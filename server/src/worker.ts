import { createMcpHandler } from "agents/mcp";
import { instrument } from "@microlabs/otel-cf-workers";
import type { AuditRecord } from "./answer.js";
import {
  createHvdcServer,
  type AttachUploadedFileInput,
  type AttachUploadedFileResult,
  type CompleteUploadInput,
  type CompleteUploadResult,
  type CreateUploadUrlInput,
  type CreateUploadUrlResult,
  type HvdcAuthContext,
  type HvdcProtectedStorage,
  type WriteFileCommitInput,
  type WriteFileCommitResult,
  type WriteFileDryRunInput,
  type WriteFileDryRunResult
} from "./hvdc-server.js";

type Env = {
  ALLOWED_ORIGIN?: string;
  WIDGET_DOMAIN?: string;
  MCP_AUTH_TOKEN?: string;
  MCP_AUTH_SCOPES?: string;
  OAUTH_AUTHORIZATION_SERVER?: string;
  OAUTH_RESOURCE_ID?: string;
  MCP_AUDIT_DB?: D1Database;
  HVDC_FILES?: R2Bucket;
  OTEL_ENABLED?: string;
  OTEL_EXPORTER_OTLP_ENDPOINT?: string;
  OTEL_EXPORTER_OTLP_HEADERS?: string;
};

const MCP_PATH = "/mcp";
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

function corsOrigin(env: Env): string {
  return env.ALLOWED_ORIGIN ?? "https://chatgpt.com";
}

function jsonHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": corsOrigin(env),
    "Access-Control-Allow-Headers": "authorization, content-type, mcp-session-id, mcp-protocol-version",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Expose-Headers": "Mcp-Session-Id, WWW-Authenticate"
  };
}

function randomToken(bytes = 24): string {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string | ArrayBuffer): Promise<string> {
  const data = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

function safeFileName(fileName: string): string {
  return fileName.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 120) || "upload.bin";
}

function normalizeManagedPath(targetPath: string): string | null {
  const normalized = targetPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("../") || normalized.includes("..\\") || normalized.includes("//")) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,239}$/.test(normalized)) return null;
  return normalized;
}

function authContext(request: Request, env: Env): HvdcAuthContext {
  const authHeader = request.headers.get("authorization") ?? "";
  const tokenMatch = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!env.MCP_AUTH_TOKEN || !tokenMatch || tokenMatch[1] !== env.MCP_AUTH_TOKEN) {
    return { authenticated: false, scopes: [] };
  }
  const scopes = (env.MCP_AUTH_SCOPES ?? "files:upload files:write")
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
  return { authenticated: true, subject: "oauth-bearer-client", scopes };
}

function oauthMetadata(request: Request, env: Env): Response {
  const url = new URL(request.url);
  const resource = env.OAUTH_RESOURCE_ID ?? `${url.origin}${MCP_PATH}`;
  return Response.json(
    {
      resource,
      resource_name: "HVDC Ontology MCP",
      authorization_servers: [env.OAUTH_AUTHORIZATION_SERVER ?? url.origin],
      bearer_methods_supported: ["header"],
      scopes_supported: ["files:upload", "files:write"],
      mcp_endpoint: `${url.origin}${MCP_PATH}`
    },
    { headers: jsonHeaders(env) }
  );
}

function uploadAuthRequired(request: Request, env: Env): Response {
  const url = new URL(request.url);
  return Response.json(
    {
      status: "AUTH_REQUIRED",
      message: "OAuth Bearer token with files:upload scope is required.",
      requiredScopes: ["files:upload"]
    },
    {
      status: 401,
      headers: {
        ...jsonHeaders(env),
        "WWW-Authenticate": `Bearer resource_metadata="${url.origin}/.well-known/oauth-protected-resource/mcp", scope="files:upload"`
      }
    }
  );
}

async function writeD1Audit(env: Env, record: AuditRecord): Promise<void> {
  if (!env.MCP_AUDIT_DB) return;
  await env.MCP_AUDIT_DB.prepare(
    `INSERT INTO mcp_audit_logs
      (id, tool_name, input_hash, output_hash, pii_masked, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      record.toolName,
      record.inputHash,
      record.outputHash,
      record.piiMasked ? 1 : 0,
      record.timestamp
    )
    .run();
}

function healthResponse(request: Request, env: Env): Response {
  const url = new URL(request.url);
  const payload = {
    service: "hvdc-ontology-chatgpt-app",
    runtime: "cloudflare-workers",
    mcpPath: MCP_PATH,
    storage: {
      r2: Boolean(env.HVDC_FILES),
      d1Audit: Boolean(env.MCP_AUDIT_DB)
    },
    auth: {
      oauthMetadata: "/.well-known/oauth-protected-resource/mcp",
      protectedWriteTools: true,
      tokenConfigured: Boolean(env.MCP_AUTH_TOKEN)
    },
    widgetDomain: env.WIDGET_DOMAIN ?? url.origin
  };
  return Response.json(payload, {
    headers: jsonHeaders(env)
  });
}

type UploadTokenRow = {
  upload_id: string;
  object_key: string;
  file_name: string;
  mime_type: string;
  max_bytes: number;
  expires_at: string;
  status: string;
};

type UploadedFileRow = {
  upload_id: string;
  object_key: string;
  file_name: string;
  mime_type: string;
  byte_length: number;
  uploaded_at: string;
};

type WriteProposalRow = {
  proposal_id: string;
  target_path: string;
  proposed_object_key: string;
  target_object_key: string;
  content_hash: string;
  status: string;
};

function storageUnavailable(message: string) {
  return {
    status: "STORAGE_UNAVAILABLE" as const,
    humanGateRequired: true as const,
    message
  };
}

function createProtectedStorage(request: Request, env: Env): HvdcProtectedStorage {
  const origin = new URL(request.url).origin;

  return {
    async createUploadUrl(input: CreateUploadUrlInput): Promise<CreateUploadUrlResult> {
      if (!env.MCP_AUDIT_DB || !env.HVDC_FILES) return storageUnavailable("R2 and D1 bindings are required for uploads.");
      if (input.byteLength && input.byteLength > MAX_UPLOAD_BYTES) {
        return {
          status: "VALIDATION_FAILED",
          humanGateRequired: true,
          message: `Upload exceeds ${MAX_UPLOAD_BYTES} byte Worker upload limit.`
        };
      }
      const uploadId = `upl_${randomToken(18)}`;
      const tokenHash = await sha256Hex(uploadId);
      const now = new Date();
      const ttlSeconds = input.ttlSeconds ?? 600;
      const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
      const datePrefix = now.toISOString().slice(0, 10);
      const objectKey = `uploads/${input.purpose}/${datePrefix}/${uploadId}-${safeFileName(input.fileName)}`;
      const maxBytes = input.byteLength ?? MAX_UPLOAD_BYTES;

      await env.MCP_AUDIT_DB.prepare(
        `INSERT INTO mcp_upload_tokens
          (upload_id, token_hash, object_key, file_name, mime_type, max_bytes, purpose, approval_ref, approved_by_role, expires_at, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`
      )
        .bind(
          uploadId,
          tokenHash,
          objectKey,
          input.fileName,
          input.mimeType,
          maxBytes,
          input.purpose,
          input.approval.approvalRef,
          input.approval.approvedByRole,
          expiresAt,
          now.toISOString()
        )
        .run();

      return {
        status: "UPLOAD_URL_READY",
        uploadId,
        uploadUrl: `${origin}/upload/${uploadId}`,
        method: "PUT",
        expiresAt,
        objectKey,
        maxBytes,
        requiredHeaders: { "content-type": input.mimeType },
        humanGateRequired: true,
        message: "Short-lived R2 upload URL created."
      };
    },

    async completeUpload(input: CompleteUploadInput): Promise<CompleteUploadResult> {
      if (!env.MCP_AUDIT_DB) return storageUnavailable("D1 binding is required to complete uploads.");
      const row = await env.MCP_AUDIT_DB.prepare(
        `SELECT upload_id, object_key, file_name, mime_type, byte_length, uploaded_at
         FROM mcp_uploaded_files WHERE upload_id = ?`
      )
        .bind(input.uploadId)
        .first<UploadedFileRow>();
      if (!row) {
        return {
          status: "UPLOAD_PENDING",
          uploadId: input.uploadId,
          humanGateRequired: true,
          message: "Upload has not been received yet."
        };
      }
      return {
        status: "UPLOADED",
        uploadId: row.upload_id,
        objectKey: row.object_key,
        fileName: row.file_name,
        mimeType: row.mime_type,
        byteLength: row.byte_length,
        uploadedAt: row.uploaded_at,
        humanGateRequired: true,
        message: "Upload is present in R2."
      };
    },

    async attachUploadedFile(input: AttachUploadedFileInput): Promise<AttachUploadedFileResult> {
      if (!env.MCP_AUDIT_DB) return storageUnavailable("D1 binding is required to attach uploaded files.");
      const row = await env.MCP_AUDIT_DB.prepare(
        `SELECT upload_id, object_key FROM mcp_uploaded_files WHERE upload_id = ?`
      )
        .bind(input.uploadId)
        .first<{ upload_id: string; object_key: string }>();
      if (!row) {
        return {
          status: "NOT_FOUND",
          uploadId: input.uploadId,
          humanGateRequired: true,
          message: "Uploaded file was not found."
        };
      }
      const attachmentId = `att_${randomToken(18)}`;
      await env.MCP_AUDIT_DB.prepare(
        `INSERT INTO mcp_file_attachments
          (attachment_id, upload_id, target_type, target_ref, evidence_note, approval_ref, approved_by_role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          attachmentId,
          input.uploadId,
          input.targetType,
          input.targetRef,
          input.evidenceNote,
          input.approval.approvalRef,
          input.approval.approvedByRole,
          new Date().toISOString()
        )
        .run();
      return {
        status: "ATTACHED",
        attachmentId,
        uploadId: input.uploadId,
        targetType: input.targetType,
        targetRef: input.targetRef,
        objectKey: row.object_key,
        humanGateRequired: true,
        message: "Uploaded file attached to target metadata."
      };
    },

    async createWriteProposal(input: WriteFileDryRunInput): Promise<WriteFileDryRunResult> {
      if (!env.MCP_AUDIT_DB || !env.HVDC_FILES) return storageUnavailable("R2 and D1 bindings are required for write proposals.");
      const managedPath = normalizeManagedPath(input.targetPath);
      if (!managedPath) {
        return {
          status: "VALIDATION_FAILED",
          humanGateRequired: true,
          message: "targetPath must be a relative managed path without traversal."
        };
      }
      const proposalId = `wrp_${randomToken(18)}`;
      const proposedObjectKey = `writes/proposals/${proposalId}.txt`;
      const targetObjectKey = `managed/${managedPath}`;
      const contentHash = await sha256Hex(input.content);
      const previous = await env.HVDC_FILES.head(targetObjectKey);
      const previousHash = previous?.customMetadata?.contentHash ?? null;
      if (input.baseContentHash && previousHash && input.baseContentHash !== previousHash) {
        return {
          status: "CONFLICT",
          targetPath: managedPath,
          humanGateRequired: true,
          message: "baseContentHash does not match the current committed object hash."
        };
      }
      await env.HVDC_FILES.put(proposedObjectKey, input.content, {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
        customMetadata: { targetPath: managedPath, contentHash, approvalRef: input.approval.approvalRef }
      });
      const addedLines = input.content.split(/\r?\n/).length;
      await env.MCP_AUDIT_DB.prepare(
        `INSERT INTO mcp_write_proposals
          (proposal_id, target_path, proposed_object_key, target_object_key, content_hash, base_content_hash, change_reason, approval_ref, approved_by_role, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRY_RUN', ?)`
      )
        .bind(
          proposalId,
          managedPath,
          proposedObjectKey,
          targetObjectKey,
          contentHash,
          input.baseContentHash ?? null,
          input.changeReason,
          input.approval.approvalRef,
          input.approval.approvedByRole,
          new Date().toISOString()
        )
        .run();
      return {
        status: "DRY_RUN_READY",
        proposalId,
        targetPath: managedPath,
        proposedObjectKey,
        contentHash,
        diffSummary: {
          mode: previous ? "UPDATE" : "CREATE",
          addedLines,
          removedLines: 0,
          previousHash
        },
        humanGateRequired: true,
        message: "Write dry-run proposal created in R2/D1."
      };
    },

    async commitWriteProposal(input: WriteFileCommitInput): Promise<WriteFileCommitResult> {
      if (!env.MCP_AUDIT_DB || !env.HVDC_FILES) return storageUnavailable("R2 and D1 bindings are required for write commits.");
      const proposal = await env.MCP_AUDIT_DB.prepare(
        `SELECT proposal_id, target_path, proposed_object_key, target_object_key, content_hash, status
         FROM mcp_write_proposals WHERE proposal_id = ?`
      )
        .bind(input.proposalId)
        .first<WriteProposalRow>();
      if (!proposal) {
        return {
          status: "NOT_FOUND",
          proposalId: input.proposalId,
          humanGateRequired: true,
          message: "Write proposal was not found."
        };
      }
      if (proposal.status !== "DRY_RUN") {
        return {
          status: "CONFLICT",
          proposalId: input.proposalId,
          humanGateRequired: true,
          message: `Write proposal is not commit-ready. Current status: ${proposal.status}.`
        };
      }
      const proposedObject = await env.HVDC_FILES.get(proposal.proposed_object_key);
      if (!proposedObject) {
        return {
          status: "NOT_FOUND",
          proposalId: input.proposalId,
          humanGateRequired: true,
          message: "Proposed R2 object was not found."
        };
      }
      const content = await proposedObject.text();
      const commitId = `wrc_${randomToken(18)}`;
      await env.HVDC_FILES.put(proposal.target_object_key, content, {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
        customMetadata: { contentHash: proposal.content_hash, commitId, approvalRef: input.approval.approvalRef }
      });
      await env.MCP_AUDIT_DB.prepare(
        `UPDATE mcp_write_proposals
         SET status = 'COMMITTED', commit_id = ?, commit_reason = ?, committed_at = ?
         WHERE proposal_id = ?`
      )
        .bind(commitId, input.commitReason, new Date().toISOString(), input.proposalId)
        .run();
      return {
        status: "COMMITTED",
        proposalId: input.proposalId,
        commitId,
        targetPath: proposal.target_path,
        objectKey: proposal.target_object_key,
        contentHash: proposal.content_hash,
        humanGateRequired: true,
        message: "Write proposal committed to managed R2 object."
      };
    }
  };
}

async function handleDirectUpload(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: jsonHeaders(env) });
  if (request.method !== "PUT") {
    return Response.json({ status: "METHOD_NOT_ALLOWED" }, { status: 405, headers: jsonHeaders(env) });
  }
  if (!authContext(request, env).authenticated) return uploadAuthRequired(request, env);
  if (!env.MCP_AUDIT_DB || !env.HVDC_FILES) {
    return Response.json(storageUnavailable("R2 and D1 bindings are required for uploads."), { status: 503, headers: jsonHeaders(env) });
  }

  const uploadId = new URL(request.url).pathname.split("/").pop() ?? "";
  const tokenHash = await sha256Hex(uploadId);
  const row = await env.MCP_AUDIT_DB.prepare(
    `SELECT upload_id, object_key, file_name, mime_type, max_bytes, expires_at, status
     FROM mcp_upload_tokens WHERE upload_id = ? AND token_hash = ?`
  )
    .bind(uploadId, tokenHash)
    .first<UploadTokenRow>();
  if (!row) return Response.json({ status: "NOT_FOUND", message: "Upload token was not found." }, { status: 404, headers: jsonHeaders(env) });
  if (row.status !== "PENDING") {
    return Response.json({ status: "CONFLICT", message: `Upload token is ${row.status}.` }, { status: 409, headers: jsonHeaders(env) });
  }
  if (Date.parse(row.expires_at) < Date.now()) {
    return Response.json({ status: "CONFLICT", message: "Upload token expired." }, { status: 409, headers: jsonHeaders(env) });
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > row.max_bytes) {
    return Response.json({ status: "VALIDATION_FAILED", message: "Upload exceeds maxBytes." }, { status: 413, headers: jsonHeaders(env) });
  }
  if (!request.body) {
    return Response.json({ status: "VALIDATION_FAILED", message: "Upload body is required." }, { status: 400, headers: jsonHeaders(env) });
  }
  const mimeType = request.headers.get("content-type") ?? row.mime_type;
  await env.HVDC_FILES.put(row.object_key, request.body, {
    httpMetadata: { contentType: mimeType },
    customMetadata: { uploadId: row.upload_id, fileName: row.file_name }
  });
  await env.MCP_AUDIT_DB.prepare(
    `INSERT INTO mcp_uploaded_files
      (upload_id, object_key, file_name, mime_type, byte_length, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(row.upload_id, row.object_key, row.file_name, mimeType, contentLength, new Date().toISOString())
    .run();
  await env.MCP_AUDIT_DB.prepare(`UPDATE mcp_upload_tokens SET status = 'UPLOADED' WHERE upload_id = ?`)
    .bind(row.upload_id)
    .run();
  return Response.json(
    { status: "UPLOADED", uploadId: row.upload_id, objectKey: row.object_key, byteLength: contentLength },
    { headers: jsonHeaders(env) }
  );
}

const handler = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/healthz")) {
      return healthResponse(request, env);
    }

    if (request.method === "GET" && (url.pathname === "/.well-known/oauth-protected-resource" || url.pathname === "/.well-known/oauth-protected-resource/mcp")) {
      return oauthMetadata(request, env);
    }

    if (url.pathname.startsWith("/upload/")) {
      return handleDirectUpload(request, env);
    }

    const server = createHvdcServer({
      widgetDomain: env.WIDGET_DOMAIN ?? url.origin,
      audit: (record) => writeD1Audit(env, record),
      auth: authContext(request, env),
      storage: createProtectedStorage(request, env)
    });
    const mcpHandler = createMcpHandler(server, {
      route: MCP_PATH,
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      corsOptions: {
        origin: corsOrigin(env),
        methods: "POST, GET, PUT, DELETE, OPTIONS",
        headers: "authorization, content-type, mcp-session-id, mcp-protocol-version",
        exposeHeaders: "Mcp-Session-Id, WWW-Authenticate"
      }
    });

    return mcpHandler(request, env, ctx);
  }
};

export default instrument(handler, (env: Env) => ({
  exporter: {
    url: env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "",
    headers: env.OTEL_EXPORTER_OTLP_HEADERS
      ? Object.fromEntries(
          env.OTEL_EXPORTER_OTLP_HEADERS.split(",").map((h) => {
            const idx = h.indexOf("=");
            return [h.slice(0, idx), h.slice(idx + 1)];
          })
        )
      : {}
  },
  service: { name: "hvdc-mcp", version: "1.0.0" },
  enabled: (env as Record<string, unknown>).OTEL_ENABLED === "true"
}));

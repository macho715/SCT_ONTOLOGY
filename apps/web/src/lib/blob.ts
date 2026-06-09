import { createHash, randomUUID } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface BlobUploadResult {
  blob_ref: string;
  sha256: string;
  size_bytes: number;
  mime_type: string;
  blob_url: string;
}

const DEV_LOCAL_BLOB_DIR = join(process.cwd(), '.dev-blob');

function isDevStubToken(): boolean {
  const t = process.env.BLOB_READ_WRITE_TOKEN ?? '';
  return t === '' || t.startsWith('dev-stub');
}

export async function uploadToBlob(file: File, jobId: string): Promise<BlobUploadResult> {
  const buf = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash('sha256').update(buf).digest('hex');
  const id = randomUUID().replace(/-/g, '').slice(0, 12);
  const filename = `${jobId}/${id}-${file.name}`;

  if (isDevStubToken()) {
    const target = join(DEV_LOCAL_BLOB_DIR, filename);
    mkdirSync(join(DEV_LOCAL_BLOB_DIR, jobId), { recursive: true });
    writeFileSync(target, buf);
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://127.0.0.1:3000';
    return {
      blob_ref: `local:${filename}`,
      sha256,
      size_bytes: buf.byteLength,
      mime_type: file.type || 'application/octet-stream',
      blob_url: `${base}/api/dev/blob/${encodeURIComponent(filename)}`
    };
  }

  // @vercel/blob v0.27 only supports access:'public'; private downloads require store ACL + signed download URL (out of scope for MVP).
  const { put } = await import('@vercel/blob');
  const res = await put(filename, file, { access: 'public', addRandomSuffix: true });
  return {
    blob_ref: `blob:${res.pathname}`,
    sha256,
    size_bytes: buf.byteLength,
    mime_type: file.type || 'application/octet-stream',
    blob_url: res.url
  };
}

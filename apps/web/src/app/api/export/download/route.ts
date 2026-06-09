import { NextResponse } from 'next/server';
import { STORE } from '@/lib/job-store';
import { ErrorCodes, httpForError, type ErrorCode } from '@/lib/error-codes';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { EXPORTS_MAP, isDevStub } from '@/lib/export-store';

export const runtime = 'nodejs';

function err(code: ErrorCode, message: string) {
  return NextResponse.json({ code, message }, { status: httpForError(code) });
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('job_id');
  if (!jobId) return err('INVALID_STATE', 'job_id required');

  const job = await STORE.getJob(jobId);
  if (!job) return err('JOB_NOT_FOUND', 'unknown job_id');

  if (job.verdict === 'ZERO') {
    return err('ZERO_BLOCKED', 'Export blocked for jobs with ZERO verdict');
  }

  if (job.status !== 'APPROVED') {
    return err('APPROVAL_REQUIRED', 'Job must be approved before download');
  }

  const record = EXPORTS_MAP.get(jobId);
  if (!record) {
    return err('INVALID_STATE', 'Job has not been exported yet');
  }

  let buffer: Buffer;

  if (isDevStub()) {
    const filename = `exports/${jobId}/audit-pack-${(record.result as any).manifest.sha256.slice(0, 8)}.xlsx`;
    const target = join(process.cwd(), '.dev-blob', filename);
    if (!existsSync(target)) {
      return err('INVALID_STATE', 'Exported file not found on disk');
    }
    buffer = readFileSync(target);
  } else {
    try {
      const res = await fetch(record.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch from blob: ${res.statusText}`);
      }
      buffer = Buffer.from(await res.arrayBuffer());
    } catch (e) {
      return err('EXPORT_FAILED', `Failed to download file from storage: ${(e as Error).message}`);
    }
  }

  const filenameHeader = `audit-pack-${jobId}.xlsx`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filenameHeader}"`
    }
  });
}

import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';

const DEV_BLOB_DIR = join(process.cwd(), '.dev-blob');

function isDevStub(): boolean {
  const t = process.env.BLOB_READ_WRITE_TOKEN ?? '';
  return t === '' || t.startsWith('dev-stub');
}

export async function GET(_req: Request, { params }: { params: { path: string[] } }): Promise<Response> {
  if (!isDevStub()) {
    return NextResponse.json({ code: 'FORBIDDEN', message: 'dev blob endpoint disabled' }, { status: 403 });
  }
  const filename = params.path.join('/');
  const target = join(DEV_BLOB_DIR, filename);
  if (!target.startsWith(DEV_BLOB_DIR) || !existsSync(target)) {
    return NextResponse.json({ code: 'JOB_NOT_FOUND', message: 'blob not found' }, { status: 404 });
  }
  const buf = readFileSync(target);
  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: { 'content-type': 'application/octet-stream' }
  });
}

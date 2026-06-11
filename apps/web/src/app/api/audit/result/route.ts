import { NextResponse } from 'next/server';
import { createJobStore, STORE } from '@/lib/job-store';
import { ErrorCodes, httpForError, type ErrorCode } from '@/lib/error-codes';

export const runtime = 'nodejs';
void createJobStore;

function err(code: ErrorCode, message: string) {
  return NextResponse.json({ code, message }, { status: httpForError(code) });
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('job_id');
  if (!jobId) return err('INVALID_STATE', 'job_id required');
  const job = await STORE.getJob(jobId);
  if (!job) return err('JOB_NOT_FOUND', 'unknown job_id');
  const result = await STORE.getResult(jobId);
  if (!result) return err('INVALID_STATE', 'result not ready');
  // P3C: include pdf_source_data when present (plan §6.1 #3, §6.4)
  const pdfSource = (result as any).pdf_source_data || (result as any).source_data_rows || [];
  return NextResponse.json({ job_id: job.job_id, verdict: result.verdict, line_results: result.line_results, action_items: result.action_items, pdf_source_data: pdfSource });
}

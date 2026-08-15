import { postHogMiddleware } from '@posthog/next';
import type { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';

/**
 * Seeds PostHog identity cookies and proxies `/ingest` when the API key is set.
 * Pass your middleware's `NextResponse` as `response` so cookies merge correctly.
 */
export async function withPostHogMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return response;
  }

  const run = postHogMiddleware({ proxy: true, response });
  return run(request);
}

import { PostHogProvider, PostHogPageView } from '@posthog/next';
import { PostHogUserIdentifier } from './use-identify-user';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * Drop-in analytics wrapper for any layout. No-ops when `NEXT_PUBLIC_POSTHOG_KEY` is unset.
 */
export function PostHogExtension({
  children
}: {
  children: React.ReactNode;
}) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      clientOptions={{
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com'
      }}
      bootstrapFlags
    >
      <PostHogPageView />
      <PostHogUserIdentifier />
      {children}
    </PostHogProvider>
  );
}

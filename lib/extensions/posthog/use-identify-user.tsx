'use client';

import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { usePostHog } from '@posthog/next';

/** Minimal user shape for `identify` — map your app's user type here if needed. */
export type IdentifiedUser = {
  id: number | string;
  email: string;
  name?: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Links PostHog `distinct_id` to the signed-in user (and resets on logout).
 * Safe to call when PostHog is disabled (no-op when `usePostHog` is unavailable).
 */
export function useIdentifyUser(user: IdentifiedUser | null | undefined) {
  const posthog = usePostHog();
  const prevId = useRef<string | number | null>(null);

  useEffect(() => {
    if (!posthog) return;

    if (user) {
      if (prevId.current !== user.id) {
        posthog.identify(String(user.id), {
          email: user.email,
          name: user.name ?? undefined
        });
        prevId.current = user.id;
      }
    } else if (prevId.current !== null) {
      posthog.reset();
      prevId.current = null;
    }
  }, [posthog, user]);
}

/** Fetches `/api/user` and calls `useIdentifyUser` — drop inside `PostHogExtension`. */
export function PostHogUserIdentifier() {
  const { data: user } = useSWR<IdentifiedUser>('/api/user', fetcher);
  useIdentifyUser(user ?? undefined);
  return null;
}

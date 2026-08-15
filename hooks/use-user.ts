'use client';

import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User>('/api/user', fetcher);

  return {
    user: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

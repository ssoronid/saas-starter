'use client';

import useSWR from 'swr';
import { TeamDataWithMembers } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTeam() {
  const { data, error, isLoading, mutate } = useSWR<TeamDataWithMembers>(
    '/api/team',
    fetcher
  );

  return {
    team: data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

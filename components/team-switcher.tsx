'use client';

import * as React from 'react';
import { CircleIcon } from 'lucide-react';

import { useTeam } from '@/hooks/use-team';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function TeamSwitcher() {
  const { team, isLoading } = useTeam();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <CircleIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {team?.name ?? 'My Team'}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {team?.planName ?? 'Free'}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

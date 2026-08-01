'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Settings, Shield, Users } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Team', href: '/dashboard', icon: Users },
  { title: 'General', href: '/dashboard/general', icon: Settings },
  { title: 'Activity', href: '/dashboard/activity', icon: Activity },
  { title: 'Security', href: '/dashboard/security', icon: Shield },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname === item.href}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

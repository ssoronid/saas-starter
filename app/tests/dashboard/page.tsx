import { ArrowDownRight, ArrowUpRight, CreditCard, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Dashboard preview — UI test'
};

const stats = [
  { label: 'Monthly revenue', value: '$12,480', delta: '+8.2%', up: true },
  { label: 'Active teams', value: '312', delta: '+24', up: true },
  { label: 'Subscriptions', value: '287', delta: '+12', up: true },
  { label: 'Churn', value: '1.9%', delta: '-0.4%', up: false }
];

const members = [
  { name: 'Ada Lovelace', email: 'ada@example.com', plan: 'Plus', status: 'active' },
  { name: 'Grace Hopper', email: 'grace@example.com', plan: 'Base', status: 'active' },
  { name: 'Alan Turing', email: 'alan@example.com', plan: 'Plus', status: 'trialing' },
  { name: 'Katherine Johnson', email: 'kj@example.com', plan: 'Base', status: 'canceled' }
];

const activity = [
  { action: 'Team created', actor: 'Ada Lovelace', when: '2 hours ago' },
  { action: 'Subscription upgraded to Plus', actor: 'Grace Hopper', when: 'Yesterday' },
  { action: 'Invitation sent', actor: 'Alan Turing', when: '2 days ago' },
  { action: 'Password changed', actor: 'Katherine Johnson', when: 'Last week' }
];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function statusBadge(status: string) {
  if (status === 'active') return <Badge>Active</Badge>;
  if (status === 'trialing') return <Badge variant="secondary">Trialing</Badge>;
  return <Badge variant="outline">Canceled</Badge>;
}

export default function DashboardPreviewPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard preview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Static test route — mock data, no auth, no database. Every color on
            this page is a design token.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>
            <Users />
            Invite member
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.up ? (
                  <ArrowUpRight className="size-3.5" aria-hidden />
                ) : (
                  <ArrowDownRight className="size-3.5" aria-hidden />
                )}
                {stat.delta} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Team members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="loading">Loading states</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team members</CardTitle>
              <CardDescription>
                Avatar, table, and badge primitives with mock members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{initials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.plan}</TableCell>
                      <TableCell>{statusBadge(member.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>List rows with separators and muted metadata.</CardDescription>
            </CardHeader>
            <CardContent>
              {activity.map((entry, index) => (
                <div key={entry.action}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                        <CreditCard className="size-4 text-muted-foreground" aria-hidden />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">{entry.actor}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.when}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading">
          <Card>
            <CardHeader>
              <CardTitle>Loading states</CardTitle>
              <CardDescription>
                Skeleton primitives — the replacement for hand-rolled pulsing divs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Verify this page in both light and dark mode. See{' '}
        <span className="font-medium">.claude/skills/shadcn-conventions</span> for the
        conventions it demonstrates.
      </p>
    </main>
  );
}

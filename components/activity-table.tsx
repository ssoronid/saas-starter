import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActivityType } from '@/lib/db/schema';

const ACTION_LABELS: Record<string, string> = {
  [ActivityType.SIGN_UP]: 'Signed up',
  [ActivityType.SIGN_IN]: 'Signed in',
  [ActivityType.SIGN_OUT]: 'Signed out',
  [ActivityType.UPDATE_PASSWORD]: 'Updated password',
  [ActivityType.DELETE_ACCOUNT]: 'Deleted account',
  [ActivityType.UPDATE_ACCOUNT]: 'Updated account',
  [ActivityType.CREATE_TEAM]: 'Created team',
  [ActivityType.REMOVE_TEAM_MEMBER]: 'Removed team member',
  [ActivityType.INVITE_TEAM_MEMBER]: 'Invited team member',
  [ActivityType.ACCEPT_INVITATION]: 'Accepted invitation',
};

type ActivityLog = {
  id: number;
  action: string;
  timestamp: Date;
  ipAddress: string | null;
  userName: string | null;
};

export function ActivityTable({ logs }: { logs: ActivityLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest account events</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No activity yet
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.userName ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.ipAddress || '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

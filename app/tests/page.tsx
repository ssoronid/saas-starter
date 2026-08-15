import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const dynamic = 'force-static';

export const metadata = {
  title: 'UI test pages'
};

export default function TestsIndexPage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">UI test pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Static, public routes for verifying the shadcn/ui design system out of
          the box — no auth, no database, mock data only.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard preview</CardTitle>
          <CardDescription>
            Stat cards, tables, tabs, badges, and loading states rendered with
            design tokens. Check it in light and dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/tests/dashboard">Open /tests/dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

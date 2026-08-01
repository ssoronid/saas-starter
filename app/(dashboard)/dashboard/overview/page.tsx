import { ActivityTable } from '@/components/activity-table';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { getActivityLogs, getTeamForUser } from '@/lib/db/queries';

export default async function OverviewPage() {
  const [team, logs] = await Promise.all([getTeamForUser(), getActivityLogs()]);

  const perDay = new Map<string, number>();
  for (const log of logs) {
    const day = new Date(log.timestamp).toISOString().slice(0, 10);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
  }
  const chartData = [...perDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards
        planName={team?.planName ?? 'Free'}
        subscriptionStatus={team?.subscriptionStatus ?? 'none'}
        memberCount={team?.teamMembers?.length ?? 0}
        activityCount={logs.length}
      />
      <ChartAreaInteractive data={chartData} />
      <ActivityTable logs={logs} />
    </div>
  );
}

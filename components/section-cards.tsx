import { Activity, CreditCard, ShieldCheck, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SectionCardsProps = {
  planName: string;
  subscriptionStatus: string;
  memberCount: number;
  activityCount: number;
};

export function SectionCards({
  planName,
  subscriptionStatus,
  memberCount,
  activityCount,
}: SectionCardsProps) {
  const cards = [
    {
      label: 'Current Plan',
      value: planName,
      icon: CreditCard,
      badge: subscriptionStatus !== 'none' ? subscriptionStatus : null,
    },
    {
      label: 'Team Members',
      value: String(memberCount),
      icon: Users,
      badge: null,
    },
    {
      label: 'Recent Activity',
      value: String(activityCount),
      icon: Activity,
      badge: 'last 10 events',
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <card.icon className="size-4" />
              {card.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
            {card.badge && (
              <Badge variant="outline" className="w-fit">
                {card.badge}
              </Badge>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

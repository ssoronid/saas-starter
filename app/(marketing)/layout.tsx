import { paymentsConfigured } from '@/lib/payments';
import { Header } from '@/components/header';

/**
 * Public pages carry the marketing header. The dashboard has its own group so a
 * layout extension can replace its chrome without stripping navigation here.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header paymentsConfigured={paymentsConfigured} />
      {children}
    </section>
  );
}

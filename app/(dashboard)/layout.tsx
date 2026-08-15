import { paymentsConfigured } from '@/lib/payments';
import { Header } from '@/components/header';

/**
 * Chrome for the built-in dashboard, whose inner layout renders only a settings
 * nav and so relies on this header for branding and the user menu.
 *
 * A layout-* extension replaces this file with a pass-through, because the app
 * shell it installs carries its own header, team switcher and user menu —
 * leaving this one in place is what produced two stacked headers.
 */
export default function DashboardLayout({
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

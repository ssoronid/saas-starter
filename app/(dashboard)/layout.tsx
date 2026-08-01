import { paymentsConfigured } from '@/lib/payments';
import { Header } from './header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header paymentsConfigured={paymentsConfigured} />
      {children}
    </section>
  );
}

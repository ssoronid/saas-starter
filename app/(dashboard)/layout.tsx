/**
 * Pass-through: the app shell in this group's dashboard layout already renders a
 * header, a team switcher and a user menu. The template's own header lives here
 * by default, and leaving it in place stacked two headers on every dashboard
 * page. Marketing pages keep theirs — they are in the (marketing) group.
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

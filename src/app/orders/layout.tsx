import DashboardLayout from '@/layouts/dashboard';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

import EvidenceUpload from '@/components/EvidenceUpload/EvidenceUpload';
import OrderComments from '@/components/OrderComments/OrderComments';
import OrderTimeTracker from '@/components/OrderTimeTracker/OrderTimeTracker';
import MaterialsSection from '@/components/MaterialsSection/MaterialsSection';
import BackButton from '@/components/BackButton/BackButton';
import { cn } from '@/lib/utils';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  // Unwrap params usando await (Server Component)
  const { id: orderId } = await params;

  console.log('🖥️ Server Component - Página Orden:', orderId);

  return (
    <main className={cn('space-y-6')}>
      <header className={cn('flex items-center justify-between')}>
        <div>
          <BackButton />
          <h1 className={cn('text-3xl font-bold text-primary')}>
            Orden de trabajo
          </h1>
          <p className={cn('text-primary/80 mt-1')}>Orden #{orderId}</p>
        </div>
      </header>

      <section className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6')}>
        <div className={cn('space-y-6')}>
          <OrderTimeTracker orderId={orderId} />
          <EvidenceUpload orderId={orderId} />
          <OrderComments orderId={orderId} />
        </div>

        <div className={cn('space-y-6')}>
          {/* Solo este widget usa Server Component */}
          <MaterialsSection orderId={orderId} />
        </div>
      </section>
    </main>
  );
}

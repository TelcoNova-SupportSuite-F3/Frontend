import EvidenceUpload from '@/components/EvidenceUpload/EvidenceUpload';
import OrderComments from '@/components/OrderComments/OrderComments';
import OrderTimeTracker from '@/components/OrderTimeTracker/OrderTimeTracker';
import MaterialsSection from '@/components/MaterialsSection/MaterialsSection';
import BackButton from '@/components/BackButton/BackButton';

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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <BackButton />
          <h2 className='text-3xl font-bold text-blue-900'>Orden de trabajo</h2>
          <p className='text-blue-600 mt-1'>Orden #{orderId}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <OrderTimeTracker orderId={orderId} />
          <EvidenceUpload orderId={orderId} />
          <OrderComments orderId={orderId} />
        </div>

        <div className='space-y-6'>
          {/* Solo este widget usa Server Component */}
          <MaterialsSection orderId={orderId} />
        </div>
      </div>
    </div>
  );
}

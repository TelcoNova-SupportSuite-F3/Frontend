import { getOrderDetail } from '@/hooks/useOrderDetail';
import OrderDetailHeader from '@/components/OrderDetailHeader/OrderDetailHeader';
import OrderBasicInfo from '@/components/OrderBasicInfo/OrderBasicInfo';
import OrderActionsSection from '@/components/OrderActionsSection/OrderActionsSection';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
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
  const { id: orderIdString } = await params;
  const orderId = parseInt(orderIdString, 10);

  // Cargar datos usando el hook
  const { order, error, isAuthenticated } = await getOrderDetail(orderId);

  // Caso: No autenticado
  if (!isAuthenticated) {
    return (
      <>
        <OrderDetailHeader title='Orden de trabajo' />
        <ErrorMessage
          title=''
          message='No se encontró token de autenticación. Por favor, inicie sesión nuevamente.'
          type='warning'
        />
      </>
    );
  }

  // Caso: Error en la carga
  if (error) {
    return (
      <>
        <OrderDetailHeader title='Error cargando orden' />
        <ErrorMessage title='' message={error} type='error' />
      </>
    );
  }

  // Caso: Sin orden
  if (!order) {
    return (
      <>
        <OrderDetailHeader title='Orden no encontrada' />
        <ErrorMessage
          title=''
          message='No se pudieron cargar los detalles de la orden'
          type='info'
        />
      </>
    );
  }

  // Caso exitoso: Mostrar detalles de la orden
  return (
    <main className={cn('space-y-6')}>
      <OrderDetailHeader order={order} />
      <OrderBasicInfo order={order} />
      <OrderActionsSection order={order} />
    </main>
  );
}

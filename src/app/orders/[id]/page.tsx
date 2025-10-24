import { getOrderDetail } from '@/hooks/useOrderDetail';
import OrderDetailClient from './OrderDetailClient';
import OrderDetailHeader from '@/components/OrderDetailHeader/OrderDetailHeader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

// Deshabilitar caché para que siempre obtenga datos frescos del servidor
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  return <OrderDetailClient order={order} />;
}

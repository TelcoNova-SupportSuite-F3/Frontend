import { Card, CardContent } from '@/components/ui/card';
import { useOrdersData } from '@/hooks/useOrdersData';
import OrdersMetrics from '@/components/OrdersMetrics/OrdersMetrics';
import OrdersTable from '@/components/OrdersTable/OrdersTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { cn } from '@/lib/utils';

export default async function OrdersPage() {
  // Cargar datos usando el hook
  const { orders, summary, error, isAuthenticated } = await useOrdersData();

  // Caso: No autenticado
  if (!isAuthenticated) {
    return (
      <ErrorMessage
        title='Mis órdenes'
        message='No se encontró token de autenticación. Por favor, inicie sesión nuevamente.'
        type='warning'
      />
    );
  }

  // Caso: Error en la carga
  if (error) {
    return <ErrorMessage title='Mis órdenes' message={error} type='error' />;
  }

  // Caso: Sin órdenes o datos incompletos
  if (!orders || !summary) {
    return (
      <ErrorMessage
        title='Mis órdenes'
        message='No se pudieron cargar las órdenes'
        type='info'
      />
    );
  }

  // Caso exitoso: Mostrar dashboard
  return (
    <main className={cn('space-y-6')}>
      <header>
        <h1 className={cn('text-3xl font-bold text-primary')}>Mis órdenes</h1>
      </header>

      <OrdersMetrics summary={summary} />

      <Card>
        <CardContent className={cn('p-0')}>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </main>
  );
}

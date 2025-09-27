import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrders } from '@/lib/order-actions';
import OrderDetailsButton from '@/components/OrderDetailsButton/OrderDetailsButton';
import { cn } from '@/lib/utils';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'En curso':
      return (
        <Badge className={cn('bg-primary/10 text-primary hover:bg-primary/10')}>
          {status}
        </Badge>
      );
    case 'Pausado':
      return (
        <Badge
          className={cn('bg-yellow-100 text-yellow-800 hover:bg-yellow-100')}
        >
          {status}
        </Badge>
      );
    case 'Finalizado':
      return (
        <Badge className={cn('bg-green-100 text-green-800 hover:bg-green-100')}>
          {status}
        </Badge>
      );
    case 'Requerimiento adicional':
      return (
        <Badge
          className={cn('bg-purple-100 text-purple-800 hover:bg-purple-100')}
        >
          {status}
        </Badge>
      );
    default:
      return <Badge variant='outline'>{status}</Badge>;
  }
};

export default async function OrdersPage() {
  // Cargar órdenes en el servidor
  const orders = await getOrders();

  console.log('🏗️ Server Component - Órdenes cargadas:', orders.length);

  const totalOrders = orders.length;
  const inProgress = orders.filter(
    (order) => order.status === 'En curso'
  ).length;
  const completed = orders.filter(
    (order) => order.status === 'Finalizado'
  ).length;

  return (
    <main className={cn('space-y-6')}>
      <header>
        <h1 className={cn('text-3xl font-bold text-primary')}>Mis ordenes</h1>
      </header>

      <section className={cn('grid grid-cols-1 md:grid-cols-3 gap-4')}>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className={cn('text-sm font-medium text-primary')}>
              Total ordenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-4xl font-bold text-gray-900')}>
              {totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className={cn('text-sm font-medium text-primary')}>
              Total en curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-4xl font-bold text-gray-900')}>
              {inProgress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className={cn('text-sm font-medium text-primary')}>
              Total finalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-4xl font-bold text-gray-900')}>
              {completed}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className={cn('p-0')}>
          <Table role='table' aria-label='Lista de órdenes de trabajo'>
            <TableHeader>
              <TableRow className={cn('bg-primary/5')}>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Identificador de la orden'
                >
                  ID
                </TableHead>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Título descriptivo de la orden'
                >
                  Título de la orden
                </TableHead>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Estado actual de la orden'
                >
                  Estado de la orden
                </TableHead>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Fecha de inicio de la orden'
                >
                  Fecha inicio
                </TableHead>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Fecha de finalización de la orden'
                >
                  Fecha fin
                </TableHead>
                <TableHead
                  className={cn('font-semibold text-primary')}
                  scope='col'
                  aria-label='Acciones disponibles'
                >
                  Detalle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className={cn('hover:bg-gray-50')}
                  role='row'
                  aria-label={`Orden ${order.id}: ${order.title}, Estado: ${order.status}`}
                >
                  <TableCell
                    className={cn('font-medium')}
                    role='cell'
                    aria-label={`ID de orden: ${order.id}`}
                  >
                    {order.id}
                  </TableCell>
                  <TableCell role='cell' aria-label={`Título: ${order.title}`}>
                    {order.title}
                  </TableCell>
                  <TableCell role='cell' aria-label={`Estado: ${order.status}`}>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell
                    role='cell'
                    aria-label={`Fecha de inicio: ${order.startDate}`}
                  >
                    {order.startDate}
                  </TableCell>
                  <TableCell
                    role='cell'
                    aria-label={`Fecha de fin: ${
                      order.endDate || 'No finalizada'
                    }`}
                  >
                    {order.endDate || '-'}
                  </TableCell>
                  <TableCell role='cell'>
                    <OrderDetailsButton orderId={order.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

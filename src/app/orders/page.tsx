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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'En curso':
      return (
        <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100'>
          {status}
        </Badge>
      );
    case 'Pausado':
      return (
        <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
          {status}
        </Badge>
      );
    case 'Finalizado':
      return (
        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
          {status}
        </Badge>
      );
    case 'Requerimiento adicional':
      return (
        <Badge className='bg-purple-100 text-purple-800 hover:bg-purple-100'>
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
    <div className='space-y-6'>
      <h2 className='text-3xl font-bold text-blue-900'>Mis ordenes</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-blue-600'>
              Total ordenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-bold text-gray-900'>
              {totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-blue-600'>
              Total en curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-bold text-gray-900'>{inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-blue-600'>
              Total finalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-bold text-gray-900'>{completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-blue-50'>
                <TableHead className='font-semibold text-blue-900'>
                  ID
                </TableHead>
                <TableHead className='font-semibold text-blue-900'>
                  Título de la orden
                </TableHead>
                <TableHead className='font-semibold text-blue-900'>
                  Estado de la orden
                </TableHead>
                <TableHead className='font-semibold text-blue-900'>
                  Fecha inicio
                </TableHead>
                <TableHead className='font-semibold text-blue-900'>
                  Fecha fin
                </TableHead>
                <TableHead className='font-semibold text-blue-900'>
                  Detalle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className='hover:bg-gray-50'>
                  <TableCell className='font-medium'>{order.id}</TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.startDate}</TableCell>
                  <TableCell>{order.endDate || '-'}</TableCell>
                  <TableCell>
                    <OrderDetailsButton orderId={order.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  getEstadoColor,
  getPrioridadColor,
  formatDateTime,
  type OrdenTrabajoResponse,
} from '@/types/orders';
import OrderDetailsButton from '@/components/OrderDetailsButton/OrderDetailsButton';
import { cn } from '@/lib/utils';

interface OrdersTableProps {
  orders: OrdenTrabajoResponse[];
}

const getStatusBadge = (estado: string) => {
  const colorClass = getEstadoColor(estado as keyof typeof ESTADO_LABELS);
  const label = ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] || estado;

  return <Badge className={cn(colorClass)}>{label}</Badge>;
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500')}>
        <p>No hay órdenes disponibles</p>
      </div>
    );
  }

  return (
    <Table role='table' aria-label='Lista de órdenes de trabajo'>
      <TableHeader>
        <TableRow className={cn('bg-primary/5')}>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Número de orden'
          >
            N° Orden
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Título descriptivo de la orden'
          >
            Título
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Cliente'
          >
            Cliente
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Estado actual de la orden'
          >
            Estado
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Prioridad de la orden'
          >
            Prioridad
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Fecha de asignación'
          >
            Fecha asignación
          </TableHead>
          <TableHead
            className={cn('font-semibold text-primary')}
            scope='col'
            aria-label='Acciones disponibles'
          >
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className={cn('hover:bg-gray-50')}
            role='row'
            aria-label={`Orden ${order.numeroOrden}: ${order.titulo}, Estado: ${order.estado}`}
          >
            <TableCell
              className={cn('font-medium')}
              role='cell'
              aria-label={`Número de orden: ${order.numeroOrden}`}
            >
              {order.numeroOrden}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={`Título: ${order.titulo}`}
              className={cn('max-w-xs truncate')}
              title={order.titulo}
            >
              {order.titulo}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={`Cliente: ${order.clienteNombre}`}
              className={cn('max-w-xs truncate')}
              title={order.clienteNombre}
            >
              {order.clienteNombre}
            </TableCell>
            <TableCell role='cell' aria-label={`Estado: ${order.estado}`}>
              {getStatusBadge(order.estado)}
            </TableCell>
            <TableCell role='cell' aria-label={`Prioridad: ${order.prioridad}`}>
              <Badge className={cn(getPrioridadColor(order.prioridad))}>
                {PRIORIDAD_LABELS[order.prioridad] || order.prioridad}
              </Badge>
            </TableCell>
            <TableCell
              role='cell'
              aria-label={`Fecha de asignación: ${formatDateTime(
                order.fechaAsignacion
              )}`}
            >
              {formatDateTime(order.fechaAsignacion)}
            </TableCell>
            <TableCell role='cell'>
              <OrderDetailsButton orderId={order.id.toString()} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

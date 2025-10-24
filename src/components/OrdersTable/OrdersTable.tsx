'use client';

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
  getEstadoColor,
  formatDateTime,
  type OrdenTrabajoResponse,
} from '@/types/orders';
import OrderDetailsButton from '@/components/OrderDetailsButton/OrderDetailsButton';
import { cn } from '@/lib/utils';
import {
  TABLE_COLUMNS,
  MESSAGES,
  STYLES,
  getRowAriaLabel,
  getCellAriaLabel,
} from './orders-table.constants';

/**
 * Props para el componente OrdersTable
 */
interface OrdersTableProps {
  /** Array de órdenes de trabajo a mostrar en la tabla */
  orders: OrdenTrabajoResponse[];
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Mensaje personalizado para estado vacío */
  emptyMessage?: string;
  /** Callback al hacer click en una fila (opcional) */
  onRowClick?: (order: OrdenTrabajoResponse) => void;
}

/**
 * Renderiza un badge con el estado de la orden
 */
const getStatusBadge = (estado: string) => {
  const colorClass = getEstadoColor(estado as keyof typeof ESTADO_LABELS);
  const label = ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] || estado;

  return <Badge className={cn(colorClass)}>{label}</Badge>;
};

/**
 * Componente de tabla para mostrar órdenes de trabajo
 *
 * Presenta una lista de órdenes en formato tabular con columnas
 * para ID, título, estado, fecha inicio, fecha fin y detalle.
 * Incluye estado vacío y accesibilidad mejorada.
 *
 * @example
 * ```tsx
 * <OrdersTable
 *   orders={ordersData}
 *   onRowClick={(order) => console.log('Orden seleccionada:', order.id)}
 *   emptyMessage="No se encontraron órdenes"
 * />
 * ```
 */
export default function OrdersTable({
  orders,
  className,
  emptyMessage = MESSAGES.EMPTY_STATE,
  onRowClick,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className={cn(STYLES.EMPTY_STATE, className)}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table
      role='table'
      aria-label={MESSAGES.TABLE_ARIA_LABEL}
      className={className}
    >
      <TableHeader>
        <TableRow className={cn(STYLES.HEADER_ROW)}>
          {TABLE_COLUMNS.map((column) => (
            <TableHead
              key={column.id}
              className={cn(STYLES.HEADER_CELL)}
              scope='col'
              aria-label={column.ariaLabel}
            >
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className={cn(STYLES.BODY_ROW)}
            role='row'
            aria-label={getRowAriaLabel(
              order.numeroOrden,
              order.titulo,
              order.estado
            )}
            onClick={() => onRowClick?.(order)}
            style={onRowClick ? { cursor: 'pointer' } : undefined}
          >
            <TableCell
              className={cn(STYLES.CELL_MEDIUM)}
              role='cell'
              aria-label={getCellAriaLabel(
                'Número de orden',
                order.numeroOrden
              )}
            >
              {order.numeroOrden}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={getCellAriaLabel('Título', order.titulo)}
              className={cn(STYLES.CELL_TRUNCATE)}
              title={order.titulo}
            >
              {order.titulo}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={getCellAriaLabel('Estado', order.estado)}
            >
              {getStatusBadge(order.estado)}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={getCellAriaLabel(
                'Fecha de inicio',
                formatDateTime(order.fechaInicioTrabajo)
              )}
            >
              {formatDateTime(order.fechaInicioTrabajo)}
            </TableCell>
            <TableCell
              role='cell'
              aria-label={getCellAriaLabel(
                'Fecha de fin',
                formatDateTime(order.fechaFinTrabajo)
              )}
            >
              {formatDateTime(order.fechaFinTrabajo)}
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

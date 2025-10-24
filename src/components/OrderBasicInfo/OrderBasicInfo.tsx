'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  getEstadoColor,
  getPrioridadColor,
  formatDateTime,
  type OrdenTrabajoResponse,
} from '@/types/orders';
import { cn } from '@/lib/utils';
import OrderStatusChanger from '@/components/OrderStatusChanger';
import {
  LABELS,
  DEFAULT_EMPTY_VALUE,
  STYLES,
} from './order-basic-info.constants';

/**
 * Props para el componente OrderBasicInfo
 */
interface OrderBasicInfoProps {
  /** Datos de la orden de trabajo a mostrar */
  order: OrdenTrabajoResponse;
  /** Clases CSS adicionales para el contenedor principal */
  className?: string;
  /** Valor a mostrar para campos vacíos o nulos */
  emptyValue?: string;
}

/**
 * Componente para renderizar un campo de información individual
 */
interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * Renderiza un campo de información con su etiqueta y valor
 */
function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={className}>
      <p className={cn(STYLES.LABEL)}>{label}</p>
      {typeof value === 'string' ? (
        <p className={cn(STYLES.VALUE)}>{value}</p>
      ) : (
        value
      )}
    </div>
  );
}

/**
 * Componente que muestra la información básica de una orden de trabajo
 *
 * Presenta los datos principales de la orden en formato de tarjeta,
 * incluyendo estado, prioridad, información del cliente y detalles de la orden.
 *
 * @example
 * ```tsx
 * <OrderBasicInfo
 *   order={orderData}
 *   emptyValue="No disponible"
 * />
 * ```
 */
export default function OrderBasicInfo({
  order,
  className,
  emptyValue = DEFAULT_EMPTY_VALUE,
}: OrderBasicInfoProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={cn(STYLES.CARD_TITLE)}>{LABELS.TITLE}</CardTitle>
      </CardHeader>
      <CardContent className={cn(STYLES.CONTENT_CONTAINER)}>
        {/* Estado, Prioridad, Cliente y Teléfono */}
        <div className={cn(STYLES.GRID_CONTAINER)}>
          <InfoField
            label={LABELS.ESTADO}
            value={
              <Badge className={cn(getEstadoColor(order.estado))}>
                {ESTADO_LABELS[order.estado]}
              </Badge>
            }
          />
          <InfoField
            label={LABELS.PRIORIDAD}
            value={
              <Badge className={cn(getPrioridadColor(order.prioridad))}>
                {PRIORIDAD_LABELS[order.prioridad]}
              </Badge>
            }
          />
          <InfoField label={LABELS.CLIENTE} value={order.clienteNombre} />
          <InfoField
            label={LABELS.TELEFONO}
            value={order.clienteTelefono || emptyValue}
          />
        </div>

        {/* Descripción */}
        <InfoField label={LABELS.DESCRIPCION} value={order.descripcion} />

        {/* Dirección */}
        <InfoField label={LABELS.DIRECCION} value={order.direccion} />

        {/* Fecha de asignación */}
        <InfoField
          label={LABELS.FECHA_ASIGNACION}
          value={formatDateTime(order.fechaAsignacion)}
        />

        {/* Cambiador de estado */}
        <div className="pt-4 border-t border-gray-200">
          <OrderStatusChanger order={order} />
        </div>
      </CardContent>
    </Card>
  );
}

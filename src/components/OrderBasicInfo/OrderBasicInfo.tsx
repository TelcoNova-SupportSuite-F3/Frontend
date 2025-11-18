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
  const fieldId = `info-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <dt className={cn(STYLES.LABEL)} id={fieldId}>{label}</dt>
      {typeof value === 'string' ? (
        <dd className={cn(STYLES.VALUE)} aria-labelledby={fieldId}>{value}</dd>
      ) : (
        <dd aria-labelledby={fieldId}>{value}</dd>
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
        <dl className={cn(STYLES.GRID_CONTAINER)}>
          <InfoField
            label={LABELS.ESTADO}
            value={
              <Badge
                className={cn(getEstadoColor(order.estado))}
                aria-label={`Estado: ${ESTADO_LABELS[order.estado]}`}
              >
                {ESTADO_LABELS[order.estado]}
              </Badge>
            }
          />
          <InfoField
            label={LABELS.PRIORIDAD}
            value={
              <Badge
                className={cn(getPrioridadColor(order.prioridad))}
                aria-label={`Prioridad: ${PRIORIDAD_LABELS[order.prioridad]}`}
              >
                {PRIORIDAD_LABELS[order.prioridad]}
              </Badge>
            }
          />
          <InfoField label={LABELS.CLIENTE} value={order.clienteNombre} />
          <InfoField
            label={LABELS.TELEFONO}
            value={order.clienteTelefono || emptyValue}
          />
        </dl>

        {/* Descripción */}
        <dl>
          <InfoField label={LABELS.DESCRIPCION} value={order.descripcion} />
        </dl>

        {/* Dirección */}
        <dl>
          <InfoField label={LABELS.DIRECCION} value={order.direccion} />
        </dl>

        {/* Fecha de asignación */}
        <dl>
          <InfoField
            label={LABELS.FECHA_ASIGNACION}
            value={formatDateTime(order.fechaAsignacion)}
          />
        </dl>

        {/* Cambiador de estado */}
        <div className="pt-4 border-t border-gray-200">
          <OrderStatusChanger order={order} />
        </div>
      </CardContent>
    </Card>
  );
}

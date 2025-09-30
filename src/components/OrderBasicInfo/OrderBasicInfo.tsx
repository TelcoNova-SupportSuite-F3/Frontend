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

interface OrderBasicInfoProps {
  order: OrdenTrabajoResponse;
}

export default function OrderBasicInfo({ order }: OrderBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn('text-primary')}>
          Información de la orden
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-4')}>
        {/* Estado y Prioridad */}
        <div
          className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4')}
        >
          <div>
            <p className={cn('text-sm font-medium text-gray-500')}>Estado</p>
            <Badge className={cn(getEstadoColor(order.estado))}>
              {ESTADO_LABELS[order.estado]}
            </Badge>
          </div>
          <div>
            <p className={cn('text-sm font-medium text-gray-500')}>Prioridad</p>
            <Badge className={cn(getPrioridadColor(order.prioridad))}>
              {PRIORIDAD_LABELS[order.prioridad]}
            </Badge>
          </div>
          <div>
            <p className={cn('text-sm font-medium text-gray-500')}>Cliente</p>
            <p className={cn('text-sm')}>{order.clienteNombre}</p>
          </div>
          <div>
            <p className={cn('text-sm font-medium text-gray-500')}>Teléfono</p>
            <p className={cn('text-sm')}>{order.clienteTelefono || '-'}</p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <p className={cn('text-sm font-medium text-gray-500')}>Descripción</p>
          <p className={cn('text-sm')}>{order.descripcion}</p>
        </div>

        {/* Dirección */}
        <div>
          <p className={cn('text-sm font-medium text-gray-500')}>Dirección</p>
          <p className={cn('text-sm')}>{order.direccion}</p>
        </div>

        {/* Fecha de asignación */}
        <div>
          <p className={cn('text-sm font-medium text-gray-500')}>
            Fecha asignación
          </p>
          <p className={cn('text-sm')}>
            {formatDateTime(order.fechaAsignacion)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

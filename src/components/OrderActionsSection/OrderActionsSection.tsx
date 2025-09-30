import EvidenceUpload from '@/components/EvidenceUpload/EvidenceUpload';
import OrderComments from '@/components/OrderComments/OrderComments';
import OrderTimeTracker from '@/components/OrderTimeTracker/OrderTimeTracker';
import MaterialsSection from '@/components/MaterialsSection/MaterialsSection';
import { cn } from '@/lib/utils';
import type { OrdenTrabajoResponse } from '@/types/orders';

interface OrderActionsSectionProps {
  order: OrdenTrabajoResponse;
}

export default function OrderActionsSection({
  order,
}: OrderActionsSectionProps) {
  // Convertir las fechas del backend (strings) a objetos Date
  const initialStartTime = order.fechaInicioTrabajo
    ? new Date(order.fechaInicioTrabajo)
    : undefined;
  const initialEndTime = order.fechaFinTrabajo
    ? new Date(order.fechaFinTrabajo)
    : undefined;

  return (
    <section className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6')}>
      {/* Columna izquierda: Widgets de interacción */}
      <div className={cn('space-y-6')}>
        <OrderTimeTracker
          orderId={order.id.toString()}
          initialStartTime={initialStartTime}
          initialEndTime={initialEndTime}
        />
        <EvidenceUpload orderId={order.id.toString()} />
        <OrderComments orderId={order.id.toString()} />
      </div>

      {/* Columna derecha: Materiales */}
      <div className={cn('space-y-6')}>
        <MaterialsSection
          orderId={order.id.toString()}
          materialesUtilizados={order.materialesUtilizados}
        />
      </div>
    </section>
  );
}

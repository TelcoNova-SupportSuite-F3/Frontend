import EvidenceUpload from '@/components/EvidenceUpload/EvidenceUpload';
import OrderComments from '@/components/OrderComments/OrderComments';
import OrderTimeTracker from '@/components/OrderTimeTracker/OrderTimeTracker';
import MaterialsSection from '@/components/MaterialsSection/MaterialsSection';
import { cn } from '@/lib/utils';
import type { OrdenTrabajoResponse } from '@/types/orders';
import {
  ORDER_ACTIONS_SECTION_STYLES,
  parseDateString,
} from './order-actions.utils';

/**
 * Props para OrderActionsSection
 */
interface OrderActionsSectionProps {
  /** Orden de trabajo con toda su información */
  order: OrdenTrabajoResponse;
}

/**
 * OrderActionsSection Component
 *
 * Sección principal de acciones para una orden de trabajo.
 * Organiza los widgets de interacción en dos columnas:
 * - Columna izquierda: Tiempo, evidencias y comentarios
 * - Columna derecha: Materiales
 *
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo organiza componentes de acciones
 * - Open/Closed: Configurable a través de props y constantes
 * - Dependency Inversion: Compone componentes más pequeños
 *
 * @example
 * ```tsx
 * <OrderActionsSection order={orderData} />
 * ```
 */
export default function OrderActionsSection({
  order,
}: OrderActionsSectionProps) {
  // Convertir las fechas del backend (strings) a objetos Date
  const initialStartTime = parseDateString(order.fechaInicioTrabajo);
  const initialEndTime = parseDateString(order.fechaFinTrabajo);

  return (
    <section className={cn(ORDER_ACTIONS_SECTION_STYLES.CONTAINER)}>
      {/* Columna izquierda: Widgets de interacción */}
      <div className={cn(ORDER_ACTIONS_SECTION_STYLES.LEFT_COLUMN)}>
        <OrderTimeTracker
          orderId={order.id.toString()}
          initialStartTime={initialStartTime}
          initialEndTime={initialEndTime}
        />
        <EvidenceUpload orderId={order.id.toString()} />
        <OrderComments orderId={order.id.toString()} />
      </div>

      {/* Columna derecha: Materiales */}
      <div className={cn(ORDER_ACTIONS_SECTION_STYLES.RIGHT_COLUMN)}>
        <MaterialsSection
          orderId={order.id.toString()}
          materialesUtilizados={order.materialesUtilizados}
          orderEstado={order.estado}
        />
      </div>
    </section>
  );
}

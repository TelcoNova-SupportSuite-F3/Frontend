'use client';

import OrderDetailHeader from '@/components/OrderDetailHeader/OrderDetailHeader';
import OrderBasicInfo from '@/components/OrderBasicInfo/OrderBasicInfo';
import OrderActionsSection from '@/components/OrderActionsSection/OrderActionsSection';
import { cn } from '@/lib/utils';
import type { OrdenTrabajoResponse } from '@/types/orders';

interface OrderDetailClientProps {
  order: OrdenTrabajoResponse;
}

/**
 * Componente cliente para la página de detalle de orden
 *
 * Renderiza los componentes principales de la vista de detalle.
 * Las fechas son gestionadas automáticamente por el backend:
 * - fechaInicioTrabajo: Se establece al cambiar a "En Proceso"
 * - fechaFinTrabajo: Se genera automáticamente al finalizar
 */
export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  return (
    <main className={cn('space-y-6')}>
      <OrderDetailHeader order={order} />
      <OrderBasicInfo order={order} />
      <OrderActionsSection order={order} />
    </main>
  );
}

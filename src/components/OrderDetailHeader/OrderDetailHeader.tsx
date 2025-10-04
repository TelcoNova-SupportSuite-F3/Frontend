import BackButton from '@/components/BackButton/BackButton';
import type { OrdenTrabajoResponse } from '@/types/orders';
import { cn } from '@/lib/utils';
import {
  DEFAULT_TITLE,
  STYLES,
  formatSubtitle,
} from './order-detail-header.constants';

/**
 * Props para el componente OrderDetailHeader
 */
interface OrderDetailHeaderProps {
  /** Datos de la orden de trabajo (opcional) */
  order?: OrdenTrabajoResponse;
  /** Título del encabezado */
  title?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Mostrar botón de retroceso */
  showBackButton?: boolean;
  /** Props adicionales para el botón de retroceso */
  backButtonProps?: React.ComponentProps<typeof BackButton>;
}

/**
 * Componente de encabezado para la página de detalle de orden de trabajo
 *
 * Muestra el título de la página, información resumida de la orden
 * y un botón para volver a la lista de órdenes.
 *
 * @example
 * ```tsx
 * <OrderDetailHeader
 *   order={orderData}
 *   title="Detalle de Orden"
 *   showBackButton={true}
 * />
 * ```
 *
 * @example
 * // Sin datos de orden
 * ```tsx
 * <OrderDetailHeader
 *   title="Nueva Orden"
 *   showBackButton={false}
 * />
 * ```
 */
export default function OrderDetailHeader({
  order,
  title = DEFAULT_TITLE,
  className,
  showBackButton = true,
  backButtonProps,
}: OrderDetailHeaderProps) {
  return (
    <header className={cn(STYLES.HEADER, className)}>
      <div>
        {showBackButton && <BackButton {...backButtonProps} />}
        <h1 className={cn(STYLES.TITLE)}>{title}</h1>
        {order && (
          <p className={cn(STYLES.SUBTITLE)}>
            {formatSubtitle(order.numeroOrden, order.titulo)}
          </p>
        )}
      </div>
    </header>
  );
}

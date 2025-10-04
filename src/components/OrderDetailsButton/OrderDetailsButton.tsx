'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  BUTTON_TEXT,
  STYLES,
  getAriaLabel,
  getOrderDetailsUrl,
} from './order-details-button.constants';

/**
 * Props para el componente OrderDetailsButton
 */
interface OrderDetailsButtonProps {
  /** ID de la orden de trabajo */
  orderId: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Texto personalizado del botón */
  buttonText?: string;
  /** Callback ejecutado al hacer click (opcional) */
  onClick?: () => void;
}

/**
 * Componente de botón para ver detalles de una orden de trabajo
 *
 * Renderiza un link estilizado como botón que navega a la página
 * de detalles de una orden específica.
 *
 * @example
 * ```tsx
 * <OrderDetailsButton
 *   orderId="12345"
 *   buttonText="Ver más"
 *   onClick={() => console.log('Navegando...')}
 * />
 * ```
 */
export default function OrderDetailsButton({
  orderId,
  className,
  buttonText = BUTTON_TEXT,
  onClick,
}: OrderDetailsButtonProps) {
  return (
    <Link
      href={getOrderDetailsUrl(orderId)}
      className={cn(STYLES.BASE, STYLES.VARIANT, STYLES.SIZE, className)}
      aria-label={getAriaLabel(orderId)}
      role='button'
      onClick={onClick}
    >
      {buttonText}
    </Link>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { OrdenTrabajoResponse } from '@/types/orders';
import { cn } from '@/lib/utils';
import { useOrderStatusChange } from '@/hooks/useOrderStatusChange';
import OrderStatusConfirmDialog from './OrderStatusConfirmDialog';
import { isOrderClosed } from './order-status-changer.utils';
import {
  STATUS_OPTIONS,
  MESSAGES,
  STYLES,
  ARIA_LABELS,
  STATUS_BUTTON_INACTIVE,
  getStatusButtonActiveColor,
} from './order-status-changer.constants';
import { useToast } from '@/hooks/use-toast';

/**
 * Props para OrderStatusChanger
 */
interface OrderStatusChangerProps {
  /** Orden de trabajo */
  order: OrdenTrabajoResponse;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente para cambiar el estado de una orden
 *
 * Características:
 * - Muestra botones para cada estado disponible
 * - Resalta el estado actual
 * - Deshabilita estados no permitidos según reglas de negocio
 * - Muestra confirmación para estados irreversibles
 * - Valida permisos del técnico
 * - Accesibilidad WCAG AA completa
 *
 * @example
 * ```tsx
 * <OrderStatusChanger order={orderData} />
 * ```
 */
export default function OrderStatusChanger({
  order,
  className,
}: OrderStatusChangerProps) {
  const { user } = useAuth();
  const toast = useToast();
  const {
    isLoading,
    error,
    success,
    showConfirmDialog,
    pendingStatus,
    handleStatusChange,
    confirmStatusChange,
    cancelStatusChange,
  } = useOrderStatusChange(order, user?.email);

  // Verificar si la orden está cerrada
  const orderClosed = isOrderClosed(order);

  // Obtener el mensaje de confirmación del estado pendiente
  const confirmMessage =
    STATUS_OPTIONS.find((opt) => opt.value === pendingStatus)
      ?.confirmMessage || '';

  // Referencias para evitar mostrar toasts duplicados
  const errorShownRef = useRef<string | null>(null);
  const successShownRef = useRef<boolean>(false);

  // Mostrar toast de error (solo una vez por mensaje único)
  useEffect(() => {
    if (error && error !== errorShownRef.current) {
      toast.error(error);
      errorShownRef.current = error;
    } else if (!error) {
      errorShownRef.current = null;
    }
  }, [error, toast]);

  // Mostrar toast de éxito (solo una vez)
  useEffect(() => {
    if (success && !successShownRef.current) {
      toast.success(MESSAGES.SUCCESS);
      successShownRef.current = true;
    } else if (!success) {
      successShownRef.current = false;
    }
  }, [success, toast]);

  return (
    <div className={cn(STYLES.CONTAINER, className)}>
      {/* Título */}
      <div>
        <h3 className={cn(STYLES.TITLE)}>{MESSAGES.TITLE}</h3>
        {orderClosed && (
          <p className={cn(STYLES.ERROR_MESSAGE)}>{MESSAGES.ORDER_CLOSED}</p>
        )}
      </div>

      {/* Grid de botones de estado */}
      <div className={cn(STYLES.STATUS_GRID)}>
        {STATUS_OPTIONS.map((option) => {
          const isActive = order.estado === option.value;
          const isDisabled = orderClosed || isLoading;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStatusChange(option.value)}
              disabled={isDisabled}
              aria-label={ARIA_LABELS.STATUS_BUTTON(option.label)}
              aria-pressed={isActive}
              aria-disabled={isDisabled}
              className={cn(
                STYLES.STATUS_BUTTON,
                isActive && getStatusButtonActiveColor(option.value),
                !isActive && !isDisabled && STATUS_BUTTON_INACTIVE,
                isDisabled && STYLES.STATUS_BUTTON_DISABLED
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Mensaje de carga */}
      {isLoading && (
        <div className={cn(STYLES.LOADING_CONTAINER)}>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          <span>{MESSAGES.LOADING}</span>
        </div>
      )}

      {/* Modal de confirmación */}
      <OrderStatusConfirmDialog
        isOpen={showConfirmDialog}
        message={confirmMessage}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
        isLoading={isLoading}
      />
    </div>
  );
}

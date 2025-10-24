'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MESSAGES, ARIA_LABELS } from './order-status-changer.constants';

/**
 * Props para OrderStatusConfirmDialog
 */
interface OrderStatusConfirmDialogProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Mensaje de confirmación a mostrar */
  message: string;
  /** Callback al confirmar */
  onConfirm: () => void;
  /** Callback al cancelar */
  onCancel: () => void;
  /** Si está en proceso de confirmación */
  isLoading?: boolean;
}

/**
 * Modal de confirmación para cambios de estado irreversibles
 *
 * Cumple con WCAG AA:
 * - Foco automático en botones
 * - Soporte de tecla Escape
 * - Aria-labels descriptivos
 * - Contraste de colores adecuado
 *
 * @example
 * ```tsx
 * <OrderStatusConfirmDialog
 *   isOpen={showDialog}
 *   message="¿Está seguro de finalizar esta orden?"
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export default function OrderStatusConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: OrderStatusConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        aria-label={ARIA_LABELS.CONFIRM_DIALOG}
        aria-describedby="confirm-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{MESSAGES.CONFIRM_TITLE}</DialogTitle>
          <DialogDescription id="confirm-dialog-description">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            aria-label={MESSAGES.CONFIRM_CANCEL}
          >
            {MESSAGES.CONFIRM_CANCEL}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={MESSAGES.CONFIRM_ACCEPT}
          >
            {isLoading ? MESSAGES.LOADING : MESSAGES.CONFIRM_ACCEPT}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

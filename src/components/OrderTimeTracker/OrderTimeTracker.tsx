'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { updateOrderTimes } from '@/lib/order-actions';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ERROR_MESSAGES,
  LABELS,
  ARIA_LABELS,
  STYLES,
  validateEndAfterStart,
  dateToISOString,
} from './order-time-tracker.constants';

/**
 * Props para el componente OrderTimeTracker
 */
interface OrderTimeTrackerProps {
  /** ID de la orden de trabajo */
  orderId: string;
  /** Fecha y hora inicial de inicio del trabajo */
  initialStartTime?: Date;
  /** Fecha y hora inicial de fin del trabajo */
  initialEndTime?: Date;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Callback ejecutado cuando se actualizan las fechas exitosamente */
  onTimesUpdated?: (start: Date | undefined, end: Date | undefined) => void;
  /** Deshabilitar edición de fecha de inicio */
  disableStartEdit?: boolean;
  /** Deshabilitar edición de fecha de fin */
  disableEndEdit?: boolean;
}

/**
 * Componente para rastrear y actualizar tiempos de trabajo de una orden
 *
 * Permite visualizar y editar las fechas de inicio y fin del trabajo.
 * La fecha de inicio es de solo lectura por defecto, mientras que la fecha
 * de fin es editable. Incluye validación para asegurar que la fecha de fin
 * sea posterior a la de inicio, y guarda automáticamente los cambios.
 *
 * @example
 * ```tsx
 * <OrderTimeTracker
 *   orderId="12345"
 *   initialStartTime={new Date('2024-01-15T08:00:00')}
 *   initialEndTime={new Date('2024-01-15T17:00:00')}
 *   onTimesUpdated={(start, end) => console.log('Fechas actualizadas')}
 * />
 * ```
 *
 * @example
 * // Sin fechas iniciales
 * ```tsx
 * <OrderTimeTracker
 *   orderId="12345"
 *   disableStartEdit={false}
 * />
 * ```
 */
export default function OrderTimeTracker({
  orderId,
  initialStartTime,
  initialEndTime,
  className,
  onTimesUpdated,
  disableStartEdit = true,
  disableEndEdit = false,
}: OrderTimeTrackerProps) {
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(
    initialStartTime
  );
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(
    initialEndTime
  );
  const [dateError, setDateError] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  /**
   * Valida que las fechas sean coherentes
   */
  const validateDates = (start: Date | undefined, end: Date | undefined) => {
    const validation = validateEndAfterStart(start, end);
    setDateError(validation.error);
    return validation.isValid;
  };

  /**
   * Maneja el cambio de fecha de inicio
   */
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateTime(date);
    validateDates(date, endDateTime);

    // Auto-guardar cuando se cambia la fecha de inicio
    if (date) {
      saveTimeChanges(date, endDateTime);
    }
  };

  /**
   * Maneja el cambio de fecha de fin
   */
  const handleEndDateChange = (date: Date | undefined) => {
    if (!validateDates(startDateTime, date)) {
      return;
    }

    setEndDateTime(date);

    // Auto-guardar cuando se cambia la fecha de fin
    if (date && startDateTime) {
      saveTimeChanges(startDateTime, date);
    }
  };

  /**
   * Guarda los cambios de tiempo en el backend
   */
  const saveTimeChanges = (start: Date | undefined, end: Date | undefined) => {
    startTransition(async () => {
      try {
        const result = await updateOrderTimes(
          orderId,
          dateToISOString(start),
          dateToISOString(end)
        );

        if (result.success) {
          toast.success(result.message);
          onTimesUpdated?.(start, end);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error updating times:', error);
        toast.error(ERROR_MESSAGES.UNEXPECTED_ERROR);
      }
    });
  };

  return (
    <Card className={cn(className)}>
      <CardContent className={cn(STYLES.CONTENT)}>
        <div className={cn(STYLES.CONTAINER)}>
          {/* Mensaje de error de validación */}
          {dateError && (
            <div
              className={cn(STYLES.ERROR_ALERT)}
              role='alert'
              aria-label={ARIA_LABELS.ERROR_ALERT}
            >
              <AlertCircle
                className={cn(STYLES.ERROR_ICON)}
                aria-hidden='true'
              />
              {dateError}
            </div>
          )}

          <div className={cn(STYLES.GRID)}>
            {/* Contenedor de fecha de inicio */}
            <div
              className={cn(STYLES.SECTION_BASE)}
              aria-label={ARIA_LABELS.START_CONTAINER}
            >
              <h3 className={cn(STYLES.SECTION_TITLE)}>
                {LABELS.START_SECTION_TITLE}
              </h3>
              <DateTimePicker
                label={LABELS.DATE_LABEL}
                value={startDateTime}
                onChange={handleStartDateChange}
                placeholder={LABELS.START_PLACEHOLDER}
                disabled={disableStartEdit}
                compact={true}
              />
            </div>

            {/* Contenedor de fecha de fin */}
            <div
              className={cn(STYLES.SECTION_BASE, {
                [STYLES.SECTION_DISABLED]: !startDateTime,
              })}
              aria-label={ARIA_LABELS.END_CONTAINER}
            >
              <h3 className={cn(STYLES.SECTION_TITLE)}>
                {LABELS.END_SECTION_TITLE}
              </h3>

              <DateTimePicker
                label={LABELS.DATE_LABEL}
                value={endDateTime}
                onChange={handleEndDateChange}
                placeholder={LABELS.END_PLACEHOLDER}
                minDate={startDateTime}
                disabled={!startDateTime || isPending || disableEndEdit}
                compact={true}
              />
            </div>
          </div>

          {/* Indicador de guardado */}
          {isPending && (
            <div
              className={cn(STYLES.SAVING_TEXT)}
              role='status'
              aria-live='polite'
              aria-label={ARIA_LABELS.SAVING_STATUS}
            >
              {LABELS.SAVING}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

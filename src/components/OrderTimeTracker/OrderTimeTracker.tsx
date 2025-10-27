'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LABELS,
  ARIA_LABELS,
  STYLES,
  validateEndAfterStart,
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
 * Componente para visualizar tiempos de trabajo de una orden
 *
 * Muestra las fechas de inicio y fin del trabajo en modo de solo lectura.
 * Las fechas son gestionadas automáticamente por el backend:
 * - Fecha de inicio: Se establece automáticamente al cambiar estado a "En Proceso"
 * - Fecha de fin: Se establece automáticamente al finalizar la orden
 *
 * @example
 * ```tsx
 * <OrderTimeTracker
 *   orderId="12345"
 *   initialStartTime={new Date('2024-01-15T08:00:00')}
 *   initialEndTime={new Date('2024-01-15T17:00:00')}
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
  disableEndEdit = true, // Ambas fechas son de solo lectura (automáticas)
}: OrderTimeTrackerProps) {
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(
    initialStartTime
  );
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(
    initialEndTime
  );
  const [dateError, setDateError] = useState<string>('');

  /**
   * Sincronizar el estado local con los props cuando cambien
   * Esto permite que las fechas se actualicen cuando el backend
   * setea fechaInicioTrabajo o fechaFinTrabajo automáticamente
   */
  useEffect(() => {
    setStartDateTime(initialStartTime);
  }, [initialStartTime]);

  useEffect(() => {
    setEndDateTime(initialEndTime);
  }, [initialEndTime]);

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

    // Notificar al callback si existe
    onTimesUpdated?.(date, endDateTime);
  };

  /**
   * Maneja el cambio de fecha de fin
   */
  const handleEndDateChange = (date: Date | undefined) => {
    if (!validateDates(startDateTime, date)) {
      return;
    }

    setEndDateTime(date);

    // Notificar al callback si existe
    onTimesUpdated?.(startDateTime, date);
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
                disabled={!startDateTime || disableEndEdit}
                compact={true}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

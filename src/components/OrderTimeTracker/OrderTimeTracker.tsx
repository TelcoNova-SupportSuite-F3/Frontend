'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { updateOrderTimes } from '@/lib/order-actions';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface OrderTimeTrackerProps {
  orderId: string;
  initialStartTime?: Date;
  initialEndTime?: Date;
  className?: string;
}

export default function OrderTimeTracker({
  orderId,
  initialStartTime,
  initialEndTime,
  className,
}: OrderTimeTrackerProps) {
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(
    initialStartTime
  );
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(
    initialEndTime
  );
  const [dateError, setDateError] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const validateDates = (start: Date | undefined, end: Date | undefined) => {
    if (start && end && end <= start) {
      setDateError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateTime(date);
    validateDates(date, endDateTime);

    // Auto-save cuando se cambia la fecha de inicio
    if (date) {
      saveTimeChanges(date, endDateTime);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (startDateTime && date && date <= startDateTime) {
      setDateError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    setEndDateTime(date);
    setDateError('');

    // Auto-save cuando se cambia la fecha de fin
    if (date && startDateTime) {
      saveTimeChanges(startDateTime, date);
    }
  };

  const saveTimeChanges = (start: Date | undefined, end: Date | undefined) => {
    startTransition(async () => {
      try {
        const result = await updateOrderTimes(
          orderId,
          start?.toISOString() || null,
          end?.toISOString() || null
        );

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error updating times:', error);
        toast.error('Error inesperado al actualizar tiempos');
      }
    });
  };

  return (
    <Card className={cn(className)}>
      <CardContent className={cn('p-6')}>
        <div className={cn('space-y-4')}>
          {dateError && (
            <div
              className={cn(
                'flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm'
              )}
            >
              <AlertCircle className={cn('h-4 w-4')} />
              {dateError}
            </div>
          )}

          <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
            {/* Mini-contenedor de Inicio - Solo lectura */}
            <div className={cn('border rounded-lg p-4 bg-gray-50/50')}>
              <h3 className={cn('font-semibold text-sm text-gray-700 mb-3')}>
                Fecha de inicio
              </h3>
              <DateTimePicker
                label='Fecha'
                value={startDateTime}
                onChange={handleStartDateChange}
                placeholder='No marcada'
                disabled={true}
                compact={true}
              />
            </div>

            {/* Mini-contenedor de Fin - Editable */}
            <div
              className={cn('border rounded-lg p-4 bg-gray-50/50', {
                'opacity-50': !startDateTime,
              })}
            >
              <h3 className={cn('font-semibold text-sm text-gray-700 mb-3')}>
                Fecha de fin
              </h3>

              {/* Fecha actual de fin */}
              {endDateTime && (
                <div
                  className={cn(
                    'mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'
                  )}
                >
                  <p className={cn('text-xs font-medium text-green-700 mb-1')}>
                    Fecha de fin actual
                  </p>
                  <p className={cn('text-sm text-green-900 font-semibold')}>
                    {endDateTime.toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              <DateTimePicker
                label='Fecha'
                value={endDateTime}
                onChange={handleEndDateChange}
                placeholder='Seleccionar fecha'
                minDate={startDateTime}
                disabled={!startDateTime || isPending}
                compact={true}
              />
            </div>
          </div>

          {isPending && (
            <div className={cn('text-sm text-primary text-center')}>
              Guardando cambios...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

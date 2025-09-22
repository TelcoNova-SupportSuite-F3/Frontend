'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { updateOrderTimes } from '@/lib/order-actions';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OrderTimeTrackerProps {
  orderId: string;
  initialStartTime?: Date;
  initialEndTime?: Date;
}

export default function OrderTimeTracker({
  orderId,
  initialStartTime,
  initialEndTime,
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
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {dateError && (
            <div className='flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
              <AlertCircle className='h-4 w-4' />
              {dateError}
            </div>
          )}

          <div className='space-y-4'>
            <DateTimePicker
              label='Marcar inicio'
              value={startDateTime}
              onChange={handleStartDateChange}
              placeholder='Seleccionar fecha y hora de inicio'
              disabled={isPending}
            />

            <DateTimePicker
              label='Marcar fin'
              value={endDateTime}
              onChange={handleEndDateChange}
              placeholder='Seleccionar fecha y hora de fin'
              minDate={startDateTime}
              disabled={!startDateTime || isPending}
            />
          </div>

          {isPending && (
            <div className='text-sm text-blue-600 text-center'>
              Guardando cambios...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

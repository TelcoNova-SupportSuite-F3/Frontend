'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateTimePickerProps {
  label: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  disabled?: boolean;
  compact?: boolean;
}

export function DateTimePicker({
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  className,
  minDate,
  disabled = false,
  compact = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [timeValue, setTimeValue] = React.useState<string>('');

  // Inicializar time cuando hay un valor
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Si ya hay una hora seleccionada, mantenerla
      if (timeValue) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
      } else {
        // Si no hay hora, usar la hora actual
        const now = new Date();
        date.setHours(now.getHours(), now.getMinutes(), 0, 0);
        const newTimeValue = `${now
          .getHours()
          .toString()
          .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setTimeValue(newTimeValue);
      }

      setSelectedDate(date);
      onChange?.(date);
      setOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);

    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);

      setSelectedDate(newDateTime);
      onChange?.(newDateTime);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (minDate) {
      // Comparar solo las fechas, sin considerar la hora
      const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const minDateOnly = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate()
      );
      return dateOnly < minDateOnly;
    }
    return false;
  };

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label
              htmlFor={`date-picker-${label}`}
              className='text-xs font-medium text-gray-600'
            >
              {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  id={`date-picker-${label}`}
                  className='w-full justify-between font-normal text-sm h-9 px-2'
                  disabled={disabled}
                >
                  <span className='truncate'>
                    {selectedDate
                      ? selectedDate.toLocaleDateString('es-ES')
                      : placeholder}
                  </span>
                  <ChevronDownIcon className='h-3 w-3 ml-1 flex-shrink-0' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={selectedDate}
                  captionLayout='dropdown'
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor={`time-picker-${label}`}
              className='text-xs font-medium text-gray-600'
            >
              Hora
            </Label>
            <Input
              id={`time-picker-${label}`}
              type='time'
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className='w-full h-9 text-sm'
              disabled={disabled || !selectedDate}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className='flex flex-col gap-3'>
        <Label
          htmlFor={`date-picker-${label}`}
          className='px-1 text-sm font-medium'
        >
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id={`date-picker-${label}`}
              className='w-40 justify-between font-normal'
              disabled={disabled}
            >
              <span className='truncate'>
                {selectedDate
                  ? selectedDate.toLocaleDateString('es-ES')
                  : placeholder}
              </span>
              <ChevronDownIcon className='h-4 w-4 ml-2 flex-shrink-0' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={selectedDate}
              captionLayout='dropdown'
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-col gap-3'>
        <Label
          htmlFor={`time-picker-${label}`}
          className='px-1 text-sm font-medium'
        >
          Hora
        </Label>
        <Input
          type='time'
          id={`time-picker-${label}`}
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className='w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
          disabled={disabled || !selectedDate}
        />
      </div>
    </div>
  );
}

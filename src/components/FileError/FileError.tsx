import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileErrorProps {
  error: string;
}

export default function FileError({ error }: FileErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm'
      )}
      role='alert'
      aria-live='assertive'
    >
      <AlertCircle className={cn('h-4 w-4')} role='img' aria-label='Error' />
      {error}
    </div>
  );
}

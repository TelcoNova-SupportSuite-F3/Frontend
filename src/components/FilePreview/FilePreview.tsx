import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { useFileValidation } from '@/hooks/useFileValidation';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  isLoading: boolean;
  onRemove: () => void;
}

export default function FilePreview({
  file,
  isLoading,
  onRemove,
}: FilePreviewProps) {
  const { formatFileSize } = useFileValidation();

  return (
    <div
      className={cn('space-y-3')}
      role='status'
      aria-label='Archivo seleccionado'
    >
      <CheckCircle
        className={cn('mx-auto h-12 w-12 text-green-500')}
        role='img'
        aria-label='Archivo seleccionado correctamente'
      />
      <div className={cn('space-y-1')}>
        <p
          className={cn('font-medium text-gray-900')}
          aria-label={`Nombre del archivo: ${file.name}`}
        >
          {file.name}
        </p>
        <p
          className={cn('text-sm text-gray-500')}
          aria-label={`Tamaño del archivo: ${formatFileSize(file.size)}`}
        >
          {formatFileSize(file.size)}
        </p>
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={onRemove}
        className={cn(
          'text-destructive hover:text-destructive hover:bg-destructive/10'
        )}
        disabled={isLoading}
        aria-label={`Remover archivo ${file.name}`}
      >
        <X
          className={cn('h-4 w-4 mr-1')}
          role='img'
          aria-label='Ícono de eliminar'
        />
        Remover
      </Button>
    </div>
  );
}

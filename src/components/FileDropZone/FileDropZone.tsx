import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  dragActive: boolean;
  isLoading: boolean;
  onBrowseClick: () => void;
}

export default function FileDropZone({
  dragActive,
  isLoading,
  onBrowseClick,
}: FileDropZoneProps) {
  return (
    <div className={cn('space-y-3')}>
      <Upload
        className={cn('mx-auto h-12 w-12 text-gray-400')}
        role='img'
        aria-label='Ícono de subir archivo'
      />
      <div className={cn('space-y-1')}>
        <p className={cn('text-gray-600')} id='file-upload-instructions'>
          {dragActive ? 'Suelta el archivo aquí' : 'Arrastra una imagen aquí o'}
        </p>
        <Button
          variant='link'
          onClick={onBrowseClick}
          className={cn('text-primary p-0 h-auto font-normal')}
          disabled={isLoading}
          aria-label='Hacer clic para seleccionar archivo desde el explorador'
        >
          seleccionar archivo
        </Button>
      </div>
      <p className={cn('text-xs text-gray-500')} role='note'>
        JPG, JPEG, PNG hasta 5MB
      </p>
    </div>
  );
}

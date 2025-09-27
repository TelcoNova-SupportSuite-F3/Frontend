'use client';

import { Button } from '@/components/ui/button';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  isLoading?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onUpload,
  isLoading = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tipos de archivo permitidos
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/svg+xml'];
  const allowedExtensions = ['.jpg', '.jpeg', '.svg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos JPG, JPEG y SVG';
    }

    // Validar extensión como backup
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return 'Solo se permiten archivos con extensión .jpg, .jpeg, .svg';
    }

    // Validar tamaño
    if (file.size > maxSize) {
      return 'El archivo no puede ser mayor a 5MB';
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      return 'El archivo está vacío';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4')} role='region' aria-label='Subir evidencia'>
      <h3 className={cn('text-lg font-semibold')} id='file-upload-title'>
        Subir evidencia
      </h3>

      {/* Área de drop */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          {
            'border-primary bg-primary/5': dragActive,
            'border-destructive bg-destructive/5': error,
            'border-gray-300 hover:border-gray-400': !dragActive && !error,
          }
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role='button'
        tabIndex={0}
        aria-label='Área para arrastrar y soltar archivos o hacer clic para seleccionar'
        aria-describedby='file-upload-title file-upload-instructions'
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='.jpg,.jpeg,.svg,image/jpeg,image/svg+xml'
          onChange={handleInputChange}
          className='hidden'
          disabled={isLoading}
          aria-describedby='file-upload-instructions'
        />

        {!selectedFile ? (
          <div className={cn('space-y-3')}>
            <Upload
              className={cn('mx-auto h-12 w-12 text-gray-400')}
              role='img'
              aria-label='Ícono de subir archivo'
            />
            <div className={cn('space-y-1')}>
              <p className={cn('text-gray-600')} id='file-upload-instructions'>
                {dragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra una imagen aquí o'}
              </p>
              <Button
                variant='link'
                onClick={handleBrowseClick}
                className={cn('text-primary p-0 h-auto font-normal')}
                disabled={isLoading}
                aria-label='Hacer clic para seleccionar archivo desde el explorador'
              >
                seleccionar archivo
              </Button>
            </div>
            <p className={cn('text-xs text-gray-500')} role='note'>
              JPG, JPEG, SVG hasta 5MB
            </p>
          </div>
        ) : (
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
                aria-label={`Nombre del archivo: ${selectedFile.name}`}
              >
                {selectedFile.name}
              </p>
              <p
                className={cn('text-sm text-gray-500')}
                aria-label={`Tamaño del archivo: ${formatFileSize(
                  selectedFile.size
                )}`}
              >
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveFile}
              className={cn(
                'text-destructive hover:text-destructive hover:bg-destructive/10'
              )}
              disabled={isLoading}
              aria-label={`Remover archivo ${selectedFile.name}`}
            >
              <X
                className={cn('h-4 w-4 mr-1')}
                role='img'
                aria-label='Ícono de eliminar'
              />
              Remover
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className={cn(
            'flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm'
          )}
          role='alert'
          aria-live='assertive'
        >
          <AlertCircle
            className={cn('h-4 w-4')}
            role='img'
            aria-label='Error'
          />
          {error}
        </div>
      )}

      {/* Upload button */}
      <Button
        onClick={onUpload}
        className={cn('w-full bg-primary hover:bg-primary/90 text-white')}
        disabled={!selectedFile || isLoading}
        aria-label={
          selectedFile
            ? `Subir archivo ${selectedFile.name}`
            : 'Selecciona un archivo primero'
        }
        aria-describedby='upload-status'
      >
        {isLoading ? 'Subiendo...' : 'Enviar Evidencia'}
      </Button>
      <div id='upload-status' className='sr-only' aria-live='polite'>
        {isLoading ? 'Subiendo archivo, por favor espera' : ''}
      </div>
    </div>
  );
}

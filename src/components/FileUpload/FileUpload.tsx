'use client';

import { Button } from '@/components/ui/button';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

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
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Subir evidencia</h3>

      {/* Área de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='.jpg,.jpeg,.svg,image/jpeg,image/svg+xml'
          onChange={handleInputChange}
          className='hidden'
          disabled={isLoading}
        />

        {!selectedFile ? (
          <div className='space-y-3'>
            <Upload className='mx-auto h-12 w-12 text-gray-400' />
            <div className='space-y-1'>
              <p className='text-gray-600'>
                {dragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra una imagen aquí o'}
              </p>
              <Button
                variant='link'
                onClick={handleBrowseClick}
                className='text-blue-600 p-0 h-auto font-normal'
                disabled={isLoading}
              >
                seleccionar archivo
              </Button>
            </div>
            <p className='text-xs text-gray-500'>JPG, JPEG, SVG hasta 5MB</p>
          </div>
        ) : (
          <div className='space-y-3'>
            <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
            <div className='space-y-1'>
              <p className='font-medium text-gray-900'>{selectedFile.name}</p>
              <p className='text-sm text-gray-500'>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveFile}
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
              disabled={isLoading}
            >
              <X className='h-4 w-4 mr-1' />
              Remover
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className='flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
          <AlertCircle className='h-4 w-4' />
          {error}
        </div>
      )}

      {/* Upload button */}
      <Button
        onClick={onUpload}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white'
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? 'Subiendo...' : 'Enviar Evidencia'}
      </Button>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useFileSelection } from '@/hooks/useFileSelection';
import { useFileValidation } from '@/hooks/useFileValidation';
import FileDropZone from '@/components/FileDropZone/FileDropZone';
import FilePreview from '@/components/FilePreview/FilePreview';
import FileError from '@/components/FileError/FileError';
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
  const { config } = useFileValidation();
  const { dragActive, handleDrag, handleDragIn, handleDragOut, handleDrop } =
    useDragAndDrop();
  const {
    selectedFile,
    error,
    fileInputRef,
    handleInputChange,
    handleBrowseClick,
    handleRemoveFile,
    handleFilesDrop,
  } = useFileSelection({ onFileSelect });

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
        onDrop={(e) => handleDrop(e, handleFilesDrop)}
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
          accept={`${config.allowedExtensions.join(
            ','
          )},${config.allowedTypes.join(',')}`}
          onChange={handleInputChange}
          className='hidden'
          disabled={isLoading}
          aria-describedby='file-upload-instructions'
        />

        {!selectedFile ? (
          <FileDropZone
            dragActive={dragActive}
            isLoading={isLoading}
            onBrowseClick={handleBrowseClick}
          />
        ) : (
          <FilePreview
            file={selectedFile}
            isLoading={isLoading}
            onRemove={handleRemoveFile}
          />
        )}
      </div>

      {/* Error message */}
      <FileError error={error} />

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

'use client';

import { Button } from '@/components/ui/button';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useFileSelection } from '@/hooks/useFileSelection';
import { useFileValidation } from '@/hooks/useFileValidation';
import FileDropZone from '@/components/FileDropZone/FileDropZone';
import FilePreview from '@/components/FilePreview/FilePreview';
import FileError from '@/components/FileError/FileError';
import { cn } from '@/lib/utils';
import { FILE_UPLOAD_TEXTS, FILE_UPLOAD_STYLES } from './file-upload.constants';

/**
 * Props for FileUpload component
 */
interface FileUploadProps {
  /** Callback when a file is selected */
  onFileSelect: (file: File) => void;
  /** Callback when upload button is clicked */
  onUpload: () => void;
  /** Whether upload is in progress */
  isLoading?: boolean;
  /** Custom title for the upload section */
  title?: string;
  /** Custom upload button text */
  uploadButtonText?: string;
  /** Custom uploading button text */
  uploadingButtonText?: string;
  /** Optional CSS classes for container */
  className?: string;
  /** Custom allowed file extensions */
  allowedExtensions?: string[];
  /** Custom allowed MIME types */
  allowedTypes?: string[];
}

/**
 * FileUpload Component
 *
 * A complete file upload component with drag-and-drop, file validation,
 * preview, and error handling.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Coordinates file upload UI and interactions
 * - Open/Closed: Customizable through props without modification
 * - Dependency Inversion: Depends on hook abstractions (useDragAndDrop, useFileSelection)
 *
 * @example
 * ```tsx
 * <FileUpload
 *   onFileSelect={handleFileSelect}
 *   onUpload={handleUpload}
 *   isLoading={uploading}
 * />
 *
 * // With custom configuration
 * <FileUpload
 *   onFileSelect={handleFileSelect}
 *   onUpload={handleUpload}
 *   title="Subir documento"
 *   uploadButtonText="Enviar Documento"
 *   allowedExtensions={['.pdf', '.docx']}
 * />
 * ```
 */
export default function FileUpload({
  onFileSelect,
  onUpload,
  isLoading = false,
  title = FILE_UPLOAD_TEXTS.TITLE,
  uploadButtonText = FILE_UPLOAD_TEXTS.BUTTON_UPLOAD,
  uploadingButtonText = FILE_UPLOAD_TEXTS.BUTTON_UPLOADING,
  className,
  allowedExtensions,
  allowedTypes,
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

  const acceptedExtensions = allowedExtensions || config.allowedExtensions;
  const acceptedTypes = allowedTypes || config.allowedTypes;

  const getDropAreaClassName = () => {
    if (dragActive) return FILE_UPLOAD_STYLES.DROP_AREA_DRAG_ACTIVE;
    if (error) return FILE_UPLOAD_STYLES.DROP_AREA_ERROR;
    return FILE_UPLOAD_STYLES.DROP_AREA_DEFAULT;
  };

  return (
    <div
      className={cn(FILE_UPLOAD_STYLES.CONTAINER, className)}
      role='region'
      aria-label={FILE_UPLOAD_TEXTS.ARIA_REGION}
    >
      <h3 className={cn(FILE_UPLOAD_STYLES.TITLE)} id='file-upload-title'>
        {title}
      </h3>

      {/* Área de drop */}
      <div
        className={cn(
          FILE_UPLOAD_STYLES.DROP_AREA_BASE,
          getDropAreaClassName()
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={(e) => handleDrop(e, handleFilesDrop)}
        role='button'
        tabIndex={0}
        aria-label={FILE_UPLOAD_TEXTS.ARIA_DROP_AREA}
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
          accept={`${acceptedExtensions.join(',')},${acceptedTypes.join(',')}`}
          onChange={handleInputChange}
          className={FILE_UPLOAD_STYLES.HIDDEN_INPUT}
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
        className={cn(FILE_UPLOAD_STYLES.UPLOAD_BUTTON)}
        disabled={!selectedFile || isLoading}
        aria-label={
          selectedFile
            ? `Subir archivo ${selectedFile.name}`
            : FILE_UPLOAD_TEXTS.ARIA_SELECT_FILE_FIRST
        }
        aria-describedby='upload-status'
      >
        {isLoading ? uploadingButtonText : uploadButtonText}
      </Button>
      <div
        id='upload-status'
        className={FILE_UPLOAD_STYLES.SR_ONLY}
        aria-live='polite'
      >
        {isLoading ? FILE_UPLOAD_TEXTS.ARIA_UPLOAD_STATUS_UPLOADING : ''}
      </div>
    </div>
  );
}

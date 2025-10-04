import { Button } from '@/components/ui/button';
import { CheckCircle, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FILE_PREVIEW_TEXTS,
  FILE_PREVIEW_STYLES,
  formatFileSize,
} from './file-preview.utils';

/**
 * Props for FilePreview component
 */
interface FilePreviewProps {
  /** The file to preview */
  file: File;
  /** Whether an upload is in progress */
  isLoading: boolean;
  /** Callback when remove button is clicked */
  onRemove: () => void;
  /** Custom success icon */
  successIcon?: LucideIcon;
  /** Custom remove button text */
  removeButtonText?: string;
  /** Optional CSS classes for container */
  className?: string;
  /** Show file size */
  showFileSize?: boolean;
}

/**
 * FilePreview Component
 *
 * Displays a preview of the selected file with options to remove it.
 * Follows SOLID principles:
 * - Single Responsibility: Only displays file preview
 * - Open/Closed: Customizable through props
 * - Dependency Inversion: Accepts custom icons and formatters
 *
 * @example
 * ```tsx
 * <FilePreview
 *   file={selectedFile}
 *   isLoading={uploading}
 *   onRemove={handleRemove}
 * />
 *
 * // With custom icon
 * <FilePreview
 *   file={selectedFile}
 *   isLoading={uploading}
 *   onRemove={handleRemove}
 *   successIcon={FileCheck}
 *   removeButtonText="Cancelar"
 * />
 * ```
 */
export default function FilePreview({
  file,
  isLoading,
  onRemove,
  successIcon: SuccessIcon = CheckCircle,
  removeButtonText = FILE_PREVIEW_TEXTS.REMOVE_BUTTON,
  className,
  showFileSize = true,
}: FilePreviewProps) {
  return (
    <div
      className={cn(FILE_PREVIEW_STYLES.CONTAINER, className)}
      role='status'
      aria-label={FILE_PREVIEW_TEXTS.ARIA_SELECTED_FILE}
    >
      <SuccessIcon
        className={cn(FILE_PREVIEW_STYLES.SUCCESS_ICON)}
        role='img'
        aria-label={FILE_PREVIEW_TEXTS.ARIA_FILE_SELECTED_SUCCESS}
      />
      <div className={cn(FILE_PREVIEW_STYLES.TEXT_CONTAINER)}>
        <p
          className={cn(FILE_PREVIEW_STYLES.FILE_NAME)}
          aria-label={`Nombre del archivo: ${file.name}`}
        >
          {file.name}
        </p>
        {showFileSize && (
          <p
            className={cn(FILE_PREVIEW_STYLES.FILE_SIZE)}
            aria-label={`Tamaño del archivo: ${formatFileSize(file.size)}`}
          >
            {formatFileSize(file.size)}
          </p>
        )}
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={onRemove}
        className={cn(FILE_PREVIEW_STYLES.REMOVE_BUTTON)}
        disabled={isLoading}
        aria-label={`Remover archivo ${file.name}`}
      >
        <X
          className={cn(FILE_PREVIEW_STYLES.REMOVE_ICON)}
          role='img'
          aria-label={FILE_PREVIEW_TEXTS.ARIA_REMOVE_ICON}
        />
        {removeButtonText}
      </Button>
    </div>
  );
}

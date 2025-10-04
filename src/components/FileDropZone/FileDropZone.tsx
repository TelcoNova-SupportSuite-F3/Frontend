import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FILE_UPLOAD_TEXTS,
  FILE_UPLOAD_ARIA_LABELS,
  FILE_DROP_ZONE_STYLES,
} from './file-drop-zone.constants';

/**
 * Props for FileDropZone component
 */
interface FileDropZoneProps {
  /** Whether drag is currently active */
  dragActive: boolean;
  /** Whether upload is in progress */
  isLoading: boolean;
  /** Callback when browse button is clicked */
  onBrowseClick: () => void;
  /** Custom text for drag active state */
  dragActiveText?: string;
  /** Custom text for drag inactive state */
  dragInactiveText?: string;
  /** Custom text for browse button */
  browseButtonText?: string;
  /** Custom text for allowed formats */
  allowedFormatsText?: string;
  /** Optional CSS classes for container */
  className?: string;
}

/**
 * FileDropZone Component
 *
 * Displays the drop zone UI for file upload with drag-and-drop functionality.
 * Follows SOLID principles:
 * - Single Responsibility: Only displays drop zone UI
 * - Open/Closed: Customizable through props
 * - Dependency Inversion: Receives behavior through callbacks
 *
 * @example
 * ```tsx
 * <FileDropZone
 *   dragActive={isDragging}
 *   isLoading={uploading}
 *   onBrowseClick={handleBrowse}
 * />
 *
 * // With custom text
 * <FileDropZone
 *   dragActive={isDragging}
 *   isLoading={uploading}
 *   onBrowseClick={handleBrowse}
 *   allowedFormatsText="PDF, DOCX hasta 10MB"
 * />
 * ```
 */
export default function FileDropZone({
  dragActive,
  isLoading,
  onBrowseClick,
  dragActiveText = FILE_UPLOAD_TEXTS.DRAG_ACTIVE,
  dragInactiveText = FILE_UPLOAD_TEXTS.DRAG_INACTIVE,
  browseButtonText = FILE_UPLOAD_TEXTS.BROWSE_BUTTON,
  allowedFormatsText = FILE_UPLOAD_TEXTS.ALLOWED_FORMATS,
  className,
}: FileDropZoneProps) {
  return (
    <div className={cn(FILE_DROP_ZONE_STYLES.CONTAINER, className)}>
      <Upload
        className={cn(FILE_DROP_ZONE_STYLES.ICON)}
        role='img'
        aria-label={FILE_UPLOAD_ARIA_LABELS.UPLOAD_ICON}
      />
      <div className={cn(FILE_DROP_ZONE_STYLES.TEXT_CONTAINER)}>
        <p
          className={cn(FILE_DROP_ZONE_STYLES.INSTRUCTION_TEXT)}
          id='file-upload-instructions'
        >
          {dragActive ? dragActiveText : dragInactiveText}
        </p>
        <Button
          variant='link'
          onClick={onBrowseClick}
          className={cn(FILE_DROP_ZONE_STYLES.BUTTON)}
          disabled={isLoading}
          aria-label={FILE_UPLOAD_ARIA_LABELS.BROWSE_BUTTON}
        >
          {browseButtonText}
        </Button>
      </div>
      <p
        className={cn(FILE_DROP_ZONE_STYLES.FORMAT_TEXT)}
        role={FILE_UPLOAD_ARIA_LABELS.ALLOWED_FORMATS_ROLE}
      >
        {allowedFormatsText}
      </p>
    </div>
  );
}

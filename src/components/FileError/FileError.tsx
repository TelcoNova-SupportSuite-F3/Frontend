import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FILE_ERROR_VARIANTS,
  FILE_ERROR_BASE_STYLES,
  type FileErrorVariant,
  getFileErrorVariantStyle,
} from './file-error.constants';
import { type LucideIcon } from 'lucide-react';

/**
 * Props for FileError component
 */
interface FileErrorProps {
  /** Error message to display */
  error: string;
  /** Visual variant of the error */
  variant?: FileErrorVariant;
  /** Optional CSS classes for container */
  className?: string;
  /** Optional custom icon component */
  icon?: LucideIcon;
  /** Whether to show icon */
  showIcon?: boolean;
}

/**
 * Icon mapping for each variant
 */
const VARIANT_ICONS: Record<FileErrorVariant, LucideIcon> = {
  [FILE_ERROR_VARIANTS.ERROR]: AlertCircle,
  [FILE_ERROR_VARIANTS.WARNING]: AlertTriangle,
  [FILE_ERROR_VARIANTS.INFO]: Info,
};

/**
 * FileError Component
 *
 * Displays error, warning, or info messages for file operations.
 * Follows SOLID principles:
 * - Single Responsibility: Only displays error messages
 * - Open/Closed: Extended through variant and props
 * - Dependency Inversion: Icon can be customized
 *
 * @example
 * ```tsx
 * // Error message (default)
 * <FileError error="El archivo es muy grande" />
 *
 * // Warning message
 * <FileError
 *   error="El archivo podría tardar en subir"
 *   variant="warning"
 * />
 *
 * // Info message without icon
 * <FileError
 *   error="Formatos aceptados: JPG, PNG"
 *   variant="info"
 *   showIcon={false}
 * />
 *
 * // Custom icon
 * <FileError
 *   error="Custom error"
 *   icon={CustomIcon}
 * />
 * ```
 */
export default function FileError({
  error,
  variant = FILE_ERROR_VARIANTS.ERROR,
  className,
  icon,
  showIcon = true,
}: FileErrorProps) {
  if (!error) return null;

  const Icon = icon || VARIANT_ICONS[variant];
  const variantStyle = getFileErrorVariantStyle(variant);

  return (
    <div
      className={cn(FILE_ERROR_BASE_STYLES.CONTAINER, variantStyle, className)}
      role='alert'
      aria-live='assertive'
    >
      {showIcon && Icon && (
        <Icon
          className={cn(FILE_ERROR_BASE_STYLES.ICON)}
          role='img'
          aria-label={
            variant === FILE_ERROR_VARIANTS.ERROR
              ? 'Error'
              : variant === FILE_ERROR_VARIANTS.WARNING
              ? 'Advertencia'
              : 'Información'
          }
        />
      )}
      <span>{error}</span>
    </div>
  );
}

// Re-export constants for convenience
export { FILE_ERROR_VARIANTS, type FileErrorVariant };

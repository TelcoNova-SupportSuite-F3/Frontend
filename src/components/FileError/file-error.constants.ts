/**
 * Variant types for FileError component
 */
export const FILE_ERROR_VARIANTS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export type FileErrorVariant =
  (typeof FILE_ERROR_VARIANTS)[keyof typeof FILE_ERROR_VARIANTS];

/**
 * Variant styles for FileError component
 * Maps variant types to their corresponding Tailwind CSS classes
 */
export const FILE_ERROR_VARIANT_STYLES: Record<FileErrorVariant, string> = {
  [FILE_ERROR_VARIANTS.ERROR]: 'bg-destructive/10 text-destructive',
  [FILE_ERROR_VARIANTS.WARNING]:
    'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  [FILE_ERROR_VARIANTS.INFO]: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
} as const;

/**
 * Base styles for FileError component
 */
export const FILE_ERROR_BASE_STYLES = {
  CONTAINER: 'flex items-center gap-2 p-3 rounded-lg text-sm',
  ICON: 'h-4 w-4 flex-shrink-0',
} as const;

/**
 * Gets the style class for a given variant
 *
 * @param variant - The error variant
 * @returns The corresponding Tailwind CSS class
 */
export function getFileErrorVariantStyle(variant: FileErrorVariant): string {
  return (
    FILE_ERROR_VARIANT_STYLES[variant] ||
    FILE_ERROR_VARIANT_STYLES[FILE_ERROR_VARIANTS.ERROR]
  );
}

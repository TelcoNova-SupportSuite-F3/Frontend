/**
 * File preview text constants
 */
export const FILE_PREVIEW_TEXTS = {
  REMOVE_BUTTON: 'Remover',
  ARIA_SELECTED_FILE: 'Archivo seleccionado',
  ARIA_FILE_SELECTED_SUCCESS: 'Archivo seleccionado correctamente',
  ARIA_REMOVE_ICON: 'Ícono de eliminar',
} as const;

/**
 * File preview style constants
 */
export const FILE_PREVIEW_STYLES = {
  CONTAINER: 'space-y-3',
  SUCCESS_ICON: 'mx-auto h-12 w-12 text-green-500',
  TEXT_CONTAINER: 'space-y-1',
  FILE_NAME: 'font-medium text-gray-900',
  FILE_SIZE: 'text-sm text-gray-500',
  REMOVE_BUTTON:
    'text-destructive hover:text-destructive hover:bg-destructive/10',
  REMOVE_ICON: 'h-4 w-4 mr-1',
} as const;

/**
 * Formats bytes to human-readable file size
 *
 * @param bytes - The size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * File upload instruction text constants
 */
export const FILE_UPLOAD_TEXTS = {
  DRAG_ACTIVE: 'Suelta el archivo aquí',
  DRAG_INACTIVE: 'Arrastra una imagen aquí o',
  BROWSE_BUTTON: 'seleccionar archivo',
  ALLOWED_FORMATS: 'JPG, JPEG, PNG hasta 5MB',
} as const;

/**
 * ARIA labels for accessibility
 */
export const FILE_UPLOAD_ARIA_LABELS = {
  UPLOAD_ICON: 'Ícono de subir archivo',
  BROWSE_BUTTON: 'Hacer clic para seleccionar archivo desde el explorador',
  ALLOWED_FORMATS_ROLE: 'note',
} as const;

/**
 * CSS class constants for FileDropZone styling
 */
export const FILE_DROP_ZONE_STYLES = {
  ICON: 'mx-auto h-12 w-12 text-gray-400',
  CONTAINER: 'space-y-3',
  TEXT_CONTAINER: 'space-y-1',
  INSTRUCTION_TEXT: 'text-gray-600',
  BUTTON: 'text-primary p-0 h-auto font-normal',
  FORMAT_TEXT: 'text-xs text-gray-500',
} as const;

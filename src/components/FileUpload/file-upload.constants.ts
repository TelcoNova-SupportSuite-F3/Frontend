/**
 * File upload text constants
 */
export const FILE_UPLOAD_TEXTS = {
  TITLE: 'Subir evidencia',
  BUTTON_UPLOAD: 'Enviar Evidencia',
  BUTTON_UPLOADING: 'Subiendo...',
  ARIA_REGION: 'Subir evidencia',
  ARIA_DROP_AREA:
    'Área para arrastrar y soltar archivos o hacer clic para seleccionar',
  ARIA_UPLOAD_STATUS_UPLOADING: 'Subiendo archivo, por favor espera',
  ARIA_SELECT_FILE_FIRST: 'Selecciona un archivo primero',
} as const;

/**
 * File upload style constants
 */
export const FILE_UPLOAD_STYLES = {
  CONTAINER: 'space-y-4',
  TITLE: 'text-lg font-semibold',
  DROP_AREA_BASE:
    'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
  DROP_AREA_DRAG_ACTIVE: 'border-primary bg-primary/5',
  DROP_AREA_ERROR: 'border-destructive bg-destructive/5',
  DROP_AREA_DEFAULT: 'border-gray-300 hover:border-gray-400',
  UPLOAD_BUTTON: 'w-full bg-primary hover:bg-primary/90 text-white',
  SR_ONLY: 'sr-only',
  HIDDEN_INPUT: 'hidden',
} as const;

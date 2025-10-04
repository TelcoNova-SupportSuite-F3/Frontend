/**
 * Constantes para el componente OrderTimeTracker
 */

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  END_BEFORE_START: 'La fecha de fin debe ser posterior a la fecha de inicio',
  UNEXPECTED_ERROR: 'Error inesperado al actualizar tiempos',
} as const;

/**
 * Textos de la interfaz
 */
export const LABELS = {
  START_SECTION_TITLE: 'Fecha de inicio',
  END_SECTION_TITLE: 'Fecha de fin',
  DATE_LABEL: 'Fecha',
  START_PLACEHOLDER: 'No marcada',
  END_PLACEHOLDER: 'Seleccionar fecha',
  SAVING: 'Guardando cambios...',
} as const;

/**
 * Textos de accesibilidad
 */
export const ARIA_LABELS = {
  ERROR_ALERT: 'Error de validación de fechas',
  START_CONTAINER: 'Contenedor de fecha de inicio',
  END_CONTAINER: 'Contenedor de fecha de fin',
  SAVING_STATUS: 'Estado de guardado',
} as const;

/**
 * Clases de estilo
 */
export const STYLES = {
  CONTENT: 'p-6',
  CONTAINER: 'space-y-4',
  ERROR_ALERT:
    'flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm',
  ERROR_ICON: 'h-4 w-4',
  GRID: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  SECTION_BASE: 'border rounded-lg p-4 bg-gray-50/50',
  SECTION_DISABLED: 'opacity-50',
  SECTION_TITLE: 'font-semibold text-sm text-gray-700 mb-3',
  SAVING_TEXT: 'text-sm text-primary text-center',
} as const;

/**
 * Función helper para validar que la fecha de fin sea posterior a la de inicio
 */
export const validateEndAfterStart = (
  start: Date | undefined,
  end: Date | undefined
): { isValid: boolean; error: string } => {
  if (start && end && end <= start) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.END_BEFORE_START,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};

/**
 * Función helper para convertir Date a ISO string o null
 */
export const dateToISOString = (date: Date | undefined): string | null => {
  return date?.toISOString() || null;
};

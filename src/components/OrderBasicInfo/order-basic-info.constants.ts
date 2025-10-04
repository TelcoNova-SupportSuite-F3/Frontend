/**
 * Constantes para el componente OrderBasicInfo
 */

/**
 * Textos de las etiquetas para la información de la orden
 */
export const LABELS = {
  TITLE: 'Información de la orden',
  ESTADO: 'Estado',
  PRIORIDAD: 'Prioridad',
  CLIENTE: 'Cliente',
  TELEFONO: 'Teléfono',
  DESCRIPCION: 'Descripción',
  DIRECCION: 'Dirección',
  FECHA_ASIGNACION: 'Fecha asignación',
} as const;

/**
 * Valor por defecto para campos vacíos
 */
export const DEFAULT_EMPTY_VALUE = '-';

/**
 * Clases de estilo para el layout responsivo
 */
export const STYLES = {
  CARD_TITLE: 'text-primary',
  CONTENT_CONTAINER: 'space-y-4',
  GRID_CONTAINER: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  LABEL: 'text-sm font-medium text-gray-500',
  VALUE: 'text-sm',
} as const;

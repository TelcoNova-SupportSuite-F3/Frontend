/**
 * Configuración de búsqueda de materiales
 */
export const MATERIAL_SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 3,
  DROPDOWN_MAX_HEIGHT: 'max-h-64',
} as const;

/**
 * Textos del componente de búsqueda de materiales
 */
export const MATERIAL_SEARCH_TEXTS = {
  // Labels
  LABEL: 'Búsqueda de Material',

  // Placeholders
  PLACEHOLDER: 'Buscar material (mín. 3 letras)',

  // Mensajes de estado
  NO_RESULTS: 'No se encontraron materiales',
  INACTIVE_MATERIAL: 'Material inactivo',
  MIN_CHARS_HINT: (remaining: number) =>
    `Escribe al menos ${remaining} caracteres más para buscar`,

  // Información del material
  STOCK_LABEL: 'Stock:',
  CODE_LABEL: 'Código:',
} as const;

/**
 * Estilos del componente de búsqueda de materiales
 */
export const MATERIAL_SEARCH_STYLES = {
  // Contenedor
  CONTAINER: 'space-y-2 relative',
  LABEL: 'text-sm font-medium',

  // Input
  INPUT_WRAPPER: 'relative',
  INPUT_ICON_WRAPPER: 'relative',
  SEARCH_ICON:
    'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400',
  LOADER_ICON:
    'absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin',
  INPUT: 'pl-10 pr-10',
  INPUT_WARNING: 'border-yellow-300 focus:border-yellow-400',

  // Hint
  HINT: 'text-xs text-yellow-600 mt-1',

  // Dropdown
  DROPDOWN:
    'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto',
  DROPDOWN_LIST: 'py-1',

  // Items del dropdown
  ITEM_BASE:
    'px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0',
  ITEM_HIGHLIGHTED: 'bg-blue-50',
  ITEM_HOVER: 'hover:bg-gray-50',
  ITEM_INACTIVE: 'opacity-50 cursor-not-allowed',
  ITEM_CONTENT: 'flex justify-between items-start',
  ITEM_INFO: 'flex-1',
  ITEM_STOCK: 'ml-4 text-right flex-shrink-0',

  // Texto del item
  ITEM_NAME: 'font-medium text-sm text-gray-900',
  ITEM_CODE: 'text-xs text-gray-500 mt-0.5',
  ITEM_DESCRIPTION: 'text-xs text-gray-400 mt-1 line-clamp-2',
  ITEM_STOCK_AVAILABLE: 'text-xs font-semibold text-green-600',
  ITEM_STOCK_UNAVAILABLE: 'text-xs font-semibold text-red-600',
  ITEM_UNIT: 'text-xs text-gray-500 mt-0.5',
  ITEM_INACTIVE_TEXT: 'text-xs text-red-500 mt-1',

  // Estados
  ERROR_CONTAINER: 'px-4 py-3 flex items-center gap-2 text-red-600',
  ERROR_ICON: 'h-4 w-4 flex-shrink-0',
  ERROR_TEXT: 'text-sm',
  NO_RESULTS_CONTAINER: 'px-4 py-3 text-center text-gray-500',
  NO_RESULTS_TEXT: 'text-sm',
} as const;

/**
 * Obtiene la clase de estilo para el stock según la disponibilidad
 */
export function getStockStyle(stockDisponible: number): string {
  return stockDisponible > 0
    ? MATERIAL_SEARCH_STYLES.ITEM_STOCK_AVAILABLE
    : MATERIAL_SEARCH_STYLES.ITEM_STOCK_UNAVAILABLE;
}

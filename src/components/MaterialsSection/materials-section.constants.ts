/**
 * Textos de la sección de materiales
 */
export const MATERIALS_SECTION_TEXTS = {
  // Labels de campos
  SEARCH_LABEL: 'Búsqueda de Material',
  QUANTITY_LABEL: 'Cantidad',
  QUANTITY_MAX_HINT: (max: number, unit: string) => `(Máx: ${max} ${unit})`,

  // Placeholders
  QUANTITY_PLACEHOLDER: '0',

  // Botones
  ADD_BUTTON: 'Agregar Material',
  ADD_BUTTON_LOADING: 'Agregando...',
  EDIT_BUTTON_TOOLTIP: 'Edición no disponible actualmente',
  DELETE_BUTTON_TOOLTIP: 'Eliminación no disponible actualmente',

  // Tabla
  TABLE_HEADER_MATERIAL: 'Material',
  TABLE_HEADER_QUANTITY: 'Cantidad',
  TABLE_HEADER_ACTIONS: 'Acciones',
  TABLE_EMPTY: 'No hay materiales agregados',

  // Estados
  PROCESSING: 'Procesando...',

  // Modal de edición
  EDIT_MODAL_TITLE: 'Editar Material',
  EDIT_MODAL_DESCRIPTION:
    'Actualiza el nombre y la cantidad del material seleccionado.',
  EDIT_MODAL_MATERIAL_LABEL: 'Material:',
  EDIT_MODAL_QUANTITY_LABEL: 'Cantidad:',
  EDIT_MODAL_CANCEL: 'Cancelar',
  EDIT_MODAL_UPDATE: 'Actualizar',
  EDIT_MODAL_UPDATING: 'Actualizando...',
  EDIT_MODAL_NAME_PLACEHOLDER: 'Nombre del material',
  EDIT_MODAL_QUANTITY_PLACEHOLDER: 'Cantidad',

  // Información del material seleccionado
  SELECTED_MATERIAL_CODE: 'Código:',
  SELECTED_MATERIAL_STOCK: 'Stock disponible:',
} as const;

/**
 * Estilos de la sección de materiales
 */
export const MATERIALS_SECTION_STYLES = {
  // Contenedor principal
  CARD: 'bg-blue-50',
  CARD_CONTENT: 'p-6 space-y-4',

  // Formulario
  FORM_GRID: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
  FIELD_CONTAINER: 'space-y-2',
  LABEL: 'text-sm font-medium',
  LABEL_HINT: 'text-xs text-gray-500 ml-2',
  INPUT: 'w-full',

  // Información del material seleccionado
  SELECTED_INFO: 'bg-blue-100 border border-blue-200 rounded-lg p-3 text-sm',
  SELECTED_NAME: 'font-medium text-blue-900',
  SELECTED_DETAILS: 'text-blue-700 text-xs mt-1',

  // Botón de agregar
  ADD_BUTTON: 'w-full bg-blue-600 hover:bg-blue-700 text-white',

  // Tabla
  TABLE_CONTAINER: 'bg-white rounded-lg overflow-hidden',
  TABLE_HEADER: 'bg-blue-600',
  TABLE_HEADER_CELL: 'font-semibold text-white text-center',
  TABLE_ROW: 'hover:bg-gray-50',
  TABLE_CELL: 'text-center',
  TABLE_CELL_EMPTY: 'text-center py-8 text-gray-500',
  TABLE_ACTIONS: 'flex space-x-2 justify-center',

  // Botones de acción
  ACTION_BUTTON_BASE: 'h-8 w-8 p-0',
  ACTION_BUTTON_DISABLED: 'text-gray-400 cursor-not-allowed',
  ACTION_ICON: 'h-4 w-4',

  // Estados
  LOADING_TEXT: 'text-sm text-blue-600 text-center',

  // Modal
  MODAL_FORM_GRID: 'grid gap-4 py-4',
  MODAL_FIELD_GRID: 'grid grid-cols-4 items-center gap-4',
  MODAL_LABEL: 'text-right',
  MODAL_INPUT: 'col-span-3',
  MODAL_BUTTON_UPDATE: 'bg-blue-600 hover:bg-blue-700',
} as const;

/**
 * Configuración de la sección de materiales
 */
export const MATERIALS_SECTION_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms
  MIN_QUANTITY: 1,
  MIN_QUANTITY_MODAL: 0,
} as const;

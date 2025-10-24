/**
 * Constantes para el componente OrdersTable
 */

/**
 * Configuración de las columnas de la tabla
 */
export interface ColumnConfig {
  /** Identificador único de la columna */
  id: string;
  /** Título de la columna */
  title: string;
  /** Etiqueta de accesibilidad */
  ariaLabel: string;
}

/**
 * Definición de las columnas de la tabla
 */
export const TABLE_COLUMNS: ColumnConfig[] = [
  {
    id: 'id',
    title: 'ID',
    ariaLabel: 'Número de orden',
  },
  {
    id: 'titulo',
    title: 'Título de la orden',
    ariaLabel: 'Título descriptivo de la orden',
  },
  {
    id: 'estado',
    title: 'Estado de la orden',
    ariaLabel: 'Estado actual de la orden',
  },
  {
    id: 'fecha-inicio',
    title: 'Fecha inicio',
    ariaLabel: 'Fecha de inicio del trabajo',
  },
  {
    id: 'fecha-fin',
    title: 'Fecha fin',
    ariaLabel: 'Fecha de finalización del trabajo',
  },
  {
    id: 'detalle',
    title: 'Detalle',
    ariaLabel: 'Ver detalle de la orden',
  },
] as const;

/**
 * Mensajes de la interfaz
 */
export const MESSAGES = {
  EMPTY_STATE: 'No hay órdenes disponibles',
  TABLE_ARIA_LABEL: 'Lista de órdenes de trabajo',
} as const;

/**
 * Función para generar el aria-label de una fila
 */
export const getRowAriaLabel = (
  numeroOrden: string,
  titulo: string,
  estado: string
): string => `Orden ${numeroOrden}: ${titulo}, Estado: ${estado}`;

/**
 * Función para generar el aria-label de una celda
 */
export const getCellAriaLabel = (label: string, value: string): string =>
  `${label}: ${value}`;

/**
 * Clases de estilo
 */
export const STYLES = {
  EMPTY_STATE: 'text-center py-8 text-gray-500',
  HEADER_ROW: 'bg-primary/5',
  HEADER_CELL: 'font-semibold text-primary',
  BODY_ROW: 'hover:bg-gray-50',
  CELL_MEDIUM: 'font-medium',
  CELL_TRUNCATE: 'max-w-xs truncate',
} as const;

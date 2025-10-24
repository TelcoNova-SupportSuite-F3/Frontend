import type { EstadoOrden } from '@/types/orders';

/**
 * Configuración de estados disponibles para cambio
 */
export interface StatusOption {
  value: EstadoOrden;
  label: string;
  requiresConfirmation: boolean;
  confirmMessage: string;
}

/**
 * Estados disponibles para selección
 */
export const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'ASIGNADA',
    label: 'Asignada',
    requiresConfirmation: false,
    confirmMessage: '',
  },
  {
    value: 'EN_PROCESO',
    label: 'En Proceso',
    requiresConfirmation: false,
    confirmMessage: '',
  },
  {
    value: 'PAUSADA',
    label: 'Pausada',
    requiresConfirmation: false,
    confirmMessage: '',
  },
  {
    value: 'FINALIZADA',
    label: 'Finalizada',
    requiresConfirmation: true,
    confirmMessage:
      '¿Está seguro de finalizar esta orden? Esta acción es irreversible.',
  },
  {
    value: 'CANCELADA',
    label: 'Cancelada',
    requiresConfirmation: true,
    confirmMessage:
      '¿Está seguro de cancelar esta orden? Esta acción es irreversible.',
  },
];

/**
 * Mensajes de la interfaz
 */
export const MESSAGES = {
  TITLE: 'Cambiar Estado',
  CURRENT_STATUS: 'Estado actual',
  SELECT_STATUS: 'Seleccione el nuevo estado',
  LOADING: 'Cambiando estado...',
  SUCCESS: 'Estado actualizado exitosamente',
  CONFIRM_TITLE: 'Confirmar cambio de estado',
  CONFIRM_CANCEL: 'Cancelar',
  CONFIRM_ACCEPT: 'Confirmar',
  ORDER_CLOSED: 'Esta orden está cerrada y no puede modificarse',
  NO_PERMISSION: 'No tiene permisos para modificar esta orden',
} as const;

/**
 * Aria labels para accesibilidad
 */
export const ARIA_LABELS = {
  STATUS_BUTTON: (estado: string) => `Cambiar estado a ${estado}`,
  CURRENT_STATUS: (estado: string) => `Estado actual: ${estado}`,
  CONFIRM_DIALOG: 'Modal de confirmación de cambio de estado',
  CLOSE_DIALOG: 'Cerrar modal',
} as const;

/**
 * Clases para botones inactivos (todos blancos por defecto)
 */
export const STATUS_BUTTON_INACTIVE = 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300';

/**
 * Obtiene las clases para el estado activo (más oscuro y con anillo)
 */
export const getStatusButtonActiveColor = (estado: EstadoOrden): string => {
  switch (estado) {
    case 'ASIGNADA':
      return 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-500 ring-offset-2 border-2 border-blue-600';
    case 'EN_PROCESO':
      return 'bg-primary text-white hover:bg-primary/90 ring-2 ring-primary ring-offset-2 border-2 border-primary';
    case 'PAUSADA':
      return 'bg-yellow-600 text-white hover:bg-yellow-700 ring-2 ring-yellow-500 ring-offset-2 border-2 border-yellow-600';
    case 'FINALIZADA':
      return 'bg-green-600 text-white hover:bg-green-700 ring-2 ring-green-500 ring-offset-2 border-2 border-green-600';
    case 'CANCELADA':
      return 'bg-gray-600 text-white hover:bg-gray-700 ring-2 ring-gray-500 ring-offset-2 border-2 border-gray-600';
    default:
      return 'bg-gray-600 text-white hover:bg-gray-700 ring-2 ring-gray-500 ring-offset-2 border-2 border-gray-600';
  }
};

/**
 * Clases de estilo
 */
export const STYLES = {
  CONTAINER: 'space-y-4',
  TITLE: 'text-sm font-medium text-gray-700',
  STATUS_GRID: 'grid grid-cols-2 md:grid-cols-5 gap-2',
  STATUS_BUTTON:
    'px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  STATUS_BUTTON_DISABLED: 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50 border-2 border-gray-200',
  ERROR_MESSAGE: 'text-sm text-red-600 mt-2', // Solo para mensaje de orden cerrada
  LOADING_CONTAINER: 'flex items-center gap-2 text-sm text-gray-600',
} as const;

/**
 * Constantes para el componente OrderDetailsButton
 */

/**
 * Texto del botón
 */
export const BUTTON_TEXT = 'Ver detalles';

/**
 * Función para generar el aria-label del botón
 */
export const getAriaLabel = (orderId: string): string =>
  `Ver detalles de la orden ${orderId}`;

/**
 * Función para generar la URL de detalles de la orden
 */
export const getOrderDetailsUrl = (orderId: string): string =>
  `/orders/${orderId}`;

/**
 * Clases de estilo del botón
 */
export const STYLES = {
  BASE: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  VARIANT:
    'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  SIZE: 'h-9 px-3',
} as const;

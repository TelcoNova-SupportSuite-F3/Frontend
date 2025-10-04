/**
 * Constantes para el componente OrderComments
 */

/**
 * Configuración de límites del textarea
 */
export const COMMENT_CONFIG = {
  MAX_LENGTH: 1000,
  MIN_HEIGHT: '120px',
} as const;

/**
 * Duraciones de las notificaciones toast (en milisegundos)
 */
export const TOAST_DURATIONS = {
  SUCCESS: 3000,
  ERROR: 4000,
  UNEXPECTED_ERROR: 5000,
} as const;

/**
 * Mensajes de la interfaz
 */
export const MESSAGES = {
  TITLE: 'Agregar comentario',
  PLACEHOLDER: 'Escriba un comentario sobre la orden...',
  EMPTY_ERROR: 'Por favor escribe un comentario',
  UNEXPECTED_ERROR: 'Error inesperado al enviar comentario',
  ERROR_DESCRIPTION: 'Intenta nuevamente',
  UNEXPECTED_ERROR_DESCRIPTION: 'Verifica tu conexión e intenta nuevamente',
  SUBMIT_BUTTON: 'Enviar comentario',
  SUBMITTING: 'Enviando...',
  KEYBOARD_HINT: 'Ctrl+Enter para enviar',
} as const;

/**
 * Textos de accesibilidad
 */
export const ARIA_LABELS = {
  REGION: 'Comentarios de la orden',
  TEXTAREA: 'Campo de texto para escribir comentario',
  SUBMIT_BUTTON: 'Enviar comentario',
  SUBMIT_BUTTON_LOADING: 'Enviando comentario',
  HELP_TEXT: (maxLength: number) =>
    `Escribe un comentario sobre esta orden de trabajo. Máximo ${maxLength} caracteres. Usa Ctrl+Enter para enviar rápidamente.`,
  COUNTER: (current: number, max: number) =>
    `${current} de ${max} caracteres utilizados`,
  SUBMITTING_STATUS: 'Enviando comentario, por favor espera',
} as const;

/**
 * Función helper para formatear el texto del contador
 */
export const formatCharCounter = (
  current: number,
  max: number,
  showHint: boolean
): string => {
  const base = `${current}/${max} caracteres`;
  return showHint ? `${base} • ${MESSAGES.KEYBOARD_HINT}` : base;
};

/**
 * Función helper para generar la descripción del toast de éxito
 */
export const getSuccessDescription = (orderId: string): string =>
  `Comentario enviado para orden #${orderId}`;

/**
 * Clases de estilo
 */
export const STYLES = {
  CONTENT: 'p-6',
  CONTAINER: 'space-y-4',
  FIELD_CONTAINER: 'space-y-2',
  LABEL: 'text-base font-medium',
  TEXTAREA: 'min-h-[120px] resize-none',
  ACTIONS_CONTAINER: 'flex items-center justify-between',
  COUNTER: 'text-xs text-gray-500',
  BUTTON: 'bg-primary hover:bg-primary/90 text-white',
} as const;

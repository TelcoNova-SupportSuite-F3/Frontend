/**
 * Estilos de la sección de acciones de orden
 */
export const ORDER_ACTIONS_SECTION_STYLES = {
  CONTAINER: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  LEFT_COLUMN: 'space-y-6',
  RIGHT_COLUMN: 'space-y-6',
} as const;

/**
 * Convierte una cadena de fecha a objeto Date si existe
 *
 * @param dateString - Cadena de fecha del backend
 * @returns Objeto Date o undefined
 */
export function parseDateString(
  dateString: string | null | undefined
): Date | undefined {
  return dateString ? new Date(dateString) : undefined;
}

/**
 * Constantes para el componente OrderDetailHeader
 */

/**
 * Título por defecto del encabezado
 */
export const DEFAULT_TITLE = 'Orden de trabajo';

/**
 * Separador para el subtítulo
 */
export const SUBTITLE_SEPARATOR = ' - ';

/**
 * Clases de estilo
 */
export const STYLES = {
  HEADER: 'flex items-center justify-between',
  TITLE: 'text-3xl font-bold text-primary',
  SUBTITLE: 'text-primary/80 mt-1',
} as const;

/**
 * Función helper para formatear el subtítulo
 */
export const formatSubtitle = (numeroOrden: string, titulo: string): string => {
  return `${numeroOrden}${SUBTITLE_SEPARATOR}${titulo}`;
};

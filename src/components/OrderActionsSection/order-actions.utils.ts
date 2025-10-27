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
 * @param dateString - Cadena de fecha del backend (formato: "yyyy-MM-dd HH:mm:ss" o ISO 8601)
 * @returns Objeto Date o undefined
 */
export function parseDateString(
  dateString: string | null | undefined
): Date | undefined {
  if (!dateString) {
    console.log('⚠️ parseDateString: dateString es null/undefined');
    return undefined;
  }

  console.log('🔍 parseDateString: Intentando parsear:', dateString);

  try {
    // Si ya es una cadena ISO válida (contiene 'T'), usarla directamente
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        console.log('✅ parseDateString: Parseado como ISO:', date);
        return date;
      }
    }

    // Convertir formato "yyyy-MM-dd HH:mm:ss" a ISO 8601
    // El backend envía fechas en formato "2025-10-19 14:30:00"
    // Necesitamos convertirlo a "2025-10-19T14:30:00" para que Date lo parsee correctamente
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('❌ parseDateString: Fecha inválida después de parsear:', {
        original: dateString,
        iso: isoString,
        resultado: date
      });
      return undefined;
    }

    console.log('✅ parseDateString: Fecha parseada correctamente:', date);
    return date;
  } catch (error) {
    console.error('💥 parseDateString: Error al parsear fecha:', error, dateString);
    return undefined;
  }
}

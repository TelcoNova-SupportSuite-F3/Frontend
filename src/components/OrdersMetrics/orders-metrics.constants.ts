/**
 * Constantes para el componente OrdersMetrics
 */

import type { OrdersSummary } from './orders-metrics.types';

/**
 * Configuración de las métricas a mostrar
 */
export interface MetricConfig {
  /** Título de la métrica */
  title: string;
  /** Identificador único de la métrica */
  id: string;
  /** Función para obtener el valor de la métrica desde el resumen */
  getValue: (summary: OrdersSummary) => number;
}

/**
 * Definición de las métricas disponibles
 */
export const METRICS_CONFIG: MetricConfig[] = [
  {
    title: 'Total órdenes',
    id: 'total-orders',
    getValue: (summary) => summary.total,
  },
  {
    title: 'Total en curso',
    id: 'in-progress-orders',
    getValue: (summary) => summary.enProceso,
  },
  {
    title: 'Total finalizadas',
    id: 'completed-orders',
    getValue: (summary) => summary.finalizadas,
  },
] as const;

/**
 * Texto de accesibilidad
 */
export const ARIA_LABELS = {
  SECTION: 'Resumen de órdenes',
  getMetricLabel: (title: string, value: number) => `${title}: ${value}`,
} as const;

/**
 * Clases de estilo
 */
export const STYLES = {
  SECTION: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  CARD_HEADER: 'pb-3',
  CARD_TITLE: 'text-sm font-medium text-primary',
  VALUE: 'text-4xl font-bold text-gray-900',
} as const;

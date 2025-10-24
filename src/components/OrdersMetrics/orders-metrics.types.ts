/**
 * Tipos para el componente OrdersMetrics
 */

/**
 * Resumen de órdenes de trabajo
 */
export interface OrdersSummary {
  /** Total de órdenes */
  total: number;
  /** Órdenes en proceso */
  enProceso: number;
  /** Órdenes finalizadas */
  finalizadas: number;
}

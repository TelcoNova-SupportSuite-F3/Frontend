import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OrdersSummary } from './orders-metrics.types';
import {
  METRICS_CONFIG,
  ARIA_LABELS,
  STYLES,
} from './orders-metrics.constants';

/**
 * Props para el componente OrdersMetrics
 */
interface OrdersMetricsProps {
  /** Resumen con las estadísticas de las órdenes */
  summary: OrdersSummary;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Componente para mostrar métricas resumidas de órdenes de trabajo
 *
 * Presenta estadísticas clave en tarjetas individuales,
 * incluyendo total de órdenes, en proceso, finalizadas y asignadas.
 *
 * @example
 * ```tsx
 * <OrdersMetrics
 *   summary={{
 *     total: 150,
 *     enProceso: 45,
 *     finalizadas: 80,
 *     asignadas: 25
 *   }}
 * />
 * ```
 */
export default function OrdersMetrics({
  summary,
  className,
}: OrdersMetricsProps) {
  return (
    <section
      className={cn(STYLES.SECTION, className)}
      aria-label={ARIA_LABELS.SECTION}
    >
      {METRICS_CONFIG.map((metric) => {
        const value = metric.getValue(summary);

        return (
          <Card key={metric.id}>
            <CardHeader className={cn(STYLES.CARD_HEADER)}>
              <CardTitle className={cn(STYLES.CARD_TITLE)}>
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(STYLES.VALUE)}
                aria-label={ARIA_LABELS.getMetricLabel(metric.title, value)}
              >
                {value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

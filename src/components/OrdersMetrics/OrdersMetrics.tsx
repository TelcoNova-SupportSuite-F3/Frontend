import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OrdersSummary {
  total: number;
  enProceso: number;
  finalizadas: number;
  asignadas: number;
}

interface OrdersMetricsProps {
  summary: OrdersSummary;
}

export default function OrdersMetrics({ summary }: OrdersMetricsProps) {
  const metrics = [
    {
      title: 'Total órdenes',
      value: summary.total,
      id: 'total-orders',
    },
    {
      title: 'En proceso',
      value: summary.enProceso,
      id: 'in-progress-orders',
    },
    {
      title: 'Finalizadas',
      value: summary.finalizadas,
      id: 'completed-orders',
    },
    {
      title: 'Asignadas',
      value: summary.asignadas,
      id: 'assigned-orders',
    },
  ];

  return (
    <section
      className={cn('grid grid-cols-1 md:grid-cols-4 gap-4')}
      aria-label='Resumen de órdenes'
    >
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className='pb-3'>
            <CardTitle className={cn('text-sm font-medium text-primary')}>
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn('text-4xl font-bold text-gray-900')}
              aria-label={`${metric.title}: ${metric.value}`}
            >
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

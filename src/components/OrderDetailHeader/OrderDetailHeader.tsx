import BackButton from '@/components/BackButton/BackButton';
import type { OrdenTrabajoResponse } from '@/types/orders';
import { cn } from '@/lib/utils';

interface OrderDetailHeaderProps {
  order?: OrdenTrabajoResponse;
  title?: string;
}

export default function OrderDetailHeader({
  order,
  title = 'Orden de trabajo',
}: OrderDetailHeaderProps) {
  return (
    <header className={cn('flex items-center justify-between')}>
      <div>
        <BackButton />
        <h1 className={cn('text-3xl font-bold text-primary')}>{title}</h1>
        {order && (
          <p className={cn('text-primary/80 mt-1')}>
            {order.numeroOrden} - {order.titulo}
          </p>
        )}
      </div>
    </header>
  );
}

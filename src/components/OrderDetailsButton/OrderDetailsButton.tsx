'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrderDetailsButtonProps {
  orderId: string;
  className?: string;
}

export default function OrderDetailsButton({
  orderId,
  className,
}: OrderDetailsButtonProps) {
  return (
    <Link
      href={`/orders/${orderId}`}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
        'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        'h-9 px-3',
        className
      )}
      aria-label={`Ver detalles de la orden ${orderId}`}
      role='button'
    >
      Ver detalles
    </Link>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  return (
    <Link
      href='/orders'
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
        'mb-2 text-primary hover:text-primary/90 hover:bg-accent hover:text-accent-foreground',
        'h-10 px-4 py-2',
        className
      )}
      aria-label='Volver a la lista de órdenes de trabajo'
      role='button'
    >
      <span aria-hidden='true'>←</span>
      <span className='ml-1'>Volver a Mis ordenes</span>
    </Link>
  );
}

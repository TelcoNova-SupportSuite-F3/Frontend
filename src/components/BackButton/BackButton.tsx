'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type ComponentProps } from 'react';

/**
 * Props for BackButton component
 */
interface BackButtonProps {
  /** Optional CSS classes to merge with default styles */
  className?: string;
  /** URL to navigate back to. Defaults to '/orders' */
  href?: string;
  /** Label text for the button. Defaults to 'Volver a Mis ordenes' */
  label?: string;
  /** Additional props to pass to the Link component */
  linkProps?: Omit<ComponentProps<typeof Link>, 'href' | 'className'>;
}

/**
 * BackButton Component
 *
 * A reusable navigation button for returning to a previous page.
 * Follows the Open/Closed Principle by accepting configurable props
 * instead of hardcoded values.
 *
 * @example
 * ```tsx
 * // Default usage (navigates to /orders)
 * <BackButton />
 *
 * // Custom destination and label
 * <BackButton
 *   href="/dashboard"
 *   label="Volver al Dashboard"
 * />
 *
 * // With custom styling
 * <BackButton
 *   className="my-4"
 *   href="/orders"
 * />
 * ```
 *
 * @param {BackButtonProps} props - Component props
 * @returns Navigation link styled as a back button
 */
export default function BackButton({
  className,
  href = '/orders',
  label = 'Volver a Mis ordenes',
  linkProps,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
        'mb-2 text-primary hover:text-primary/90 hover:bg-accent hover:text-accent-foreground',
        'h-10 px-4 py-2',
        className
      )}
      aria-label={`Navegar a ${label}`}
      {...linkProps}
    >
      <span aria-hidden='true'>←</span>
      <span className='ml-1'>{label}</span>
    </Link>
  );
}

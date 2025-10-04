'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para asegurar que la autenticación se haya verificado
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push('/orders');
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Mostrar loading mientras redirecciona
  return (
    <main
      className={cn('min-h-screen flex items-center justify-center')}
      suppressHydrationWarning
    >
      <section className={cn('text-primary')} suppressHydrationWarning>
        {isLoading ? 'Cargando...' : ''}
      </section>
    </main>
  );
}

'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/orders');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mostrar loading mientras redirecciona
  return (
    <main className={cn('min-h-screen flex items-center justify-center')}>
      <section className={cn('text-primary')}>Cargando...</section>
    </main>
  );
}

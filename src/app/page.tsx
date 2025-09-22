'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-blue-600'>Cargando...</div>
    </div>
  );
}

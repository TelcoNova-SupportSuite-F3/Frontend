'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrdersMetrics from '@/components/OrdersMetrics/OrdersMetrics';
import OrdersTable from '@/components/OrdersTable/OrdersTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { cn } from '@/lib/utils';
import type { OrdenTrabajoResponse } from '@/types/orders';

// Intervalo de actualización en milisegundos (30 segundos)
const REFRESH_INTERVAL = 30000;

interface OrdersSummary {
  total: number;
  enProceso: number;
  finalizadas: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrdenTrabajoResponse[]>([]);
  const [summary, setSummary] = useState<OrdersSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar datos
  const loadOrders = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const response = await fetch('/api/orders', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('No autenticado. Por favor, inicie sesión nuevamente.');
          return;
        }
        throw new Error('Error al cargar órdenes');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setOrders(data.orders || []);
      setSummary(data.summary || null);
      setError(null);
    } catch (err) {
      console.error('Error cargando órdenes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadOrders(true);
  }, []);

  // Configurar actualización automática
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Actualizar en segundo plano sin mostrar loading
      loadOrders(false);
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // Caso: Cargando
  if (isLoading) {
    return (
      <main className={cn('space-y-6')}>
        <header>
          <h1 className={cn('text-3xl font-bold text-primary')}>Mis órdenes</h1>
        </header>
        <div className={cn('text-center py-8 text-gray-500')}>
          Cargando órdenes...
        </div>
      </main>
    );
  }

  // Caso: Error en la carga
  if (error) {
    return <ErrorMessage title='Mis órdenes' message={error} type='error' />;
  }

  // Caso: Sin órdenes o datos incompletos
  if (!orders || !summary) {
    return (
      <ErrorMessage
        title='Mis órdenes'
        message='No se pudieron cargar las órdenes'
        type='info'
      />
    );
  }

  // Caso exitoso: Mostrar dashboard
  return (
    <main className={cn('space-y-6')}>
      <header>
        <h1 className={cn('text-3xl font-bold text-primary')}>Mis órdenes</h1>
      </header>

      <OrdersMetrics summary={summary} />

      <Card>
        <CardContent className={cn('p-0')}>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </main>
  );
}

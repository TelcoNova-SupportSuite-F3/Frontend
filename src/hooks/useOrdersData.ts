import { fetchMyOrders } from '@/services/order.service';
import {
  generateOrderSummary,
  sortOrdersByPriority,
} from '@/services/order.utils';
import { getServerAuthToken } from '@/lib/auth-server';
import type { OrdenTrabajoResponse } from '@/types/orders';

interface OrdersDataResult {
  orders: OrdenTrabajoResponse[] | null;
  summary: {
    total: number;
    enProceso: number;
    finalizadas: number;
    asignadas: number;
  } | null;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Server-side function to load orders data
 * NOT a React hook - use in Server Components only
 */
export async function getOrdersData(): Promise<OrdersDataResult> {
  try {
    // Obtener token del servidor
    const token = await getServerAuthToken();

    console.log('🏗️ useOrdersData - Hook Init:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    if (!token) {
      return {
        orders: null,
        summary: null,
        error: null,
        isAuthenticated: false,
      };
    }

    // Cargar órdenes desde el backend
    const ordersResponse = await fetchMyOrders(token);

    if (!ordersResponse.success || !ordersResponse.data) {
      return {
        orders: null,
        summary: null,
        error: ordersResponse.message || 'Error cargando las órdenes',
        isAuthenticated: true,
      };
    }

    // Procesar datos
    const sortedOrders = sortOrdersByPriority(ordersResponse.data);
    const summary = generateOrderSummary(ordersResponse.data);

    console.log('🏗️ useOrdersData - Órdenes cargadas:', sortedOrders.length);

    return {
      orders: sortedOrders,
      summary,
      error: null,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('🚨 useOrdersData - Error:', error);
    return {
      orders: null,
      summary: null,
      error: 'Error inesperado al cargar las órdenes',
      isAuthenticated: true,
    };
  }
}

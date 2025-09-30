import { fetchOrderById } from '@/services/order.service';
import { getServerAuthToken } from '@/lib/auth-server';
import type { OrdenTrabajoResponse } from '@/types/orders';

interface OrderDetailResult {
  order: OrdenTrabajoResponse | null;
  error: string | null;
  isAuthenticated: boolean;
}

export async function useOrderDetail(
  orderId: number
): Promise<OrderDetailResult> {
  try {
    console.log('🖥️ useOrderDetail - Hook Init:', { orderId });

    // Obtener token del servidor
    const token = await getServerAuthToken();

    console.log('🏗️ useOrderDetail - Auth Check:', {
      orderId,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    if (!token) {
      return {
        order: null,
        error: null,
        isAuthenticated: false,
      };
    }

    // Cargar orden específica desde el backend
    const orderResponse = await fetchOrderById(orderId, token);

    if (!orderResponse.success || !orderResponse.data) {
      return {
        order: null,
        error:
          orderResponse.message || 'Error cargando los detalles de la orden',
        isAuthenticated: true,
      };
    }

    console.log(
      '🏗️ useOrderDetail - Orden cargada:',
      orderResponse.data.numeroOrden
    );

    return {
      order: orderResponse.data,
      error: null,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('🚨 useOrderDetail - Error:', error);
    return {
      order: null,
      error: 'Error inesperado al cargar la orden',
      isAuthenticated: true,
    };
  }
}

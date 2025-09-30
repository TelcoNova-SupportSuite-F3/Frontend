import { API_CONFIG } from '@/lib/config';
import { makeAuthenticatedServerRequest } from './http.service';
import type {
  OrdenTrabajoResponse,
  OrdersApiResponse,
  OrderApiResponse,
  ActualizarEstadoRequest,
  EstadoOrden,
} from '@/types/orders';

/**
 * Order Service
 * Handles order-specific operations (server-side only)
 * Follows Single Responsibility Principle - only order management
 * 
 * Note: All functions require token parameter for server-side use
 * Client components should use server actions instead
 */

/**
 * Fetches all orders assigned to the authenticated technician
 * @param token - JWT token for authentication
 * @returns Promise<OrdersApiResponse> - List of orders for the technician
 */
export async function fetchMyOrders(
  token?: string
): Promise<OrdersApiResponse> {
  try {
    const orders = await makeAuthenticatedServerRequest<OrdenTrabajoResponse[]>(
      API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS,
      token
    );

    return {
      success: true,
      data: orders,
      message: `${orders.length} órdenes encontradas`,
    };
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Fetches a specific order by ID
 * @param orderId - The order ID to fetch
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - The order details
 */
export async function fetchOrderById(
  orderId: number,
  token?: string
): Promise<OrderApiResponse> {
  try {
    const order = await makeAuthenticatedServerRequest<OrdenTrabajoResponse>(
      API_CONFIG.ENDPOINTS.ORDERS.ORDER_BY_ID(orderId),
      token
    );

    return {
      success: true,
      data: order,
      message: 'Orden obtenida exitosamente',
    };
  } catch (error) {
    console.error('❌ Error obteniendo orden:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Fetches orders filtered by status
 * @param estado - The status to filter by
 * @param token - JWT token for authentication
 * @returns Promise<OrdersApiResponse> - Filtered orders
 */
export async function fetchOrdersByStatus(
  estado: EstadoOrden,
  token?: string
): Promise<OrdersApiResponse> {
  try {
    const orders = await makeAuthenticatedServerRequest<OrdenTrabajoResponse[]>(
      `${API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS}?estado=${estado}`,
      token
    );

    return {
      success: true,
      data: orders,
      message: `${orders.length} órdenes con estado ${estado}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Updates the status of an order
 * @param orderId - The order ID to update
 * @param request - The status update request
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - Updated order
 */
export async function updateOrderStatus(
  orderId: number,
  request: ActualizarEstadoRequest,
  token?: string
): Promise<OrderApiResponse> {
  try {
    const updatedOrder =
      await makeAuthenticatedServerRequest<OrdenTrabajoResponse>(
        `${API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS}/${orderId}/estado`,
        token,
        {
          method: 'PUT',
          body: JSON.stringify(request),
        }
      );

    return {
      success: true,
      data: updatedOrder,
      message: 'Estado actualizado exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Finalizes an order
 * @param orderId - The order ID to finalize
 * @param request - The finalization request
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - Finalized order
 */
export async function finalizeOrder(
  orderId: number,
  request: ActualizarEstadoRequest,
  token?: string
): Promise<OrderApiResponse> {
  try {
    const finalizedOrder =
      await makeAuthenticatedServerRequest<OrdenTrabajoResponse>(
        `${API_CONFIG.ENDPOINTS.ORDERS.FINALIZE}/${orderId}/finalizar`,
        token,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

    return {
      success: true,
      data: finalizedOrder,
      message: 'Orden finalizada exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

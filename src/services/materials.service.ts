import { API_CONFIG } from '@/lib/config';
import { makeAuthenticatedServerRequest } from './http.service';
import type {
  MaterialsApiResponse,
  MaterialResponse,
  AgregarMaterialRequest,
  OrderApiResponse,
  OrdenTrabajoResponse,
} from '@/types/orders';

/**
 * Materials Service
 * Handles material-specific operations (server-side only)
 * Follows Single Responsibility Principle - only material management
 * 
 * Note: All functions require token parameter for server-side use
 * Client components should use server actions instead
 */

/**
 * Searches for available materials in the system
 * @param searchTerm - The search term (minimum 3 characters recommended)
 * @param token - Optional JWT token for authentication
 * @returns Promise<MaterialsApiResponse> - List of matching materials with stock info
 */
export async function searchMaterials(
  searchTerm: string,
  token?: string
): Promise<MaterialsApiResponse> {
  try {
    // Backend expects 'q' parameter for search query and 'limite' for result count
    const endpoint = `${
      API_CONFIG.ENDPOINTS.MATERIALS.SEARCH
    }?q=${encodeURIComponent(searchTerm)}&limite=10`;

    const materials = await makeAuthenticatedServerRequest<MaterialResponse[]>(
      endpoint,
      token
    );

    return {
      success: true,
      data: materials,
      message: `${materials.length} materiales encontrados`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Adds a material to an order
 * @param orderId - The order ID
 * @param request - The material addition request (materialId, cantidad)
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - Updated order with the new material
 */
export async function addMaterialToOrder(
  orderId: number,
  request: AgregarMaterialRequest,
  token: string
): Promise<OrderApiResponse> {
  try {
    const updatedOrder =
      await makeAuthenticatedServerRequest<OrdenTrabajoResponse>(
        API_CONFIG.ENDPOINTS.MATERIALS.ADD_TO_ORDER(orderId),
        token,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

    return {
      success: true,
      data: updatedOrder,
      message: 'Material agregado exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

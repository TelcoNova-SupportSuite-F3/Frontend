import { API_CONFIG, HTTP_CONFIG } from '@/lib/config';
import type { OrderApiResponse } from '@/types/orders';

/**
 * Evidence Service
 * Handles evidence (photos and comments) operations for server-side use
 * Follows Single Responsibility Principle - only evidence management
 *
 * Note: All functions are server-side only (require token parameter)
 * Client components should use server actions instead of calling these directly
 */

/**
 * Uploads evidence (photo) for an order (server-side)
 * @param orderId - The order ID
 * @param file - The image file to upload (JPEG, PNG, etc.)
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - Updated order with the new evidence
 */
export async function uploadOrderEvidence(
  orderId: number,
  file: File,
  token: string
): Promise<OrderApiResponse> {
  try {
    const formData = new FormData();
    formData.append('foto', file); // Backend espera 'foto'

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVIDENCE.ADD_PHOTO(
        orderId
      )}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // No agregamos Content-Type, fetch lo hace automáticamente para FormData
        },
        body: formData,
        signal: AbortSignal.timeout(30000), // 30 seconds for file upload
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error subiendo archivo',
      }));

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    let updatedData = null;
    // Only parse JSON if there's actual content
    if (contentLength !== '0' && contentType?.includes('application/json')) {
      updatedData = await response.json();
    }

    return {
      success: true,
      data: updatedData,
      message: 'Evidencia subida exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Adds a comment evidence to an order (server-side)
 * @param orderId - The order ID
 * @param comment - The comment text to add as evidence
 * @param token - JWT token for authentication
 * @returns Promise<OrderApiResponse> - Updated order with the new comment
 */
export async function addOrderComment(
  orderId: number,
  comment: string,
  token: string
): Promise<OrderApiResponse> {
  try {
    // El backend espera el comentario como RequestParam, no como JSON body
    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.EVIDENCE.ADD_COMMENT(
      orderId
    )}?comentario=${encodeURIComponent(comment)}`;

    console.log('📝 addOrderComment - Enviando:', {
      orderId,
      url,
      hasToken: !!token,
      commentLength: comment.length,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(HTTP_CONFIG.TIMEOUT),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('❌ Error data from backend:', errorData);
      } catch {
        errorData = {
          message: `Error ${response.status}: ${response.statusText}`,
        };
      }

      const errorMessage = errorData.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const evidencia = await response.json();
    console.log('✅ addOrderComment - Respuesta exitosa');

    return {
      success: true,
      data: evidencia,
      message: 'Comentario agregado exitosamente',
    };
  } catch (error) {
    console.error('❌ addOrderComment - Error:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

import { API_CONFIG, HTTP_CONFIG } from '@/lib/config';
import {
  getAuthHeaders,
  getAuthHeadersWithToken,
  redirectToLogin,
} from './auth.service';

/**
 * HTTP Service
 * Base HTTP client for authenticated API requests
 * Follows Single Responsibility Principle - only HTTP communication
 */

/**
 * Makes authenticated HTTP requests to the backend (client-side with cookies)
 * Automatically includes cookies and handles 401 redirects to login
 * @param endpoint - API endpoint path (e.g., '/ordenes/mis-ordenes')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise<T> - Parsed JSON response
 * @throws Error if request fails or returns non-OK status
 */
export async function makeAuthenticatedClientRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include', // Important: send cookies with request
    signal: AbortSignal.timeout(HTTP_CONFIG.TIMEOUT),
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - redirect to login
        redirectToLogin();
        throw new Error('Sesión expirada. Redirigiendo al login...');
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: 'Error de comunicación con el servidor',
          status: response.status,
          timestamp: new Date().toISOString(),
          path: endpoint,
        };
      }

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado. Intente nuevamente.');
      }
      throw error;
    }
    throw new Error('Error inesperado en la comunicación');
  }
}

/**
 * Makes authenticated HTTP requests to the backend (server-side with token)
 * Used in server components where cookies are not available
 * @param endpoint - API endpoint path
 * @param token - Optional JWT token for authentication
 * @param options - Fetch options
 * @returns Promise<T> - Parsed JSON response
 * @throws Error if request fails or returns non-OK status
 */
export async function makeAuthenticatedServerRequest<T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  console.log('🌐 makeAuthenticatedServerRequest:', {
    url,
    endpoint,
    method: options.method || 'GET',
    hasToken: !!token,
    tokenLength: token?.length,
  });

  const defaultOptions: RequestInit = {
    headers: {
      ...getAuthHeadersWithToken(token),
      ...options.headers,
    },
    signal: AbortSignal.timeout(HTTP_CONFIG.TIMEOUT),
  };

  console.log('📤 Request headers:', defaultOptions.headers);
  console.log('📤 Request body:', options.body);

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('❌ Error data from backend:', errorData);
      } catch (jsonError) {
        console.error('❌ Failed to parse error JSON:', jsonError);
        errorData = {
          message: `Error ${response.status}: ${response.statusText}`,
          status: response.status,
          timestamp: new Date().toISOString(),
          path: endpoint,
        };
      }

      const errorMessage =
        errorData.message || `HTTP ${response.status} - ${response.statusText}`;
      console.error('❌ Throwing error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    // If no content or empty response, return empty object
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      console.log('✅ Response successful (no content)');
      return {} as T;
    }

    const data = await response.json();
    console.log('✅ Response data received successfully');
    return data;
  } catch (error) {
    console.error('💥 makeAuthenticatedServerRequest caught error:', error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado. Intente nuevamente.');
      }
      throw error;
    }
    throw new Error('Error inesperado en la comunicación');
  }
}

/**
 * Tests basic connectivity to the backend (server-side)
 * @returns Promise<boolean> - True if backend is reachable
 */
export async function testBackendConnectivity(): Promise<boolean> {
  try {
    const url = `${API_CONFIG.BASE_URL}/actuator/health`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

import { API_CONFIG, HTTP_CONFIG } from '@/lib/config';
import type {
  LoginRequest,
  LoginResponse,
  LoginResult,
  User,
  ApiError,
} from '@/types/auth';

/**
 * Authentication service functions for backend communication
 */

/**
 * Makes HTTP requests to the backend with proper error handling
 * Returns the response data or throws only for unexpected errors
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      ...HTTP_CONFIG.HEADERS,
      ...options.headers,
    },
    signal: AbortSignal.timeout(HTTP_CONFIG.TIMEOUT),
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    // For non-OK responses, parse the error but don't throw
    // Let the caller handle business logic errors (401, 404, etc.)
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Error de comunicación con el servidor',
        status: response.status,
        timestamp: new Date().toISOString(),
        path: endpoint,
      }));

      // Create an error object but attach response data
      const error = new Error(
        errorData.message || `HTTP ${response.status}`
      ) as Error & { status: number; data: ApiError };
      error.status = response.status;
      error.data = errorData;
      throw error;
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
 * Authenticates a user with email and password
 * @param email - User email (must be @telconova.com domain)
 * @param password - User password
 * @returns Promise<LoginResult> - Authentication result with user data and token
 */
export async function fetchAuthUser(
  email: string,
  password: string
): Promise<LoginResult> {
  console.log('🔐 Iniciando autenticación con backend:', { email });

  // 1. Frontend domain validation
  if (!email.endsWith('@telconova.com')) {
    console.log('❌ Dominio inválido:', email);
    return {
      success: false,
      errorType: 'invalid_domain',
      message: 'El dominio no pertenece a la organización',
    };
  }

  try {
    // 2. Prepare login request
    const loginRequest: LoginRequest = {
      email: email.trim().toLowerCase(),
      contrasena: password, // Backend expects 'contrasena'
    };

    // 3. Make API call
    const response = await makeRequest<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(loginRequest),
      }
    );

    console.log('✅ Respuesta del backend recibida:', {
      email: response.email,
      rol: response.rol,
      activo: response.activo,
    });

    // 4. Validate role (only TECNICO allowed in mobile app)
    if (response.rol !== 'TECNICO') {
      console.log('❌ Rol inválido:', response.rol);
      return {
        success: false,
        errorType: 'invalid_role',
        message: 'El usuario no tiene permisos de técnico',
      };
    }

    // 5. Check if user is active
    if (!response.activo) {
      console.log('❌ Usuario inactivo:', response.email);
      return {
        success: false,
        errorType: 'invalid_credentials',
        message: 'El usuario no está activo',
      };
    }

    // 6. Transform backend response to frontend User format
    const user: User = {
      id: response.email, // Using email as ID since backend doesn't provide separate ID
      name: response.nombreCompleto,
      role: response.rol,
      email: response.email,
    };

    console.log('✅ Autenticación exitosa:', user);

    return {
      success: true,
      message: 'Login exitoso',
      user,
      token: response.token,
    };
  } catch (error) {
    console.error('💥 Error en autenticación:', error);

    // Type assertion for error with status
    const apiError = error as Error & { status?: number; data?: ApiError };
    const errorMessage = apiError.message || 'Error desconocido';
    const statusCode = apiError.status;

    // Map backend error messages to frontend error types
    // Backend sends HTTP 401 with specific messages

    // Check if it's a 401 (Unauthorized) - expected business error
    if (statusCode === 401) {
      // 1. Check for invalid credentials (wrong password or user not found)
      if (
        errorMessage.includes('credenciales') ||
        errorMessage.includes('Credenciales') ||
        errorMessage.includes('inválidas')
      ) {
        return {
          success: false,
          errorType: 'invalid_credentials',
          message: 'Credenciales inválidas',
        };
      }

      // 2. Check for inactive user
      if (
        errorMessage.includes('inactivo') ||
        errorMessage.includes('está inactivo')
      ) {
        return {
          success: false,
          errorType: 'invalid_credentials',
          message: 'Usuario inactivo',
        };
      }

      // 3. Check for domain validation (user doesn't belong to @telconova.com)
      // This is caught by backend's puedeAccederSistema() validation
      if (
        errorMessage.includes('dominio') ||
        errorMessage.includes('telconova.com')
      ) {
        return {
          success: false,
          errorType: 'invalid_domain',
          message: 'El dominio no pertenece a la organización',
        };
      }

      // Default 401 response
      return {
        success: false,
        errorType: 'invalid_credentials',
        message: 'Credenciales inválidas',
      };
    }

    // Network or timeout errors
    if (
      errorMessage.includes('Tiempo de espera') ||
      errorMessage.includes('timeout')
    ) {
      return {
        success: false,
        errorType: 'server_error',
        message: 'Tiempo de espera agotado. Verifica tu conexión.',
      };
    }

    // Generic server error
    return {
      success: false,
      errorType: 'server_error',
      message: errorMessage,
    };
  }
}

/**
 * Validates a JWT token with the backend
 * @param token - JWT token to validate
 * @returns Promise<boolean> - True if token is valid
 */
export async function validateAuthToken(token: string): Promise<boolean> {
  try {
    console.log('🔍 Validando token con backend');

    const isValid = await makeRequest<boolean>(
      API_CONFIG.ENDPOINTS.AUTH.VALIDATE,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Token validado:', { isValid });
    return isValid;
  } catch (error) {
    console.error('❌ Error validando token:', error);
    return false;
  }
}

/**
 * Extracts user information from a JWT token (client-side parsing)
 * Note: This is for convenience only. Always validate with backend.
 * @param token - JWT token
 * @returns User info or null if invalid
 */
export function parseTokenPayload(token: string): Partial<User> | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    return {
      email: payload.sub || payload.email,
      role: payload.role || payload.authorities?.[0],
      name: payload.name || payload.nombreCompleto,
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired (client-side check)
 * @param token - JWT token
 * @returns boolean - True if expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    if (!payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

/**
 * Gets the token expiration date
 * @param token - JWT token
 * @returns Date or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    if (!payload.exp) return null;

    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

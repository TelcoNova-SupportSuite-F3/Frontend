import { HTTP_CONFIG } from '@/lib/config';

/**
 * Authentication Service
 * Handles token management and authentication headers
 * Follows Single Responsibility Principle - only authentication concerns
 */

/**
 * Gets the authentication token from cookies (client-side only)
 * Parses document.cookie to extract the 'auth-token' value
 * @returns string | null - The token if found, null otherwise
 */
export function getTokenFromCookies(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth-token=')
  );

  if (!authCookie) {
    return null;
  }

  return authCookie.split('=')[1];
}

/**
 * Gets the authorization headers with the current user's token from cookies
 * Automatically adds Bearer token to Authorization header if available
 * @returns HeadersInit - Headers object with Content-Type and optional Authorization
 */
export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return HTTP_CONFIG.HEADERS;
  }

  const token = getTokenFromCookies();
  return {
    ...HTTP_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Gets the authorization headers with a provided token (for server-side use)
 * Used when token is passed as parameter instead of reading from cookies
 * @param token - Optional JWT token
 * @returns HeadersInit - Headers object with Content-Type and optional Authorization
 */
export function getAuthHeadersWithToken(token?: string): HeadersInit {
  return {
    ...HTTP_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Clears authentication data from cookies and localStorage
 * Used for logout and session expiration
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Clear cookies
  document.cookie =
    'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
  document.cookie =
    'auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';

  // Also clear localStorage as fallback
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-user');
}

/**
 * Redirects to login page and clears authentication data
 */
export function redirectToLogin(): void {
  if (typeof window === 'undefined') {
    return;
  }

  clearAuthData();
  window.location.href = '/login';
}

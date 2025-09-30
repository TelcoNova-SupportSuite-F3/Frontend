import { cookies } from 'next/headers';

/**
 * Server-side authentication utilities
 */

/**
 * Gets the authentication token from cookies (server-side)
 * @returns string | undefined - The JWT token if available
 */
export async function getServerAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    console.log('🍪 Server Auth Token Check:', {
      hasToken: !!token?.value,
      tokenLength: token?.value?.length || 0,
      tokenPrefix: token?.value
        ? token.value.substring(0, 20) + '...'
        : 'No token',
    });

    return token?.value;
  } catch (error) {
    console.error('❌ Error getting server auth token:', error);
    return undefined;
  }
}

/**
 * Checks if user is authenticated on server-side
 * @returns Promise<boolean> - True if authenticated
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerAuthToken();
  return !!token;
}

/**
 * Gets user data from localStorage (server-side safe)
 * Note: This returns null on server-side since localStorage is not available
 * @returns User data or null
 */
export function getServerUserData() {
  // Server-side: return null, user data should come from token validation or API call
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userData = localStorage.getItem('auth-user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

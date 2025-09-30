'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  fetchAuthUser,
  validateAuthToken,
  isTokenExpired,
  parseTokenPayload,
} from '@/services/Login.services';
import type { User, LoginErrorType, LoginResult } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

/**
 * Gets token from cookies
 */
function getTokenFromCookies(): string | null {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${TOKEN_KEY}=`)
  );
  return authCookie ? authCookie.split('=')[1] : null;
}

/**
 * Gets user data from cookies
 */
function getUserFromCookies(): User | null {
  const cookies = document.cookie.split(';');
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${USER_KEY}=`)
  );

  if (!userCookie) {
    return null;
  }

  try {
    const userData = decodeURIComponent(userCookie.split('=')[1]);
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
}

/**
 * Sets a cookie with the given name and value
 */
function setCookie(name: string, value: string, days: number = 1) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Clears all auth cookies and localStorage
 */
function clearAuthData() {
  // Clear cookies
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  document.cookie = `${USER_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;

  // Also clear localStorage as fallback for compatibility
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from cookies (primary) or localStorage (fallback)
        const token = getTokenFromCookies() || localStorage.getItem(TOKEN_KEY);
        const storedUser =
          getUserFromCookies() ||
          (localStorage.getItem(USER_KEY)
            ? JSON.parse(localStorage.getItem(USER_KEY)!)
            : null);

        if (!token || !storedUser) {
          console.log('❌ No hay token o usuario almacenado');
          setUser(null);
          return;
        }

        // Check if token is expired (client-side check)
        if (isTokenExpired(token)) {
          console.log('⏰ Token expirado');
          clearAuthData();
          setUser(null);
          return;
        }

        // Validate token with backend
        const isValid = await validateAuthToken(token);

        if (isValid) {
          console.log('✅ Token válido, restaurando sesión');
          setUser(storedUser);
        } else {
          console.log('❌ Token inválido según el backend');
          clearAuthData();
          setUser(null);
        }
      } catch (error) {
        console.error('💥 Error verificando autenticación:', error);
        clearAuthData();
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    console.log('🔐 Iniciando login con backend:', { email });

    try {
      // Use the backend service for authentication
      const result = await fetchAuthUser(email, password);

      if (result.success && result.user && result.token) {
        // Store in cookies (primary)
        setCookie(TOKEN_KEY, result.token, 1); // 1 day
        setCookie(USER_KEY, encodeURIComponent(JSON.stringify(result.user)), 1);

        // Also store in localStorage for backward compatibility
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));

        // Update state
        setUser(result.user);

        console.log('✅ Login exitoso con backend:', result.user);
      }

      return result;
    } catch (error) {
      console.error('💥 Error en login:', error);
      return {
        success: false,
        errorType: 'server_error',
        message: 'Error interno del servidor',
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logout iniciado');

    // Limpiar estado del usuario
    setUser(null);

    // Limpiar todas las credenciales
    clearAuthData();

    console.log('🧹 Estado, localStorage y cookies limpiados');

    // Pequeño delay para asegurar que se procese el cambio de estado
    setTimeout(() => {
      console.log('🔄 Redirigiendo a login...');
      window.location.href = '/login';
    }, 100);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

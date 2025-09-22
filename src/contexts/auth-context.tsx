'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export type LoginErrorType =
  | 'invalid_domain'
  | 'invalid_role'
  | 'invalid_credentials';

interface LoginResult {
  success: boolean;
  errorType?: LoginErrorType;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulación de delay para API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock de usuarios para testing
const mockUsers = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@telco-nova.com',
    password: '123456',
    role: 'Técnico',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@telco-nova.com',
    password: 'password',
    role: 'Supervisor',
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos.lopez@telco-nova.com',
    password: 'admin123',
    role: 'Técnico',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const authToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='));

      if (authToken) {
        console.log('🔍 Token encontrado, usuario autenticado');
        // En una app real, aquí verificarías el token con el servidor
        // Por ahora, simulamos que el usuario está logueado
        const mockUser = mockUsers[0]; // Juan Pérez como usuario por defecto
        setUser(mockUser);
      } else {
        console.log('❌ No hay token, usuario no autenticado');
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    console.log('🔐 Iniciando login:', { email });

    // 1. Validación de dominio en frontend
    if (!email.endsWith('@telco-nova.com')) {
      console.log('❌ Dominio inválido:', email);
      return {
        success: false,
        errorType: 'invalid_domain',
        message: 'El dominio no pertenece a la organización',
      };
    }

    // Simular delay de API
    await delay(1500);

    try {
      // 2. Buscar usuario en mock (simula consulta a API)
      const foundUser = mockUsers.find((u) => u.email === email);

      if (!foundUser) {
        console.log('❌ Usuario no encontrado:', email);
        return {
          success: false,
          errorType: 'invalid_credentials',
          message: 'Credenciales incorrectas',
        };
      }

      // 3. Verificar rol de técnico
      if (foundUser.role !== 'Técnico') {
        console.log('❌ Rol inválido:', foundUser.role);
        return {
          success: false,
          errorType: 'invalid_role',
          message: 'El usuario no tiene permisos de técnico',
        };
      }

      // 4. Verificar contraseña
      if (foundUser.password !== password) {
        console.log('❌ Contraseña incorrecta');
        return {
          success: false,
          errorType: 'invalid_credentials',
          message: 'Contraseña incorrecta',
        };
      }

      // 5. Login exitoso
      const authenticatedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email,
      };

      setUser(authenticatedUser);

      // Establecer cookie para el middleware
      document.cookie = 'auth-token=valid; path=/; max-age=86400'; // 24 horas

      console.log('✅ Login exitoso:', authenticatedUser);

      return {
        success: true,
        message: 'Login exitoso',
      };
    } catch (error) {
      console.error('💥 Error en login:', error);
      return {
        success: false,
        errorType: 'invalid_credentials',
        message: 'Error interno del servidor',
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logout iniciado');

    // Limpiar estado del usuario
    setUser(null);

    // Eliminar cookie de autenticación de múltiples formas para asegurar
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' +
      window.location.hostname +
      '; SameSite=Lax';

    console.log('🧹 Estado y cookies limpiados');

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

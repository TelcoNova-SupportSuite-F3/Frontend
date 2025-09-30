// TypeScript types based on backend DTOs

export interface LoginRequest {
  email: string;
  contrasena: string; // Backend expects 'contrasena', not 'password'
}

export interface LoginResponse {
  token: string;
  tipoToken: string;
  email: string;
  nombreCompleto: string;
  rol: string;
  expiracion: string; // ISO date string
  activo: boolean;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export type LoginErrorType =
  | 'invalid_domain'
  | 'invalid_role'
  | 'invalid_credentials'
  | 'server_error';

export interface LoginResult {
  success: boolean;
  errorType?: LoginErrorType;
  message?: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}

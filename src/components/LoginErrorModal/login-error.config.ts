import { Mail, UserX, Lock, type LucideIcon } from 'lucide-react';

/**
 * Login error types
 */
export const LOGIN_ERROR_TYPES = {
  INVALID_DOMAIN: 'invalid_domain',
  INVALID_ROLE: 'invalid_role',
  INVALID_CREDENTIALS: 'invalid_credentials',
} as const;

export type LoginErrorType =
  (typeof LOGIN_ERROR_TYPES)[keyof typeof LOGIN_ERROR_TYPES];

/**
 * Configuration for a login error
 */
export interface LoginErrorConfig {
  /** Icon component to display */
  icon: LucideIcon;
  /** Title of the error */
  title: string;
  /** Description of the error */
  description: string;
  /** Icon color class */
  iconColor: string;
  /** Background color class */
  bgColor: string;
}

/**
 * Login error configurations
 * Maps error types to their display configuration
 */
export const LOGIN_ERROR_CONFIGS: Record<LoginErrorType, LoginErrorConfig> = {
  [LOGIN_ERROR_TYPES.INVALID_DOMAIN]: {
    icon: Mail,
    title: 'Acceso inválido',
    description: 'El dominio de tu correo no pertenece a nuestra organización.',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  [LOGIN_ERROR_TYPES.INVALID_ROLE]: {
    icon: UserX,
    title: 'Usuario no es técnico',
    description:
      'Tu rol no pertenece a técnico. Solo los técnicos pueden acceder a esta aplicación.',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  [LOGIN_ERROR_TYPES.INVALID_CREDENTIALS]: {
    icon: Lock,
    title: 'Credenciales inválidas',
    description:
      'El correo electrónico o la contraseña que ingresaste son incorrectos.',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
} as const;

/**
 * Style constants for LoginErrorModal
 */
export const LOGIN_ERROR_MODAL_STYLES = {
  ICON_CONTAINER_BASE:
    'mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4',
  ICON: 'h-6 w-6',
  TITLE: 'text-center text-lg font-semibold text-gray-900',
  DESCRIPTION: 'text-sm text-gray-700 text-center px-4',
  INFO_BOX: 'mt-4 p-3 bg-gray-50 rounded-lg',
  INFO_TEXT: 'text-xs text-gray-600',
  INFO_TEXT_MARGIN: 'text-xs text-gray-600 mt-1',
  BUTTON: 'w-full bg-blue-600 hover:bg-blue-700 text-white',
  FOOTER: 'mt-6',
  CONTENT: 'mt-4',
} as const;

/**
 * Text constants for LoginErrorModal
 */
export const LOGIN_ERROR_MODAL_TEXTS = {
  BUTTON_ACCEPT: 'Aceptar',
  EMAIL_ENTERED: 'Email ingresado:',
  REQUIRED_DOMAIN: 'Dominio requerido:',
  REQUIRED_DOMAIN_VALUE: '@telconova.com',
} as const;

/**
 * Gets the error configuration for a given error type
 *
 * @param errorType - The type of login error
 * @returns The corresponding error configuration
 */
export function getLoginErrorConfig(
  errorType: LoginErrorType
): LoginErrorConfig {
  return LOGIN_ERROR_CONFIGS[errorType];
}

'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { LogOut, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LOGOUT_BUTTON_TEXTS,
  LOGOUT_BUTTON_STYLES,
} from './logout-button.constants';

/**
 * Props para el componente LogoutButton
 */
interface LogoutButtonProps {
  /** Clases CSS adicionales */
  className?: string;
  /** Texto del botón */
  buttonText?: string;
  /** Etiqueta ARIA personalizada */
  ariaLabel?: string;
  /** Icono a mostrar en el botón */
  icon?: LucideIcon;
  /** Si mostrar el icono */
  showIcon?: boolean;
  /** Variante del botón */
  variant?:
    | 'outline'
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Callback adicional al hacer logout (ejecutado después del logout del contexto) */
  onLogoutComplete?: () => void;
}

/**
 * LogoutButton Component
 *
 * Botón para cerrar sesión del usuario.
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja el botón de logout
 * - Open/Closed: Configurable a través de props
 * - Dependency Inversion: Depende del contexto de autenticación
 *
 * @example
 * ```tsx
 * // Uso básico
 * <LogoutButton />
 *
 * // Con personalización
 * <LogoutButton
 *   buttonText="Salir"
 *   showIcon={true}
 *   variant="destructive"
 *   onLogoutComplete={() => console.log('Sesión cerrada')}
 * />
 * ```
 */
export default function LogoutButton({
  className,
  buttonText = LOGOUT_BUTTON_TEXTS.BUTTON_TEXT,
  ariaLabel = LOGOUT_BUTTON_TEXTS.ARIA_LABEL,
  icon: Icon = LogOut,
  showIcon = false,
  variant = 'outline',
  onLogoutComplete,
}: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogoutComplete?.();
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={cn(LOGOUT_BUTTON_STYLES.BASE, className)}
      aria-label={ariaLabel}
    >
      {showIcon && Icon && <Icon className='mr-2 h-4 w-4' aria-hidden='true' />}
      {buttonText}
    </Button>
  );
}

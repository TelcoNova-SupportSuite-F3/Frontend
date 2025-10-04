import { CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LOGIN_HEADER_CONFIG,
  LOGIN_HEADER_STYLES,
} from './login-header.constants';

/**
 * Props para el componente LoginHeader
 */
interface LoginHeaderProps {
  /** Ruta de la imagen del logo */
  logoSrc?: string;
  /** Texto alternativo del logo */
  logoAlt?: string;
  /** Ancho del logo en píxeles */
  logoWidth?: number;
  /** Alto del logo en píxeles */
  logoHeight?: number;
  /** Si el logo debe cargarse con prioridad */
  logoPriority?: boolean;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Clases CSS adicionales para el header interno */
  headerClassName?: string;
}

/**
 * LoginHeader Component
 *
 * Header del formulario de login que muestra el logo de la aplicación.
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo muestra el header con logo
 * - Open/Closed: Configurable a través de props
 *
 * @example
 * ```tsx
 * // Uso básico
 * <LoginHeader />
 *
 * // Con personalización
 * <LoginHeader
 *   logoSrc="/custom-logo.png"
 *   logoWidth={150}
 *   logoHeight={150}
 * />
 * ```
 */
export default function LoginHeader({
  logoSrc = LOGIN_HEADER_CONFIG.LOGO_PATH,
  logoAlt = LOGIN_HEADER_CONFIG.LOGO_ALT,
  logoWidth = LOGIN_HEADER_CONFIG.LOGO_WIDTH,
  logoHeight = LOGIN_HEADER_CONFIG.LOGO_HEIGHT,
  logoPriority = true,
  className,
  headerClassName,
}: LoginHeaderProps) {
  return (
    <CardHeader className={cn(LOGIN_HEADER_STYLES.CONTAINER, className)}>
      <header className={cn(LOGIN_HEADER_STYLES.HEADER, headerClassName)}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          priority={logoPriority}
        />
      </header>
    </CardHeader>
  );
}

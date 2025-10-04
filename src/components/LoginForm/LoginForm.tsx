'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, type LucideIcon } from 'lucide-react';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import LoginErrorModal from '@/components/LoginErrorModal/LoginErrorModal';
import { cn } from '@/lib/utils';
import { LOGIN_FORM_TEXTS, LOGIN_FORM_STYLES } from './login-form.constants';

/**
 * Props para el componente LoginForm
 */
interface LoginFormProps {
  /** Texto personalizado para el label del campo de usuario */
  usernameLabel?: string;
  /** Texto personalizado para el label del campo de contraseña */
  passwordLabel?: string;
  /** Placeholder personalizado para el campo de usuario */
  usernamePlaceholder?: string;
  /** Placeholder personalizado para el campo de contraseña */
  passwordPlaceholder?: string;
  /** Texto del botón de envío */
  submitButtonText?: string;
  /** Texto del botón cuando está cargando */
  submitButtonLoadingText?: string;
  /** Icono personalizado para el campo de usuario */
  usernameIcon?: LucideIcon;
  /** Icono personalizado para el campo de contraseña */
  passwordIcon?: LucideIcon;
  /** Mensaje al redirigir */
  redirectingText?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * LoginForm Component
 *
 * Formulario de inicio de sesión con validación y manejo de errores.
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja la UI del formulario
 * - Open/Closed: Configurable a través de props
 * - Dependency Inversion: Depende del hook useLoginLogic
 *
 * @example
 * ```tsx
 * // Uso básico
 * <LoginForm />
 *
 * // Con personalización
 * <LoginForm
 *   usernameLabel="Email"
 *   submitButtonText="Iniciar Sesión"
 *   usernameIcon={User}
 * />
 * ```
 */
export default function LoginForm({
  usernameLabel = LOGIN_FORM_TEXTS.USERNAME_LABEL,
  passwordLabel = LOGIN_FORM_TEXTS.PASSWORD_LABEL,
  usernamePlaceholder = LOGIN_FORM_TEXTS.USERNAME_PLACEHOLDER,
  passwordPlaceholder = LOGIN_FORM_TEXTS.PASSWORD_PLACEHOLDER,
  submitButtonText = LOGIN_FORM_TEXTS.SUBMIT_BUTTON,
  submitButtonLoadingText = LOGIN_FORM_TEXTS.SUBMIT_BUTTON_LOADING,
  usernameIcon: UsernameIcon = Mail,
  passwordIcon: PasswordIcon = Lock,
  redirectingText = LOGIN_FORM_TEXTS.REDIRECTING,
  className,
}: LoginFormProps) {
  const {
    username,
    password,
    isLoading,
    showErrorModal,
    errorType,
    setUsername,
    setPassword,
    handleSubmit,
    handleCloseModal,
    isAuthenticated,
  } = useLoginLogic();

  // Estado de carga mientras redirige
  if (isAuthenticated) {
    return (
      <CardContent
        className={cn(LOGIN_FORM_STYLES.CARD_CONTENT_LOADING, className)}
      >
        <div className={cn(LOGIN_FORM_STYLES.REDIRECTING_TEXT)}>
          {redirectingText}
        </div>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent className={cn(LOGIN_FORM_STYLES.CARD_CONTENT, className)}>
        <form
          onSubmit={handleSubmit}
          className={cn(LOGIN_FORM_STYLES.FORM)}
          role='form'
          aria-label={LOGIN_FORM_TEXTS.ARIA_FORM_LABEL}
        >
          {/* Campo de Usuario */}
          <div className={cn(LOGIN_FORM_STYLES.FIELD_CONTAINER)}>
            <Label htmlFor='username' className={cn(LOGIN_FORM_STYLES.LABEL)}>
              {usernameLabel}
            </Label>
            <div className={cn(LOGIN_FORM_STYLES.INPUT_WRAPPER)}>
              <UsernameIcon
                className={cn(LOGIN_FORM_STYLES.INPUT_ICON)}
                role='img'
                aria-label={LOGIN_FORM_TEXTS.ARIA_USERNAME_ICON}
              />
              <Input
                id='username'
                type='text'
                placeholder={usernamePlaceholder}
                className={cn(LOGIN_FORM_STYLES.INPUT)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                aria-describedby='username-help'
                aria-invalid={!username && showErrorModal ? 'true' : 'false'}
              />
            </div>
            <div id='username-help' className={LOGIN_FORM_STYLES.SR_ONLY}>
              {LOGIN_FORM_TEXTS.ARIA_USERNAME_HELP}
            </div>
          </div>

          {/* Campo de Contraseña */}
          <div className={cn(LOGIN_FORM_STYLES.FIELD_CONTAINER)}>
            <Label htmlFor='password' className={cn(LOGIN_FORM_STYLES.LABEL)}>
              {passwordLabel}
            </Label>
            <div className={cn(LOGIN_FORM_STYLES.INPUT_WRAPPER)}>
              <PasswordIcon
                className={cn(LOGIN_FORM_STYLES.INPUT_ICON)}
                role='img'
                aria-label={LOGIN_FORM_TEXTS.ARIA_PASSWORD_ICON}
              />
              <Input
                id='password'
                type='password'
                placeholder={passwordPlaceholder}
                className={cn(LOGIN_FORM_STYLES.INPUT)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-describedby='password-help'
                aria-invalid={!password && showErrorModal ? 'true' : 'false'}
              />
            </div>
            <div id='password-help' className={LOGIN_FORM_STYLES.SR_ONLY}>
              {LOGIN_FORM_TEXTS.ARIA_PASSWORD_HELP}
            </div>
          </div>

          {/* Botón de Envío */}
          <div className={cn(LOGIN_FORM_STYLES.BUTTON_CONTAINER)}>
            <Button
              type='submit'
              disabled={isLoading}
              className={cn(LOGIN_FORM_STYLES.BUTTON)}
              aria-describedby='login-status'
            >
              {isLoading ? submitButtonLoadingText : submitButtonText}
            </Button>
            <div
              id='login-status'
              className={LOGIN_FORM_STYLES.SR_ONLY}
              aria-live='polite'
            >
              {isLoading ? LOGIN_FORM_TEXTS.ARIA_LOGIN_STATUS_LOADING : ''}
            </div>
          </div>
        </form>
      </CardContent>

      <LoginErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseModal}
        errorType={errorType}
        email={username}
      />
    </>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import LoginErrorModal from '@/components/LoginErrorModal/LoginErrorModal';
import { cn } from '@/lib/utils';

export default function LoginForm() {
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

  // Loading state mientras redirige
  if (isAuthenticated) {
    return (
      <CardContent className={cn('text-center py-8')}>
        <div className={cn('text-primary')}>Redirigiendo...</div>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent className={cn('space-y-6 px-8 pb-8')}>
        <form
          onSubmit={handleSubmit}
          className={cn('space-y-6')}
          role='form'
          aria-label='Formulario de inicio de sesión'
        >
          <div className={cn('space-y-2')}>
            <Label
              htmlFor='username'
              className={cn('text-lg font-semibold text-gray-800')}
            >
              Usuario
            </Label>
            <div className={cn('relative')}>
              <Mail
                className={cn(
                  'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5'
                )}
                role='img'
                aria-label='Ícono de usuario'
              />
              <Input
                id='username'
                type='text'
                placeholder='Ingresa tu usuario'
                className={cn(
                  'pl-12 h-12 border-gray-300 rounded-lg text-base'
                )}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                aria-describedby='username-help'
                aria-invalid={!username && showErrorModal ? 'true' : 'false'}
              />
            </div>
            <div id='username-help' className='sr-only'>
              Ingresa tu nombre de usuario
            </div>
          </div>

          <div className={cn('space-y-2')}>
            <Label
              htmlFor='password'
              className={cn('text-lg font-semibold text-gray-800')}
            >
              Contraseña
            </Label>
            <div className={cn('relative')}>
              <Lock
                className={cn(
                  'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5'
                )}
                role='img'
                aria-label='Ícono de contraseña'
              />
              <Input
                id='password'
                type='password'
                placeholder='Ingresa tu contraseña'
                className={cn(
                  'pl-12 h-12 border-gray-300 rounded-lg text-base'
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-describedby='password-help'
                aria-invalid={!password && showErrorModal ? 'true' : 'false'}
              />
            </div>
            <div id='password-help' className='sr-only'>
              Ingresa tu contraseña de acceso al sistema
            </div>
          </div>

          <div className={cn('pt-4')}>
            <Button
              type='submit'
              disabled={isLoading}
              className={cn(
                'w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base rounded-lg disabled:opacity-50'
              )}
              aria-describedby='login-status'
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>
            <div id='login-status' className='sr-only' aria-live='polite'>
              {isLoading ? 'Verificando credenciales, por favor espera' : ''}
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

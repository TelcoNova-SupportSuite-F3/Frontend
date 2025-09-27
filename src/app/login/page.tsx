'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import LoginErrorModal, {
  LoginErrorType,
} from '@/components/LoginErrorModal/LoginErrorModal';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<LoginErrorType | null>(null);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/orders');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorType('invalid_credentials');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (!result.success && result.errorType) {
        console.log('❌ Login fallido:', result);
        setErrorType(result.errorType);
        setShowErrorModal(true);
      }
      // Si es exitoso, el useEffect redirige automáticamente
    } catch (error) {
      console.error('💥 Error inesperado en login:', error);
      setErrorType('invalid_credentials');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setErrorType(null);
  };

  // No mostrar el formulario si ya está autenticado
  if (isAuthenticated) {
    return (
      <main className={cn('min-h-screen flex items-center justify-center')}>
        <section className={cn('text-primary')}>Redirigiendo...</section>
      </main>
    );
  }

  return (
    <main
      className={cn(
        'min-h-screen bg-gray-100 flex items-center justify-center p-4'
      )}
    >
      <Card className={cn('w-full max-w-md bg-white shadow-lg')}>
        <CardHeader className={cn('text-center pb-8 pt-8')}>
          <header className={cn('flex justify-center mb-6')}>
            <Image
              src='/logo.svg'
              alt='TelcoNova Logo'
              width={200}
              height={200}
              priority
            />
          </header>
        </CardHeader>

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
      </Card>
    </main>
  );
}

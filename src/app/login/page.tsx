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

export default function LoginPage() {
  const [email, setEmail] = useState('');
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

    if (!email || !password) {
      setErrorType('invalid_credentials');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    console.log('🚀 Intentando login con:', email);

    try {
      const result = await login(email, password);

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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-blue-600'>Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md bg-white shadow-lg'>
        <CardHeader className='text-center pb-8 pt-8'>
          <div className='flex justify-center mb-6'>
            <Image
              src='/logo.svg'
              alt='TelcoNova Logo'
              width={200}
              height={200}
              priority
            />
          </div>
        </CardHeader>

        <CardContent className='space-y-6 px-8 pb-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-lg font-semibold text-gray-800'
              >
                Correo electrónico
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5' />
                <Input
                  id='email'
                  type='email'
                  placeholder='nombre@telco-nova.com'
                  className='pl-12 h-12 border-gray-300 rounded-lg text-base'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-lg font-semibold text-gray-800'
              >
                Contraseña
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Ingresa tu contraseña'
                  className='pl-12 h-12 border-gray-300 rounded-lg text-base'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className='pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg disabled:opacity-50'
              >
                {isLoading ? 'Verificando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </CardContent>

        <LoginErrorModal
          isOpen={showErrorModal}
          onClose={handleCloseModal}
          errorType={errorType}
          email={email}
        />
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import type { LoginErrorType } from '@/components/LoginErrorModal/LoginErrorModal';

interface LoginState {
  username: string;
  password: string;
  isLoading: boolean;
  showErrorModal: boolean;
  errorType: LoginErrorType | null;
}

interface LoginLogicReturn extends LoginState {
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCloseModal: () => void;
  isAuthenticated: boolean;
}

export function useLoginLogic(): LoginLogicReturn {
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
        setErrorType(result.errorType as LoginErrorType);
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

  return {
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
  };
}

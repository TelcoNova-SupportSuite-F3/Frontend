'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, UserX, Lock } from 'lucide-react';

export type LoginErrorType =
  | 'invalid_domain'
  | 'invalid_role'
  | 'invalid_credentials';

interface LoginErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorType: LoginErrorType | null;
  email?: string;
}

const errorConfig = {
  invalid_domain: {
    icon: Mail,
    title: 'Acceso inválido',
    description: 'Posibles causas:',
    bullets: [
      'Credenciales inválidas.',
      'Tu rol no pertenece a técnico.',
      'El dominio de tu correo no pertenece a nuestra organización dominio telco-nova.com',
    ],
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  invalid_role: {
    icon: UserX,
    title: 'Rol no autorizado',
    description: 'Tu usuario no tiene permisos de técnico.',
    bullets: [
      'Tu cuenta existe pero no tienes rol de técnico.',
      'Contacta al administrador para verificar tus permisos.',
      'Solo técnicos pueden acceder a esta aplicación.',
    ],
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  invalid_credentials: {
    icon: Lock,
    title: 'Credenciales incorrectas',
    description: 'Los datos ingresados no son válidos.',
    bullets: [
      'Verifica tu correo electrónico.',
      'Revisa que tu contraseña sea correcta.',
      'Asegúrate de no tener activado Caps Lock.',
    ],
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
};

export default function LoginErrorModal({
  isOpen,
  onClose,
  errorType,
  email,
}: LoginErrorModalProps) {
  if (!errorType) return null;

  const config = errorConfig[errorType];
  const IconComponent = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${config.bgColor} mb-4`}
          >
            <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <DialogTitle className='text-center text-lg font-semibold text-gray-900'>
            {config.title}
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-gray-600 mt-2'>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <ul className='space-y-2 text-sm text-gray-700'>
            {config.bullets.map((bullet, index) => (
              <li key={index} className='flex items-start gap-2'>
                <div className='flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mt-2'></div>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {errorType === 'invalid_domain' && email && (
            <div className='mt-3 p-3 bg-gray-50 rounded-lg'>
              <p className='text-xs text-gray-600'>
                <strong>Email ingresado:</strong> {email}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                <strong>Dominio requerido:</strong> @telco-nova.com
              </p>
            </div>
          )}
        </div>

        <DialogFooter className='mt-6'>
          <Button
            onClick={onClose}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant='outline'
      className='text-blue-600 border-blue-600 hover:bg-blue-50'
    >
      Cerrar sesión
    </Button>
  );
}

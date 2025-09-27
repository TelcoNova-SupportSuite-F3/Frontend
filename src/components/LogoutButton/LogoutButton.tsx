'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant='outline'
      className={cn(
        'text-primary border-primary hover:bg-primary/5',
        className
      )}
      aria-label='Cerrar sesión y volver al login'
    >
      Cerrar sesión
    </Button>
  );
}

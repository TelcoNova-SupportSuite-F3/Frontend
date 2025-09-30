'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'T';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 flex')}>
      {/* Skip to main content link for screen readers */}
      <a
        href='#main-content'
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
          'bg-primary text-primary-foreground px-4 py-2 rounded-md z-50'
        )}
      >
        Saltar al contenido principal
      </a>

      <aside
        className={cn('w-64 bg-primary text-white flex flex-col')}
        role='navigation'
        aria-label='Navegación principal'
      >
        <header className={cn('p-6 border-b border-primary-foreground/20')}>
          <div className={cn('flex flex-col items-center space-y-3')}>
            <div
              className={cn(
                'w-20 h-20 bg-white rounded-full flex items-center justify-center'
              )}
              role='img'
              aria-label='Logo de TelcoNova'
            >
              <Image
                src='/logo.svg'
                alt='TelcoNova - Sistema de gestión de órdenes'
                width={64}
                height={64}
              />
            </div>
            <h1 className={cn('text-lg font-bold text-center')}>TelcoNova</h1>
          </div>
        </header>

        <nav
          className={cn('flex-1 p-4')}
          role='navigation'
          aria-label='Menú de navegación'
        >
          <ul className={cn('space-y-2')} role='list'>
            <li>
              <button
                disabled
                className={cn(
                  'w-full justify-start text-white/40 cursor-not-allowed',
                  'inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium',
                  'h-10 px-4 py-2'
                )}
                aria-label='Dashboard (no disponible)'
                aria-disabled='true'
              >
                Dashboard
              </button>
            </li>
            <li>
              <Link
                href='/orders'
                className={cn(
                  'w-full justify-start text-white hover:bg-primary-foreground/10 hover:text-white bg-primary-foreground/20',
                  'inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium transition-colors',
                  'h-10 px-4 py-2'
                )}
                aria-label='Ver mis órdenes de trabajo'
                aria-current='page'
              >
                Mis ordenes
              </Link>
            </li>
            <li>
              <button
                disabled
                className={cn(
                  'w-full justify-start text-white/40 cursor-not-allowed',
                  'inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium',
                  'h-10 px-4 py-2'
                )}
                aria-label='Mi perfil (no disponible)'
                aria-disabled='true'
              >
                Mi perfil
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className={cn('flex-1 flex flex-col')}>
        <header
          className={cn('bg-white shadow-sm border-b px-6 py-4')}
          role='banner'
        >
          <div className={cn('flex items-center justify-between')}>
            <h1 className={cn('text-2xl font-bold text-gray-900')}>
              Panel de técnicos
            </h1>

            <div
              className={cn('flex items-center space-x-4')}
              role='region'
              aria-label='Información de usuario'
            >
              <span
                className={cn('text-sm text-gray-600')}
                aria-label='Usuario actual'
              >
                {user?.name || 'Técnico'}
              </span>
              <Avatar role='img' aria-label='Avatar del usuario'>
                <AvatarFallback className={cn('bg-primary/10 text-primary')}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main
          id='main-content'
          className={cn('flex-1 p-6')}
          role='main'
          aria-label='Contenido principal'
        >
          {children}
        </main>
      </div>
    </div>
  );
}

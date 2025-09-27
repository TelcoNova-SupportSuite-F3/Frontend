import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
          <div className={cn('flex items-center space-x-3')}>
            <div
              className={cn(
                'w-12 h-12 bg-white rounded-full flex items-center justify-center'
              )}
              role='img'
              aria-label='Logo de TelcoNova'
            >
              <Image
                src='/logo.svg'
                alt='TelcoNova - Sistema de gestión de órdenes'
                width={24}
                height={24}
              />
            </div>
          </div>
          <div>
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
              <Link
                href='/dashboard'
                className={cn(
                  'w-full justify-start text-white hover:bg-primary-foreground/10 hover:text-white',
                  'inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium transition-colors',
                  'h-10 px-4 py-2'
                )}
                aria-label='Ir al Dashboard principal'
              >
                Dashboard
              </Link>
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
              <Link
                href='/profile'
                className={cn(
                  'w-full justify-start text-white hover:bg-primary-foreground/10 hover:text-white',
                  'inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium transition-colors',
                  'h-10 px-4 py-2'
                )}
                aria-label='Ver mi perfil de usuario'
              >
                Mi perfil
              </Link>
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
                Nombre de técnico
              </span>
              <Avatar role='img' aria-label='Avatar del usuario'>
                <AvatarFallback className={cn('bg-primary/10 text-primary')}>
                  T
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

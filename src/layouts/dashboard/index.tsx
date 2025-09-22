import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { ReactNode } from 'react';
import LogoutButton from '@/components/LogoutButton/LogoutButton';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <div className='w-64 bg-blue-900 text-white flex flex-col'>
        <div className='p-6 border-b border-blue-800'>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center'>
              <Image
                src='/logo.svg'
                alt='TelcoNova Logo'
                width={24}
                height={24}
              />
            </div>
          </div>
          <div>
            <h1 className='text-lg font-bold text-center'>TelcoNova</h1>
          </div>
        </div>

        <nav className='flex-1 p-4'>
          <ul className='space-y-2'>
            <li>
              <Button
                variant='ghost'
                className='w-full justify-start text-white hover:bg-blue-800 hover:text-white'
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant='ghost'
                className='w-full justify-start text-white hover:bg-blue-800 hover:text-white bg-blue-800'
              >
                Mis ordenes
              </Button>
            </li>
            <li>
              <Button
                variant='ghost'
                className='w-full justify-start text-white hover:bg-blue-800 hover:text-white'
              >
                Mi perfil
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className='flex-1 flex flex-col'>
        <header className='bg-white shadow-sm border-b px-6 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Panel de técnicos
            </h1>

            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Nombre de técnico</span>
              <Avatar>
                <AvatarFallback className='bg-blue-100 text-blue-900'>
                  T
                </AvatarFallback>
              </Avatar>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}

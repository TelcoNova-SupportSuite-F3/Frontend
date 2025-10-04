import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthWrapper from '@/components/AuthWrapper/AuthWrapper';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TelcoNova - Panel de Técnicos',
  description: 'Sistema de gestión de órdenes para técnicos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <head>
        <script src='/console-silencer.js' async></script>
      </head>
      <body
        className={cn(geistSans.variable, geistMono.variable, 'antialiased')}
        suppressHydrationWarning
      >
        <AuthWrapper>{children}</AuthWrapper>
        <Toaster position='bottom-right' richColors />
      </body>
    </html>
  );
}

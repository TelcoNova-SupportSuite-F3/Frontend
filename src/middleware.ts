import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('auth-token')?.value;

  // Proteger rutas /orders
  if (pathname.startsWith('/orders') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir de login a orders si ya está autenticado
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/orders', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

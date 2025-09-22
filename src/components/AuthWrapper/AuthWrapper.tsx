'use client';

import { AuthProvider } from '../../contexts/auth-context';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { type ReactNode } from 'react';

/**
 * Props for AuthWrapper component
 */
interface AuthWrapperProps {
  /** Child components to be wrapped with authentication context */
  children: ReactNode;
}

/**
 * AuthWrapper Component
 *
 * Wraps children with the authentication context provider.
 * This component follows the Single Responsibility Principle by only
 * providing authentication context to its children.
 *
 * @example
 * ```tsx
 * <AuthWrapper>
 *   <App />
 * </AuthWrapper>
 * ```
 *
 * @param {AuthWrapperProps} props - Component props
 * @returns Children wrapped with AuthProvider
 */
export default function AuthWrapper({ children }: AuthWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

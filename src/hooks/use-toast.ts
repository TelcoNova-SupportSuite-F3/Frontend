/**
 * Hook personalizado para mostrar notificaciones user-friendly
 * Usa Sonner internamente pero con una API más simple
 */

import { toast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(options?.title || 'Éxito', {
      description: message,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(options?.title || 'Error', {
      description: message,
      duration: options?.duration || 6000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(options?.title || 'Advertencia', {
      description: message,
      duration: options?.duration || 5000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(options?.title || 'Información', {
      description: message,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  };

  const loading = (message: string, options?: Omit<ToastOptions, 'action'>) => {
    return toast.loading(options?.title || 'Cargando...', {
      description: message,
    });
  };

  const promise = <T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss: toast.dismiss,
  };
}

export default useToast;

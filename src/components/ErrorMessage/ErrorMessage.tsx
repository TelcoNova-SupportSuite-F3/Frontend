import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  MESSAGE_TYPES,
  type MessageType,
  getMessageTypeStyle,
} from './message-type-styles';

/**
 * Props for ErrorMessage component
 */
interface ErrorMessageProps {
  /** Title of the message to display */
  title: string;
  /** Main message content */
  message: string;
  /** Type of message - determines styling */
  type?: MessageType;
  /** Whether to wrap the message in a Card component */
  showCard?: boolean;
  /** Optional CSS classes for the container */
  className?: string;
  /** Optional CSS classes for the message text */
  messageClassName?: string;
}

/**
 * ErrorMessage Component
 *
 * A flexible message display component that can show different types
 * of messages (error, warning, info, success) with appropriate styling.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only displays messages
 * - Open/Closed: Extended through props without modifying code
 * - Dependency Inversion: Depends on abstractions (MessageType) not concrete types
 *
 * @example
 * ```tsx
 * // Error message (default)
 * <ErrorMessage
 *   title="Error de autenticación"
 *   message="Usuario o contraseña incorrectos"
 * />
 *
 * // Warning message
 * <ErrorMessage
 *   title="Advertencia"
 *   message="La sesión está a punto de expirar"
 *   type="warning"
 * />
 *
 * // Info message without card
 * <ErrorMessage
 *   title="Información"
 *   message="Datos guardados correctamente"
 *   type="info"
 *   showCard={false}
 * />
 * ```
 *
 * @param {ErrorMessageProps} props - Component props
 * @returns Message display component
 */
export default function ErrorMessage({
  title,
  message,
  type = MESSAGE_TYPES.ERROR,
  showCard = true,
  className,
  messageClassName,
}: ErrorMessageProps) {
  const messageContent = (
    <p className={cn(getMessageTypeStyle(type), messageClassName)}>{message}</p>
  );

  return (
    <main className={cn('space-y-6', className)}>
      <header>
        <h1 className={cn('text-3xl font-bold text-primary')}>{title}</h1>
      </header>
      {showCard ? (
        <Card>
          <CardContent className={cn('p-6 text-center')}>
            {messageContent}
          </CardContent>
        </Card>
      ) : (
        messageContent
      )}
    </main>
  );
}

// Re-export types and constants for convenience
export { MESSAGE_TYPES, type MessageType };

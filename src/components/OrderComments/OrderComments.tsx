'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitComment } from '@/lib/order-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  COMMENT_CONFIG,
  TOAST_DURATIONS,
  MESSAGES,
  ARIA_LABELS,
  STYLES,
  formatCharCounter,
  getSuccessDescription,
} from './order-comments.constants';

/**
 * Props para el componente OrderComments
 */
interface OrderCommentsProps {
  /** ID de la orden de trabajo */
  orderId: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Callback ejecutado cuando se envía exitosamente un comentario */
  onCommentSubmitted?: (comment: string) => void;
  /** Límite máximo de caracteres para el comentario */
  maxLength?: number;
}

/**
 * Componente para agregar comentarios a una orden de trabajo
 *
 * Proporciona un área de texto para escribir y enviar comentarios,
 * con validación, límite de caracteres y atajos de teclado.
 *
 * @example
 * ```tsx
 * <OrderComments
 *   orderId="12345"
 *   onCommentSubmitted={(comment) => console.log('Comentario enviado:', comment)}
 *   maxLength={500}
 * />
 * ```
 */
export default function OrderComments({
  orderId,
  className,
  onCommentSubmitted,
  maxLength = COMMENT_CONFIG.MAX_LENGTH,
}: OrderCommentsProps) {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  /**
   * Valida y envía el comentario
   */
  const handleSubmit = () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      toast.error(MESSAGES.EMPTY_ERROR);
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitComment(orderId, trimmedComment);

        if (result.success) {
          toast.success(result.message, {
            description: getSuccessDescription(orderId),
            duration: TOAST_DURATIONS.SUCCESS,
          });
          setComment('');
          onCommentSubmitted?.(trimmedComment);
        } else {
          toast.error(result.message, {
            description: MESSAGES.ERROR_DESCRIPTION,
            duration: TOAST_DURATIONS.ERROR,
          });
        }
      } catch {
        toast.error(MESSAGES.UNEXPECTED_ERROR, {
          description: MESSAGES.UNEXPECTED_ERROR_DESCRIPTION,
          duration: TOAST_DURATIONS.UNEXPECTED_ERROR,
        });
      }
    });
  };

  /**
   * Maneja el atajo de teclado Ctrl/Cmd + Enter para enviar
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const commentId = `comment-${orderId}`;
  const helpTextId = `comment-help-${orderId}`;
  const counterId = `comment-counter-${orderId}`;
  const submitStatusId = `submit-status-${orderId}`;

  return (
    <Card
      className={cn(className)}
      role='region'
      aria-label={ARIA_LABELS.REGION}
    >
      <CardContent className={cn(STYLES.CONTENT)}>
        <div className={cn(STYLES.CONTAINER)}>
          <div className={cn(STYLES.FIELD_CONTAINER)}>
            <Label htmlFor={commentId} className={cn(STYLES.LABEL)}>
              {MESSAGES.TITLE}
            </Label>
            <Textarea
              id={commentId}
              placeholder={MESSAGES.PLACEHOLDER}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(STYLES.TEXTAREA)}
              disabled={isPending}
              maxLength={maxLength}
              aria-describedby={`${helpTextId} ${counterId}`}
              aria-label={ARIA_LABELS.TEXTAREA}
            />
            <div id={helpTextId} className='sr-only'>
              {ARIA_LABELS.HELP_TEXT(maxLength)}
            </div>
          </div>

          <div className={cn(STYLES.ACTIONS_CONTAINER)}>
            <span
              id={counterId}
              className={cn(STYLES.COUNTER)}
              role='status'
              aria-live='polite'
              aria-label={ARIA_LABELS.COUNTER(comment.length, maxLength)}
            >
              {formatCharCounter(comment.length, maxLength, comment.length > 0)}
            </span>
            <Button
              onClick={handleSubmit}
              className={cn(STYLES.BUTTON)}
              disabled={!comment.trim() || isPending}
              aria-describedby={submitStatusId}
              aria-label={
                isPending
                  ? ARIA_LABELS.SUBMIT_BUTTON_LOADING
                  : ARIA_LABELS.SUBMIT_BUTTON
              }
            >
              {isPending ? MESSAGES.SUBMITTING : MESSAGES.SUBMIT_BUTTON}
            </Button>
            <div id={submitStatusId} className='sr-only' aria-live='polite'>
              {isPending ? ARIA_LABELS.SUBMITTING_STATUS : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

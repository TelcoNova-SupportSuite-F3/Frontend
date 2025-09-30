'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitComment } from '@/lib/order-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface OrderCommentsProps {
  orderId: string;
  className?: string;
}

export default function OrderComments({
  orderId,
  className,
}: OrderCommentsProps) {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitComment(orderId, comment.trim());

        if (result.success) {
          toast.success(result.message, {
            description: `Comentario enviado para orden #${orderId}`,
            duration: 3000,
          });
          setComment('');
        } else {
          toast.error(result.message, {
            description: 'Intenta nuevamente',
            duration: 4000,
          });
        }
      } catch {
        toast.error('Error inesperado al enviar comentario', {
          description: 'Verifica tu conexión e intenta nuevamente',
          duration: 5000,
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card
      className={cn(className)}
      role='region'
      aria-label='Comentarios de la orden'
    >
      <CardContent className={cn('p-6')}>
        <div className={cn('space-y-4')}>
          <div className={cn('space-y-2')}>
            <Label
              htmlFor={`comment-${orderId}`}
              className={cn('text-base font-medium')}
            >
              Agregar comentario
            </Label>
            <Textarea
              id={`comment-${orderId}`}
              placeholder='Escriba un comentario sobre la orden...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn('min-h-[120px] resize-none')}
              disabled={isPending}
              maxLength={1000}
              aria-describedby={`comment-help-${orderId} comment-counter-${orderId}`}
              aria-label='Campo de texto para escribir comentario'
            />
            <div id={`comment-help-${orderId}`} className='sr-only'>
              Escribe un comentario sobre esta orden de trabajo. Máximo 1000
              caracteres. Usa Ctrl+Enter para enviar rápidamente.
            </div>
          </div>

          <div className={cn('flex items-center justify-between')}>
            <span
              id={`comment-counter-${orderId}`}
              className={cn('text-xs text-gray-500')}
              role='status'
              aria-live='polite'
              aria-label={`${comment.length} de 1000 caracteres utilizados`}
            >
              {comment.length}/1000 caracteres
              {comment.length > 0 && ' • Ctrl+Enter para enviar'}
            </span>
            <Button
              onClick={handleSubmit}
              className={cn('bg-primary hover:bg-primary/90 text-white')}
              disabled={!comment.trim() || isPending}
              aria-describedby={`submit-status-${orderId}`}
              aria-label={
                isPending ? 'Enviando comentario' : 'Enviar comentario'
              }
            >
              {isPending ? 'Enviando...' : 'Enviar comentario'}
            </Button>
            <div
              id={`submit-status-${orderId}`}
              className='sr-only'
              aria-live='polite'
            >
              {isPending ? 'Enviando comentario, por favor espera' : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { submitComment } from '@/lib/order-actions';
import { toast } from 'sonner';

interface OrderCommentsProps {
  orderId: string;
}

export default function OrderComments({ orderId }: OrderCommentsProps) {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    console.log('🚀 Enviando comentario:', {
      orderId,
      length: comment.trim().length,
    });

    startTransition(async () => {
      try {
        const result = await submitComment(orderId, comment.trim());

        console.log('📨 Respuesta recibida:', result);

        if (result.success) {
          toast.success(result.message, {
            description: `Comentario enviado para orden #${orderId}`,
            duration: 3000,
          });
          setComment('');
          console.log('✅ Comentario procesado exitosamente');
        } else {
          toast.error(result.message, {
            description: 'Intenta nuevamente',
            duration: 4000,
          });
          console.log('❌ Error en comentario:', result.message);
        }
      } catch (error) {
        console.error('💥 Error inesperado al enviar comentario:', error);
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
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <Textarea
            placeholder='Escriba un comentario...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            className='min-h-[120px] resize-none'
            disabled={isPending}
            maxLength={1000}
          />

          <div className='flex items-center justify-between'>
            <span className='text-xs text-gray-500'>
              {comment.length}/1000 caracteres
              {comment.length > 0 && ' • Ctrl+Enter para enviar'}
            </span>
            <Button
              onClick={handleSubmit}
              className='bg-blue-600 hover:bg-blue-700 text-white'
              disabled={!comment.trim() || isPending}
            >
              {isPending ? 'Enviando...' : 'Enviar comentario'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

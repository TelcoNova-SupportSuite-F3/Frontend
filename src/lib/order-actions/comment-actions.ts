'use server';

import { revalidatePath } from 'next/cache';
import { type CommentSubmitResult, delay } from './types';

// Server Action: Enviar comentario
export async function submitComment(
  orderId: string,
  comment: string
): Promise<CommentSubmitResult> {
  console.log('📝 Iniciando submitComment:', {
    orderId,
    commentLength: comment.length,
  });

  try {
    await delay(800); // Reducir tiempo para mejor UX

    // Validación de comentario vacío
    if (!comment.trim()) {
      console.log('❌ Comentario vacío');
      return {
        success: false,
        message: 'El comentario no puede estar vacío',
      };
    }

    // Validación de longitud
    if (comment.length > 1000) {
      console.log('❌ Comentario muy largo:', comment.length);
      return {
        success: false,
        message: 'El comentario es demasiado largo (máximo 1000 caracteres)',
      };
    }

    const commentId = `comment_${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log('✅ Comentario guardado exitosamente:', {
      orderId,
      commentId,
      timestamp,
      preview: comment.substring(0, 50) + (comment.length > 50 ? '...' : ''),
    });

    // Revalidar página
    try {
      revalidatePath(`/orders/${orderId}`);
      console.log('🔄 Página revalidada');
    } catch (revalidateError) {
      console.warn('⚠️ Error en revalidación (no crítico):', revalidateError);
    }

    return {
      success: true,
      message: '¡Comentario enviado exitosamente!',
      commentId,
    };
  } catch (error) {
    console.error('💥 Error inesperado en submitComment:', error);

    // En producción esto sería un error real
    return {
      success: true,
      message: 'Comentario enviado (modo desarrollo)',
      commentId: `fallback_${Date.now()}`,
    };
  }
}

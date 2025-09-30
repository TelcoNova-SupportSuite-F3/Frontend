'use server';

import { revalidatePath } from 'next/cache';
import { type EvidenceUploadResult, delay } from './types';

// Server Action: Subir evidencia
export async function uploadEvidence(
  orderId: string,
  formData: FormData
): Promise<EvidenceUploadResult> {
  try {
    await delay(2000); // Simular tiempo de upload

    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        message: 'No se proporcionó ningún archivo',
      };
    }

    // Validaciones server-side
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Tipo de archivo no permitido. Solo JPG, JPEG y PNG',
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB',
      };
    }

    console.log(`Subiendo evidencia para orden ${orderId}:`, file.name);

    // Simular éxito
    const fileId = `evidence_${Date.now()}`;

    // Revalidar la página para mostrar cambios
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: 'Evidencia subida exitosamente',
      fileId,
    };
  } catch (error) {
    console.error('Error uploading evidence:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

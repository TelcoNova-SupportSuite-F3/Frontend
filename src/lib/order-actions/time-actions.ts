'use server';

import { revalidatePath } from 'next/cache';
import { type OrderTimeResult, delay } from './types';

// Server Action: Actualizar tiempos de orden
export async function updateOrderTimes(
  orderId: string,
  startDateTime: string | null,
  endDateTime: string | null
): Promise<OrderTimeResult> {
  try {
    await delay(800); // Simular tiempo de procesamiento

    // Validaciones
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (end <= start) {
        return {
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio',
        };
      }
    }

    console.log(`Actualizando tiempos para orden ${orderId}:`, {
      startDateTime,
      endDateTime,
    });

    // Revalidar la página
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: 'Tiempos actualizados exitosamente',
    };
  } catch (error) {
    console.error('Error updating order times:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

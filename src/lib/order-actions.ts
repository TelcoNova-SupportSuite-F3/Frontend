'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  addOrderComment,
  uploadOrderEvidence,
} from '@/services/evidence.service';
import { getServerAuthToken } from '@/lib/auth-server';
import type { AgregarMaterialRequest, OrderApiResponse } from '@/types/orders';

// Tipos para las diferentes acciones
export interface EvidenceUploadResult {
  success: boolean;
  message: string;
  fileId?: string;
}

export interface CommentSubmitResult {
  success: boolean;
  message: string;
  commentId?: string;
}

export interface OrderTimeResult {
  success: boolean;
  message: string;
}

// Simulación de delay para APIs mock (materiales, etc.)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gets the authentication token from server-side cookies
 * @returns The token or null if not found
 */
async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  return token || null;
}

// Server Action: Subir evidencia
export async function uploadEvidence(
  orderId: string,
  formData: FormData
): Promise<EvidenceUploadResult> {
  try {
    // Obtener token de las cookies del servidor
    const token = await getServerToken();
    if (!token) {
      return {
        success: false,
        message:
          'No se encontró token de autenticación. Por favor, inicie sesión.',
      };
    }

    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        message: 'No se proporcionó ningún archivo',
      };
    }

    // Validaciones client-side ya se hacen en el componente,
    // pero validamos de nuevo por seguridad
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

    // Llamar al servicio real del backend con el token
    const result = await uploadOrderEvidence(parseInt(orderId), file, token);

    if (result.success) {
      // Revalidar la página para mostrar la nueva evidencia
      revalidatePath(`/orders/${orderId}`);

      return {
        success: true,
        message: result.message || 'Evidencia subida exitosamente',
        fileId: result.data?.id?.toString(),
      };
    } else {
      return {
        success: false,
        message: result.message || 'Error al subir evidencia',
      };
    }
  } catch (error) {
    console.error('Error en uploadEvidence:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error inesperado al subir evidencia',
    };
  }
}

// Server Action: Enviar comentario
export async function submitComment(
  orderId: string,
  comment: string
): Promise<CommentSubmitResult> {
  try {
    // Obtener token de las cookies del servidor
    const token = await getServerToken();
    if (!token) {
      return {
        success: false,
        message:
          'No se encontró token de autenticación. Por favor, inicie sesión.',
      };
    }

    // Validación de comentario vacío
    if (!comment.trim()) {
      return {
        success: false,
        message: 'El comentario no puede estar vacío',
      };
    }

    // Validación de longitud
    if (comment.length > 1000) {
      return {
        success: false,
        message: 'El comentario es demasiado largo (máximo 1000 caracteres)',
      };
    }

    // Llamar al servicio real del backend con el token
    const result = await addOrderComment(
      parseInt(orderId),
      comment.trim(),
      token
    );

    if (result.success) {
      // Revalidar la página para mostrar el nuevo comentario
      revalidatePath(`/orders/${orderId}`);

      return {
        success: true,
        message: result.message || '¡Comentario enviado exitosamente!',
        commentId: result.data?.id?.toString(),
      };
    } else {
      return {
        success: false,
        message: result.message || 'Error al enviar comentario',
      };
    }
  } catch (error) {
    console.error('Error en submitComment:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error inesperado al enviar comentario',
    };
  }
}

// ===== MATERIALS SERVER ACTIONS =====

interface Material {
  id: string;
  name: string;
  quantity: number;
}

interface MaterialResult {
  success: boolean;
  message: string;
  data?: Material | Material[];
}

// Base de datos simulada de materiales
const materialsData: Material[] = [
  { id: '1', name: 'Cable de red (metros)', quantity: 100 },
  { id: '2', name: 'Conectores RJ45', quantity: 50 },
  { id: '3', name: 'Router Wi-Fi', quantity: 5 },
  { id: '4', name: 'Herramientas de crimpado', quantity: 2 },
];

// Server Action: Obtener todos los materiales
export async function getMaterials(): Promise<Material[]> {
  console.log('📦 Cargando materiales desde servidor');
  await delay(300);
  return [...materialsData];
}

// Server Action: Buscar materiales
export async function searchMaterials(searchTerm: string): Promise<Material[]> {
  console.log('🔍 Buscando materiales:', searchTerm);
  await delay(500);

  const mockResults: Material[] = [
    { id: 'search_1', name: 'Cable de red (metros)', quantity: 0 },
    { id: 'search_2', name: 'Conectores RJ45', quantity: 0 },
    { id: 'search_3', name: `${searchTerm} Premium`, quantity: 0 },
  ];

  return mockResults.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Server Action: Agregar material a una orden
export async function addMaterialToOrderAction(
  orderId: number,
  request: AgregarMaterialRequest
): Promise<OrderApiResponse> {
  try {
    const token = await getServerAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'No autorizado. Por favor, inicia sesión nuevamente.',
      };
    }

    // Dynamic import to avoid circular dependencies
    const { addMaterialToOrder } = await import('@/services/materials.service');
    const result = await addMaterialToOrder(orderId, request, token);

    if (result.success) {
      revalidatePath(`/orders/${orderId}`);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// Server Action: Agregar material (DEPRECATED - usar addMaterialToOrderAction)
export async function addMaterial(
  name: string,
  quantity: string
): Promise<MaterialResult> {
  console.log('⚠️ DEPRECATED: addMaterial - usar addMaterialToOrderAction');
  console.log('➕ Agregando material:', { name, quantity });

  try {
    await delay(300);

    if (!name.trim()) {
      return {
        success: false,
        message: 'El nombre del material es requerido',
      };
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return {
        success: false,
        message: 'La cantidad debe ser un número válido',
      };
    }

    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      name: name.trim(),
      quantity: parsedQuantity,
    };

    materialsData.push(newMaterial);

    // Revalidar la página
    revalidatePath('/orders/[id]', 'page');

    return {
      success: true,
      message: 'Material agregado exitosamente',
      data: newMaterial,
    };
  } catch (error) {
    console.error('💥 Error agregando material:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

// Server Action: Actualizar material
export async function updateMaterial(
  id: string,
  name: string,
  quantity: number
): Promise<MaterialResult> {
  console.log('✏️ Actualizando material:', { id, name, quantity });

  try {
    await delay(300);

    const materialIndex = materialsData.findIndex((m) => m.id === id);
    if (materialIndex === -1) {
      return {
        success: false,
        message: 'Material no encontrado',
      };
    }

    if (!name.trim()) {
      return {
        success: false,
        message: 'El nombre del material es requerido',
      };
    }

    if (isNaN(quantity) || quantity < 0) {
      return {
        success: false,
        message: 'La cantidad debe ser un número válido',
      };
    }

    materialsData[materialIndex].name = name.trim();
    materialsData[materialIndex].quantity = quantity;

    // Revalidar la página
    revalidatePath('/orders/[id]', 'page');

    return {
      success: true,
      message: 'Material actualizado exitosamente',
      data: materialsData[materialIndex],
    };
  } catch (error) {
    console.error('💥 Error actualizando material:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

// Server Action: Eliminar material
export async function deleteMaterial(id: string): Promise<MaterialResult> {
  console.log('🗑️ Eliminando material:', id);

  try {
    await delay(300);

    const materialIndex = materialsData.findIndex((m) => m.id === id);
    if (materialIndex === -1) {
      return {
        success: false,
        message: 'Material no encontrado',
      };
    }

    const deletedMaterial = materialsData.splice(materialIndex, 1)[0];

    // Revalidar la página
    revalidatePath('/orders/[id]', 'page');

    return {
      success: true,
      message: 'Material eliminado exitosamente',
      data: deletedMaterial,
    };
  } catch (error) {
    console.error('💥 Error eliminando material:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
    };
  }
}

/**
 * Server action para refrescar los datos de órdenes
 * Revalida la página de órdenes para obtener datos actualizados
 */
export async function refreshOrdersAction(): Promise<{ success: boolean }> {
  try {
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error al refrescar órdenes:', error);
    return { success: false };
  }
}

/**
 * Server action para cambiar el estado de una orden
 * @param orderId - ID de la orden
 * @param newStatus - Nuevo estado a aplicar
 * @param fechaInicioTrabajo - Fecha de inicio del trabajo (requerida para FINALIZADA)
 * @param fechaFinTrabajo - Fecha de fin del trabajo (requerida para FINALIZADA)
 * @returns Resultado del cambio de estado
 */
export async function changeOrderStatusAction(
  orderId: number,
  newStatus: string,
  fechaInicioTrabajo?: string,
  fechaFinTrabajo?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getServerToken();
    if (!token) {
      return {
        success: false,
        message:
          'No se encontró token de autenticación. Por favor, inicie sesión.',
      };
    }

    // Dynamic import to avoid circular dependencies
    const { updateOrderStatus } = await import('@/services/order.service');
    const { ESTADO_ORDEN } = await import('@/types/orders');

    const result = await updateOrderStatus(
      orderId,
      {
        nuevoEstado: newStatus as (typeof ESTADO_ORDEN)[keyof typeof ESTADO_ORDEN],
        fechaInicioTrabajo,
        fechaFinTrabajo,
      },
      token
    );

    if (result.success) {
      // Revalidar la página de detalle de la orden
      revalidatePath(`/orders/${orderId}`);
      // Revalidar también la lista de órdenes
      revalidatePath('/orders');

      return {
        success: true,
        message: result.message || 'Estado actualizado exitosamente',
      };
    } else {
      return {
        success: false,
        message: result.message || 'Error al actualizar el estado',
      };
    }
  } catch (error) {
    console.error('Error en changeOrderStatusAction:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error inesperado al cambiar el estado',
    };
  }
}

// ===== ORDERS DATA SERVER ACTIONS =====

interface Order {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

// Base de datos simulada de órdenes
const ordersData: Order[] = [
  {
    id: '001',
    title: 'Instalación de fibra óptica',
    status: 'En curso',
    startDate: '2025-09-17 13:23',
    endDate: '',
  },
  {
    id: '002',
    title: 'Revisión de conexión ADSL',
    status: 'Finalizado',
    startDate: '2025-09-15 10:00',
    endDate: '2025-09-15 12:30',
  },
  {
    id: '003',
    title: 'Cambio de router',
    status: 'Pausado',
    startDate: '2025-09-16 09:00',
    endDate: '',
  },
  {
    id: '004',
    title: 'Configuración de red empresarial',
    status: 'Requerimiento adicional',
    startDate: '2025-09-18 14:00',
    endDate: '',
  },
];

// Server Action: Obtener todas las órdenes
export async function getOrders(): Promise<Order[]> {
  console.log('📋 Cargando órdenes desde servidor');
  await delay(400);
  return [...ordersData];
}

// Server Action: Obtener orden específica
export async function getOrder(id: string): Promise<Order | null> {
  console.log('📋 Cargando orden específica:', id);
  await delay(300);
  return ordersData.find((order) => order.id === id) || null;
}

// ===== ORDER TIME SERVER ACTIONS =====

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

    // Aquí iría la lógica real
    // - Actualizar timestamps en base de datos
    // - Calcular duración de trabajo
    // - Actualizar estado de orden si es necesario

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

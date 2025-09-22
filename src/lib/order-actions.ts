'use server';

import { revalidatePath } from 'next/cache';

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

// Simulación de delay para APIs
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Tipo de archivo no permitido. Solo JPG, JPEG y SVG',
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB',
      };
    }

    // Aquí iría la lógica real de subida
    // - Subir a cloud storage (AWS S3, Cloudinary, etc.)
    // - Guardar referencia en base de datos
    // - Procesar imagen si es necesario

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

    // Simular guardado exitoso
    // En producción aquí iría:
    // - Guardar comentario en base de datos
    // - Notificar a supervisores si es necesario
    // - Registrar timestamp y usuario
    // - Validar permisos del usuario

    const commentId = `comment_${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log('✅ Comentario guardado exitosamente:', {
      orderId,
      commentId,
      timestamp,
      preview: comment.substring(0, 50) + (comment.length > 50 ? '...' : ''),
    });

    // Simular revalidación de página
    try {
      revalidatePath(`/orders/${orderId}`);
      console.log('🔄 Página revalidada');
    } catch (revalidateError) {
      console.warn('⚠️ Error en revalidación (no crítico):', revalidateError);
    }

    // Respuesta exitosa garantizada para comentarios válidos
    return {
      success: true,
      message: '¡Comentario enviado exitosamente!',
      commentId,
    };
  } catch (error) {
    console.error('💥 Error inesperado en submitComment:', error);

    // Incluso en caso de error, devolvemos éxito para el mock
    // En producción esto sería un error real
    return {
      success: true,
      message: 'Comentario enviado (modo desarrollo)',
      commentId: `fallback_${Date.now()}`,
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

// Server Action: Agregar material
export async function addMaterial(
  name: string,
  quantity: string
): Promise<MaterialResult> {
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

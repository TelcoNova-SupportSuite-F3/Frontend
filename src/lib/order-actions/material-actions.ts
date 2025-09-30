'use server';

import { revalidatePath } from 'next/cache';
import { type Material, type MaterialResult, delay } from './types';

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

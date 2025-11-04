import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addMaterialToOrderAction, searchMaterialByCodeAction, deleteMaterialFromOrderAction } from '@/lib/order-actions';
import type { MaterialUtilizadoResponse, EstadoOrden } from '@/types/orders';
import { ESTADO_ORDEN } from '@/types/orders';

interface UseEditMaterialReturn {
  isEditModalOpen: boolean;
  editingMaterial: MaterialUtilizadoResponse | null;
  editName: string;
  editQuantity: string;
  currentQuantity: number;
  unidadMedida: string;
  stockDisponible: number;
  isPending: boolean;
  canEdit: boolean;
  openEditModal: (material: MaterialUtilizadoResponse) => Promise<void>;
  closeEditModal: () => void;
  setEditName: (value: string) => void;
  setEditQuantity: (value: string) => void;
  handleUpdateMaterial: () => void;
  canUpdate: boolean;
}

export function useEditMaterial(orderId: string, orderEstado: EstadoOrden): UseEditMaterialReturn {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialUtilizadoResponse | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState('');
  const [stockDisponible, setStockDisponible] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Solo se puede editar si la orden está EN_PROCESO
  const canEdit = orderEstado === ESTADO_ORDEN.EN_PROCESO;

  const canUpdate = !!(editQuantity.trim() && !isPending);

  const openEditModal = async (material: MaterialUtilizadoResponse) => {
    // Mostrar loading mientras se obtiene el stock
    const loadingToast = toast.loading('Cargando información del material...');

    // Primero configurar los datos del material
    setEditingMaterial(material);
    setEditName(material.nombreMaterial);
    setEditQuantity(material.cantidadUtilizada.toString());
    setCurrentQuantity(material.cantidadUtilizada);
    setUnidadMedida(material.unidadMedida);

    // Buscar el stock disponible ANTES de abrir el modal
    try {
      console.log('🔍 Buscando stock disponible para:', {
        codigo: material.codigoMaterial,
        nombre: material.nombreMaterial
      });

      const searchResult = await searchMaterialByCodeAction(
        material.codigoMaterial,
        material.nombreMaterial
      );

      if (searchResult.success && searchResult.stockDisponible !== undefined) {
        console.log('✅ Stock encontrado:', searchResult.stockDisponible);
        setStockDisponible(searchResult.stockDisponible);
      } else {
        console.warn('⚠️ No se pudo obtener stock disponible');
        setStockDisponible(0);
        toast.warning('No se pudo obtener el stock disponible');
      }
    } catch (error) {
      console.error('❌ Error buscando stock:', error);
      setStockDisponible(0);
      toast.error('Error al cargar información del material');
    }

    // Cerrar el loading toast
    toast.dismiss(loadingToast);

    // DESPUÉS de tener el stock, abrir el modal
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMaterial(null);
    setEditName('');
    setEditQuantity('');
    setCurrentQuantity(0);
    setUnidadMedida('');
    setStockDisponible(0);
  };

  const handleUpdateMaterial = () => {
    // Validar que la orden esté en estado EN_PROCESO
    if (orderEstado !== ESTADO_ORDEN.EN_PROCESO) {
      toast.error('Solo se puede editar la lista de materiales de una orden en proceso.');
      return;
    }

    if (!editingMaterial || !editQuantity.trim()) {
      toast.error('Por favor ingresa la cantidad deseada');
      return;
    }

    const newQuantity = parseInt(editQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      toast.error('La cantidad debe ser un número mayor a 0');
      return;
    }

    // Validar que no se esté disminuyendo la cantidad
    if (newQuantity < currentQuantity) {
      toast.error('No puedes disminuir la cantidad. Para reducir, elimina el material y vuélvelo a agregar.');
      return;
    }

    // Validar que haya un cambio
    if (newQuantity === currentQuantity) {
      toast.info('La cantidad no ha cambiado.');
      return;
    }

    console.log('🚀 Actualizando cantidad de material (DELETE + ADD):', {
      orderId,
      materialUtilizadoId: editingMaterial.id,
      nombreMaterial: editingMaterial.nombreMaterial,
      cantidadActual: currentQuantity,
      cantidadNueva: newQuantity,
    });

    startTransition(async () => {
      // Mostrar toast de progreso
      const loadingToast = toast.loading('Actualizando cantidad...');

      try {
        // PASO 1: Buscar el material por código/nombre para obtener su materialId
        console.log('🔍 [1/3] Buscando material:', {
          codigo: editingMaterial.codigoMaterial,
          nombre: editingMaterial.nombreMaterial
        });

        const searchResult = await searchMaterialByCodeAction(
          editingMaterial.codigoMaterial,
          editingMaterial.nombreMaterial
        );

        if (!searchResult.success || !searchResult.materialId) {
          toast.dismiss(loadingToast);
          toast.error(searchResult.message || 'No se pudo encontrar el material');
          return;
        }

        console.log('✅ Material encontrado:', {
          materialId: searchResult.materialId,
          stockDisponible: searchResult.stockDisponible,
        });

        // Validar que hay stock suficiente para la nueva cantidad
        const stockActualDisponible = searchResult.stockDisponible || 0;
        const stockNecesario = newQuantity - currentQuantity; // Solo necesitamos la diferencia adicional

        if (stockNecesario > stockActualDisponible) {
          toast.dismiss(loadingToast);
          toast.error(
            `Stock insuficiente. Solo hay ${stockActualDisponible} ${searchResult.unidadMedida || unidadMedida} disponibles.`,
            {
              description: `Tienes ${currentQuantity} en uso. Necesitas ${stockNecesario} más pero solo hay ${stockActualDisponible}.`,
              duration: 5000,
            }
          );
          return;
        }

        // PASO 2: DELETE del material actual
        console.log('🗑️ [2/3] Eliminando material actual:', {
          orderId,
          materialUtilizadoId: editingMaterial.id
        });

        const deleteResult = await deleteMaterialFromOrderAction(
          Number(orderId),
          editingMaterial.id
        );

        if (!deleteResult.success) {
          toast.dismiss(loadingToast);
          toast.error(deleteResult.message || 'Error al eliminar el material');
          return;
        }

        console.log('✅ Material eliminado exitosamente');

        // PASO 3: ADD del material con la nueva cantidad
        console.log('➕ [3/3] Agregando material con nueva cantidad:', {
          orderId,
          materialId: searchResult.materialId,
          cantidad: newQuantity
        });

        const addResult = await addMaterialToOrderAction(Number(orderId), {
          materialId: searchResult.materialId,
          cantidad: newQuantity
        });

        toast.dismiss(loadingToast);

        if (addResult.success) {
          toast.success('Cantidad actualizada exitosamente', {
            description: `${editingMaterial.nombreMaterial}: ${currentQuantity} → ${newQuantity} ${unidadMedida}`
          });
          console.log('✅ Operación completada exitosamente');
          closeEditModal();

          // Refrescar la página para mostrar cambios
          router.refresh();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          // CRÍTICO: DELETE funcionó pero ADD falló
          toast.error('Error crítico: El material fue eliminado pero no se pudo agregar con la nueva cantidad', {
            description: 'Por favor, agrega el material manualmente desde el formulario.',
            duration: 10000,
          });
          console.error('❌ [CRÍTICO] Material eliminado pero no agregado:', addResult.message);
          closeEditModal();

          // Refrescar para mostrar que el material ya no está
          router.refresh();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('💥 Error actualizando cantidad de material:', error);
        toast.error('Error inesperado al actualizar material', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    });
  };

  return {
    isEditModalOpen,
    editingMaterial,
    editName,
    editQuantity,
    currentQuantity,
    unidadMedida,
    stockDisponible,
    isPending,
    canEdit,
    openEditModal,
    closeEditModal,
    setEditName,
    setEditQuantity,
    handleUpdateMaterial,
    canUpdate,
  };
}

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addMaterialToOrderAction, searchMaterialByCodeAction } from '@/lib/order-actions';
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
  openEditModal: (material: MaterialUtilizadoResponse) => void;
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

  const openEditModal = (material: MaterialUtilizadoResponse) => {
    setEditingMaterial(material);
    setEditName(material.nombreMaterial);
    setEditQuantity(material.cantidadUtilizada.toString());
    setCurrentQuantity(material.cantidadUtilizada);
    setUnidadMedida(material.unidadMedida);
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

    // Calcular la diferencia entre cantidad actual y nueva cantidad
    const quantityDifference = newQuantity - currentQuantity;

    // Validar que no se esté disminuyendo la cantidad
    if (quantityDifference < 0) {
      toast.error('No puedes disminuir la cantidad. Para reducir, elimina el material y vuélvelo a agregar.');
      return;
    }

    // Validar que haya un cambio
    if (quantityDifference === 0) {
      toast.info('La cantidad no ha cambiado.');
      return;
    }

    console.log('🚀 Aumentando cantidad de material:', {
      orderId,
      materialId: editingMaterial.id,
      nombreMaterial: editingMaterial.nombreMaterial,
      cantidadActual: currentQuantity,
      cantidadDeseada: newQuantity,
      diferencia: quantityDifference,
    });

    startTransition(async () => {
      try {
        // WORKAROUND: Buscar el material por código/nombre para obtener su materialId
        // Ya que MaterialUtilizadoResponse no incluye el materialId del catálogo
        console.log('🔍 Buscando material:', {
          codigo: editingMaterial.codigoMaterial,
          nombre: editingMaterial.nombreMaterial
        });

        // Buscar el material usando Server Action (pasa código Y nombre)
        const searchResult = await searchMaterialByCodeAction(
          editingMaterial.codigoMaterial,
          editingMaterial.nombreMaterial
        );

        if (!searchResult.success || !searchResult.materialId) {
          toast.error(searchResult.message || 'No se pudo encontrar el material');
          return;
        }

        console.log('✅ Material encontrado:', {
          materialId: searchResult.materialId,
          stockDisponible: searchResult.stockDisponible,
          unidadMedida: searchResult.unidadMedida
        });

        // Actualizar el stock disponible en el estado
        if (searchResult.stockDisponible !== undefined) {
          setStockDisponible(searchResult.stockDisponible);
        }

        // Validar que hay stock suficiente para el aumento
        const stockActualDisponible = searchResult.stockDisponible || 0;
        if (quantityDifference > stockActualDisponible) {
          toast.error(
            `Stock insuficiente. Solo hay ${stockActualDisponible} ${searchResult.unidadMedida || unidadMedida} disponibles.`,
            {
              description: `Tienes ${currentQuantity} en uso. Puedes agregar hasta ${stockActualDisponible} más.`,
              duration: 5000,
            }
          );
          return;
        }

        console.log('📤 Enviando actualización:', {
          orderId,
          materialId: searchResult.materialId,
          cantidad: quantityDifference
        });

        // Ahora podemos usar el materialId para agregar la diferencia
        const result = await addMaterialToOrderAction(Number(orderId), {
          materialId: searchResult.materialId,
          cantidad: quantityDifference
        });

        console.log('📥 Respuesta del servidor:', result);

        if (result.success) {
          toast.success('Cantidad actualizada exitosamente');
          console.log('✅ Cerrando modal y refrescando...');
          closeEditModal();

          // Forzar refresh con window.location.reload como fallback
          try {
            router.refresh();
            console.log('✅ Router refresh ejecutado');

            // Dar un pequeño delay y recargar la página si es necesario
            setTimeout(() => {
              console.log('🔄 Recargando página para asegurar actualización...');
              window.location.reload();
            }, 500);
          } catch (refreshError) {
            console.error('❌ Error en refresh, recargando página:', refreshError);
            window.location.reload();
          }
        } else {
          console.error('❌ Error del servidor:', result.message);
          toast.error(result.message);
        }
      } catch (error) {
        console.error('💥 Error actualizando cantidad de material:', error);
        toast.error('Error inesperado al actualizar material');
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

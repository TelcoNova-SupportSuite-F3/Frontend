import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addMaterialToOrderAction } from '@/lib/order-actions';
import type { MaterialResponse } from '@/types/orders';

interface UseAddMaterialReturn {
  searchTerm: string;
  selectedMaterial: MaterialResponse | null;
  quantity: string;
  isPending: boolean;
  setSearchTerm: (value: string) => void;
  setSelectedMaterial: (material: MaterialResponse | null) => void;
  setQuantity: (value: string) => void;
  handleAddMaterial: () => void;
  canAdd: boolean;
  clearForm: () => void;
}

export function useAddMaterial(orderId: string): UseAddMaterialReturn {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialResponse | null>(null);
  const [quantity, setQuantity] = useState('');
  const [isPending, startTransition] = useTransition();

  const canAdd = !!(selectedMaterial && quantity.trim() && !isPending);

  const clearForm = () => {
    setSearchTerm('');
    setSelectedMaterial(null);
    setQuantity('');
  };

  const handleAddMaterial = () => {
    if (!selectedMaterial) {
      toast.error('Por favor selecciona un material de la lista');
      return;
    }

    if (!quantity.trim()) {
      toast.error('Por favor ingresa la cantidad');
      return;
    }

    const requestedQuantity = parseInt(quantity);

    // Validación de cantidad numérica
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      toast.error('La cantidad debe ser un número mayor a 0');
      return;
    }

    // Validación de stock disponible
    if (requestedQuantity > selectedMaterial.stockDisponible) {
      toast.error(
        `Stock insuficiente. Disponible: ${selectedMaterial.stockDisponible} ${selectedMaterial.unidadMedida}`,
        {
          description: `Solo puedes agregar hasta ${selectedMaterial.stockDisponible} unidades de ${selectedMaterial.nombre}`,
          duration: 5000,
        }
      );
      return;
    }

    // Validación de material activo
    if (!selectedMaterial.activo) {
      toast.error('Este material no está activo y no puede ser agregado');
      return;
    }

    console.log('🚀 Agregando material:', {
      orderId,
      materialId: selectedMaterial.id,
      nombre: selectedMaterial.nombre,
      cantidad: requestedQuantity,
      stockDisponible: selectedMaterial.stockDisponible,
    });

    startTransition(async () => {
      try {
        // Llamar al server action con el formato correcto
        const result = await addMaterialToOrderAction(Number(orderId), {
          materialId: selectedMaterial.id,
          cantidad: requestedQuantity,
        });

        if (result.success) {
          toast.success(result.message, {
            description: `${requestedQuantity} ${selectedMaterial.unidadMedida} de ${selectedMaterial.nombre}`,
          });
          clearForm();

          // Forzar refresh de la página para mostrar el material agregado
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('💥 Error agregando material:', error);
        toast.error('Error inesperado al agregar material');
      }
    });
  };

  return {
    searchTerm,
    selectedMaterial,
    quantity,
    isPending,
    setSearchTerm,
    setSelectedMaterial,
    setQuantity,
    handleAddMaterial,
    canAdd,
    clearForm,
  };
}

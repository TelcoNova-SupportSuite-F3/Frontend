import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateMaterial } from '@/lib/order-actions';
import type { Material } from '@/lib/order-actions/types';

interface UseEditMaterialReturn {
  isEditModalOpen: boolean;
  editingMaterial: Material | null;
  editName: string;
  editQuantity: string;
  isPending: boolean;
  openEditModal: (material: Material) => void;
  closeEditModal: () => void;
  setEditName: (value: string) => void;
  setEditQuantity: (value: string) => void;
  handleUpdateMaterial: () => void;
  canUpdate: boolean;
}

export function useEditMaterial(): UseEditMaterialReturn {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [isPending, startTransition] = useTransition();

  const canUpdate = !!(editName.trim() && editQuantity.trim() && !isPending);

  const openEditModal = (material: Material) => {
    setEditingMaterial(material);
    setEditName(material.name);
    setEditQuantity(material.quantity.toString());
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMaterial(null);
    setEditName('');
    setEditQuantity('');
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial || !editName.trim() || !editQuantity.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const newQuantity = parseInt(editQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error('La cantidad debe ser un número válido');
      return;
    }

    console.log('🚀 Actualizando material:', {
      id: editingMaterial.id,
      editName,
      newQuantity,
    });

    startTransition(async () => {
      try {
        const result = await updateMaterial(
          editingMaterial.id,
          editName.trim(),
          newQuantity
        );

        if (result.success) {
          toast.success(result.message);
          closeEditModal();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('💥 Error actualizando material:', error);
        toast.error('Error inesperado al actualizar material');
      }
    });
  };

  return {
    isEditModalOpen,
    editingMaterial,
    editName,
    editQuantity,
    isPending,
    openEditModal,
    closeEditModal,
    setEditName,
    setEditQuantity,
    handleUpdateMaterial,
    canUpdate,
  };
}

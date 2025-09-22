'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from '@/lib/order-actions';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  quantity: number;
}

interface MaterialsSectionProps {
  materials: Material[];
}

export default function MaterialsSectionClient({
  materials,
}: MaterialsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isPending, startTransition] = useTransition();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const handleAddMaterial = () => {
    if (!searchTerm.trim() || !quantity.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    console.log('🚀 Agregando material:', { searchTerm, quantity });

    startTransition(async () => {
      try {
        const result = await addMaterial(searchTerm.trim(), quantity.trim());

        if (result.success) {
          toast.success(result.message);
          setSearchTerm('');
          setQuantity('');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('💥 Error agregando material:', error);
        toast.error('Error inesperado al agregar material');
      }
    });
  };

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

  const handleDeleteMaterial = (id: string) => {
    console.log('🚀 Eliminando material:', id);

    startTransition(async () => {
      try {
        const result = await deleteMaterial(id);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('💥 Error eliminando material:', error);
        toast.error('Error inesperado al eliminar material');
      }
    });
  };

  return (
    <Card className='bg-blue-50'>
      <CardContent className='p-6 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='search' className='text-sm font-medium'>
              Búsqueda
            </Label>
            <Input
              id='search'
              placeholder='Nombre del material'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quantity' className='text-sm font-medium'>
              Cantidad
            </Label>
            <Input
              id='quantity'
              placeholder='0'
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min='0'
              disabled={isPending}
            />
          </div>
        </div>
        <Button
          onClick={handleAddMaterial}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          disabled={isPending || !searchTerm.trim() || !quantity.trim()}
        >
          {isPending ? 'Agregando...' : 'Agregar'}
        </Button>

        <div className='bg-white rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-blue-600'>
                <TableHead className='font-semibold text-white text-center'>
                  Material
                </TableHead>
                <TableHead className='font-semibold text-white text-center'>
                  Cantidad
                </TableHead>
                <TableHead className='font-semibold text-white text-center'>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='text-center py-8 text-gray-500'
                  >
                    No hay materiales agregados
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((material) => (
                  <TableRow key={material.id} className='hover:bg-gray-50'>
                    <TableCell className='text-center'>
                      {material.name}
                    </TableCell>
                    <TableCell className='text-center'>
                      {material.quantity}
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex space-x-2 justify-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                          onClick={() => openEditModal(material)}
                          disabled={isPending}
                          title='Actualizar'
                        >
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700'
                          onClick={() => handleDeleteMaterial(material.id)}
                          disabled={isPending}
                          title='Eliminar'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {isPending && (
          <div className='text-sm text-blue-600 text-center'>Procesando...</div>
        )}
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
            <DialogDescription>
              Actualiza el nombre y la cantidad del material seleccionado.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-name' className='text-right'>
                Material:
              </Label>
              <Input
                id='edit-name'
                type='text'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className='col-span-3'
                placeholder='Nombre del material'
                disabled={isPending}
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-quantity' className='text-right'>
                Cantidad:
              </Label>
              <Input
                id='edit-quantity'
                type='number'
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                className='col-span-3'
                placeholder='Cantidad'
                min='0'
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={closeEditModal}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateMaterial}
              disabled={isPending || !editName.trim() || !editQuantity.trim()}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {isPending ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

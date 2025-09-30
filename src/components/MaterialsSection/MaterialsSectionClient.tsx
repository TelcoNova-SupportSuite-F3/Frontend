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
import { useAddMaterial } from '@/hooks/useAddMaterial';
import { useEditMaterial } from '@/hooks/useEditMaterial';
import { useDeleteMaterial } from '@/hooks/useDeleteMaterial';
import { useSearchMaterials } from '@/hooks/useSearchMaterials';
import MaterialSearchInput from '@/components/MaterialSearchInput/MaterialSearchInput';
import type {
  MaterialUtilizadoResponse,
  MaterialResponse,
} from '@/types/orders';
import { useEffect } from 'react';

interface MaterialsSectionProps {
  materialesUtilizados: MaterialUtilizadoResponse[];
  orderId: string;
}

export default function MaterialsSectionClient({
  materialesUtilizados,
  orderId,
}: MaterialsSectionProps) {
  // Hooks especializados para cada operación
  const addMaterial = useAddMaterial(orderId);
  const editMaterial = useEditMaterial();
  const deleteMaterial = useDeleteMaterial();
  const searchMaterials = useSearchMaterials();

  // Combinar estados de loading para deshabilitar acciones
  const isPending =
    addMaterial.isPending || editMaterial.isPending || deleteMaterial.isPending;

  // Búsqueda automática cuando el término cambia
  useEffect(() => {
    if (addMaterial.searchTerm.length >= 3) {
      const timeoutId = setTimeout(() => {
        searchMaterials.performSearch(addMaterial.searchTerm);
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    } else {
      searchMaterials.clearSearch();
    }
  }, [addMaterial.searchTerm]);

  const handleMaterialSelect = (material: MaterialResponse) => {
    console.log('✅ Material seleccionado:', material);
    addMaterial.setSearchTerm(material.nombre);
    addMaterial.setSelectedMaterial(material);
    searchMaterials.clearSearch();
  };

  const handleSearchValueChange = (value: string) => {
    addMaterial.setSearchTerm(value);

    // Si el usuario está escribiendo, limpiar la selección actual
    if (
      addMaterial.selectedMaterial &&
      value !== addMaterial.selectedMaterial.nombre
    ) {
      addMaterial.setSelectedMaterial(null);
    }

    // Realizar búsqueda si hay 3+ caracteres
    if (value.length >= 3) {
      searchMaterials.performSearch(value);
    } else {
      searchMaterials.clearSearch();
    }
  };

  return (
    <Card className='bg-blue-50'>
      <CardContent className='p-6 space-y-4'>
        {/* Formulario de agregar material */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Campo de búsqueda con autocompletado */}
          <MaterialSearchInput
            value={addMaterial.searchTerm}
            onValueChange={handleSearchValueChange}
            onMaterialSelect={handleMaterialSelect}
            searchResults={searchMaterials.searchResults}
            isSearching={searchMaterials.isSearching}
            searchError={searchMaterials.searchError}
            disabled={isPending}
          />

          {/* Campo de cantidad */}
          <div className='space-y-2'>
            <Label htmlFor='quantity' className='text-sm font-medium'>
              Cantidad
              {addMaterial.selectedMaterial && (
                <span className='text-xs text-gray-500 ml-2'>
                  (Máx: {addMaterial.selectedMaterial.stockDisponible}{' '}
                  {addMaterial.selectedMaterial.unidadMedida})
                </span>
              )}
            </Label>
            <Input
              id='quantity'
              placeholder='0'
              type='number'
              value={addMaterial.quantity}
              onChange={(e) => addMaterial.setQuantity(e.target.value)}
              min='1'
              max={addMaterial.selectedMaterial?.stockDisponible}
              disabled={isPending || !addMaterial.selectedMaterial}
              className='w-full'
            />
          </div>
        </div>

        {/* Información del material seleccionado */}
        {addMaterial.selectedMaterial && (
          <div className='bg-blue-100 border border-blue-200 rounded-lg p-3 text-sm'>
            <p className='font-medium text-blue-900'>
              {addMaterial.selectedMaterial.nombre}
            </p>
            <p className='text-blue-700 text-xs mt-1'>
              Código: {addMaterial.selectedMaterial.codigo} | Stock disponible:{' '}
              {addMaterial.selectedMaterial.stockDisponible}{' '}
              {addMaterial.selectedMaterial.unidadMedida}
            </p>
          </div>
        )}

        <Button
          onClick={addMaterial.handleAddMaterial}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          disabled={!addMaterial.canAdd || isPending}
        >
          {addMaterial.isPending ? 'Agregando...' : 'Agregar Material'}
        </Button>

        {/* Tabla de materiales */}
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
              {materialesUtilizados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='text-center py-8 text-gray-500'
                  >
                    No hay materiales agregados
                  </TableCell>
                </TableRow>
              ) : (
                materialesUtilizados.map((materialUtilizado) => (
                  <TableRow
                    key={materialUtilizado.id}
                    className='hover:bg-gray-50'
                  >
                    <TableCell className='text-center'>
                      {materialUtilizado.nombreMaterial}
                    </TableCell>
                    <TableCell className='text-center'>
                      {materialUtilizado.cantidadUtilizada}{' '}
                      {materialUtilizado.unidadMedida}
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex space-x-2 justify-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-gray-400 cursor-not-allowed'
                          disabled={true}
                          title='Edición no disponible actualmente'
                        >
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-gray-400 cursor-not-allowed'
                          disabled={true}
                          title='Eliminación no disponible actualmente'
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

        {/* Indicador de loading */}
        {isPending && (
          <div className='text-sm text-blue-600 text-center'>Procesando...</div>
        )}
      </CardContent>

      {/* Modal de edición */}
      <Dialog
        open={editMaterial.isEditModalOpen}
        onOpenChange={editMaterial.closeEditModal}
      >
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
                value={editMaterial.editName}
                onChange={(e) => editMaterial.setEditName(e.target.value)}
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
                value={editMaterial.editQuantity}
                onChange={(e) => editMaterial.setEditQuantity(e.target.value)}
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
              onClick={editMaterial.closeEditModal}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={editMaterial.handleUpdateMaterial}
              disabled={!editMaterial.canUpdate || isPending}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {editMaterial.isPending ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

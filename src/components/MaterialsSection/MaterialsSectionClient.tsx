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
  EstadoOrden,
} from '@/types/orders';
import { ESTADO_ORDEN } from '@/types/orders';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  MATERIALS_SECTION_TEXTS,
  MATERIALS_SECTION_STYLES,
  MATERIALS_SECTION_CONFIG,
} from './materials-section.constants';

/**
 * Props para MaterialsSectionClient
 */
interface MaterialsSectionProps {
  /** Lista de materiales utilizados en la orden */
  materialesUtilizados: MaterialUtilizadoResponse[];
  /** ID de la orden de trabajo */
  orderId: string;
  /** Estado actual de la orden */
  orderEstado: EstadoOrden;
}

/**
 * MaterialsSectionClient Component
 *
 * Componente cliente para gestionar materiales de una orden de trabajo.
 * Sigue los principios SOLID:
 * - Single Responsibility: Coordina la gestión de materiales
 * - Dependency Inversion: Usa hooks especializados para cada operación
 * - Open/Closed: Configurable a través de constantes
 *
 * @example
 * ```tsx
 * <MaterialsSectionClient
 *   materialesUtilizados={materials}
 *   orderId="123"
 * />
 * ```
 */
export default function MaterialsSectionClient({
  materialesUtilizados,
  orderId,
  orderEstado,
}: MaterialsSectionProps) {
  // Determinar si se pueden editar materiales (solo en estado EN_PROCESO)
  const canEditMaterials = orderEstado === ESTADO_ORDEN.EN_PROCESO;

  // Hooks especializados para cada operación
  const addMaterial = useAddMaterial(orderId, orderEstado);
  const editMaterial = useEditMaterial(orderId, orderEstado);
  const deleteMaterial = useDeleteMaterial(orderId, orderEstado);
  const searchMaterials = useSearchMaterials();

  // Combinar estados de loading para deshabilitar acciones
  const isPending =
    addMaterial.isPending || editMaterial.isPending || deleteMaterial.isPending;

  // Búsqueda automática cuando el término cambia
  useEffect(() => {
    if (addMaterial.searchTerm.length >= 3) {
      const timeoutId = setTimeout(() => {
        searchMaterials.performSearch(addMaterial.searchTerm);
      }, MATERIALS_SECTION_CONFIG.DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    } else {
      searchMaterials.clearSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addMaterial.searchTerm,
    searchMaterials.performSearch,
    searchMaterials.clearSearch,
  ]);

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
    <Card className={cn(MATERIALS_SECTION_STYLES.CARD)}>
      <CardContent className={cn(MATERIALS_SECTION_STYLES.CARD_CONTENT)}>
        {/* Formulario de agregar material */}
        <div className={cn(MATERIALS_SECTION_STYLES.FORM_GRID)}>
          {/* Campo de búsqueda con autocompletado */}
          <MaterialSearchInput
            value={addMaterial.searchTerm}
            onValueChange={handleSearchValueChange}
            onMaterialSelect={handleMaterialSelect}
            searchResults={searchMaterials.searchResults}
            isSearching={searchMaterials.isSearching}
            searchError={searchMaterials.searchError}
            disabled={!canEditMaterials || isPending}
          />

          {/* Campo de cantidad */}
          <div className={cn(MATERIALS_SECTION_STYLES.FIELD_CONTAINER)}>
            <Label
              htmlFor='quantity'
              className={cn(MATERIALS_SECTION_STYLES.LABEL)}
            >
              {MATERIALS_SECTION_TEXTS.QUANTITY_LABEL}
              {addMaterial.selectedMaterial && (
                <span className={cn(MATERIALS_SECTION_STYLES.LABEL_HINT)}>
                  {MATERIALS_SECTION_TEXTS.QUANTITY_MAX_HINT(
                    addMaterial.selectedMaterial.stockDisponible,
                    addMaterial.selectedMaterial.unidadMedida
                  )}
                </span>
              )}
            </Label>
            <Input
              id='quantity'
              placeholder={MATERIALS_SECTION_TEXTS.QUANTITY_PLACEHOLDER}
              type='number'
              value={addMaterial.quantity}
              onChange={(e) => addMaterial.setQuantity(e.target.value)}
              min={MATERIALS_SECTION_CONFIG.MIN_QUANTITY}
              max={addMaterial.selectedMaterial?.stockDisponible}
              disabled={!canEditMaterials || isPending || !addMaterial.selectedMaterial}
              className={cn(MATERIALS_SECTION_STYLES.INPUT)}
            />
          </div>
        </div>

        {/* Información del material seleccionado */}
        {addMaterial.selectedMaterial && (
          <div className={cn(MATERIALS_SECTION_STYLES.SELECTED_INFO)}>
            <p className={cn(MATERIALS_SECTION_STYLES.SELECTED_NAME)}>
              {addMaterial.selectedMaterial.nombre}
            </p>
            <p className={cn(MATERIALS_SECTION_STYLES.SELECTED_DETAILS)}>
              {MATERIALS_SECTION_TEXTS.SELECTED_MATERIAL_CODE}{' '}
              {addMaterial.selectedMaterial.codigo} |{' '}
              {MATERIALS_SECTION_TEXTS.SELECTED_MATERIAL_STOCK}{' '}
              {addMaterial.selectedMaterial.stockDisponible}{' '}
              {addMaterial.selectedMaterial.unidadMedida}
            </p>
          </div>
        )}

        <Button
          onClick={addMaterial.handleAddMaterial}
          className={cn(MATERIALS_SECTION_STYLES.ADD_BUTTON)}
          disabled={!canEditMaterials || !addMaterial.canAdd || isPending}
          title={!canEditMaterials ? MATERIALS_SECTION_TEXTS.DISABLED_STATE_TOOLTIP : ''}
        >
          {addMaterial.isPending
            ? MATERIALS_SECTION_TEXTS.ADD_BUTTON_LOADING
            : MATERIALS_SECTION_TEXTS.ADD_BUTTON}
        </Button>

        {/* Tabla de materiales */}
        <div className={cn(MATERIALS_SECTION_STYLES.TABLE_CONTAINER)}>
          <Table role="table" aria-label="Materiales utilizados en la orden">
            <TableHeader>
              <TableRow className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER)}>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
                  scope="col"
                >
                  {MATERIALS_SECTION_TEXTS.TABLE_HEADER_MATERIAL}
                </TableHead>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
                  scope="col"
                >
                  {MATERIALS_SECTION_TEXTS.TABLE_HEADER_QUANTITY}
                </TableHead>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
                  scope="col"
                >
                  {MATERIALS_SECTION_TEXTS.TABLE_HEADER_ACTIONS}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialesUtilizados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className={cn(MATERIALS_SECTION_STYLES.TABLE_CELL_EMPTY)}
                  >
                    {MATERIALS_SECTION_TEXTS.TABLE_EMPTY}
                  </TableCell>
                </TableRow>
              ) : (
                materialesUtilizados.map((materialUtilizado) => (
                  <TableRow
                    key={materialUtilizado.id}
                    className={cn(MATERIALS_SECTION_STYLES.TABLE_ROW)}
                  >
                    <TableCell
                      className={cn(MATERIALS_SECTION_STYLES.TABLE_CELL)}
                    >
                      {materialUtilizado.nombreMaterial}
                    </TableCell>
                    <TableCell
                      className={cn(MATERIALS_SECTION_STYLES.TABLE_CELL)}
                    >
                      {materialUtilizado.cantidadUtilizada}{' '}
                      {materialUtilizado.unidadMedida}
                    </TableCell>
                    <TableCell
                      className={cn(MATERIALS_SECTION_STYLES.TABLE_CELL)}
                    >
                      <div
                        className={cn(MATERIALS_SECTION_STYLES.TABLE_ACTIONS)}
                      >
                        <Button
                          variant='ghost'
                          size='sm'
                          className={cn(
                            MATERIALS_SECTION_STYLES.ACTION_BUTTON_BASE,
                            !canEditMaterials && MATERIALS_SECTION_STYLES.ACTION_BUTTON_DISABLED,
                            canEditMaterials && 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          )}
                          disabled={!canEditMaterials || isPending}
                          onClick={() => editMaterial.openEditModal(materialUtilizado)}
                          title={
                            canEditMaterials
                              ? MATERIALS_SECTION_TEXTS.EDIT_BUTTON_TOOLTIP
                              : MATERIALS_SECTION_TEXTS.EDIT_DISABLED_TOOLTIP
                          }
                          aria-label={`Editar material ${materialUtilizado.nombreMaterial}`}
                        >
                          <Edit2
                            className={cn(MATERIALS_SECTION_STYLES.ACTION_ICON)}
                            aria-hidden="true"
                          />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className={cn(
                            MATERIALS_SECTION_STYLES.ACTION_BUTTON_BASE,
                            !canEditMaterials && MATERIALS_SECTION_STYLES.ACTION_BUTTON_DISABLED,
                            canEditMaterials && 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          )}
                          disabled={!canEditMaterials || isPending}
                          onClick={() => deleteMaterial.handleDeleteMaterial(materialUtilizado.id)}
                          title={
                            canEditMaterials
                              ? MATERIALS_SECTION_TEXTS.DELETE_BUTTON_TOOLTIP
                              : MATERIALS_SECTION_TEXTS.DELETE_DISABLED_TOOLTIP
                          }
                          aria-label={`Eliminar material ${materialUtilizado.nombreMaterial}`}
                        >
                          <Trash2
                            className={cn(MATERIALS_SECTION_STYLES.ACTION_ICON)}
                            aria-hidden="true"
                          />
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
          <div className={cn(MATERIALS_SECTION_STYLES.LOADING_TEXT)}>
            {MATERIALS_SECTION_TEXTS.PROCESSING}
          </div>
        )}
      </CardContent>

      {/* Modal de edición */}
      <Dialog
        open={editMaterial.isEditModalOpen}
        onOpenChange={editMaterial.closeEditModal}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {MATERIALS_SECTION_TEXTS.EDIT_MODAL_TITLE}
            </DialogTitle>
            <DialogDescription>
              {MATERIALS_SECTION_TEXTS.EDIT_MODAL_DESCRIPTION}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor='edit-name' className="text-sm font-medium">
                {MATERIALS_SECTION_TEXTS.EDIT_MODAL_MATERIAL_LABEL}
              </Label>
              <Input
                id='edit-name'
                type='text'
                value={editMaterial.editName}
                className="bg-gray-50"
                disabled={true}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor='edit-quantity' className="text-sm font-medium">
                  {MATERIALS_SECTION_TEXTS.EDIT_MODAL_QUANTITY_LABEL}
                </Label>
                <span className='text-xs text-gray-500'>
                  {MATERIALS_SECTION_TEXTS.EDIT_MODAL_QUANTITY_HINT(
                    editMaterial.currentQuantity,
                    editMaterial.unidadMedida
                  )}
                </span>
              </div>
              <Input
                id='edit-quantity'
                type='number'
                value={editMaterial.editQuantity}
                onChange={(e) => editMaterial.setEditQuantity(e.target.value)}
                placeholder={
                  MATERIALS_SECTION_TEXTS.EDIT_MODAL_QUANTITY_PLACEHOLDER
                }
                min={editMaterial.currentQuantity}
                max={editMaterial.currentQuantity + editMaterial.stockDisponible}
                disabled={isPending}
              />
              {editMaterial.stockDisponible > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 Stock disponible: <span className="font-semibold">{editMaterial.stockDisponible} {editMaterial.unidadMedida}</span>
                  {' '}(Máximo total: {editMaterial.currentQuantity + editMaterial.stockDisponible} {editMaterial.unidadMedida})
                </p>
              )}
              {editMaterial.stockDisponible === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ No hay stock adicional disponible. Solo puedes mantener la cantidad actual.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={editMaterial.closeEditModal}
              disabled={isPending}
            >
              {MATERIALS_SECTION_TEXTS.EDIT_MODAL_CANCEL}
            </Button>
            <Button
              onClick={editMaterial.handleUpdateMaterial}
              disabled={!editMaterial.canUpdate || isPending}
              className={cn(MATERIALS_SECTION_STYLES.MODAL_BUTTON_UPDATE)}
            >
              {editMaterial.isPending
                ? MATERIALS_SECTION_TEXTS.EDIT_MODAL_UPDATING
                : MATERIALS_SECTION_TEXTS.EDIT_MODAL_UPDATE}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

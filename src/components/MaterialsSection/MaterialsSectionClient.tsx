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
      }, MATERIALS_SECTION_CONFIG.DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    } else {
      searchMaterials.clearSearch();
    }
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
            disabled={isPending}
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
              disabled={isPending || !addMaterial.selectedMaterial}
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
          disabled={!addMaterial.canAdd || isPending}
        >
          {addMaterial.isPending
            ? MATERIALS_SECTION_TEXTS.ADD_BUTTON_LOADING
            : MATERIALS_SECTION_TEXTS.ADD_BUTTON}
        </Button>

        {/* Tabla de materiales */}
        <div className={cn(MATERIALS_SECTION_STYLES.TABLE_CONTAINER)}>
          <Table>
            <TableHeader>
              <TableRow className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER)}>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
                >
                  {MATERIALS_SECTION_TEXTS.TABLE_HEADER_MATERIAL}
                </TableHead>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
                >
                  {MATERIALS_SECTION_TEXTS.TABLE_HEADER_QUANTITY}
                </TableHead>
                <TableHead
                  className={cn(MATERIALS_SECTION_STYLES.TABLE_HEADER_CELL)}
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
                            MATERIALS_SECTION_STYLES.ACTION_BUTTON_DISABLED
                          )}
                          disabled={true}
                          title={MATERIALS_SECTION_TEXTS.EDIT_BUTTON_TOOLTIP}
                        >
                          <Edit2
                            className={cn(MATERIALS_SECTION_STYLES.ACTION_ICON)}
                          />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className={cn(
                            MATERIALS_SECTION_STYLES.ACTION_BUTTON_BASE,
                            MATERIALS_SECTION_STYLES.ACTION_BUTTON_DISABLED
                          )}
                          disabled={true}
                          title={MATERIALS_SECTION_TEXTS.DELETE_BUTTON_TOOLTIP}
                        >
                          <Trash2
                            className={cn(MATERIALS_SECTION_STYLES.ACTION_ICON)}
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

          <div className={cn(MATERIALS_SECTION_STYLES.MODAL_FORM_GRID)}>
            <div className={cn(MATERIALS_SECTION_STYLES.MODAL_FIELD_GRID)}>
              <Label
                htmlFor='edit-name'
                className={cn(MATERIALS_SECTION_STYLES.MODAL_LABEL)}
              >
                {MATERIALS_SECTION_TEXTS.EDIT_MODAL_MATERIAL_LABEL}
              </Label>
              <Input
                id='edit-name'
                type='text'
                value={editMaterial.editName}
                onChange={(e) => editMaterial.setEditName(e.target.value)}
                className={cn(MATERIALS_SECTION_STYLES.MODAL_INPUT)}
                placeholder={
                  MATERIALS_SECTION_TEXTS.EDIT_MODAL_NAME_PLACEHOLDER
                }
                disabled={isPending}
              />
            </div>

            <div className={cn(MATERIALS_SECTION_STYLES.MODAL_FIELD_GRID)}>
              <Label
                htmlFor='edit-quantity'
                className={cn(MATERIALS_SECTION_STYLES.MODAL_LABEL)}
              >
                {MATERIALS_SECTION_TEXTS.EDIT_MODAL_QUANTITY_LABEL}
              </Label>
              <Input
                id='edit-quantity'
                type='number'
                value={editMaterial.editQuantity}
                onChange={(e) => editMaterial.setEditQuantity(e.target.value)}
                className={cn(MATERIALS_SECTION_STYLES.MODAL_INPUT)}
                placeholder={
                  MATERIALS_SECTION_TEXTS.EDIT_MODAL_QUANTITY_PLACEHOLDER
                }
                min={MATERIALS_SECTION_CONFIG.MIN_QUANTITY_MODAL}
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

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import type { MaterialResponse } from '@/types/orders';

interface MaterialSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onMaterialSelect: (material: MaterialResponse) => void;
  searchResults: MaterialResponse[];
  isSearching: boolean;
  searchError: string | null;
  disabled?: boolean;
  placeholder?: string;
}

export default function MaterialSearchInput({
  value,
  onValueChange,
  onMaterialSelect,
  searchResults,
  isSearching,
  searchError,
  disabled = false,
  placeholder = 'Buscar material (mín. 3 letras)',
}: MaterialSearchInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mostrar dropdown cuando hay resultados o error
  useEffect(() => {
    if (value.length >= 3 && (searchResults.length > 0 || searchError)) {
      setIsDropdownOpen(true);
    } else if (value.length < 3) {
      setIsDropdownOpen(false);
    }
  }, [searchResults, searchError, value]);

  const handleInputChange = (newValue: string) => {
    onValueChange(newValue);
    setHighlightedIndex(-1);

    if (newValue.length < 3) {
      setIsDropdownOpen(false);
    }
  };

  const handleSelectMaterial = (material: MaterialResponse) => {
    onMaterialSelect(material);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectMaterial(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const showMinimumCharsHint = value.length > 0 && value.length < 3;
  const showSearching = isSearching && value.length >= 3;
  const showResults =
    !isSearching && searchResults.length > 0 && isDropdownOpen;
  const showError = !isSearching && searchError && isDropdownOpen;
  const showNoResults =
    !isSearching &&
    searchResults.length === 0 &&
    value.length >= 3 &&
    isDropdownOpen &&
    !searchError;

  return (
    <div className='space-y-2 relative'>
      <Label htmlFor='material-search' className='text-sm font-medium'>
        Búsqueda de Material
      </Label>

      <div className='relative'>
        {/* Input */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            ref={inputRef}
            id='material-search'
            type='text'
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (value.length >= 3 && searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'pl-10 pr-10',
              showMinimumCharsHint &&
                'border-yellow-300 focus:border-yellow-400'
            )}
          />
          {showSearching && (
            <Loader2 className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin' />
          )}
        </div>

        {/* Hint de mínimo de caracteres */}
        {showMinimumCharsHint && (
          <p className='text-xs text-yellow-600 mt-1'>
            Escribe al menos {3 - value.length} caracteres más para buscar
          </p>
        )}

        {/* Dropdown con resultados */}
        {(showResults || showError || showNoResults) && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto'
            )}
          >
            {/* Resultados */}
            {showResults && (
              <ul className='py-1'>
                {searchResults.map((material, index) => (
                  <li
                    key={material.id}
                    onClick={() => handleSelectMaterial(material)}
                    className={cn(
                      'px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0',
                      highlightedIndex === index
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50',
                      !material.activo && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex-1'>
                        <p className='font-medium text-sm text-gray-900'>
                          {material.nombre}
                        </p>
                        <p className='text-xs text-gray-500 mt-0.5'>
                          Código: {material.codigo}
                        </p>
                        {material.descripcion && (
                          <p className='text-xs text-gray-400 mt-1 line-clamp-2'>
                            {material.descripcion}
                          </p>
                        )}
                      </div>
                      <div className='ml-4 text-right flex-shrink-0'>
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            material.stockDisponible > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          Stock: {material.stockDisponible}
                        </p>
                        <p className='text-xs text-gray-500 mt-0.5'>
                          {material.unidadMedida}
                        </p>
                      </div>
                    </div>
                    {!material.activo && (
                      <p className='text-xs text-red-500 mt-1'>
                        Material inactivo
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Error */}
            {showError && (
              <div className='px-4 py-3 flex items-center gap-2 text-red-600'>
                <AlertCircle className='h-4 w-4 flex-shrink-0' />
                <p className='text-sm'>{searchError}</p>
              </div>
            )}

            {/* Sin resultados */}
            {showNoResults && (
              <div className='px-4 py-3 text-center text-gray-500'>
                <p className='text-sm'>No se encontraron materiales</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

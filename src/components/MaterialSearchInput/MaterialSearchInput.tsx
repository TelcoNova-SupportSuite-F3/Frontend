'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import type { MaterialResponse } from '@/types/orders';
import {
  MATERIAL_SEARCH_CONFIG,
  MATERIAL_SEARCH_TEXTS,
  MATERIAL_SEARCH_STYLES,
  getStockStyle,
} from './material-search.constants';

/**
 * Props para el componente MaterialSearchInput
 */
interface MaterialSearchInputProps {
  /** Valor actual del input de búsqueda */
  value: string;
  /** Callback cuando cambia el valor del input */
  onValueChange: (value: string) => void;
  /** Callback cuando se selecciona un material */
  onMaterialSelect: (material: MaterialResponse) => void;
  /** Resultados de la búsqueda */
  searchResults: MaterialResponse[];
  /** Si está buscando actualmente */
  isSearching: boolean;
  /** Error de búsqueda */
  searchError: string | null;
  /** Si el input está deshabilitado */
  disabled?: boolean;
  /** Placeholder personalizado */
  placeholder?: string;
  /** Label personalizado */
  label?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * MaterialSearchInput Component
 *
 * Componente de búsqueda de materiales con autocompletado.
 * Sigue los principios SOLID:
 * - Single Responsibility: Solo maneja la UI de búsqueda
 * - Open/Closed: Configurable a través de props
 * - Dependency Inversion: Recibe datos y callbacks desde el exterior
 *
 * @example
 * ```tsx
 * <MaterialSearchInput
 *   value={searchTerm}
 *   onValueChange={setSearchTerm}
 *   onMaterialSelect={handleSelect}
 *   searchResults={results}
 *   isSearching={loading}
 *   searchError={error}
 * />
 * ```
 */
export default function MaterialSearchInput({
  value,
  onValueChange,
  onMaterialSelect,
  searchResults,
  isSearching,
  searchError,
  disabled = false,
  placeholder = MATERIAL_SEARCH_TEXTS.PLACEHOLDER,
  label = MATERIAL_SEARCH_TEXTS.LABEL,
  className,
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
    const minLength = MATERIAL_SEARCH_CONFIG.MIN_SEARCH_LENGTH;
    if (
      value.length >= minLength &&
      (searchResults.length > 0 || searchError)
    ) {
      setIsDropdownOpen(true);
    } else if (value.length < minLength) {
      setIsDropdownOpen(false);
    }
  }, [searchResults, searchError, value]);

  const handleInputChange = (newValue: string) => {
    onValueChange(newValue);
    setHighlightedIndex(-1);

    if (newValue.length < MATERIAL_SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
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

  // Estados calculados para renderizado condicional
  const minLength = MATERIAL_SEARCH_CONFIG.MIN_SEARCH_LENGTH;
  const showMinimumCharsHint = value.length > 0 && value.length < minLength;
  const showSearching = isSearching && value.length >= minLength;
  const showResults =
    !isSearching && searchResults.length > 0 && isDropdownOpen;
  const showError = !isSearching && searchError && isDropdownOpen;
  const showNoResults =
    !isSearching &&
    searchResults.length === 0 &&
    value.length >= minLength &&
    isDropdownOpen &&
    !searchError;
  const remainingChars = minLength - value.length;

  return (
    <div className={cn(MATERIAL_SEARCH_STYLES.CONTAINER, className)}>
      <Label htmlFor='material-search' className={MATERIAL_SEARCH_STYLES.LABEL}>
        {label}
      </Label>

      <div className={MATERIAL_SEARCH_STYLES.INPUT_WRAPPER}>
        {/* Input */}
        <div className={MATERIAL_SEARCH_STYLES.INPUT_ICON_WRAPPER}>
          <Search className={MATERIAL_SEARCH_STYLES.SEARCH_ICON} />
          <Input
            ref={inputRef}
            id='material-search'
            type='text'
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (value.length >= minLength && searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              MATERIAL_SEARCH_STYLES.INPUT,
              showMinimumCharsHint && MATERIAL_SEARCH_STYLES.INPUT_WARNING
            )}
          />
          {showSearching && (
            <Loader2 className={MATERIAL_SEARCH_STYLES.LOADER_ICON} />
          )}
        </div>

        {/* Hint de mínimo de caracteres */}
        {showMinimumCharsHint && (
          <p className={MATERIAL_SEARCH_STYLES.HINT}>
            {MATERIAL_SEARCH_TEXTS.MIN_CHARS_HINT(remainingChars)}
          </p>
        )}

        {/* Dropdown con resultados */}
        {(showResults || showError || showNoResults) && (
          <div
            ref={dropdownRef}
            className={cn(MATERIAL_SEARCH_STYLES.DROPDOWN)}
          >
            {/* Resultados */}
            {showResults && (
              <ul className={MATERIAL_SEARCH_STYLES.DROPDOWN_LIST}>
                {searchResults.map((material, index) => (
                  <li
                    key={material.id}
                    onClick={() => handleSelectMaterial(material)}
                    className={cn(
                      MATERIAL_SEARCH_STYLES.ITEM_BASE,
                      highlightedIndex === index
                        ? MATERIAL_SEARCH_STYLES.ITEM_HIGHLIGHTED
                        : MATERIAL_SEARCH_STYLES.ITEM_HOVER,
                      !material.activo && MATERIAL_SEARCH_STYLES.ITEM_INACTIVE
                    )}
                  >
                    <div className={MATERIAL_SEARCH_STYLES.ITEM_CONTENT}>
                      <div className={MATERIAL_SEARCH_STYLES.ITEM_INFO}>
                        <p className={MATERIAL_SEARCH_STYLES.ITEM_NAME}>
                          {material.nombre}
                        </p>
                        <p className={MATERIAL_SEARCH_STYLES.ITEM_CODE}>
                          {MATERIAL_SEARCH_TEXTS.CODE_LABEL} {material.codigo}
                        </p>
                        {material.descripcion && (
                          <p
                            className={MATERIAL_SEARCH_STYLES.ITEM_DESCRIPTION}
                          >
                            {material.descripcion}
                          </p>
                        )}
                      </div>
                      <div className={MATERIAL_SEARCH_STYLES.ITEM_STOCK}>
                        <p
                          className={cn(
                            getStockStyle(material.stockDisponible)
                          )}
                        >
                          {MATERIAL_SEARCH_TEXTS.STOCK_LABEL}{' '}
                          {material.stockDisponible}
                        </p>
                        <p className={MATERIAL_SEARCH_STYLES.ITEM_UNIT}>
                          {material.unidadMedida}
                        </p>
                      </div>
                    </div>
                    {!material.activo && (
                      <p className={MATERIAL_SEARCH_STYLES.ITEM_INACTIVE_TEXT}>
                        {MATERIAL_SEARCH_TEXTS.INACTIVE_MATERIAL}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Error */}
            {showError && (
              <div className={MATERIAL_SEARCH_STYLES.ERROR_CONTAINER}>
                <AlertCircle className={MATERIAL_SEARCH_STYLES.ERROR_ICON} />
                <p className={MATERIAL_SEARCH_STYLES.ERROR_TEXT}>
                  {searchError}
                </p>
              </div>
            )}

            {/* Sin resultados */}
            {showNoResults && (
              <div className={MATERIAL_SEARCH_STYLES.NO_RESULTS_CONTAINER}>
                <p className={MATERIAL_SEARCH_STYLES.NO_RESULTS_TEXT}>
                  {MATERIAL_SEARCH_TEXTS.NO_RESULTS}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

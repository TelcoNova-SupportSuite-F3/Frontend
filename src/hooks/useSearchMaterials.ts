import { useState, useCallback } from 'react';
import { searchMaterials } from '@/services/materials.service';
import type { MaterialResponse } from '@/types/orders';

/**
 * Get token from cookies (client-side)
 */
function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth-token=')
  );
  return authCookie ? authCookie.split('=')[1] : null;
}

interface UseSearchMaterialsReturn {
  searchResults: MaterialResponse[];
  isSearching: boolean;
  searchError: string | null;
  performSearch: (term: string) => Promise<void>;
  clearSearch: () => void;
}

export function useSearchMaterials(): UseSearchMaterialsReturn {
  const [searchResults, setSearchResults] = useState<MaterialResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = useCallback(async (term: string) => {
    // Solo buscar si hay al menos 3 caracteres
    if (term.length < 3) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('🔍 Buscando materiales con término:', term);

      // Get token from cookies
      const token = getTokenFromCookies();
      if (!token) {
        console.error('❌ No hay token disponible para búsqueda de materiales');
        setSearchError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const response = await searchMaterials(term, token);

      if (response.success && response.data) {
        console.log('✅ Materiales encontrados:', response.data.length);
        setSearchResults(response.data);

        if (response.data.length === 0) {
          setSearchError('No se encontraron materiales con ese nombre');
        }
      } else {
        console.log('❌ Error en búsqueda:', response.message);
        setSearchError(response.message || 'Error al buscar materiales');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('💥 Error buscando materiales:', error);
      setSearchError('Error inesperado al buscar materiales');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    performSearch,
    clearSearch,
  };
}

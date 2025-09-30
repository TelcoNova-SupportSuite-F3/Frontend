import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteMaterial } from '@/lib/order-actions';

interface UseDeleteMaterialReturn {
  isPending: boolean;
  handleDeleteMaterial: (id: string) => void;
}

export function useDeleteMaterial(): UseDeleteMaterialReturn {
  const [isPending, startTransition] = useTransition();

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

  return {
    isPending,
    handleDeleteMaterial,
  };
}

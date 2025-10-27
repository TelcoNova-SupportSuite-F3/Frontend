import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteMaterialFromOrderAction } from '@/lib/order-actions';
import type { EstadoOrden } from '@/types/orders';
import { ESTADO_ORDEN } from '@/types/orders';

interface UseDeleteMaterialReturn {
  isPending: boolean;
  canDelete: boolean;
  handleDeleteMaterial: (materialUtilizadoId: number) => void;
}

export function useDeleteMaterial(orderId: string, orderEstado: EstadoOrden): UseDeleteMaterialReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Solo se puede eliminar materiales si la orden está EN_PROCESO
  const canDelete = orderEstado === ESTADO_ORDEN.EN_PROCESO;

  const handleDeleteMaterial = (materialUtilizadoId: number) => {
    // Validar que la orden esté en estado EN_PROCESO
    if (orderEstado !== ESTADO_ORDEN.EN_PROCESO) {
      toast.error('Solo se puede editar la lista de materiales de una orden en proceso.');
      return;
    }

    console.log('🚀 Eliminando material:', { orderId, materialUtilizadoId });

    startTransition(async () => {
      try {
        const result = await deleteMaterialFromOrderAction(
          Number(orderId),
          materialUtilizadoId
        );

        if (result.success) {
          toast.success(result.message);
          // Forzar refresh de la página para mostrar cambios
          router.refresh();
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
    canDelete,
    handleDeleteMaterial,
  };
}

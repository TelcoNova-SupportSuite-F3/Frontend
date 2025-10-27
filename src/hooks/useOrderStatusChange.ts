import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OrdenTrabajoResponse, EstadoOrden } from '@/types/orders';
import {
  validateStatusChange,
  requiresConfirmation,
  isOrderClosed,
} from '@/components/OrderStatusChanger/order-status-changer.utils';
import { changeOrderStatusAction } from '@/lib/order-actions';

/**
 * Formatea una fecha al formato ISO 8601 esperado por el backend para LocalDateTime
 * Formato: "yyyy-MM-ddTHH:mm:ss"
 * Usa la zona horaria de Colombia (America/Bogota) para coincidir con el backend
 */
function formatToBackendString(date: Date): string {
  // Obtener fecha en zona horaria de Colombia
  const colombiaDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Bogota' }));

  const year = colombiaDate.getFullYear();
  const month = String(colombiaDate.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaDate.getDate()).padStart(2, '0');
  const hours = String(colombiaDate.getHours()).padStart(2, '0');
  const minutes = String(colombiaDate.getMinutes()).padStart(2, '0');
  const seconds = String(colombiaDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Convierte una fecha del formato del backend (yyyy-MM-dd HH:mm:ss) a ISO 8601
 * para poder enviarla de vuelta al backend
 */
function convertBackendDateToISO(backendDate: string | undefined): string | undefined {
  if (!backendDate) return undefined;
  // Reemplazar espacio por 'T' para convertir a ISO 8601
  return backendDate.replace(' ', 'T');
}

/**
 * Estado del hook
 */
interface UseOrderStatusChangeState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  pendingStatus: EstadoOrden | null;
  showConfirmDialog: boolean;
}

/**
 * Retorno del hook
 */
interface UseOrderStatusChangeReturn extends UseOrderStatusChangeState {
  handleStatusChange: (newStatus: EstadoOrden) => void;
  confirmStatusChange: () => Promise<void>;
  cancelStatusChange: () => void;
  clearMessages: () => void;
}

/**
 * Hook para manejar la lógica de cambio de estado de órdenes
 * Incluye validaciones, confirmación y llamada a la API
 */
export function useOrderStatusChange(
  order: OrdenTrabajoResponse,
  currentUserEmail?: string
): UseOrderStatusChangeReturn {
  const router = useRouter();
  const [state, setState] = useState<UseOrderStatusChangeState>({
    isLoading: false,
    error: null,
    success: false,
    pendingStatus: null,
    showConfirmDialog: false,
  });

  /**
   * Limpia los mensajes de error y éxito
   */
  const clearMessages = () => {
    setState((prev) => ({
      ...prev,
      error: null,
      success: false,
    }));
  };

  /**
   * Inicia el proceso de cambio de estado
   * Valida permisos y requisitos, muestra confirmación si es necesario
   */
  const handleStatusChange = (newStatus: EstadoOrden) => {
    clearMessages();

    // No hacer nada si es el mismo estado
    if (newStatus === order.estado) {
      return;
    }

    // Verificar si la orden está cerrada
    if (isOrderClosed(order)) {
      setState((prev) => ({
        ...prev,
        error: 'No se pueden modificar órdenes finalizadas o canceladas.',
      }));
      return;
    }

    // Validar el cambio de estado
    const validation = validateStatusChange(order, newStatus, currentUserEmail);

    if (!validation.isValid) {
      setState((prev) => ({
        ...prev,
        error: validation.errorMessage || 'No se puede cambiar el estado',
      }));
      return;
    }

    // Si requiere confirmación, mostrar modal
    if (requiresConfirmation(newStatus)) {
      setState((prev) => ({
        ...prev,
        pendingStatus: newStatus,
        showConfirmDialog: true,
      }));
      return;
    }

    // Si no requiere confirmación, cambiar directamente
    executeStatusChange(newStatus);
  };

  /**
   * Ejecuta el cambio de estado llamando a la API
   */
  const executeStatusChange = async (newStatus: EstadoOrden) => {
    // Validar que si se va a finalizar, la orden tenga fecha de inicio (debe estar en proceso)
    if (newStatus === 'FINALIZADA') {
      if (!order.fechaInicioTrabajo) {
        setState((prev) => ({
          ...prev,
          error: 'La orden debe estar en proceso antes de finalizarla.',
        }));
        return;
      }
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Si el estado es FINALIZADA, enviar fechas en formato ISO
      const fechaInicio = newStatus === 'FINALIZADA'
        ? convertBackendDateToISO(order.fechaInicioTrabajo)
        : undefined;
      // Generar fecha fin automáticamente en formato ISO 8601
      const fechaFin = newStatus === 'FINALIZADA'
        ? formatToBackendString(new Date())
        : undefined;

      const result = await changeOrderStatusAction(
        order.id,
        newStatus,
        fechaInicio,
        fechaFin
      );

      if (result.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          success: true,
          error: null,
          pendingStatus: null,
          showConfirmDialog: false,
        }));

        // Refrescar la página para obtener los datos actualizados del servidor
        // router.refresh() sincroniza con los Server Components y obtiene nuevos datos
        router.refresh();

        // Dar un pequeño delay y recargar si es necesario para asegurar que las fechas se actualicen
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Error al cambiar el estado',
          pendingStatus: null,
          showConfirmDialog: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        pendingStatus: null,
        showConfirmDialog: false,
      }));
    }
  };

  /**
   * Confirma el cambio de estado después de mostrar el modal
   */
  const confirmStatusChange = async () => {
    if (!state.pendingStatus) return;

    await executeStatusChange(state.pendingStatus);
  };

  /**
   * Cancela el cambio de estado y cierra el modal
   */
  const cancelStatusChange = () => {
    setState((prev) => ({
      ...prev,
      pendingStatus: null,
      showConfirmDialog: false,
    }));
  };

  return {
    ...state,
    handleStatusChange,
    confirmStatusChange,
    cancelStatusChange,
    clearMessages,
  };
}

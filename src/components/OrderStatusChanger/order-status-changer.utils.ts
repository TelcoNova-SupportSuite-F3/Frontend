import type { OrdenTrabajoResponse, EstadoOrden } from '@/types/orders';

/**
 * Resultado de validación de cambio de estado
 */
export interface StatusValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Valida si una orden tiene todos los requisitos para ser finalizada
 * Requisitos: al menos 1 evidencia (foto O comentario)
 */
export function validateFinalizarRequisitos(
  order: OrdenTrabajoResponse
): StatusValidationResult {
  // Validar que exista al menos una evidencia (foto o comentario)
  if (order.evidencias.length === 0) {
    return {
      isValid: false,
      errorMessage:
        'Debe agregar al menos una evidencia (foto o comentario) antes de finalizar la orden.',
    };
  }

  return { isValid: true };
}

/**
 * Valida si una orden tiene los requisitos mínimos para ser cancelada
 * Requisitos: al menos 1 foto o 1 comentario
 */
export function validateCancelarRequisitos(
  order: OrdenTrabajoResponse
): StatusValidationResult {
  const tieneEvidencias = order.evidencias.length > 0;

  if (!tieneEvidencias) {
    return {
      isValid: false,
      errorMessage:
        'Debe incluir una foto o un comentario para cancelar la orden.',
    };
  }

  return { isValid: true };
}

/**
 * Verifica si una orden está cerrada (finalizada o cancelada)
 */
export function isOrderClosed(order: OrdenTrabajoResponse): boolean {
  return order.estado === 'FINALIZADA' || order.estado === 'CANCELADA';
}

/**
 * Verifica si un estado específico requiere confirmación
 */
export function requiresConfirmation(estado: EstadoOrden): boolean {
  return estado === 'FINALIZADA' || estado === 'CANCELADA';
}

/**
 * Verifica si se puede cambiar de un estado a otro
 * Solo se permite cambiar desde ASIGNADA, EN_PROCESO o PAUSADA
 */
export function canTransitionFrom(estadoActual: EstadoOrden): boolean {
  const estadosPermitidos: EstadoOrden[] = ['ASIGNADA', 'EN_PROCESO', 'PAUSADA'];
  return estadosPermitidos.includes(estadoActual);
}

/**
 * Verifica si el técnico actual tiene permisos para modificar la orden
 */
export function canModifyOrder(
  order: OrdenTrabajoResponse,
  currentUserEmail?: string
): StatusValidationResult {
  if (!currentUserEmail) {
    return {
      isValid: false,
      errorMessage: 'Usuario no autenticado.',
    };
  }

  if (!order.tecnicoAsignado) {
    return {
      isValid: false,
      errorMessage: 'Esta orden no tiene un técnico asignado.',
    };
  }

  if (order.tecnicoAsignado.email !== currentUserEmail) {
    return {
      isValid: false,
      errorMessage: 'No tiene permisos para modificar esta orden.',
    };
  }

  return { isValid: true };
}

/**
 * Valida si se puede cambiar al nuevo estado solicitado
 * Incluye todas las validaciones: permisos, transición, requisitos
 */
export function validateStatusChange(
  order: OrdenTrabajoResponse,
  newStatus: EstadoOrden,
  currentUserEmail?: string
): StatusValidationResult {
  // Validar que la orden no esté cerrada
  if (isOrderClosed(order)) {
    return {
      isValid: false,
      errorMessage:
        'No se pueden modificar órdenes finalizadas o canceladas.',
    };
  }

  // Validar permisos del técnico
  const permissionCheck = canModifyOrder(order, currentUserEmail);
  if (!permissionCheck.isValid) {
    return permissionCheck;
  }

  // Validar que el estado actual permita transiciones
  if (!canTransitionFrom(order.estado)) {
    return {
      isValid: false,
      errorMessage: 'No se puede cambiar el estado desde el estado actual.',
    };
  }

  // Validar requisitos específicos según el nuevo estado
  if (newStatus === 'FINALIZADA') {
    return validateFinalizarRequisitos(order);
  }

  if (newStatus === 'CANCELADA') {
    return validateCancelarRequisitos(order);
  }

  return { isValid: true };
}

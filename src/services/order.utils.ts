import type {
  OrdenTrabajoResponse,
  OrderSummary,
  OrderFilters,
} from '@/types/orders';

/**
 * Order Utilities
 * Pure functions for order filtering, sorting, and statistics
 * Follows Single Responsibility Principle - only order data manipulation
 */

/**
 * Generates order summary statistics from orders data
 * @param orders - Array of orders
 * @returns OrderSummary - Summary statistics
 */
export function generateOrderSummary(
  orders: OrdenTrabajoResponse[]
): OrderSummary {
  const summary: OrderSummary = {
    total: orders.length,
    enProceso: 0,
    finalizadas: 0,
    asignadas: 0,
    pausadas: 0,
  };

  orders.forEach((order) => {
    switch (order.estado) {
      case 'EN_PROCESO':
        summary.enProceso++;
        break;
      case 'FINALIZADA':
        summary.finalizadas++;
        break;
      case 'ASIGNADA':
        summary.asignadas++;
        break;
      case 'PAUSADA':
        summary.pausadas++;
        break;
    }
  });

  return summary;
}

/**
 * Filters orders based on provided criteria
 * @param orders - Array of orders to filter
 * @param filters - Filter criteria
 * @returns Filtered array of orders
 */
export function filterOrders(
  orders: OrdenTrabajoResponse[],
  filters: OrderFilters
): OrdenTrabajoResponse[] {
  return orders.filter((order) => {
    if (filters.estado && order.estado !== filters.estado) {
      return false;
    }

    if (filters.prioridad && order.prioridad !== filters.prioridad) {
      return false;
    }

    if (filters.fechaDesde) {
      const orderDate = new Date(order.fechaCreacion);
      const filterDate = new Date(filters.fechaDesde);
      if (orderDate < filterDate) {
        return false;
      }
    }

    if (filters.fechaHasta) {
      const orderDate = new Date(order.fechaCreacion);
      const filterDate = new Date(filters.fechaHasta);
      if (orderDate > filterDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts orders by priority and creation date
 * Higher priority and newer orders appear first
 * @param orders - Array of orders to sort
 * @returns Sorted array of orders
 */
export function sortOrdersByPriority(
  orders: OrdenTrabajoResponse[]
): OrdenTrabajoResponse[] {
  const priorityOrder = { CRITICA: 4, ALTA: 3, MEDIA: 2, BAJA: 1 };

  return [...orders].sort((a, b) => {
    // First sort by priority (higher priority first)
    const priorityDiff =
      priorityOrder[b.prioridad] - priorityOrder[a.prioridad];
    if (priorityDiff !== 0) return priorityDiff;

    // Then sort by creation date (newer first)
    return (
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  });
}

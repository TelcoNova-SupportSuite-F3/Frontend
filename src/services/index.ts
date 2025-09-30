/**
 * Services Barrel Export
 * Central export point for all refactored services
 * Makes imports cleaner and maintains backward compatibility
 */

// Auth Service
export {
  getTokenFromCookies,
  getAuthHeaders,
  getAuthHeadersWithToken,
  clearAuthData,
  redirectToLogin,
} from './auth.service';

// HTTP Service
export {
  makeAuthenticatedClientRequest,
  makeAuthenticatedServerRequest,
  testBackendConnectivity,
} from './http.service';

// Order Service (server-side only)
export {
  fetchMyOrders,
  fetchOrderById,
  fetchOrdersByStatus,
  updateOrderStatus,
  finalizeOrder,
} from './order.service';

// Materials Service (server-side only)
export { searchMaterials, addMaterialToOrder } from './materials.service';

// Evidence Service (server-side only)
export { uploadOrderEvidence, addOrderComment } from './evidence.service';

// Order Utils
export {
  generateOrderSummary,
  filterOrders,
  sortOrdersByPriority,
} from './order.utils';

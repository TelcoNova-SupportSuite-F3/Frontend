// Configuration constants for the application

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://backendtelconova-production.up.railway.app',
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      VALIDATE: '/auth/validate',
    },
    // Órdenes de Trabajo
    ORDERS: {
      MY_ORDERS: '/ordenes/mis-ordenes',
      ALL_ORDERS: '/ordenes/todas',
      ORDER_BY_ID: (id: string | number) => `/ordenes/${id}`,
      BY_STATUS: (
        estado: 'ASIGNADA' | 'EN_PROCESO' | 'PAUSADA' | 'FINALIZADA'
      ) => `/ordenes/estado/${estado}`,
      UPDATE_STATUS: (id: string | number) => `/ordenes/${id}/estado`,
      FINALIZE: (id: string | number) => `/ordenes/${id}/finalizar`,
    },
    // Evidencias
    EVIDENCE: {
      LIST: (ordenId: string | number) => `/ordenes/${ordenId}/evidencias`,
      ADD_MIXED: (ordenId: string | number) => `/ordenes/${ordenId}/evidencias`,
      ADD_PHOTO: (ordenId: string | number) =>
        `/ordenes/${ordenId}/evidencias/foto`,
      ADD_COMMENT: (ordenId: string | number) =>
        `/ordenes/${ordenId}/evidencias/comentario`,
      GET_BY_ID: (evidenciaId: string | number) =>
        `/ordenes/evidencias/${evidenciaId}`,
      DELETE: (evidenciaId: string | number) =>
        `/ordenes/evidencias/${evidenciaId}`,
    },
    // Materiales
    MATERIALS: {
      LIST: '/materiales',
      SEARCH: '/materiales/buscar',
      GET_BY_ID: (id: string | number) => `/materiales/${id}`,
      CHECK_STOCK: (id: string | number, cantidad: number) =>
        `/materiales/${id}/stock/${cantidad}`,
      // Materiales en orden
      LIST_BY_ORDER: (ordenId: string | number) =>
        `/materiales/ordenes/${ordenId}/materiales`,
      ADD_TO_ORDER: (ordenId: string | number) =>
        `/materiales/ordenes/${ordenId}/materiales`,
      DELETE_FROM_ORDER: (
        ordenId: string | number,
        materialUtilizadoId: string | number
      ) => `/materiales/ordenes/${ordenId}/materiales/${materialUtilizadoId}`,
    },
  },
} as const;

export const HTTP_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// Estados permitidos para órdenes
export const ORDER_STATES = {
  ASIGNADA: 'ASIGNADA',
  EN_PROCESO: 'EN_PROCESO',
  PAUSADA: 'PAUSADA',
  FINALIZADA: 'FINALIZADA',
} as const;

// Tipos de evidencia
export const EVIDENCE_TYPES = {
  COMENTARIO: 'COMENTARIO',
  FOTO: 'FOTO',
} as const;

// Límites de archivos para evidencias
export const FILE_LIMITS = {
  PHOTO: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
  },
  COMMENT: {
    MAX_LENGTH: 500, // caracteres
  },
} as const;

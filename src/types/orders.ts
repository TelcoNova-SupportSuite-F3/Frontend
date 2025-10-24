// TypeScript types based on backend DTOs for orders

// Enums from backend
export const ESTADO_ORDEN = {
  ASIGNADA: 'ASIGNADA',
  EN_PROCESO: 'EN_PROCESO',
  PAUSADA: 'PAUSADA',
  FINALIZADA: 'FINALIZADA',
  CANCELADA: 'CANCELADA',
} as const;
export type EstadoOrden = (typeof ESTADO_ORDEN)[keyof typeof ESTADO_ORDEN];
export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type TipoServicio =
  | 'INSTALACION'
  | 'REPARACION'
  | 'MANTENIMIENTO'
  | 'UPGRADE'
  | 'DESCONEXION'
  | 'RECONEXION'
  | 'REVISION_TECNICA';

export type TipoEvidencia = 'COMENTARIO' | 'FOTO';

// DTOs from backend
export interface TecnicoResponse {
  id: number;
  email: string;
  nombreCompleto: string;
  activo: boolean;
}

export interface EvidenciaResponse {
  id: number;
  tipo: TipoEvidencia;
  contenido?: string;
  urlFoto?: string;
  nombreArchivo?: string;
  tamanoArchivo?: string;
  fechaCreacion: string; // ISO date string
  creadoPor: string;
}

export interface MaterialUtilizadoResponse {
  id: number;
  codigoMaterial: string;
  nombreMaterial: string;
  cantidadUtilizada: number;
  unidadMedida: string;
  precioUnitario: number;
  costoTotal: number;
  fechaRegistro: string; // ISO date string
  registradoPor: string;
}

export interface MaterialResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  precioUnitario: number;
  stockDisponible: number;
  activo: boolean;
}

export interface OrdenTrabajoResponse {
  id: number;
  numeroOrden: string;
  titulo: string;
  descripcion: string;
  estado: EstadoOrden;
  prioridad: Prioridad;
  tipoServicio: TipoServicio;
  clienteNombre: string;
  clienteTelefono?: string;
  direccion: string;
  tecnicoAsignado?: TecnicoResponse;
  fechaAsignacion?: string; // ISO date string
  fechaInicioTrabajo?: string; // ISO date string
  fechaFinTrabajo?: string; // ISO date string
  fechaCreacion: string; // ISO date string
  evidencias: EvidenciaResponse[];
  materialesUtilizados: MaterialUtilizadoResponse[];
  costoTotalMateriales: number;
  duracionTrabajoHoras: number;
  estaVencida: boolean;
}

// Request DTOs
export interface ActualizarEstadoRequest {
  nuevoEstado: EstadoOrden;
  observaciones?: string;
  fechaInicioTrabajo?: string; // ISO date string
  fechaFinTrabajo?: string; // ISO date string
}

export interface AgregarMaterialRequest {
  materialId: number;
  cantidad: number;
}

export interface RegistrarEvidenciaRequest {
  tipo: TipoEvidencia;
  contenido?: string;
  archivo?: File;
}

/**
 * Resultado de cambio de estado
 */
export interface OrderStatusChangeResult {
  success: boolean;
  message: string;
  data?: OrdenTrabajoResponse;
}

// Frontend specific types
export interface OrderSummary {
  total: number;
  enProceso: number;
  finalizadas: number;
  asignadas: number;
  pausadas: number;
}

export interface OrderFilters {
  estado?: EstadoOrden;
  prioridad?: Prioridad;
  fechaDesde?: string;
  fechaHasta?: string;
}

// API Response types
export interface OrdersApiResponse {
  success: boolean;
  data?: OrdenTrabajoResponse[];
  message?: string;
}

export interface OrderApiResponse {
  success: boolean;
  data?: OrdenTrabajoResponse;
  message?: string;
}

export interface MaterialsApiResponse {
  success: boolean;
  data?: MaterialResponse[];
  message?: string;
}

// Status mapping for frontend display
export const ESTADO_LABELS: Record<EstadoOrden, string> = {
  ASIGNADA: 'Asignada',
  EN_PROCESO: 'En Proceso',
  PAUSADA: 'Pausada',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

export const TIPO_SERVICIO_LABELS: Record<TipoServicio, string> = {
  INSTALACION: 'Instalación',
  REPARACION: 'Reparación',
  MANTENIMIENTO: 'Mantenimiento',
  UPGRADE: 'Upgrade',
  DESCONEXION: 'Desconexión',
  RECONEXION: 'Reconexión',
  REVISION_TECNICA: 'Revisión Técnica',
};

// Helper functions
export const getEstadoColor = (estado: EstadoOrden): string => {
  switch (estado) {
    case 'ASIGNADA':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'EN_PROCESO':
      return 'bg-primary/10 text-primary hover:bg-primary/10';
    case 'PAUSADA':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'FINALIZADA':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'CANCELADA':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export const getPrioridadColor = (prioridad: Prioridad): string => {
  switch (prioridad) {
    case 'BAJA':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    case 'MEDIA':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'ALTA':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    case 'CRITICA':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '-';

  try {
    // Convertir formato "yyyy-MM-dd HH:mm:ss" a ISO 8601
    // El backend env\u00eda fechas en formato "2025-10-19 14:30:00"
    // Necesitamos convertirlo a "2025-10-19T14:30:00" para que Date lo parsee correctamente
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);

    // Verificar si la fecha es v\u00e1lida
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return dateString;
    }

    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';

  try {
    // Convertir formato "yyyy-MM-dd HH:mm:ss" a ISO 8601
    // El backend env\u00eda fechas en formato "2025-10-19 14:30:00"
    // Necesitamos convertirlo a "2025-10-19T14:30:00" para que Date lo parsee correctamente
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);

    // Verificar si la fecha es v\u00e1lida
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return dateString;
    }

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Bogota',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

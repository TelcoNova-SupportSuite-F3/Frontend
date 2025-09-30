// Tipos base para server actions
export interface ServerActionResult {
  success: boolean;
  message: string;
}

// Evidencia
export interface EvidenceUploadResult extends ServerActionResult {
  fileId?: string;
}

// Comentarios
export interface CommentSubmitResult extends ServerActionResult {
  commentId?: string;
}

// Materiales
export interface Material {
  id: string;
  name: string;
  quantity: number;
}

export interface MaterialResult extends ServerActionResult {
  data?: Material | Material[];
}

// Órdenes
export interface Order {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

// Tiempo
export interface OrderTimeResult extends ServerActionResult {}

// Utilidades comunes
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

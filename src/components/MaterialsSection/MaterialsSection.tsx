import MaterialsSectionClient from './MaterialsSectionClient';
import type { MaterialUtilizadoResponse } from '@/types/orders';

/**
 * Props para MaterialsSection
 */
interface MaterialsSectionProps {
  /** ID de la orden de trabajo */
  orderId: string;
  /** Lista de materiales utilizados */
  materialesUtilizados: MaterialUtilizadoResponse[];
}

/**
 * MaterialsSection Component
 *
 * Componente servidor que pasa datos a MaterialsSectionClient.
 * Sigue el patrón de Server/Client Components de Next.js.
 *
 * @example
 * ```tsx
 * <MaterialsSection
 *   orderId="123"
 *   materialesUtilizados={materials}
 * />
 * ```
 */
export default function MaterialsSection({
  orderId,
  materialesUtilizados,
}: MaterialsSectionProps) {
  return (
    <MaterialsSectionClient
      materialesUtilizados={materialesUtilizados}
      orderId={orderId}
    />
  );
}

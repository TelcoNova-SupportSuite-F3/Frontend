import MaterialsSectionClient from './MaterialsSectionClient';
import type { MaterialUtilizadoResponse } from '@/types/orders';

interface MaterialsSectionProps {
  orderId: string;
  materialesUtilizados: MaterialUtilizadoResponse[];
}

export default function MaterialsSection({
  orderId,
  materialesUtilizados,
}: MaterialsSectionProps) {
  console.log(
    '📦 Server Component - Materiales utilizados en orden:',
    orderId,
    'Count:',
    materialesUtilizados.length
  );

  return (
    <MaterialsSectionClient
      materialesUtilizados={materialesUtilizados}
      orderId={orderId}
    />
  );
}

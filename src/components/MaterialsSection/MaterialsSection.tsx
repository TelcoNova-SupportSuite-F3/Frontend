import { getMaterials } from '@/lib/order-actions';
import MaterialsSectionClient from './MaterialsSectionClient';

interface MaterialsSectionProps {
  orderId: string;
}

export default async function MaterialsSection({
  orderId,
}: MaterialsSectionProps) {
  // Cargar materiales específicamente para este widget
  const materials = await getMaterials();

  console.log(
    '📦 Server Component - Materiales para orden:',
    orderId,
    'Count:',
    materials.length
  );

  return <MaterialsSectionClient materials={materials} />;
}

'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface OrderDetailsButtonProps {
  orderId: string;
}

export default function OrderDetailsButton({
  orderId,
}: OrderDetailsButtonProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <Button
      variant='outline'
      size='sm'
      className='text-blue-600 border-blue-600 hover:bg-blue-50'
      onClick={handleViewDetail}
    >
      Ver detalles
    </Button>
  );
}

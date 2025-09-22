'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/orders');
  };

  return (
    <Button
      variant='ghost'
      onClick={handleBack}
      className='mb-2 text-blue-600 hover:text-blue-700'
    >
      ← Volver a Mis ordenes
    </Button>
  );
}

import { CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function LoginHeader() {
  return (
    <CardHeader className={cn('text-center pb-8 pt-8')}>
      <header className={cn('flex justify-center mb-6')}>
        <Image
          src='/logo.svg'
          alt='TelcoNova Logo'
          width={200}
          height={200}
          priority
        />
      </header>
    </CardHeader>
  );
}

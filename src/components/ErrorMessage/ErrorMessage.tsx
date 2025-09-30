import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({
  title,
  message,
  type = 'error',
}: ErrorMessageProps) {
  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <main className={cn('space-y-6')}>
      <header>
        <h1 className={cn('text-3xl font-bold text-primary')}>{title}</h1>
      </header>
      <Card>
        <CardContent className={cn('p-6 text-center')}>
          <p className={cn(getTextColor())}>{message}</p>
        </CardContent>
      </Card>
    </main>
  );
}

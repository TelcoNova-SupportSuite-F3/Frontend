import { Card } from '@/components/ui/card';
import LoginHeader from '@/components/LoginHeader/LoginHeader';
import LoginForm from '@/components/LoginForm/LoginForm';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  return (
    <main
      className={cn(
        'min-h-screen bg-gray-100 flex items-center justify-center p-4'
      )}
    >
      <Card className={cn('w-full max-w-md bg-white shadow-lg')}>
        <LoginHeader />
        <LoginForm />
      </Card>
    </main>
  );
}

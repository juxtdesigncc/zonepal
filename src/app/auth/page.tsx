import { Auth } from '@/components/auth';

export const metadata = {
  title: 'ZonePal - Sign In',
  description: 'Sign in to save and share your timezone configurations',
};

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Auth />
      </div>
    </div>
  );
} 
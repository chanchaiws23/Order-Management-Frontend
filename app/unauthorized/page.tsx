import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <ShieldAlert className="h-24 w-24 mx-auto text-red-500 mb-6" />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don&apos;t have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/shop">
            <Button>Go to Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

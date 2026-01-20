import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <ShieldAlert className="mx-auto mb-6 h-24 w-24 text-red-500" />
        <h1 className="mb-2 text-4xl font-bold">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
        <div className="flex justify-center gap-4">
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

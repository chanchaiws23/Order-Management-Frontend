import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { ConditionalLayout } from '@/components/shared/ConditionalLayout';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Order Management System',
    template: '%s | Order Management System',
  },
  description: 'Modern e-commerce order management system with role-based access control',
  keywords: ['e-commerce', 'order management', 'inventory', 'admin dashboard', 'shop'],
  authors: [{ name: 'Order Management Team' }],
  creator: 'Order Management Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Order Management System',
    title: 'Order Management System',
    description: 'Modern e-commerce order management system with role-based access control',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Management System',
    description: 'Modern e-commerce order management system with role-based access control',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3001'),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  });

  if (!result.success) {
    // In development, warn but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('Environment validation warning:', result.error.flatten());
    }
    // Return defaults
    return {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    };
  }

  return result.data;
}

export const env = getEnv();

'use client';

export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  label: 'web-vital' | 'custom';
}) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value}`);
  }

  // In production, send to analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement analytics reporting
    // Example with Google Analytics:
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
}

export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return duration;
}

export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

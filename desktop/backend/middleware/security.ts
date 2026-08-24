import { Middleware } from 'encore.dev/api';

// Security headers middleware for Encore.ts
export const securityHeaders: Middleware = async (req, next) => {
  const response = await next(req);

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );

  // Prevent iframe embedding
  response.headers.set('X-Frame-Options', 'DENY');

  // Additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
};

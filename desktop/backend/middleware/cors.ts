// CORS configuration for Encore.ts
// Note: Encore handles CORS through API gateway configuration
// This file provides CORS constants for reference

export const allowedOrigins = [
  'http://localhost:5002',
  'https://frontend-a0s11lix5-finesse-jones-projects-287f926d.vercel.app'
];

export const corsConfig = {
  allowedOrigins,
  allowCredentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS is configured in encore.app or via Encore Cloud dashboard
// This exports the config for documentation purposes

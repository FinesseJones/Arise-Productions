// API Configuration
const getAPIBaseURL = (): string => {
  // In production, use the env variable, otherwise use localhost
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://staging-unified3dproduction-dazi.encr.app';
  }
  return 'http://localhost:4000';
};

export const API_BASE_URL = getAPIBaseURL();

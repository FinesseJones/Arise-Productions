// ==============================================================================
// ARISE PRODUCTION STUDIO - DYNAMIC API & WEBSOCKET CLIENT CONFIGURATION
// AUTOMATICALLY RESOLVES LOCALHOST, ELECTRON, DOCKER & REMOTE VPS ORIGINS
// ==============================================================================

export const getAPIBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE;
    if (envUrl) return envUrl;

    if (window.location.protocol.startsWith('http')) {
      const hostname = window.location.hostname || 'localhost';
      const port = window.location.port;

      // If running directly on backend port 4000 or on standard web ports 80/443 (e.g. deployed VPS domain)
      if (port === '4000' || port === '' || port === '80' || port === '443') {
        return window.location.origin;
      }

      // If developing on Vite/Next dev server (5173, 5002, 5003, 3000, etc.), route to backend on 4000
      return `${window.location.protocol}//${hostname}:4000`;
    }
  }
  return 'http://localhost:4000';
};

export const getWSBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    const envWs = (import.meta as any).env?.VITE_WS_URL;
    if (envWs) return envWs;

    if (window.location.protocol.startsWith('http')) {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const hostname = window.location.hostname || 'localhost';
      const port = window.location.port;

      if (port === '4000' || port === '' || port === '80' || port === '443') {
        return `${proto}//${window.location.host}/ws`;
      }

      return `${proto}//${hostname}:4000/ws`;
    }
  }
  return 'ws://localhost:4000/ws';
};

export const API_BASE_URL = getAPIBaseURL();
export const WS_BASE_URL = getWSBaseURL();

// ==============================================================================
// ARISE PRODUCTION STUDIO - DYNAMIC API & WEBSOCKET CLIENT CONFIGURATION
// AUTOMATICALLY RESOLVES LOCALHOST, ELECTRON, DOCKER & REMOTE VPS ORIGINS
// ==============================================================================

export const getAPIBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE;
    if (envUrl) return envUrl;
    if (window.location.protocol.startsWith('http')) {
      // If developing with Vite dev server port 5002/5003, point to backend on 4000
      if (window.location.port === '5002' || window.location.port === '5003') {
        return `${window.location.protocol}//${window.location.hostname}:4000`;
      }
      // Production VPS / Custom Domain / Docker container: same origin
      return window.location.origin;
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
      if (window.location.port === '5002' || window.location.port === '5003') {
        return `${proto}//${window.location.hostname}:4000/ws`;
      }
      return `${proto}//${window.location.host}/ws`;
    }
  }
  return 'ws://localhost:4000/ws';
};

export const API_BASE_URL = getAPIBaseURL();
export const WS_BASE_URL = getWSBaseURL();

// Centralized endpoints. Use Vite env if provided; otherwise, derive from current host.
const HOST = typeof window !== 'undefined' ? window.location.hostname : '172.31.123.75';

// export const API_BASE = import.meta?.env?.VITE_API_BASE_URL || `http://${HOST}:8081`;
// export const SOCKET_URL = import.meta?.env?.VITE_SOCKET_URL || `http://${HOST}:3000`;


export const API_BASE = `http://172.31.123.75:8081`;
export const SOCKET_URL = `http://172.31.123.75:3000`;

// Central config — all environment variables imported here
// Usage: import { API_URL } from '../config/env';

// Fallback to local API if env var is missing
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const NODE_ENV = import.meta.env.MODE || 'development';
export const IS_PRODUCTION = import.meta.env.PROD;

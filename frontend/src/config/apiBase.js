/**
 * API base URL — set VITE_API_URL in Vercel/local .env before build.
 * Fallback keeps production working if the env var was not set on Vercel.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://deskflow-6.onrender.com';

/**
 * Centralized runtime configuration read from Vite env vars.
 * Falls back to the local studio-api default so the app still boots
 * if `.env` was not copied from `.env.example`.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

import { API_BASE_URL } from './env';

/**
 * The studio-api response envelope. Every endpoint wraps its payload in this
 * shape; `data` is populated on success and `error` on failure.
 */
export interface ApiEnvelope<T> {
  status: string;
  data: T | null;
  error: { code: string; message: string } | null;
}

/**
 * Performs a GET against studio-api and unwraps the `ApiResponse` envelope,
 * returning `data` directly. Throws on transport errors, non-2xx responses,
 * or an `error` envelope so callers can surface a single failure path.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status} ${res.statusText})`);
  }

  const envelope = (await res.json()) as ApiEnvelope<T>;

  if (envelope.status !== 'success' || envelope.error || envelope.data === null) {
    throw new Error(envelope.error?.message ?? 'Request failed');
  }

  return envelope.data;
}

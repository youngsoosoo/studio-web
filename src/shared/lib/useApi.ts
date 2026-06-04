import { useEffect, useState } from 'react';
import { apiGet } from './apiClient';

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiState<T> {
  /** The path whose result `data`/`error` belong to. */
  path: string;
  data: T | null;
  error: string | null;
}

/**
 * Fetches `path` from studio-api on mount (and whenever `path` changes),
 * unwrapping the response envelope. Aborts the in-flight request on unmount or
 * path change to avoid setting state after teardown.
 *
 * `loading` is derived (the settled path not yet matching the requested path)
 * so the effect only calls setState from async callbacks — no synchronous
 * setState in the effect body. Dependency-free seam that can later be swapped
 * for react-query without touching consumers.
 */
export function useApi<T>(path: string): UseApiResult<T> {
  const [state, setState] = useState<ApiState<T>>({ path: '', data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    apiGet<T>(path, controller.signal)
      .then((result) => setState({ path, data: result, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setState({
          path,
          data: null,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      });

    return () => controller.abort();
  }, [path]);

  const loading = state.path !== path;
  return {
    data: loading ? null : state.data,
    loading,
    error: loading ? null : state.error,
  };
}

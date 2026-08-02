import { useApi } from '../../shared/lib/useApi';
import type { ProjectDetail } from './types';

/**
 * Loads a project's case study from `GET /api/portfolio/projects/{id}`.
 * A 404 (project without a case study) surfaces as `error` with `data: null`;
 * callers treat that as "no detail" and fall back to the summary fields.
 */
export const useProjectDetail = (id: string) =>
  useApi<ProjectDetail>(`/api/portfolio/projects/${encodeURIComponent(id)}`);

import { useApi } from '../../shared/lib/useApi';
import type { PortfolioResponse } from './types';

/**
 * Loads the entire public portfolio in a single request.
 * Backed by `GET /api/portfolio` on studio-api.
 */
export const usePortfolio = () => useApi<PortfolioResponse>('/api/portfolio');

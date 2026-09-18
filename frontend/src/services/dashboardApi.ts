import { apiClient } from './apiClient';

export interface DashboardSummary {
  total_projects: number;
  total_sites: number;
  total_area_ha: number;
  avg_biodiversity_index: number | null;
  avg_carbon_estimate: number | null;
  projects_by_status: Record<string, number>;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return res.data;
};

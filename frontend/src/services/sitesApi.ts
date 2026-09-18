import { apiClient } from './apiClient';

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Site {
  id: string;
  project_id: string;
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  geometry?: GeoJsonPolygon;
  area?: number;
  ecosystem_type?: string;
  monitoring_status?: string;
  carbon_baseline?: number;
  current_carbon_estimate?: number;
  biodiversity_index?: number;
  created_at: string;
  updated_at: string;
}

export interface SiteCreate {
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  geometry?: GeoJsonPolygon;
  area?: number;
  ecosystem_type?: string;
  monitoring_status?: string;
  carbon_baseline?: number;
  current_carbon_estimate?: number;
  biodiversity_index?: number;
}

export interface CarbonMetric {
  id: string;
  site_id: string;
  recorded_at: string;
  co2e_tonnes: number;
  notes?: string;
}

export interface BiodiversityMetric {
  id: string;
  site_id: string;
  recorded_at: string;
  index_score: number;
  species_count?: number;
  habitat_health?: string;
}

export const getSites = async (projectId: string): Promise<Site[]> => {
  const res = await apiClient.get<Site[]>(`/projects/${projectId}/sites`);
  return res.data;
};

export const createSite = async (projectId: string, data: SiteCreate): Promise<Site> => {
  const res = await apiClient.post<Site>(`/projects/${projectId}/sites`, data);
  return res.data;
};

export const deleteSite = async (siteId: string): Promise<void> => {
  await apiClient.delete(`/sites/${siteId}`);
};

export const getCarbonMetrics = async (siteId: string): Promise<CarbonMetric[]> => {
  const res = await apiClient.get<CarbonMetric[]>(`/sites/${siteId}/carbon-metrics`);
  return res.data;
};

export const getBiodiversityMetrics = async (siteId: string): Promise<BiodiversityMetric[]> => {
  const res = await apiClient.get<BiodiversityMetric[]>(`/sites/${siteId}/biodiversity-metrics`);
  return res.data;
};

import { apiClient } from './apiClient';

export const getSites = async (projectId) => {
  const res = await apiClient.get(`/projects/${projectId}/sites`);
  return res.data;
};

export const createSite = async (projectId, data) => {
  const res = await apiClient.post(`/projects/${projectId}/sites`, data);
  return res.data;
};

export const deleteSite = async (siteId) => {
  await apiClient.delete(`/sites/${siteId}`);
};

export const getCarbonMetrics = async (siteId) => {
  const res = await apiClient.get(`/sites/${siteId}/carbon-metrics`);
  return res.data;
};

export const getBiodiversityMetrics = async (siteId) => {
  const res = await apiClient.get(`/sites/${siteId}/biodiversity-metrics`);
  return res.data;
};

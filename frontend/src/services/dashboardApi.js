import { apiClient } from './apiClient';

export const getDashboardSummary = async () => {
  const res = await apiClient.get('/dashboard/summary');
  return res.data;
};

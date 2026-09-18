import { apiClient } from './apiClient';

export const getProjects = async () => {
  const res = await apiClient.get('/projects');
  return res.data.items;
};

export const getProject = async (id) => {
  const res = await apiClient.get(`/projects/${id}`);
  return res.data;
};

export const createProject = async (data) => {
  const res = await apiClient.post('/projects', data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await apiClient.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  await apiClient.delete(`/projects/${id}`);
};

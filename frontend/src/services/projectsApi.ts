import { apiClient } from './apiClient';

export interface Project {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: string;
  start_date?: string;
  target_date?: string;
  total_area?: number;
  organization?: string;
  created_at: string;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  skip: number;
  limit: number;
}

export const getProjects = async () => {
  const res = await apiClient.get<ProjectListResponse>('/projects');
  return res.data.items;
};

export const getProject = async (id: string) => {
  const res = await apiClient.get<Project>(`/projects/${id}`);
  return res.data;
};

export const createProject = async (data: Partial<Project>) => {
  const res = await apiClient.post<Project>('/projects', data);
  return res.data;
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const res = await apiClient.put<Project>(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  await apiClient.delete(`/projects/${id}`);
};

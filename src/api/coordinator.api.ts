import api from './client';
import type { Coordinator, CoordinatorFormData } from '../types/coordinator.types';

export const coordinatorApi = {
  getAll: async () => {
    const response = await api.get<any[]>('/coordinators');
    return response.data.map(c => ({
      ...c,
      pollingPlaceName: c.pollingPlace?.name,
      voterCount: c._count?.voters || 0
    })) as Coordinator[];
  },
  getById: async (id: string) => {
    const response = await api.get<any>(`/coordinators/${id}`);
    const data = response.data;
    return {
      ...data,
      pollingPlaceName: data.pollingPlace?.name,
      voterCount: data.voters?.length || 0
    } as Coordinator;
  },
  create: async (data: CoordinatorFormData) => {
    const response = await api.post<Coordinator>('/coordinators', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CoordinatorFormData>) => {
    const response = await api.put<Coordinator>(`/coordinators/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/coordinators/${id}`);
  },
};

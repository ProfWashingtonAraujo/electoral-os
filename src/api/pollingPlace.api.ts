import api from './client';
import type { PollingPlace, PollingPlaceFormData } from '../types/polling-place.types';

export const pollingPlaceApi = {
  getAll: async () => {
    const response = await api.get<PollingPlace[]>('/polling-places');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<PollingPlace>(`/polling-places/${id}`);
    return response.data;
  },
  create: async (data: PollingPlaceFormData) => {
    const response = await api.post<PollingPlace>('/polling-places', data);
    return response.data;
  },
  update: async (id: string, data: Partial<PollingPlaceFormData>) => {
    const response = await api.put<PollingPlace>(`/polling-places/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/polling-places/${id}`);
  },
};

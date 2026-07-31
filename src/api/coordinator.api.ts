import api from './client';
import type { Coordinator, CoordinatorFormData } from '../types/coordinator.types';

type CoordinatorApiResponse = Coordinator & {
  pollingPlace?: { name?: string | null } | null
  _count?: { voters?: number }
  voters?: unknown[]
}

const normalizeCoordinator = (coordinator: CoordinatorApiResponse) => ({
  ...coordinator,
  pollingPlaceName: coordinator.pollingPlace?.name ?? coordinator.pollingPlaceName,
  voterCount: coordinator._count?.voters ?? coordinator.voters?.length ?? coordinator.voterCount ?? 0,
}) as Coordinator

export const coordinatorApi = {
  getAll: async () => {
    const response = await api.get<CoordinatorApiResponse[]>('/coordinators');
    return response.data.map(normalizeCoordinator)
  },
  getById: async (id: string) => {
    const response = await api.get<CoordinatorApiResponse>(`/coordinators/${id}`);
    return normalizeCoordinator(response.data)
  },
  create: async (data: CoordinatorFormData) => {
    const response = await api.post<Coordinator>('/coordinators', data);
    return normalizeCoordinator(response.data)
  },
  update: async (id: string, data: Partial<CoordinatorFormData>) => {
    const response = await api.put<Coordinator>(`/coordinators/${id}`, data);
    return normalizeCoordinator(response.data)
  },
  delete: async (id: string) => {
    await api.delete(`/coordinators/${id}`);
  },
};

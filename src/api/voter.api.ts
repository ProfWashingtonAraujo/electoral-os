import api from './client';
import type { Voter, VoterFormData } from '../types/voter.types';

export type VotersQuery = {
  coordinatorId?: string;
  pollingPlaceId?: string;
  search?: string;
  region?: string;
  neighborhood?: string;
  supportStatus?: string;
  status?: string;
  page?: number;
  perPage?: number;
};

export type VotersPageResponse = {
  items: Voter[];
  total: number;
  page: number;
  perPage: number;
};

export type VotersStatsResponse = {
  total: number;
  statusCounts: Record<string, number>;
  topRegions: Array<{ region: string; count: number }>;
  regionsCount: number;
  growthByMonth: Array<{ month: string; count: number }>;
};

export const voterApi = {
  getAll: async (query?: VotersQuery) => {
    const response = await api.get<VotersPageResponse>('/voters', { params: query });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Voter>(`/voters/${id}`);
    return response.data;
  },
  create: async (data: VoterFormData) => {
    const response = await api.post<Voter>('/voters', data);
    return response.data;
  },
  update: async (id: string, data: Partial<VoterFormData>) => {
    const response = await api.put<Voter>(`/voters/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/voters/${id}`);
  },

  getStats: async (period?: '30d' | '90d' | 'all') => {
    const response = await api.get<VotersStatsResponse>('/voters/stats', { params: period ? { period } : undefined });
    return response.data;
  },
};

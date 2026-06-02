import api from './client';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'digitador';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemUserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'coordinator' | 'digitador';
  active?: boolean;
}

export const userApi = {
  getAll: async (): Promise<SystemUser[]> => {
    const response = await api.get<SystemUser[]>('/users');
    return response.data;
  },

  create: async (data: SystemUserFormData): Promise<SystemUser> => {
    const response = await api.post<SystemUser>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<SystemUserFormData>): Promise<SystemUser> => {
    const response = await api.put<SystemUser>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

import api from './client';

export type AuditEventType =
  | 'login_success'
  | 'report_export'
  | 'settings_change'
  | 'voter_created'
  | 'coordinator_created'
  | 'polling_place_created';

export interface AuditLogEntry {
  id: string;
  type: AuditEventType;
  userId: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  message: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export const auditApi = {
  create: async (payload: {
    type: AuditEventType;
    message: string;
    metadata?: Record<string, unknown>;
    userName?: string;
    userEmail?: string;
  }): Promise<AuditLogEntry> => {
    const response = await api.post<AuditLogEntry>('/audit', payload);
    return response.data;
  },

  list: async (limit = 200): Promise<AuditLogEntry[]> => {
    const response = await api.get<AuditLogEntry[]>('/audit', { params: { limit } });
    return response.data;
  },
};

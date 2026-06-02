export type AuditEventType = 'login_success' | 'report_export' | 'settings_change' | 'voter_created' | 'coordinator_created' | 'polling_place_created';
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
export declare function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): Promise<AuditLogEntry>;
export declare function listAuditLogs(limit?: number): Promise<AuditLogEntry[]>;
//# sourceMappingURL=auditLog.d.ts.map
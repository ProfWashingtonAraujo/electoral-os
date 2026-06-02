import { mkdir, appendFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

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

const logFilePath = resolve(process.cwd(), 'data', 'audit-log.jsonl');

export async function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) {
  const payload: AuditLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };

  await mkdir(dirname(logFilePath), { recursive: true });
  await appendFile(logFilePath, `${JSON.stringify(payload)}\n`, 'utf8');

  return payload;
}

export async function listAuditLogs(limit = 200): Promise<AuditLogEntry[]> {
  try {
    const content = await readFile(logFilePath, 'utf8');
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AuditLogEntry)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}

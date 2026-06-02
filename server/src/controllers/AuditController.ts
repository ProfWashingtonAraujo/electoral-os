import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { appendAuditLog, listAuditLogs, type AuditEventType } from '../lib/auditLog.js';

const ALLOWED_TYPES: AuditEventType[] = [
  'login_success',
  'report_export',
  'settings_change',
  'voter_created',
  'coordinator_created',
  'polling_place_created',
];

export class AuditController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { type, message, metadata } = req.body as {
        type?: AuditEventType;
        message?: string;
        metadata?: Record<string, unknown>;
      };

      if (!type || !ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({ error: 'Tipo de auditoria inválido' });
      }

      if (!message) {
        return res.status(400).json({ error: 'Mensagem é obrigatória' });
      }

      const entry = await appendAuditLog({
        type,
        message,
        metadata,
        userId: req.userId ?? 'unknown',
        userRole: req.userRole,
        userName: (req.body?.userName as string | undefined) ?? undefined,
        userEmail: (req.body?.userEmail as string | undefined) ?? undefined,
        ip: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      });

      res.status(201).json(entry);
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
      res.status(500).json({ error: 'Erro ao registrar auditoria' });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const limit = Number(req.query.limit ?? 200);
      const logs = await listAuditLogs(Number.isNaN(limit) ? 200 : limit);
      res.json(logs);
    } catch (error) {
      console.error('Erro ao listar auditoria:', error);
      res.status(500).json({ error: 'Erro ao listar auditoria' });
    }
  }
}

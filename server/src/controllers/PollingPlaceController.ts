import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { appendAuditLog } from '../lib/auditLog.js';

// Helper: converte string CSV de seções para array
function sectionsToArray(sections: string): string[] {
  if (!sections || sections.trim() === '') return [];
  const normalized = sections
    .trim()
    .replace(/^\{/, '')
    .replace(/\}$/, '');

  return normalized
    .split(',')
    .map((s) => s.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
}

// Helper: converte array de seções para string CSV
function sectionsToString(sections: string | string[]): string {
  if (Array.isArray(sections)) return sections.join(',');
  return sections ?? '';
}

// Helper: normaliza um local de votação vindo do banco para o formato esperado pelo frontend
function normalizePlace(p: { id: string; name: string; address: string; neighborhood: string; region: string; electoralZone: string; sections: string; createdAt: Date; updatedAt: Date }) {
  return {
    ...p,
    sections: sectionsToArray(p.sections),
  };
}

export class PollingPlaceController {
  async getAll(req: Request, res: Response) {
    try {
      const pollingPlaces = await prisma.pollingPlace.findMany({
        orderBy: { name: 'asc' },
      });
      res.json(pollingPlaces.map(normalizePlace));
    } catch {
      res.status(500).json({ error: 'Erro ao buscar locais de votação' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const pollingPlace = await prisma.pollingPlace.findUnique({
        where: { id }
      });
      if (!pollingPlace) return res.status(404).json({ error: 'Local de votação não encontrado' });
      res.json(normalizePlace(pollingPlace));
    } catch {
      res.status(500).json({ error: 'Erro ao buscar local de votação' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, address, neighborhood, region, electoralZone, sections } = req.body;
      const pollingPlace = await prisma.pollingPlace.create({
        data: {
          name,
          address,
          neighborhood,
          region,
          electoralZone,
          sections: sectionsToString(sections),
        }
      });

      const actor = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
      await appendAuditLog({
        type: 'polling_place_created',
        userId: req.userId ?? 'unknown',
        userRole: req.userRole,
        userName: actor?.name,
        userEmail: actor?.email,
        message: `Novo local de votação cadastrado: ${pollingPlace.name}`,
        metadata: { pollingPlaceId: pollingPlace.id, pollingPlaceName: pollingPlace.name },
        ip: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      });

      res.status(201).json(normalizePlace(pollingPlace));
    } catch {
      res.status(500).json({ error: 'Erro ao criar local de votação' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { sections, ...rest } = req.body;
      const data = {
        ...rest,
        ...(sections !== undefined ? { sections: sectionsToString(sections) } : {}),
      };
      const pollingPlace = await prisma.pollingPlace.update({
        where: { id },
        data,
      });
      res.json(normalizePlace(pollingPlace));
    } catch {
      res.status(500).json({ error: 'Erro ao atualizar local de votação' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.pollingPlace.delete({ where: { id } });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Erro ao excluir local de votação' });
    }
  }
}

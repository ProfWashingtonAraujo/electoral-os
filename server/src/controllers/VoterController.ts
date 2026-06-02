import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { appendAuditLog } from '../lib/auditLog.js';

export class VoterController {
  async stats(_req: Request, res: Response) {
    try {
      const period = String((_req.query as any)?.period ?? 'all');
      const now = new Date();
      const fromDate =
        period === '30d'
          ? new Date(now.getTime() - 30 * 86400000)
          : period === '90d'
            ? new Date(now.getTime() - 90 * 86400000)
            : new Date(now.getTime() - 365 * 86400000);

      const [total, byStatus, byRegion, regionGroups] = await Promise.all([
        prisma.voter.count(),
        prisma.voter.groupBy({
          by: ['supportStatus'],
          _count: { supportStatus: true },
        }),
        prisma.voter.groupBy({
          by: ['region'],
          where: { region: { not: null } },
          _count: { region: true },
          orderBy: { _count: { region: 'desc' } },
          take: 5,
        }),
        prisma.voter.groupBy({
          by: ['region'],
          where: { region: { not: null } },
        }),
      ]);

      const growth = await prisma.$queryRaw<Array<{ month: string; count: number }>>`
        SELECT
          to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
          COUNT(*)::int AS count
        FROM "Voter"
        WHERE "createdAt" >= ${fromDate}
        GROUP BY 1
        ORDER BY 1 ASC
      `;

      const statusCounts: Record<string, number> = {};
      for (const row of byStatus) {
        statusCounts[row.supportStatus] = row._count.supportStatus;
      }

      const topRegions = byRegion
        .filter((r) => r.region)
        .map((r) => ({ region: r.region as string, count: r._count.region }));

      res.json({
        total,
        statusCounts,
        topRegions,
        regionsCount: regionGroups.length,
        growthByMonth: growth,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de eleitores:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas de eleitores' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const {
        coordinatorId,
        pollingPlaceId,
        search,
        region,
        neighborhood,
        supportStatus,
        status,
        page,
        perPage,
      } = req.query;

      const where: any = {};
      if (coordinatorId) where.coordinatorId = String(coordinatorId);
      if (pollingPlaceId) where.pollingPlaceId = String(pollingPlaceId);
      if (region) where.region = String(region);
      if (neighborhood) where.neighborhood = String(neighborhood);
      if (supportStatus) where.supportStatus = String(supportStatus);
      if (status) where.status = String(status);

      if (search) {
        const term = String(search).trim();
        if (term) {
          where.OR = [
            { name: { contains: term, mode: 'insensitive' } },
            { neighborhood: { contains: term, mode: 'insensitive' } },
            { voterRegistration: { contains: term, mode: 'insensitive' } },
          ];
        }
      }

      const pageNum = Math.max(1, Number(page ?? 1) || 1);
      const perPageNum = Math.min(200, Math.max(1, Number(perPage ?? 25) || 25));
      const skip = (pageNum - 1) * perPageNum;

      const [total, items] = await Promise.all([
        prisma.voter.count({ where }),
        prisma.voter.findMany({
          where,
          include: { coordinator: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: perPageNum,
        }),
      ]);

      res.json({ items, total, page: pageNum, perPage: perPageNum });
    } catch (error) {
      console.error('Erro ao buscar eleitores:', error);
      res.status(500).json({ error: 'Erro ao buscar eleitores' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const voter = await prisma.voter.findUnique({
        where: { id },
        include: { coordinator: true }
      });
      if (!voter) return res.status(404).json({ error: 'Eleitor não encontrado' });
      res.json(voter);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar eleitor' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { 
        name, phone, whatsapp, address, neighborhood, city, region, 
        voterRegistration, electoralZone, electoralSection, 
        supportStatus, notes, registrationSource, status, 
        pollingPlaceId, coordinatorId 
      } = req.body;
      const voter = await prisma.voter.create({
        data: { 
          name, phone, whatsapp, address, neighborhood, city, region, 
          voterRegistration, electoralZone, electoralSection, 
          supportStatus, notes, registrationSource, status, 
          pollingPlaceId, coordinatorId 
        }
      });

      const actor = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
      await appendAuditLog({
        type: 'voter_created',
        userId: req.userId ?? 'unknown',
        userRole: req.userRole,
        userName: actor?.name,
        userEmail: actor?.email,
        message: `Novo eleitor cadastrado: ${voter.name}`,
        metadata: { voterId: voter.id, voterName: voter.name },
        ip: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      });

      res.status(201).json(voter);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar eleitor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body;
      const voter = await prisma.voter.update({
        where: { id },
        data
      });
      res.json(voter);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar eleitor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.voter.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir eleitor' });
    }
  }
}

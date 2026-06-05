import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { appendAuditLog } from '../lib/auditLog.js';

export class CoordinatorController {
  async getAll(req: Request, res: Response) {
    try {
      const coordinators = await prisma.coordinator.findMany({
        include: {
          pollingPlace: { select: { name: true } },
          _count: { select: { voters: true } }
        }
      });
      res.json(coordinators);
    } catch (error) {
      console.error('Erro ao buscar coordenadores:', error);
      res.status(500).json({ error: 'Erro ao buscar coordenadores' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const coordinator = await prisma.coordinator.findUnique({
        where: { id },
        include: {
          pollingPlace: { select: { name: true } },
          voters: true,
          _count: { select: { voters: true } }
        }
      });
      if (!coordinator) return res.status(404).json({ error: 'Coordenador não encontrado' });
      res.json(coordinator);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar coordenador' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const {
        name,
        phone,
        whatsapp,
        region,
        neighborhood,
        voterRegistration,
        pollingPlaceId,
        electoralZone,
        electoralSection,
        notes,
        status,
      } = req.body;
      const coordinator = await prisma.coordinator.create({
        data: {
          name,
          phone,
          whatsapp,
          region,
          neighborhood,
          voterRegistration,
          pollingPlaceId,
          electoralZone,
          electoralSection,
          notes,
          status,
        },
        include: {
          pollingPlace: { select: { name: true } },
          _count: { select: { voters: true } }
        }
      });

      const actor = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
      await appendAuditLog({
        type: 'coordinator_created',
        userId: req.userId ?? 'unknown',
        userRole: req.userRole,
        userName: actor?.name,
        userEmail: actor?.email,
        message: `Novo coordenador cadastrado: ${coordinator.name}`,
        metadata: { coordinatorId: coordinator.id, coordinatorName: coordinator.name },
        ip: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      });

      res.status(201).json(coordinator);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar coordenador' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const {
        name,
        phone,
        whatsapp,
        region,
        neighborhood,
        voterRegistration,
        pollingPlaceId,
        electoralZone,
        electoralSection,
        notes,
        status,
      } = req.body;
      const coordinator = await prisma.coordinator.update({
        where: { id },
        data: {
          name,
          phone,
          whatsapp,
          region,
          neighborhood,
          voterRegistration,
          pollingPlaceId,
          electoralZone,
          electoralSection,
          notes,
          status,
        },
        include: {
          pollingPlace: { select: { name: true } },
          _count: { select: { voters: true } }
        }
      });
      res.json(coordinator);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar coordenador' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.coordinator.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir coordenador' });
    }
  }
}

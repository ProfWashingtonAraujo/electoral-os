import { prisma } from '../lib/prisma.js';
import { appendAuditLog } from '../lib/auditLog.js';
export class CoordinatorController {
    async getAll(req, res) {
        try {
            const coordinators = await prisma.coordinator.findMany({
                include: { _count: { select: { voters: true } } }
            });
            res.json(coordinators);
        }
        catch (error) {
            console.error('Erro ao buscar coordenadores:', error);
            res.status(500).json({ error: 'Erro ao buscar coordenadores' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const coordinator = await prisma.coordinator.findUnique({
                where: { id },
                include: { voters: true }
            });
            if (!coordinator)
                return res.status(404).json({ error: 'Coordenador não encontrado' });
            res.json(coordinator);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar coordenador' });
        }
    }
    async create(req, res) {
        try {
            const { name, phone, whatsapp, region, neighborhood, notes, status } = req.body;
            const coordinator = await prisma.coordinator.create({
                data: { name, phone, whatsapp, region, neighborhood, notes, status }
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
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar coordenador' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, whatsapp, region, neighborhood, notes, status } = req.body;
            const coordinator = await prisma.coordinator.update({
                where: { id },
                data: { name, phone, whatsapp, region, neighborhood, notes, status }
            });
            res.json(coordinator);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar coordenador' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma.coordinator.delete({ where: { id } });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao excluir coordenador' });
        }
    }
}
//# sourceMappingURL=CoordinatorController.js.map
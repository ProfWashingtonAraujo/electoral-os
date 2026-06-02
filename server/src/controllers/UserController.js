import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
const SALT_ROUNDS = 10;
const ALLOWED_ROLES = new Set(['admin', 'coordinator', 'digitador']);
const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    active: true,
    createdAt: true,
    updatedAt: true,
};
export class UserController {
    async getAll(_req, res) {
        try {
            const users = await prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
            res.json(users);
        }
        catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
            if (!user)
                return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    }
    async create(req, res) {
        try {
            const { name, email, password, role, active } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
            }
            const normalizedRole = (role ?? 'coordinator');
            if (!ALLOWED_ROLES.has(normalizedRole)) {
                return res.status(400).json({ error: 'Perfil inválido' });
            }
            const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
            if (existing) {
                return res.status(409).json({ error: 'E-mail já cadastrado' });
            }
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const user = await prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role: normalizedRole,
                    ...(active !== undefined ? { active: Boolean(active) } : {}),
                },
                select: userSelect,
            });
            res.status(201).json(user);
        }
        catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, role, active } = req.body;
            const data = {};
            if (name !== undefined)
                data.name = name;
            if (email !== undefined)
                data.email = String(email).toLowerCase();
            if (role !== undefined) {
                const normalizedRole = String(role);
                if (!ALLOWED_ROLES.has(normalizedRole)) {
                    return res.status(400).json({ error: 'Perfil inválido' });
                }
                data.role = normalizedRole;
            }
            if (active !== undefined)
                data.active = active;
            if (password)
                data.password = await bcrypt.hash(password, SALT_ROUNDS);
            try {
                const user = await prisma.user.update({ where: { id }, data, select: userSelect });
                res.json(user);
            }
            catch (error) {
                // Prisma unique violation: keep API semantics consistent.
                if (error?.code === 'P2002') {
                    return res.status(409).json({ error: 'E-mail já cadastrado' });
                }
                // Prisma not found
                if (error?.code === 'P2025') {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                throw error;
            }
        }
        catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
            if (!target)
                return res.status(404).json({ error: 'Usuário não encontrado' });
            if (target.role === 'admin') {
                const adminCount = await prisma.user.count({ where: { role: 'admin', active: true } });
                if (adminCount <= 1) {
                    return res.status(409).json({ error: 'Não é possível excluir o último administrador' });
                }
            }
            await prisma.user.delete({ where: { id } });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    }
}
//# sourceMappingURL=UserController.js.map
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new UserController();

router.use(authMiddleware);

// User management is restricted to admins.
router.use((req, res, next) => {
  const r = req as AuthRequest;
  if (r.userRole !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
});

router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;

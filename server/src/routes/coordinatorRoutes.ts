import { Router } from 'express';
import { CoordinatorController } from '../controllers/CoordinatorController.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new CoordinatorController();

router.use((req, res, next) => {
  const authReq = req as AuthRequest;
  if ((authReq.userRole === 'digitador' || authReq.userRole === 'coordinator') && req.method !== 'GET') {
    return res.status(403).json({ error: 'Acesso negado para este perfil' });
  }
  next();
});

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;

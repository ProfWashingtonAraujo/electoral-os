import { Router } from 'express';
import { AuditController } from '../controllers/AuditController.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new AuditController();

router.get('/', (req, res) => controller.list(req as AuthRequest, res));
router.post('/', (req, res) => controller.create(req as AuthRequest, res));

export default router;

import { Router } from 'express';
import { AuditController } from '../controllers/AuditController.js';

const router = Router();
const controller = new AuditController();

router.get('/', (req, res) => controller.list(req as any, res));
router.post('/', (req, res) => controller.create(req as any, res));

export default router;

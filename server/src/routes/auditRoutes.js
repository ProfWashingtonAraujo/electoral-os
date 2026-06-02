import { Router } from 'express';
import { AuditController } from '../controllers/AuditController.js';
const router = Router();
const controller = new AuditController();
router.get('/', (req, res) => controller.list(req, res));
router.post('/', (req, res) => controller.create(req, res));
export default router;
//# sourceMappingURL=auditRoutes.js.map
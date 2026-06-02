import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new AuthController();
router.post('/login', (req, res) => controller.login(req, res));
router.get('/me', authMiddleware, (req, res) => controller.me(req, res));
export default router;
//# sourceMappingURL=authRoutes.js.map
import { Router } from 'express';
import { PollingPlaceController } from '../controllers/PollingPlaceController.js';
const router = Router();
const controller = new PollingPlaceController();
router.use((req, res, next) => {
    const authReq = req;
    if (authReq.userRole === 'digitador' && req.method !== 'GET') {
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
//# sourceMappingURL=pollingPlaceRoutes.js.map
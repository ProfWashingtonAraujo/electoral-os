import { Router } from 'express';
import { VoterController } from '../controllers/VoterController.js';
const router = Router();
const controller = new VoterController();
router.use((req, res, next) => {
    const authReq = req;
    if (authReq.userRole === 'digitador' && req.method === 'DELETE') {
        return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }
    next();
});
router.get('/', controller.getAll);
router.get('/stats', (req, res) => controller.stats(req, res));
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
export default router;
//# sourceMappingURL=voterRoutes.js.map
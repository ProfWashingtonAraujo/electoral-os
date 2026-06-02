import { Router } from 'express';
import coordinatorRoutes from './coordinatorRoutes.js';
import voterRoutes from './voterRoutes.js';
import pollingPlaceRoutes from './pollingPlaceRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import auditRoutes from './auditRoutes.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/coordinators', authMiddleware, coordinatorRoutes);
router.use('/voters', authMiddleware, voterRoutes);
router.use('/polling-places', authMiddleware, pollingPlaceRoutes);
router.use('/users', userRoutes);
router.use('/audit', authMiddleware, auditRoutes);

export default router;


// src/modules/auth/infrastructure/auth.routes.ts

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;


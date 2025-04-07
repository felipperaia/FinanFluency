// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUser, updateUser } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para obter os dados do usuário logado
router.get('/me', authenticate, getUser);

// Endpoint para atualizar os dados do usuário logado
router.put('/me', authenticate, updateUser);

export default router;

// src/routes/financeRoutes.ts
import { Router } from 'express';
import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
  getDashboardSummary
} from '../controllers/financeController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas abaixo exigem autenticação
router.post('/transaction', authenticate, createTransaction);
router.get('/transactions', authenticate, getAllTransactions);
router.delete('/transaction/:id', authenticate, deleteTransaction);
router.get('/summary', authenticate, getDashboardSummary);

export default router;

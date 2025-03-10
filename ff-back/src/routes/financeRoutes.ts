import { Router } from 'express';
import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
  getDashboardSummary
} from '../controllers/financeController';

const router = Router();

router.post('/transaction', createTransaction);
router.get('/transactions', getAllTransactions);
router.delete('/transaction/:id', deleteTransaction);

router.get('/summary', getDashboardSummary);

export default router;

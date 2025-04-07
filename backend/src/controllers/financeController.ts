// src/controllers/financeController.ts
import { Request, Response } from 'express';
import { TransactionModel } from '../models/financeModel';

export async function createTransaction(req: Request, res: Response) {
  try {
    // O usuário autenticado está em req.user (através do middleware)
    const user = (req as any).user;
    const { type, value, description, date } = req.body;
    const transaction = await TransactionModel.create({
      user: user._id,
      type,
      value,
      description,
      date
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
}

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const transactions = await TransactionModel.find({ user: user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    // Apenas remove se a transação pertence ao usuário autenticado
    const transaction = await TransactionModel.findOneAndDelete({ _id: id, user: user._id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ error: 'Erro ao excluir transação' });
  }
}

export async function getDashboardSummary(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const transactions = await TransactionModel.find({ user: user._id });
    let totalRecebimentos = 0;
    let totalPagamentos = 0;
    let qtdSemAtraso = 0;
    let qtdAtrasados = 0;
    const today = new Date();

    transactions.forEach((t) => {
      if (t.type === 'RECEBIMENTO') {
        totalRecebimentos += t.value;
      } else if (t.type === 'PAGAMENTO') {
        totalPagamentos += t.value;
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0,0,0,0);
        const currentDay = new Date();
        currentDay.setHours(0,0,0,0);
        transactionDate < currentDay ? qtdAtrasados++ : qtdSemAtraso++;
      }
    });

    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).getMonth();
      const typeKey = t.type === 'RECEBIMENTO' ? 'recebimentos' : 'pagamentos';
      acc[month] = acc[month] || { recebimentos: 0, pagamentos: 0 };
      acc[month][typeKey] += t.value;
      return acc;
    }, {} as Record<number, { recebimentos: number; pagamentos: number }>);

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const labels = Object.keys(monthlyData).map(month => monthNames[parseInt(month)]);
    const recebimentos = Object.values(monthlyData).map(m => m.recebimentos);
    const pagamentos = Object.values(monthlyData).map(m => m.pagamentos);
    const saldo = totalRecebimentos - totalPagamentos;

    res.json({
      totalRecebimentos,
      totalPagamentos,
      saldo,
      qtdSemAtraso,
      qtdAtrasados,
      labels,
      recebimentos,
      pagamentos
    });
  } catch (error) {
    console.error('Erro ao buscar resumo do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo do dashboard' });
  }
}

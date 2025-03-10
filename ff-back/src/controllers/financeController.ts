import { Request, Response } from 'express';
import { TransactionModel, ITransaction } from '../models/financeModel';

export async function createTransaction(req: Request, res: Response) {
  try {
    const { type, value, description, date } = req.body;

    const transaction = await TransactionModel.create({
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
    const transactions = await TransactionModel.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const transaction = await TransactionModel.findByIdAndDelete(id);

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
    const transactions = await TransactionModel.find();

    let totalRecebimentos = 0;
    let totalPagamentos = 0;
    let qtdSemAtraso = 0;
    let qtdAtrasados = 0;
    const today = new Date();

    // *** ALTERAÇÃO: Cálculo correto de atrasos ***
    // Corrigir o cálculo de atrasos
    transactions.forEach((t) => {
      if (t.type === 'RECEBIMENTO') {
        totalRecebimentos += t.value;
      } else if (t.type === 'PAGAMENTO') {
        totalPagamentos += t.value;
        
        // Corrigir comparação de datas
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0,0,0,0); // Resetar horas
        const today = new Date();
        today.setHours(0,0,0,0);
        
        transactionDate < today ? qtdAtrasados++ : qtdSemAtraso++;
      }
    });

    // *** ALTERAÇÃO: Dados dinâmicos para gráficos ***
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).getMonth();
      const typeKey = t.type === 'RECEBIMENTO' ? 'recebimentos' : 'pagamentos';
      
      acc[month] = acc[month] || { recebimentos: 0, pagamentos: 0 };
      acc[month][typeKey] += t.value;
      
      return acc;
    }, {} as Record<number, { recebimentos: number; pagamentos: number }>);

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                       'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const labels = Object.keys(monthlyData)
      .map(month => monthNames[parseInt(month)]);
    
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
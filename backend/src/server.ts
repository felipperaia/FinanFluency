// src/server.ts
import 'dotenv/config';             // carrega variáveis de .env antes de qualquer uso de process.env
import express from 'express';
import path from 'path';
import cors from 'cors';
import { connectDB } from './database';
import financeRoutes from './routes/financeRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  await connectDB();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rotas de autenticação
  app.use('/api/auth', authRoutes);
  // Rotas financeiras (protegidas)
  app.use('/api/finance', financeRoutes);
  // Rotas usuários
  app.use('/api/user', userRoutes);

  // Arquivos estáticos
  app.use(express.static(path.join(__dirname, '../../public/')));

  // Rota principal
  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // 404 → offline.html
  app.use((_req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../public/offline.html'));
  });

  app.listen(PORT, () => {
    console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('🔴 Falha crítica:', err);
  process.exit(1);
});

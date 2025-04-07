// src/server.ts
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

  // Arquivos estáticos (ajuste o caminho conforme sua estrutura)
  app.use(express.static(path.join(__dirname, '../../public/')));

  // Rota principal
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // Rota para páginas não encontradas
  app.use((req, res) => {
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

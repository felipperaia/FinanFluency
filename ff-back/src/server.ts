import express from 'express';
import path from 'path';
import cors from 'cors'; // Importe o CORS
import { connectDB } from './database';
import financeRoutes from './routes/financeRoutes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  await connectDB();

  // Middlewares
  app.use(cors()); // Habilita CORS
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rotas
  app.use('/api/finance', financeRoutes);

  // Caminho correto para arquivos estáticos (ajustado para sua estrutura)
  app.use(express.static(path.join(__dirname, '../../'))); // Aponta para a raiz do projeto

  // Rota principal
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html')); // Caminho absoluto
  });

  // Tratamento de erro para rotas não encontradas
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../offline.html'));
  });

  app.listen(PORT, () => {
    console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('🔴 Falha crítica:', err);
  process.exit(1);
});
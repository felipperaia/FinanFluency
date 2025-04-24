// src/database.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ A variável MONGO_URI não está definida no .env');
  process.exit(1);
}

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI as string, {
      // opcional: ajustes adicionais se precisar
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('🟢 Conectado ao MongoDB Atlas com sucesso!');
  } catch (error) {
    console.error('🔴 Erro ao conectar ao MongoDB Atlas:', error);
    process.exit(1);
  }
}

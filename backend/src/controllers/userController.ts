// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

export async function getUser(req: Request, res: Response) {
  try {
    // O usuário autenticado foi adicionado via middleware
    const user = await UserModel.findById((req as any).user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    // Atualize apenas os campos permitidos, por exemplo: username e email
    const { username, email } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

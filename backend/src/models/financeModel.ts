// src/models/financeModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface ITransaction extends Document {
  user: IUser['_id'];
  type: 'RECEBIMENTO' | 'PAGAMENTO';
  value: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['RECEBIMENTO', 'PAGAMENTO'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);

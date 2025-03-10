import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  type: 'RECEBIMENTO' | 'PAGAMENTO';
  value: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
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
      index: true // *** ALTERAÇÃO: Adicionado índice ***
    }
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
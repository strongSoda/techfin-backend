import { z } from 'zod';

export const transactionSchema = z.object({
  payee: z.string().min(1, 'Payee is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export const updateTransactionSchema = transactionSchema.extend({
  version: z.number().int().nonnegative(),
});

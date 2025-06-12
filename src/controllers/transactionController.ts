import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

export const createTransaction = async (req: AuthRequest, res: Response) => {

  const { payee, amount, category, date } = req.body;
  const userId = req.userId!;

  try {
    const transaction = await prisma.transaction.create({
      data: { payee, amount, category, date: new Date(date), userId },
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { cursor, limit = 50 } = req.query;

  const take = Number(limit);
  const where = { userId, deletedAt: null };

  const result = await prisma.transaction.findMany({
    where,
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: String(cursor) } }),
    orderBy: { date: 'desc' },
  });

  return res.json(result);
};


export const updateTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const { payee, amount, category, date, version } = req.body;

  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  if (existing.version !== version) {
    return res.status(409).json({ error: 'Transaction has been modified by another client. Please refresh.' });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      payee,
      amount,
      category,
      date: new Date(date),
      version: version + 1, // bump version for optimistic concurrency control
    },
  });

  return res.json(updated);
};


export const softDeleteTransaction = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    const deleted = await prisma.transaction.updateMany({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });

    if (deleted.count === 0) return res.status(404).json({ error: 'Transaction not found or unauthorized' });

    res.json({ message: 'Deleted (soft) successfully' });
  } catch {
    res.status(500).json({ error: 'Soft delete failed' });
  }
};

export const bulkUploadTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const transactions = req.body.transactions;

  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: 'transactions must be an array' });
  }

  const data = transactions.map((tx: any) => ({
    ...tx,
    userId,
    date: new Date(tx.date),
  }));

  try {
    const result = await prisma.transaction.createMany({
      data,
      skipDuplicates: true,
    });

    return res.status(201).json({ insertedCount: result.count });
  } catch (err) {
    return res.status(500).json({ error: 'Bulk insert failed', details: err });
  }
};

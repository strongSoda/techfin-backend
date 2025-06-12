import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app:Express = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;

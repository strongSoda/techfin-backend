import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  softDeleteTransaction,
  bulkUploadTransactions,
} from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import { transactionSchema, updateTransactionSchema } from '../utils/validators';

const router = Router();

router.use((req, res, next) => {authenticate(req, res, next)});

router.post('/', validateBody(transactionSchema), createTransaction);
router.get('/', (req, res) => {getTransactions(req, res)});
router.put('/:id', validateBody(updateTransactionSchema), (req, res) => {updateTransaction(req, res)});
router.delete('/:id', (req, res) => {
  softDeleteTransaction(req, res);
});

router.post('/bulk-upload',  (req, res) => {bulkUploadTransactions(req, res)})

export default router;

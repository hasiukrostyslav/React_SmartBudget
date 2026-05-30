import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  deleteAllTransactionsCtl,
  deleteManyTransactions,
  deleteOneTransaction,
  getOneTransaction,
  listTransactions,
  patchTransaction,
  patchTransactionsCategory,
  patchTransactionsStatus,
  postTransaction,
} from './transactions.controller';
import {
  BulkCategorySchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  TransactionCreateSchema,
  TransactionUpdateSchema,
} from './transactions.schemas';

const router = Router();

// All routes require an authenticated user
router.use(authMiddleware);

// Order matters: more specific paths come BEFORE :id catch-all so e.g.
// /transactions/status doesn't get matched as id="status"
router.get('/', listTransactions);
router.post('/', validate(TransactionCreateSchema), postTransaction);
router.delete('/all', deleteAllTransactionsCtl);
router.delete('/', validate(BulkDeleteSchema), deleteManyTransactions);
router.patch('/status', validate(BulkStatusSchema), patchTransactionsStatus);
router.patch(
  '/category',
  validate(BulkCategorySchema),
  patchTransactionsCategory,
);
router.get('/:id', getOneTransaction);
router.patch('/:id', validate(TransactionUpdateSchema), patchTransaction);
router.delete('/:id', deleteOneTransaction);

export default router;

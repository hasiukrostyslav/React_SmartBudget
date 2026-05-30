import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import transactionsRouter from '../transactions/transactions.router';
import { getDashboard } from './dashboard.controller';

const router = Router();

router.get('/', authMiddleware, getDashboard);
router.use('/transactions', transactionsRouter);

export default router;

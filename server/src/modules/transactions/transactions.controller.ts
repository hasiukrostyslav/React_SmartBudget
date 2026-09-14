import { Request, Response } from 'express';

import { AppError } from '../../lib/AppError';
import { requireUser } from '../../lib/requireUser';
import { SearchParamsSchema } from './transactions.schemas';
import {
  createTransaction,
  deleteAllTransactions,
  deleteTransactionById,
  deleteTransactionsMany,
  findTransactionById,
  findTransactionsByUserId,
  updateTransactionById,
  updateTransactionsCategory,
  updateTransactionsStatus,
} from './transactions.service';

// No try/catch: Express 5 forwards a rejected promise to the error middleware,
// which is where status codes and logging are decided.

export async function listTransactions(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  const parsed = SearchParamsSchema.safeParse(req.query);
  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    throw new AppError(
      400,
      `Invalid query parameter "${issue.path.join('.')}": ${issue.message}`,
    );
  }

  res.json(await findTransactionsByUserId(userId, parsed.data));
}

export async function getOneTransaction(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  const data = await findTransactionById(req.params.id as string, userId);
  if (!data) throw new AppError(404, 'Transaction not found');

  res.json(data);
}

export async function postTransaction(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.status(201).json(await createTransaction(userId, req.body));
}

export async function patchTransaction(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  const data = await updateTransactionById(
    req.params.id as string,
    userId,
    req.body,
  );
  if (!data) throw new AppError(404, 'Transaction not found');

  res.json(data);
}

export async function patchTransactionsStatus(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.json(await updateTransactionsStatus(userId, req.body));
}

export async function patchTransactionsCategory(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.json(await updateTransactionsCategory(userId, req.body));
}

export async function deleteOneTransaction(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.json(await deleteTransactionById(req.params.id as string, userId));
}

export async function deleteManyTransactions(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.json(await deleteTransactionsMany(userId, req.body));
}

export async function deleteAllTransactionsCtl(req: Request, res: Response) {
  const { id: userId } = requireUser(req);

  res.json(await deleteAllTransactions(userId));
}

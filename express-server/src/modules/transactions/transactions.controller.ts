import { Request, Response } from 'express';

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
import { SearchParamsSchema } from './transactions.schemas';

function getUserId(req: Request): string | null {
  return req.user?.id ?? req.user?.sub ?? null;
}

function unauthorized(res: Response) {
  res.status(401).json({ message: 'Unauthorized. Please sign in!' });
}

function handleError(res: Response, label: string, error: unknown) {
  console.error(`[${label}]`, error);
  res.status(500).json({ message: 'Internal server error' });
}

export async function listTransactions(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  // Validate (and apply defaults to) query params — mirrors next/SearchParamsSchema
  const parsed = SearchParamsSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid query parameters' });
    return;
  }

  try {
    const data = await findTransactionsByUserId(userId, parsed.data);
    res.json(data);
  } catch (error) {
    handleError(res, 'listTransactions', error);
  }
}

export async function getOneTransaction(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await findTransactionById(req.params.id as string, userId);
    if (!data) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    handleError(res, 'getOneTransaction', error);
  }
}

export async function postTransaction(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await createTransaction(userId, req.body);
    res.status(201).json(data);
  } catch (error) {
    handleError(res, 'postTransaction', error);
  }
}

export async function patchTransaction(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await updateTransactionById(
      req.params.id as string,
      userId,
      req.body,
    );
    if (!data) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    handleError(res, 'patchTransaction', error);
  }
}

export async function patchTransactionsStatus(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await updateTransactionsStatus(userId, req.body);
    res.json(data);
  } catch (error) {
    handleError(res, 'patchTransactionsStatus', error);
  }
}

export async function patchTransactionsCategory(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await updateTransactionsCategory(userId, req.body);
    res.json(data);
  } catch (error) {
    handleError(res, 'patchTransactionsCategory', error);
  }
}

export async function deleteOneTransaction(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await deleteTransactionById(req.params.id as string, userId);
    res.json(data);
  } catch (error) {
    handleError(res, 'deleteOneTransaction', error);
  }
}

export async function deleteManyTransactions(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await deleteTransactionsMany(userId, req.body);
    res.json(data);
  } catch (error) {
    handleError(res, 'deleteManyTransactions', error);
  }
}

export async function deleteAllTransactionsCtl(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!userId) return unauthorized(res);

  try {
    const data = await deleteAllTransactions(userId);
    res.json(data);
  } catch (error) {
    handleError(res, 'deleteAllTransactionsCtl', error);
  }
}

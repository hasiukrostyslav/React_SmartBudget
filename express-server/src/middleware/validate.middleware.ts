import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

import { AppError } from '../lib/AppError';

// Factory that returns an Express middleware validating req.body against a Zod
// schema. Failures go through next() so they render, log and carry a request
// id like every other error, rather than responding directly.
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(400, 'Validation failed', {
          errors: result.error.flatten().fieldErrors,
        }),
      );
      return;
    }

    req.body = result.data;
    next();
  };
}

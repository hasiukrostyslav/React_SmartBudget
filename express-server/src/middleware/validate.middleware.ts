import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Factory that returns an Express middleware validating req.body against a Zod schema.
// Mirrors the ZodValidationPipe from the NestJS server.
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten();
      res.status(400).json({ message: 'Validation failed', errors: errors.fieldErrors });
      return;
    }

    req.body = result.data;
    next();
  };
}

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ValidationError } from './validate';

// must have 4 args so Express recognizes this as an error-handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({ error: 'Validation failed', details: fieldErrors });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, details: err.details });
    return;
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}

import { NextFunction, Request, Response } from 'express';

// must have 4 args so Express recognizes this as an error-handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}

import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';

export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];

  if (token !== 'super-secret-key') {
    next(new UnauthorizedError('Unauthorized'));
    return;
  }

  next();
}

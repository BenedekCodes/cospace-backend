import { NextFunction, Request, Response } from 'express';

export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];

  if (token !== 'super-secret-key') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

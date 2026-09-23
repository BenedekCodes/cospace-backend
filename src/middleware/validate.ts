import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export class ValidationError extends Error {
  constructor(message: string, public readonly details: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validate(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter((field) => req.body[field] === undefined);

    if (missingFields.length > 0) {
      next(new ValidationError('Missing required fields', { missingFields }));
      return;
    }

    next();
  };
}

export function validateSchema(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

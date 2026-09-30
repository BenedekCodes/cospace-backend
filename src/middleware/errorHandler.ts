import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ValidationError } from './validate';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../constants/httpStatus';

// express.json() rejects malformed request bodies with a SyntaxError carrying these body-parser-specific fields
interface BodyParserSyntaxError extends SyntaxError {
  status?: number;
  type?: string;
  body?: unknown;
}

function isMalformedJsonError(err: Error): err is BodyParserSyntaxError {
  return err instanceof SyntaxError && 'body' in err;
}

// must have 4 args so Express recognizes this as an error-handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (isMalformedJsonError(err)) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'fail', error: 'Malformed JSON in request body' });
    return;
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(HttpStatus.BAD_REQUEST).json({ status: 'fail', error: 'Validation failed', details: fieldErrors });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'fail', error: err.message, details: err.details });
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, error: err.message });
    return;
  }

  console.error(err.stack);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Something went wrong on our end' });
}

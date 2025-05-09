import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status is 500 (Server Error)
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on the server';

  console.error(`[ERROR] ${status} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    status,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

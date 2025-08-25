// src/utils/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// This is our central error handler
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err); // Log the error for debugging

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      issues: err.issues,
    });
  }

  // Handle specific errors from our services
  if (err.message === 'User with this email already exists') {
    return res.status(409).json({ message: err.message });
  }
  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ message: err.message });
  }

  // Handle generic server errors
  return res.status(500).json({ message: 'An unexpected error occurred' });
}
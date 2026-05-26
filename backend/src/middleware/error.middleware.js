import { AppError } from '../utils/AppError.js';

/**
 * 404 handler for routes that did not match any registered path.
 */
export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

/**
 * Centralized error handler — maps known errors to consistent JSON responses.
 */
export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found',
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

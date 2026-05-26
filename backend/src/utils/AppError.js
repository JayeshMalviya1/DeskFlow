/**
 * Operational error with an HTTP status code.
 * Thrown from the service layer and handled by error middleware.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

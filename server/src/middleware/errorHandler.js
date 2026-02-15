import { createErrorResponse } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json(createErrorResponse('Validation failed', errors));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(400).json(createErrorResponse(message));
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json(createErrorResponse('Invalid ID format'));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse('Invalid token'));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse('Token expired'));
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(createErrorResponse(message));
};

export default errorHandler;

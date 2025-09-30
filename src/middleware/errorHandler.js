const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // PostgreSQL foreign key constraint violation
  if (err.code === '23503') {
    const message = 'Referenced record not found';
    error = { message, statusCode: 400 };
  }

  // PostgreSQL not null constraint violation
  if (err.code === '23502') {
    const message = 'Required field is missing';
    error = { message, statusCode: 400 };
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    const message = 'Invalid value for field';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };


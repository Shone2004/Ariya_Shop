const errorHandler = (err, req, res, next) => {
  console.error('Express Error Handler:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
  }

  // Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    errors = [`The field '${field}' must be unique.`];
  }

  // Mongoose Bad ObjectId cast error
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  // Hide internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message]
  });
};

module.exports = errorHandler;

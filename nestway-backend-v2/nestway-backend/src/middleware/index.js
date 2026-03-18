// ─────────────────────────────────────────────────────────────
//  middleware/index.js
//  Request logger + global error handler
// ─────────────────────────────────────────────────────────────

// Logs every incoming request: method, path, timestamp
const requestLogger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

// Wraps async route handlers so you don't need try/catch in every route
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Sends a clean JSON error response instead of crashing the server
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};

module.exports = { requestLogger, asyncHandler, errorHandler };

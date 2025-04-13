function fallbackHandler(req, res, next) {
  res.status(404).json({
    message: "Route not found",
    error: true,
  });
  next();
}

module.exports = fallbackHandler; // Export the fallback handler middleware for use in the main app file
// This middleware handles requests to undefined routes and sends a 404 response with a message
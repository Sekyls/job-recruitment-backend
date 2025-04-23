function fallbackHandler(req, res, next) {
  if (!res.headersSent) {
    res.status(404).json({
      message: "Route not found",
      error: true,
    });
  }
  // Don't call next() here — you're done responding
}

module.exports = fallbackHandler;
 // Export the fallback handler middleware for use in the main app file
// This middleware handles requests to undefined routes and sends a 404 response with a message

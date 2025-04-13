module.exports = function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
// This middleware function is used to handle errors in the Express application.
// It takes four parameters: err, req, res, and next.
// The function logs the error stack to the console and sends a JSON response with the error message and status code.
// If the error does not have a status code, it defaults to 500 (Internal Server Error).
// The success property in the response is set to false to indicate that the request was not successful.
// This middleware is added after all other middleware and route handlers in the Express app.
// It ensures that any unhandled errors in the application are caught and handled gracefully.

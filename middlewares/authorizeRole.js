module.exports = function (...allowedRoles) {
  // Middleware function to authorize user roles
  // This function takes an array of allowed roles as arguments.
  return function (req, res, next) {
    const userRole = req.user?.role; // Extract the user's role from the request object
    // The req.user object is typically populated by a previous middleware that verifies the user's token.
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Check if the user's role is not in the allowedRoles array
      // If the user's role is not found or not included in the allowedRoles array, send a 403 Forbidden response.
      return res.status(403).json({ message: "Access denied." });
    }
    next(); // If the user's role is allowed, call the next middleware or route handler
    // This allows the request to proceed to the next middleware or route handler.
  };
};
// This middleware checks if the user's role is in the allowedRoles array.
// If the role is not allowed, it sends a 403 Forbidden response.
// If the role is allowed, it calls the next middleware or route handler.
// This is useful for protecting routes that should only be accessible to users with specific roles, such as "admin" or "user".
// The middleware can be used in route definitions to restrict access based on user roles.
// For example, you can use it like this:
// app.get("/admin", authorizeRole("admin"), (req, res) => {
//   res.send("Welcome, admin!");
// });
// This would restrict access to the "/admin" route to users with the "admin" role only.
// If a user without the "admin" role tries to access this route, they would receive a 403 Forbidden response.

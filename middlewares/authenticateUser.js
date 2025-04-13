const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library to handle JWTs
// This library provides methods for creating, verifying, and decoding JSON Web Tokens (JWTs).

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization; // Extracting the Authorization header from the request headers
  // The Authorization header is expected to contain the JWT token used for authentication.

  // Must be in form: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" }); // If the Authorization header is missing or does not start with "Bearer ", send a 401 Unauthorized response.
  }

  const token = authHeader.split(" ")[1]; // Extracting the token from the Authorization header
  // The split method is used to separate the "Bearer" part from the actual token.
  // The token is expected to be the second part of the header, after the space.

  if (!token) {
    // If the token is not present in the Authorization header, send a 401 Unauthorized response.
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token using the secret key stored in the environment variable JWT_SECRET
    // The verify method checks if the token is valid and has not expired.
    req.user = decoded; // contains userId and role of the user
    // If the token is valid, the decoded payload is assigned to req.user.
    next(); // Call the next middleware or route handler in the stack
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
// This middleware function is used to authenticate users by verifying the JWT (JSON Web Token) provided in the request headers.
// It checks if the token is present, verifies its validity, and extracts user information from it.
// If the token is valid, it adds the user information to the request object and calls the next middleware or route handler.
// If the token is missing or invalid, it sends an appropriate error response to the client.
// This is useful for protecting routes that require authentication, ensuring that only authorized users can access them.

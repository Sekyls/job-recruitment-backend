const express = require("express"); // Import express
const mongoose = require("mongoose"); // Import mongoose for MongoDB connection
const cors = require("cors"); // Import cors for Cross-Origin Resource Sharing
const dotenv = require("dotenv").config(); // Import dotenv for environment variables
const authRoutes = require("./routes/authRoutes"); // Import authentication routes
const jobRoutes = require("./routes/jobRoutes"); // Import job routes
const applicationRoutes = require("./routes/applicationRoutes"); // Import application routes
const helmet = require("helmet"); // Import helmet for security headers
const rateLimit = require("express-rate-limit"); // Import express-rate-limit for rate limiting
const app = express(); // Create an instance of express
const errorHandler = require("./middlewares/errorHandler"); // Import custom error handler middleware
const fileUpload = require("express-fileupload");
const fallbackHandler = require("./middlewares/Fallback_Handler"); // Import fallback handler middleware

const limiter = rateLimit({
  // Create a rate limiter middleware
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests. Please try again later.",
});

// Middleware to incoming JSON requests
app.use(express.json()); // Parse incoming JSON requests
app.use(
  cors({
    // Enable CORS for all routes
    origin: "*", // Allow all origins (you can specify specific origins if needed)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific HTTP methods
    preflightContinue: false, // Do not pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204, // Use 204 for successful OPTIONS requests
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files instead of memory
    tempFileDir: "/tmp/", // Temporary directory
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true, // Return error if file exceeds limit
  })
);
app.use("/api/auth", authRoutes); // Use authRoutes for authentication-related routes
app.use("/api/jobs", jobRoutes); // Use jobRoutes for job-related routes
app.use("/api", applicationRoutes); // Use applicationRoutes for job application-related routes
app.use(fallbackHandler); // Use fallback handler middleware for undefined routes
app.use(helmet()); // Use helmet to set security-related HTTP headers
app.use(limiter); // Use the rate limiter middleware
app.use(errorHandler); // Use custom error handler middleware

module.exports = app; // Export the app for testing purposes
// This allows the app to be imported in test files for unit testing

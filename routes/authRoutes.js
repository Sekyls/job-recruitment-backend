const express = require("express"); // Import express to create a router
const router = express.Router(); // Create a new router instance
const { registerUser } = require("../controllers/authController");
// Import the registerUser function from the authController file
// This function is responsible for handling user registration requests.
// This function handles the registration logic for new users.
// It typically includes steps like validating the input data, checking for existing users, hashing passwords, and saving the user to the database.
// The registerUser function is called when a POST request is made to the "/register" endpoint.
const { loginUser } = require("../controllers/authController"); // Import the loginUser function from the authController file
// This function is responsible for handling user login requests.
const { loginSchema } = require("../validations/authValidation"); // Import the loginSchema from the authValidation file
// This schema defines the validation rules for user login data.
const validate = require("../middlewares/validate"); // Import the validate middleware
// This middleware is used to validate incoming requests against defined schemas.
const { registerSchema } = require("../validations/authValidation");
// Import the registerSchema from the authValidation file
// This schema defines the validation rules for user registration data.
router.post("/register", validate(registerSchema), registerUser);
// Define a POST route for user registration
// The route is defined using the router.post method, which creates a new POST endpoint.
// The first argument is the path ("/register"), and the second argument is the middleware function to validate the request body.
// The route listens for POST requests to the "/register" endpoint.
// When a request is received, the validate middleware is called first to validate the request body against the registerSchema.
// If the validation passes, the registerUser function is called to handle the registration logic.
// If the validation fails, an error response is sent back to the client.
router.post("/login", validate(loginSchema), loginUser); // Define a POST route for user login
// The route is defined using the router.post method, which creates a new POST endpoint.
module.exports = router; // Export the router so it can be used in other parts of the application
// This allows the router to be imported and used in the main application file or other route files.

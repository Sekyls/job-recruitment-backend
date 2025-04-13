const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
// Bcrypt is a library used for hashing passwords securely.
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for creating JWT tokens
// Jsonwebtoken is a library used for creating and verifying JSON Web Tokens (JWTs).
const User = require("../models/User"); // Import the User model to interact with the user collection in the database
// The User model defines the schema and methods for interacting with user data in the database.

exports.registerUser = async function (req, res) {
  // Function to handle user registration
  // This function is responsible for registering a new user in the system.
  try {
    const { name, email, password, role, dateOfBirth } = req.body; // Destructure the request body to get user details
    // Extract user details from the request body

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email }); // Check if a user with the same email already exists in the database
    // The findOne method is used to search for a single document in the user collection that matches the specified criteria.
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." }); // If a user with the same email is found, send a 409 Conflict response
      // The status code 409 indicates a conflict with the current state of the resource.
    }

    // 2. Hash the password
    const saltRounds = 10; // Define the number of rounds for hashing the password
    // Salt rounds determine the computational cost of hashing the password.
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password using bcrypt
    // The hash method takes the password and the number of salt rounds as arguments.

    // 3. Create new user
    const newUser = new User({
      // Create a new user instance using the User model
      // The User model defines the schema for user documents in the database.
      name,
      email,
      password: hashedPassword, // Store the hashed password instead of the plain text password
      // The hashed password is stored in the database for security purposes.
      role: role || "seeker", // Set the user role, defaulting to "seeker" if not provided
      // The role determines the user's permissions and access levels in the application.
      dateOfBirth,
    });

    await newUser.save(); // Save the new user to the database
    // The save method is used to persist the new user document in the database.

    // 4. Create JWT token
    const token = jwt.sign(
      // Create a JWT token for the new user
      // The sign method is used to create a new JWT token.
      { userId: newUser._id, role: newUser.role }, // The payload contains the user ID and role.
      // The payload is the data that will be encoded in the token.
      process.env.JWT_SECRET, // The secret key used to sign the token. It should be kept secret and not exposed publicly.
      // The secret key is used to verify the authenticity of the token.
      { expiresIn: process.env.JWT_EXPIRES_IN } // The expiration time for the token. It determines how long the token is valid.
      // The expiresIn option specifies the duration after which the token will expire.
    );

    // 5. Respond
    res.status(201).json({
      // Send a 201 Created response with the user details and token
      // The status code 201 indicates that a new resource has been created successfully.
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    // Handle any errors that occur during the registration process
    // The catch block is used to handle any errors that may occur during the try block.
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// .................................................................................................................................
exports.loginUser = async function (req, res) {
  // Function to handle user login
  // This function is responsible for authenticating a user and generating a JWT token.
  try {
    const { email, password } = req.body; // Destructure the request body to get user credentials
    // Extract user credentials from the request body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password"); // Check if a user with the provided email exists in the database
    // The select method is used to include the password field in the query result.
    // The findOne method is used to search for a single document in the user collection that matches the specified criteria.
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // If the user is not found, send a 401 Unauthorized response
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password stored in the database
    // The compare method takes the plain text password and the hashed password as arguments.
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" }); // If the passwords do not match, send a 401 Unauthorized response
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Create a JWT token for the authenticated user
      // The payload contains the user ID and role.
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } // The secret key used to sign the token and the expiration time for the token
      // The expiresIn option specifies the duration after which the token will expire.
    );

    // Respond with token + user info
    res.status(200).json({
      // Send a 200 OK response with the user details and token
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Handle any errors that occur during the login process
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

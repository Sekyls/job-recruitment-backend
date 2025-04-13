const mongoose = require("mongoose"); // Import mongoose for MongoDB connection

const userSchema = new mongoose.Schema({
  // Field to store the name of the user
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Automatically trim whitespace from the name
  },

  // Field to store the dateOfBirth of the user
  dateOfBirth: {
    type: Date,
    required: true, // Date of birth is required
    validate: {
      validator: (value) => {
        return value <= Date.now(); // Ensure date of birth is in the past
      },
      message: (props) =>
        `${props.value} is not a valid date of birth! Date of birth must be in the past.`, // Error message if validation fails
    },
  },

  // Field to store the email of the user
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Ensure email is unique
    lowercase: true, // Convert email to lowercase
    trim: true, // Automatically convert email to lowercase and trim whitespace
    validate: {
      // Custom validation for email format
      validator: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Regular expression to validate email format
      },
    },
    message: (props) => `${props.value} is not a valid email!`, // Error message if validation fails
  },

  // Field to store the password of the user
  password: {
    type: String,
    required: true, // Password is required
    select: false, // Exclude password from queries by default
    validate: {
      // Custom validation for password length and complexity
      validator: (value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value); // Regular expression to validate password complexity
      },
      // Error message if validation fails
      message: (props) =>
        `${props.value} is not a valid password! Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.`,
    },
  },

  // Field to store the role of the user
  role: {
    type: String,
    enum: ["seeker", "employer"], // Possible values for the role field
    default: "seeker", // Default value is "seeker"
  },

  // Field to store the creation date
  createdAt: {
    type: Date, // Field to store the creation date
    default: Date.now, // Automatically set the creation date to now
    immutable: true, // Prevents modification of this field after creation
  },
});

const User = mongoose.model("User", userSchema); // Create a model named "User" using the userSchema
module.exports = User; // Export the User model for use in other files
// This model can be used to create, read, update, and delete user documents in the MongoDB database

const Joi = require("joi"); // Import Joi for validation

const registerSchema = Joi.object({
  // Define the validation schema for user registration
  // Joi.object() creates a new schema object for validating an object.
  // The schema defines the structure and validation rules for the object being validated.
  // The object() method is used to create a schema for an object type.
  // The schema defines the expected properties and their validation rules.
  // Each property is defined using the appropriate Joi validation method.
  // The schema is used to validate the request body when a user registers.
  // The validation rules ensure that the data provided by the user meets the specified criteria.

  name: Joi.string().min(2).max(50).required(), // Validate name with minimum length of 2 and maximum length of 50 characters
  email: Joi.string().email().required(), // Validate email format
  password: Joi.string().min(8).required(), // Validate password with minimum length of 8 characters
  role: Joi.string().valid("seeker", "employer").required(), // Validate role as either "seeker" or "employer"
  dateOfBirth: Joi.date().required(), // Validate date of birth as a date
});

const loginSchema = Joi.object({
  // Define the validation schema for user login
  // The loginSchema is used to validate the request body when a user logs in.
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { registerSchema, loginSchema }; // Export the validation schemas for use in other parts of the application
// This module exports the validation schemas for user registration and login using Joi.

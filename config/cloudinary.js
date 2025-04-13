const cloudinary = require("cloudinary").v2; // Import the Cloudinary library

cloudinary.config({
  // Configure Cloudinary with environment variables
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud name from Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY, // API key from Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret from Cloudinary dashboard
  secure: true, // Use HTTPS for secure connections
});

module.exports = cloudinary;
// This module exports the configured Cloudinary instance for use in other parts of the application.
// This allows for easy uploading and management of images/documents in Cloudinary.
// The configuration is done using environment variables to keep sensitive information secure.
// The exported instance can be used to upload files, delete files, and perform other operations on Cloudinary.

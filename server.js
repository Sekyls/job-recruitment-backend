const mongoose = require("mongoose"); // Import mongoose for MongoDB connection
const dotenv = require("dotenv"); // Import dotenv for environment variables
const app = require("./app"); // Import the Express app from app.js
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000; // Set the server port from environment variables or default to 5000
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from environment variables

async function startServer() {
  // Function to start the server and connect to MongoDB
  if (!MONGO_URI) {
    console.error("MongoDB URI is not defined in the environment variables.");
    process.exit(1); // Exit the process with a failure code (1)
  }
  try {
    await mongoose.connect(MONGO_URI); // Connect to MongoDB using the URI
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      // Start the Express server on the specified port
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with a failure code (1)
  }
}

startServer();
// This code connects to a MongoDB database using Mongoose and starts an Express server.
// It uses environment variables to configure the database connection and server port.
// If the connection to MongoDB fails, it logs an error message and exits the process with a failure code (1).

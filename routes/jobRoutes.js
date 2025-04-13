const express = require("express"); // Import express to create a router for handling job-related routes
const router = express.Router(); // Create a new router instance
const {
  postJob,
  searchJobs,
  updateJob,
  deleteJob,
  getJobById,
} = require("../controllers/jobController");
// Import the postJob and searchJobs functions from the jobController
// These functions will handle the logic for posting and searching jobs
const authenticateUser = require("../middlewares/authenticateUser"); // Import middleware to authenticate users
const authorizeRole = require("../middlewares/authorizeRole"); // Import middleware to authorize user roles
router.post("/post-job", authenticateUser, authorizeRole("employer"), postJob); // Define a POST route for posting a job
// The route is protected by authentication and authorization middleware
router.get("/search", searchJobs);
// Define a GET route for searching jobs
// This route is not protected, so anyone can access it
router.get("/:id", getJobById); // Define a GET route for getting a job by ID
// Update job by ID
router.put("/:id", authenticateUser, authorizeRole("employer"), updateJob);

// Delete job by ID
router.delete("/:id", authenticateUser, authorizeRole("employer"), deleteJob);

module.exports = router; // Export the router so it can be used in other parts of the application

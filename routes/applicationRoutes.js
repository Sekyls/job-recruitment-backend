const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getJobApplications,
  getUserApplications,
} = require("../controllers/applicationController");
const authenticateUser = require("../middlewares/authenticateUser");
const authorizeRole = require("../middlewares/authorizeRole");

// Seeker applies with files
router.post(
  "/apply/:jobId",
  authenticateUser,
  authorizeRole("seeker"),
  applyToJob
);

// Employer views applications
router.get(
  "/employer/applications/:jobId",
  authenticateUser,
  authorizeRole("employer"),
  getJobApplications
);

// GET /api/applications/user/:userId
router.get(
  "/user/applications/:userId",
  authenticateUser,
  authorizeRole("seeker"),
  getUserApplications
);

module.exports = router;

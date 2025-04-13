const mongoose = require("mongoose"); // Import mongoose for MongoDB connection

const applicationSchema = new mongoose.Schema( // Define the schema for job applications
  {
    job: {
      // Reference to the job being applied for
      type: mongoose.Schema.Types.ObjectId, // Reference to the Job model
      ref: "Job", // This allows us to populate the job details later
      required: true,
    },
    applicant: {
      // Reference to the user applying for the job
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // This allows us to populate the user details later
      required: true,
    },
    coverLetter: {
      // Cover letter provided by the applicant
      type: String,
      required: true,
    },
    documents: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        fileType: {
          type: String,
          enum: ["pdf", "doc", "docx", "txt"], // Add allowed types
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"], // Valid statuses
      default: "pending",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
  // to the application documents
);

module.exports = mongoose.model("Application", applicationSchema); // Export the Application model based on the schema defined above
// This model can be used to interact with the applications collection in the MongoDB database

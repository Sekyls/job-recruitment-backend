const mongoose = require("mongoose"); // Import mongoose to create a schema for the Job model

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    employer: {
      // Reference to the User model
      // This field will store the ID of the user who created the job
      type: mongoose.Schema.Types.ObjectId, // ObjectId is a special type in MongoDB used for unique identifiers
      // It is used to create a reference to another document in a different collection
      ref: "User", // This field will reference the User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema); // Export the Job model so it can be used in other parts of the application
// The model is created using the jobSchema and is named "Job"

const Job = require("../models/Job"); // Import the Job model to interact with the jobs collection in the database

exports.postJob = async function (req, res) {
  // Function to handle posting a job
  try {
    const { title, description, requirements, location, industry, skills } =
      req.body; // Destructure the request body to get job details
    // Validate required fields

    // Create job
    const job = await Job.create({
      // Create a new job document in the database
      // using the Job model's create method
      title,
      description,
      requirements,
      location,
      industry,
      skills,
      employer: req.user.userId, // from JWT token
      // Get the employer ID from the JWT token
    });

    res.status(201).json({
      // Send a response back to the client
      message: "Job posted successfully",
      job,
    });
  } catch (err) {
    console.error("Post job error:", err);
    res.status(500).json({ message: "Server error" }); // Handle server errors
  }
};
// ...........................................................................................................................................
exports.searchJobs = async function (req, res) {
  // Function to handle searching for jobs
  // This function will be called when a GET request is made to the /search-jobs endpoint
  try {
    const { title, location, industry, skills } = req.query; // Get search parameters from the query string
    // Destructure the request query to get search parameters

    // Create dynamic filter object
    const filter = {}; // Initialize an empty filter object
    // This object will be used to build the search query

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive
      // This will allow searching for jobs based on title
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive
      // This will allow searching for jobs based on location
    }
    if (industry) {
      filter.industry = { $regex: industry, $options: "i" }; // case-insensitive
      // This will allow searching for jobs based on industry
    }
    if (skills) {
      // Convert skills to array if comma separated
      const skillsArray = skills // Check if skills are provided in the query string
        .split(",") // Split the skills string into an array using comma as a separator
        .filter((skill) => skill.trim() !== "") // Filter out any empty strings
        .map((skill) => skill.trim().toLowerCase()); // Convert each skill to lowercase
      // This will allow searching for jobs based on skills
      filter.skills = { $in: skillsArray }; // Use $in operator to match any of the skills in the array
      // This will allow searching for jobs that match any of the skills in the array
    }

    const jobs = await Job.find(filter).populate("employer", "name email"); // Find jobs based on the filter object
    // Populate the employer field with name and email from the User model

    res.status(200).json({
      // Send a response back to the client
      // with the list of jobs found
      message: "Jobs fetched successfully",
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("Job search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// .....................................................................................................................................
// Fetch job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Find a job by its ID
    // using the Job model's findById method
    if (!job) {
      // Check if the job exists
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.log("Error fetching job:", error); // Log the error details for debugging
    res.status(500).json({ message: "Server Error" });
  }
};
// ................................................................................................................................................
// Update job by ID
exports.updateJob = async (req, res) => {
  try {
    const { title, description, requirements, location, industry, skills } =
      req.body;
    const job = await Job.findById(req.params.id);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user is the employer who created the job
    if (job.employer.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only update your own jobs." });
    }

    // Update job
    // Only update fields that are provided
    if (req.body.title) job.title = req.body.title;
    if (req.body.description) job.description = req.body.description;
    if (req.body.requirements) job.requirements = req.body.requirements;
    if (req.body.location) job.location = req.body.location;
    if (req.body.industry) job.industry = req.body.industry;
    if (req.body.skills) job.skills = req.body.skills;

    const updatedJob = await job.save();
    res
      .status(200)
      .json({ success: true, message: "Job updated successfully", updatedJob });
  } catch (error) {
    console.error("Error updating job:", error); // Log the error details for debugging
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ...............................................................................................................................................
// Delete job by ID
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user is the employer who created the job
    if (job.employer.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only delete your own jobs." });
    }

    await job.deleteOne(); // Delete the job from the database
    // using the Job model's deleteOne method
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error); // Log the error details for debugging
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

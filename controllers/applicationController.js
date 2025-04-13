const Application = require("../models/Application"); // Import the Application model for job applications
const Job = require("../models/Job"); // Import the Job model for job-related operations
const cloudinary = require("../config/cloudinary"); // Import Cloudinary configuration for file uploads

exports.applyToJob = async function (req, res) {
  try {
    // File validation
    if (!req.files?.file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Input validation
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;
    const userId = req.user.userId;

    if (!jobId || !coverLetter) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing application
    if (await Application.exists({ job: jobId, applicant: userId })) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Process files
    const files = Array.isArray(req.files.file)
      ? req.files.file
      : [req.files.file];
    const uploadedDocs = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop().toLowerCase();

      // Validate file extension
      if (!["pdf", "doc", "docx", "txt"].includes(fileExt)) {
        return res.status(400).json({
          message: "Invalid file type. Only PDF/DOC/DOCX allowed",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",
        folder: "applications",
        allowed_formats: ["pdf", "doc", "docx", "txt"],
      });

      uploadedDocs.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        fileType: fileExt, // Use validated extension
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      coverLetter,
      documents: uploadedDocs,
      status: "pending", // Use valid enum value
    });

    return res.status(201).json({
      success: true,
      application: {
        id: application._id,
        status: application.status,
        documents: application.documents,
      },
    });
  } catch (error) {
    console.error("Application error:", error);
    return res.status(500).json({
      success: false,
      message: "Application failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// ..................................................................................................................................................
exports.getJobApplications = async function (req, res) {
  // Function to fetch job applications for an employer
  // This function is responsible for retrieving job applications for a specific employer
  try {
    const employerId = req.user.userId; // Get the employerId from the authenticated user
    // This is the ID of the employer who is logged in
    const { jobId } = req.params.jobId; // Get jobId from the query string
    // This allows filtering applications by jobId if provided

    const filter = {}; // Initialize an empty filter object
    // This object will be used to build the search query
    if (jobId) filter.job = jobId; // If jobId is provided, add it to the filter object
    // This allows filtering applications by jobId if provided

    // Get all jobs created by the employer
    const employerJobs = await Job.find({ employer: employerId }).select("_id");
    const employerJobIds = employerJobs.map((job) => job._id.toString());

    // Find applications for these jobs
    const applications = await Application.find({
      // Find applications based on the filter object
      // using the Application model
      ...filter, // Apply the filter object to the query
      // This allows filtering applications based on the provided filter
      job: { $in: employerJobIds }, // Check if the jobId is in the list of employer's jobs
    })
      .populate("job", "title") // Populate the job field with job title
      .populate("documents.fileType") // Populate the fileType field in documents
      .populate("applicant", "name email") // Populate the applicant field with name and email
      .populate("job.industry") // Populate the industry field in job
      .select("-__v") // optional: remove mongoose versioning field
      // This removes the __v field from the response
      .sort({ createdAt: -1 }); // Sort applications by creation date in descending order
    // This sorts the applications by the createdAt field in descending order

    res.status(200).json({
      message: "Applications fetched", // Send a success message
      count: applications.length, // Send the count of applications fetched
      // This is the number of applications found based on the filter
      applications, // Send the list of applications fetched
      // This is the array of applications found based on the filter
    });
  } catch (err) {
    console.error("Fetch applications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// .........................................................................................................................................

exports.getUserApplications = async function (req, res) {
  try {
    const userId = req.params.userId; // Get the userId from the request parameters
    // This is the ID of the user whose applications are being fetched
    const applications = await Application.find({ applicant: userId }) // Find applications for the user
      .populate("applicant", "name email") // Populate the applicant field with name and email
      .populate("job", "title location") // Populate the job field with title and location
      .populate("documents.fileType") // Populate the fileType field in documents
      .sort({ createdAt: -1 }); // Sort applications by creation date in descending order
    // This sorts the applications by the createdAt field in descending order

    res.status(200).json(applications); // Send the applications as a response
    // This sends the array of applications found based on the userId
  } catch (error) {
    console.error("Error fetching applications:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch applications", error });
  }
};

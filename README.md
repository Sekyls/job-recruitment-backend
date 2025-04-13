# Job Recruitment Platform - Backend

This is the backend of a Job Recruitment Platform built using **Node.js**, **Express.js**, and **MongoDB**.  
It provides RESTful APIs for user management, job listings, job search, applications, and file uploads.

## Features

- User Registration & Authentication (Job Seeker & Employer roles)
- JWT-based protected routes
- Employers can post and manage job listings
- Job seekers can search and apply for jobs
- CVs and certificates uploaded via **Cloudinary**
- MongoDB for flexible data storage
- Robust validation using **Joi**
- Secure password hashing with **bcrypt**
- Clean folder structure for scalability

## Folder Structure

│project-root/
├── controllers/ # Request logic
├── models/ # Mongoose schemas
├── routes/ # Express routes
├── middlewares/ # Auth, validation, file handling
├── validators/ # Joi schemas
├── config/ # Cloudinary setup
├── app.js # Express setup
├── server.js # MongoDB connection & server start
├── .env # Environment variables
├── .gitignore # Ignored files/folders
└── README.md # This file

## Environment Variables

Create a `.env` file in the root:
PORT=******\*******
MONGO_URI=******\*******
JWT_SECRET=********\*\*\*********
JWT_EXPIRES_IN=1h
CLOUDINARY_CLOUD_NAME=****\*\*\*****
CLOUDINARY_API_KEY=********\*\*\*\*********
CLOUDINARY_API_SECRET=******\*\*\*\*******
CLOUDINARY_URL=******\*******

## Run the Application

Install dependencies:

```bash
npm install
npm start

## API Endpoints
🔐 Auth
POST /api/auth/register – Register user
POST /api/auth/login – Login user

💼 Jobs
POST /api/jobs/ – Create a new job (Employer only)
GET /api/jobs/ – List all jobs
GET /api/jobs/:id – Get a single job
PUT /api/jobs/:id – Update job
DELETE /api/jobs/:id – Delete job

📄 Applications
POST /api/applications/:jobId – Apply to a job (with file upload)
GET /api/applications/job/:jobId – Get all applications for a job
GET /api/applications/user/:userId – Get all applications by a user

## 📬 Postman Collection
You can test all API endpoints using the provided Postman collection:
[`job-recruitment-api.postman_collection.json`](./job-recruitment-api.postman_collection.json)
Just import it into Postman and start testing!

☁️ Cloudinary File Uploads
CVs and certificates are uploaded using the multer middleware + Cloudinary.
Ensure your Cloudinary keys are added in the .env file.

🔐 Security Features
Password hashing with bcrypt
JWT authentication
Joi validation for incoming requests
Helmet & CORS middleware

✅ To Do (Future Enhancements)
Email notifications for applications
Pagination and filtering for job listings
Admin dashboard
Rate limiting for brute-force protection

📌 License
This project is for educational purposes.
Use it freely, modify it, and learn from it.

💬 Feedback or Questions?
Feel free to reach out if you have suggestions or questions!

```

# UpTask Backend - Project Management API

🚀 **MERN Stack Project** - MongoDB | Express | React | Node.js

A robust RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** for managing projects, tasks, and team collaboration. This is the backend service for a full-stack MERN application.

## 📋 Project Overview

This backend service powers a project management dashboard that enables teams to collaborate effectively. It provides a complete solution for:

- **Project Management**: Create, update, and delete projects
- **Task Organization**: Manage tasks within projects with different statuses
- **Team Collaboration**: Add and manage team members with role-based access
- **User Authentication**: Secure JWT-based authentication system
- **Email Notifications**: Automated email system using Nodemailer with Mailtrap sandbox

## 🎯 Objective

The main objective of this API is to provide a scalable and secure backend infrastructure for project management, enabling teams to:

1. **Organize Work**: Structure projects and break them down into manageable tasks
2. **Collaborate Efficiently**: Add team members to projects and track progress together
3. **Secure Access**: Implement authentication and authorization to protect project data
4. **Stay Informed**: Receive email notifications for important events (account verification, password reset, team invitations)

## 🚀 Real Impact

This backend service enables:

- **Centralized Project Management**: All project information stored securely in MongoDB
- **Real-time Collaboration**: Multiple team members can work on the same project simultaneously
- **Data Integrity**: TypeScript ensures type safety and reduces runtime errors
- **Scalability**: MongoDB and Express provide a foundation that can scale with user growth
- **Security**: JWT tokens and bcrypt password hashing protect user data

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **Email Service**: Nodemailer with Mailtrap
- **Validation**: express-validator
- **Development**: nodemon, ts-node

## 📁 Project Structure

```
src/
├── config/           # Configuration files (DB, CORS, Nodemailer)
├── controllers/      # Request handlers (Auth, Project, Task, Team)
├── emails/          # Email templates
├── middleware/      # Authentication & validation middleware
├── models/          # Mongoose schemas (User, Project, Task, Token)
├── routes/          # API route definitions
├── index.ts         # Application entry point
└── server.ts        # Express server configuration
```

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Mailtrap account (for email testing)

### Steps

1. **Clone the repository**

```bash
git clone git@github.com:irenemonzon/server_task_mongoDB.git
cd server_task_mongoDB
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/uptask
# Or for MongoDB Atlas:
# DATABASE_URL=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Email Configuration (Mailtrap Sandbox)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
```

4. **Start the development server**

```bash
npm run dev
```

The API will be running at `http://localhost:4000`

## 🔧 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the server | `4000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/uptask` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS configuration | `http://localhost:5173` |
| `SMTP_HOST` | Mailtrap SMTP host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | Mailtrap SMTP port | `2525` |
| `SMTP_USER` | Mailtrap username | From your Mailtrap inbox |
| `SMTP_PASS` | Mailtrap password | From your Mailtrap inbox |

### 📧 Email Configuration (Mailtrap)

This project uses **Mailtrap Sandbox** for email testing in development:

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Create a new inbox
3. Copy the SMTP credentials (host, port, username, password)
4. Add them to your `.env` file

**Note**: Mailtrap is a safe email testing tool that captures emails without sending them to real recipients. Perfect for development and testing!

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/confirm-account` - Confirm email account
- `POST /api/auth/request-code` - Request new confirmation code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/validate-token` - Validate reset token
- `POST /api/auth/update-password/:token` - Update password with token
- `GET /api/auth/user` - Get current user info

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `GET /api/projects/:projectId/tasks/:taskId` - Get task details
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task
- `POST /api/projects/:projectId/tasks/:taskId/status` - Update task status

### Team Management
- `POST /api/projects/:projectId/team` - Add team member
- `GET /api/projects/:projectId/team` - Get team members
- `DELETE /api/projects/:projectId/team/:userId` - Remove team member

## 🔐 Authentication Flow

1. User registers with email and password
2. Confirmation email sent via Mailtrap
3. User confirms account with 6-digit code
4. User logs in and receives JWT token
5. Token must be included in Authorization header for protected routes

```bash
Authorization: Bearer <your-jwt-token>
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

The TypeScript code will be compiled to the `dist/` directory.

### Environment Setup

Make sure to update your `.env` file for production:
- Use a secure `JWT_SECRET`
- Configure production MongoDB URL (MongoDB Atlas recommended)
- Update `FRONTEND_URL` to your production frontend URL
- For production emails, replace Mailtrap with a real SMTP service (SendGrid, AWS SES, etc.)

## 🌐 Live Demo

- **Frontend URL**: https://task-frontend-seven-iota.vercel.app
- **Test Account**: 
  - Email: `irene@gmail.com`
  - Password: `123456789`

## 📝 Testing the Application

Using the test account, you can:

1. ✅ **Login** to the dashboard
2. ✅ **Create new projects** with name, description, and client information
3. ✅ **Add tasks** to projects with different statuses (pending, on hold, in progress, under review, completed)
4. ✅ **Move tasks** between different status columns
5. ✅ **Edit and delete** both projects and tasks
6. ✅ **Invite team members** to collaborate on projects
7. ✅ **Manage team** by adding or removing members

## 🔗 Related Projects

- **Frontend**: See `Task-frontend` https://github.com/irenemonzon/Task-frontend

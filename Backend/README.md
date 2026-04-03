# University Management System - Backend

MERN Stack backend API for University Management System.

## Features

- User authentication (JWT-based)
- Role-based access control (Student/Teacher)
- Course management
- Student enrollment system
- Timetable management
- Notice board system

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start MongoDB (if running locally):
```bash
# For Windows
mongod

# For Mac/Linux
sudo systemctl start mongod
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Courses
- `GET /api/courses` - Get all courses (Protected)
- `GET /api/courses/:id` - Get course by ID (Protected)
- `POST /api/courses` - Create course (Teacher only)
- `PUT /api/courses/:id` - Update course (Teacher only)
- `DELETE /api/courses/:id` - Delete course (Teacher only)
- `POST /api/courses/:id/enroll` - Enroll in course (Student only)
- `POST /api/courses/:id/unenroll` - Unenroll from course (Student only)
- `GET /api/courses/teacher/:teacherId` - Get courses by teacher (Protected)

### Timetable
- `GET /api/timetable` - Get all timetable entries (Protected)
- `GET /api/timetable/course/:courseId` - Get timetable by course (Protected)
- `GET /api/timetable/teacher/:teacherId` - Get timetable by teacher (Protected)
- `POST /api/timetable` - Create timetable entry (Teacher only)
- `PUT /api/timetable/:id` - Update timetable entry (Teacher only)
- `DELETE /api/timetable/:id` - Delete timetable entry (Teacher only)

### Notices
- `GET /api/notices` - Get all notices (Protected)
- `GET /api/notices/:id` - Get notice by ID (Protected)
- `POST /api/notices` - Create notice (Teacher only)
- `PUT /api/notices/:id` - Update notice (Teacher only)
- `DELETE /api/notices/:id` - Delete notice (Teacher only)
- `GET /api/notices/department/:department` - Get notices by department (Protected)

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Project Structure

```
Backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User model
│   ├── Course.js          # Course model
│   ├── Timetable.js       # Timetable model
│   └── Notice.js          # Notice model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── courses.js         # Course routes
│   ├── timetable.js       # Timetable routes
│   └── notices.js         # Notice routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── server.js              # Main server file
├── .env                   # Environment variables
├── .env.example           # Example environment file
└── package.json           # Dependencies
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## License

MIT

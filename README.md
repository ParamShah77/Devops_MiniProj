# University Management System

A comprehensive university management system built with the MERN stack (MongoDB, Express, React, Node.js) and Next.js.

## Features

### For Students
- User authentication and registration
- Course enrollment with password protection
- View enrolled courses and available courses
- Access timetable
- View department notices

### For Teachers
- User authentication and registration
- Create and manage courses
- Add/edit timetable entries
- Post notices to departments
- View enrolled students in courses

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
University_Devop/
├── Frontend/           # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── lib/          # Utilities and API services
│   └── ...
├── Backend/           # Express backend API
│   ├── config/       # Configuration files
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Entry point
└── README.md         # This file
```

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start MongoDB:
```bash
# For Windows
mongod

# For Mac/Linux
sudo systemctl start mongod
```

6. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running the Full Application

1. Start MongoDB service
2. Start the backend server (Terminal 1):
```bash
cd Backend
npm run dev
```

3. Start the frontend (Terminal 2):
```bash
cd Frontend
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Teacher)
- `PUT /api/courses/:id` - Update course (Teacher)
- `DELETE /api/courses/:id` - Delete course (Teacher)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)
- `POST /api/courses/:id/unenroll` - Unenroll from course (Student)

### Timetable
- `GET /api/timetable` - Get all timetable entries
- `POST /api/timetable` - Create timetable entry (Teacher)
- `PUT /api/timetable/:id` - Update entry (Teacher)
- `DELETE /api/timetable/:id` - Delete entry (Teacher)

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (Teacher)
- `PUT /api/notices/:id` - Update notice (Teacher)
- `DELETE /api/notices/:id` - Delete notice (Teacher)

## Default Demo Accounts (Frontend Only - Before Backend Integration)

### Student
- Email: alex@meridian.edu
- Password: any

### Teacher
- Email: sarah@meridian.edu
- Password: any

**Note:** After backend integration, you'll need to register new accounts through the registration form.

## Features Implementation

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Student/Teacher)
- Protected routes

### Course Management
- Teachers can create, update, and delete courses
- Students can browse and enroll in courses
- Password-protected enrollment
- Track enrolled students

### Timetable
- Visual schedule display
- Day-wise and time-wise organization
- Course-linked timetable entries

### Notices
- Department-wise notices
- Priority levels (low, medium, high)
- Teacher-only posting

## Development

### Backend Development
- Uses nodemon for auto-reload
- RESTful API design
- MongoDB with Mongoose ODM
- JWT token-based authentication

### Frontend Development
- Next.js with App Router
- Client-side components with "use client"
- Tailwind CSS for styling
- Responsive design

## Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Ensure MongoDB connection string is set
3. Deploy using platform-specific instructions

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@meridian.edu or open an issue in the repository.

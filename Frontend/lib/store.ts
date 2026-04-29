export type UserRole = "student" | "teacher"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

export interface Course {
  id: string
  name: string
  code: string
  teacher: string
  teacherId: string
  department: string
  credits: number
  enrollmentPassword: string
  description: string
  enrolledStudents: string[]
}

export interface TimetableEntry {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  day: string
  startTime: string
  endTime: string
  room: string
  teacher: string
}

export interface Notice {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  date: string
  priority: "low" | "medium" | "high"
  department: string
}

// Demo data
export const DEMO_COURSES: Course[] = [
  {
    id: "c1",
    name: "Data Structures & Algorithms",
    code: "CS201",
    teacher: "Dr. Sarah Mitchell",
    teacherId: "t1",
    department: "Computer Science",
    credits: 4,
    enrollmentPassword: "dsa2026",
    description: "Comprehensive study of fundamental data structures and algorithm design techniques.",
    enrolledStudents: ["s1"],
  },
  {
    id: "c2",
    name: "Linear Algebra",
    code: "MATH301",
    teacher: "Prof. James Chen",
    teacherId: "t2",
    department: "Mathematics",
    credits: 3,
    enrollmentPassword: "linalg26",
    description: "Vectors, matrices, linear transformations, eigenvalues and eigenvectors.",
    enrolledStudents: [],
  },
  {
    id: "c3",
    name: "Operating Systems",
    code: "CS305",
    teacher: "Dr. Sarah Mitchell",
    teacherId: "t1",
    department: "Computer Science",
    credits: 4,
    enrollmentPassword: "os2026",
    description: "Process management, memory management, file systems, and concurrency.",
    enrolledStudents: ["s1"],
  },
]

export const DEMO_TIMETABLE: TimetableEntry[] = [
  { id: "tt1", courseId: "c1", courseName: "Data Structures & Algorithms", courseCode: "CS201", day: "Monday", startTime: "09:00", endTime: "10:30", room: "Room 204", teacher: "Dr. Sarah Mitchell" },
  { id: "tt2", courseId: "c3", courseName: "Operating Systems", courseCode: "CS305", day: "Monday", startTime: "11:00", endTime: "12:30", room: "Room 301", teacher: "Dr. Sarah Mitchell" },
  { id: "tt3", courseId: "c2", courseName: "Linear Algebra", courseCode: "MATH301", day: "Tuesday", startTime: "10:00", endTime: "11:30", room: "Room 105", teacher: "Prof. James Chen" },
  { id: "tt4", courseId: "c1", courseName: "Data Structures & Algorithms", courseCode: "CS201", day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "Room 204", teacher: "Dr. Sarah Mitchell" },
  { id: "tt5", courseId: "c3", courseName: "Operating Systems", courseCode: "CS305", day: "Thursday", startTime: "11:00", endTime: "12:30", room: "Room 301", teacher: "Dr. Sarah Mitchell" },
  { id: "tt6", courseId: "c2", courseName: "Linear Algebra", courseCode: "MATH301", day: "Friday", startTime: "10:00", endTime: "11:30", room: "Room 105", teacher: "Prof. James Chen" },
]

export const DEMO_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "Mid-Semester Examinations Schedule",
    content: "Mid-semester examinations will be conducted from March 15 to March 22. Please check the examination portal for your individual schedule and room assignments.",
    author: "Dr. Sarah Mitchell",
    authorId: "t1",
    date: "2026-02-14",
    priority: "high",
    department: "Computer Science",
  },
  {
    id: "n2",
    title: "Guest Lecture on Machine Learning",
    content: "A guest lecture on 'Recent Advances in Machine Learning' will be held on February 20 at 2:00 PM in the Main Auditorium. All students are encouraged to attend.",
    author: "Prof. James Chen",
    authorId: "t2",
    date: "2026-02-12",
    priority: "medium",
    department: "Mathematics",
  },
  {
    id: "n3",
    title: "Library Hours Extended",
    content: "The university library will remain open until 11:00 PM on weekdays during the examination period. Weekend hours will be 8:00 AM to 9:00 PM.",
    author: "Dr. Sarah Mitchell",
    authorId: "t1",
    date: "2026-02-10",
    priority: "low",
    department: "Computer Science",
  },
]

export const DEMO_USERS = {
  students: [
    { id: "s1", name: "Alex Johnson", email: "alex@spit.ac.in", role: "student" as UserRole, department: "Computer Science" },
  ],
  teachers: [
    { id: "t1", name: "Dr. Sarah Mitchell", email: "sarah@spit.ac.in", role: "teacher" as UserRole, department: "Computer Science" },
    { id: "t2", name: "Prof. James Chen", email: "james@spit.ac.in", role: "teacher" as UserRole, department: "Mathematics" },
  ],
}

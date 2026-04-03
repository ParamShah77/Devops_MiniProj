"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { User, UserRole, Course, TimetableEntry, Notice } from "./store"
import { authAPI, coursesAPI, timetableAPI, noticesAPI } from "./api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole, department: string) => Promise<boolean>
  logout: () => void
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  timetable: TimetableEntry[]
  setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>
  notices: Notice[]
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>
  enrollInCourse: (courseId: string, password: string) => Promise<{ success: boolean; message: string }>
  unenrollFromCourse: (courseId: string) => Promise<void>
  fetchData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [notices, setNotices] = useState<Notice[]>([])

  // Fetch all data (courses, timetable, notices)
  const fetchData = useCallback(async () => {
    try{
      const [coursesData, timetableData, noticesData] = await Promise.all([
        coursesAPI.getAll().catch(err => {
          console.error('Courses API error:', err)
          return []
        }),
        timetableAPI.getAll().catch(err => {
          console.error('Timetable API error:', err)
          return []
        }),
        noticesAPI.getAll().catch(err => {
          console.error('Notices API error:', err)
          return []
        })
      ])

      setCourses((coursesData || []).map((course: any) => ({
        id: course._id,
        name: course.name,
        code: course.code,
        teacher: course.teacher,
        teacherId: course.teacherId._id || course.teacherId,
        department: course.department,
        credits: course.credits,
        enrollmentPassword: course.enrollmentPassword,
        description: course.description,
        enrolledStudents: (course.enrolledStudents || []).map((s: any) => s._id || s)
      })))

      setTimetable((timetableData || []).map((entry: any) => ({
        id: entry._id,
        courseId: entry.courseId._id || entry.courseId,
        courseName: entry.courseName,
        courseCode: entry.courseCode,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
        teacher: entry.teacher
      })))

      setNotices((noticesData || []).map((notice: any) => ({
        id: notice._id,
        title: notice.title,
        content: notice.content,
        author: notice.author,
        authorId: notice.authorId._id || notice.authorId,
        date: new Date(notice.createdAt).toISOString().split('T')[0],
        priority: notice.priority,
        department: notice.department
      })))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await authAPI.getCurrentUser()
          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department
          })
          await fetchData()
        }
      } catch (error) {
        console.error('Error loading user:', error)
        authAPI.logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [fetchData])

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const data = await authAPI.login(email, password, role)
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department
      })
      await fetchData()
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [fetchData])

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole, department: string): Promise<boolean> => {
    try {
      const data = await authAPI.register(name, email, password, role, department)
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department
      })
      await fetchData()
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }, [fetchData])

  const logout = useCallback(() => {
    authAPI.logout()
    setUser(null)
    setCourses([])
    setTimetable([])
    setNotices([])
  }, [])

  const enrollInCourse = useCallback(async (courseId: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      await coursesAPI.enroll(courseId, password)
      await fetchData()
      return { success: true, message: "Successfully enrolled" }
    } catch (error: any) {
      return { success: false, message: error.message || "Enrollment failed" }
    }
  }, [fetchData])

  const unenrollFromCourse = useCallback(async (courseId: string): Promise<void> => {
    try {
      await coursesAPI.unenroll(courseId)
      await fetchData()
    } catch (error) {
      console.error('Unenroll error:', error)
    }
  }, [fetchData])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        courses,
        setCourses,
        timetable,
        setTimetable,
        notices,
        setNotices,
        enrollInCourse,
        unenrollFromCourse,
        fetchData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

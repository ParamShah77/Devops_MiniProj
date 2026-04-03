"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { AuthForm } from "@/components/auth-form"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"
import { StudentDashboard } from "@/components/student/student-dashboard"

type Page =
  | "landing"
  | "login-student"
  | "login-teacher"
  | "signup-student"
  | "signup-teacher"
  | "dashboard"

function AppContent() {
  const { user, logout, loading } = useAuth()
  const [page, setPage] = useState<Page>("landing")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      setPage("dashboard")
    }
  }, [user])

  const handleLogout = () => {
    logout()
    setPage("landing")
  }

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (user && page === "dashboard") {
    if (user.role === "teacher") {
      return <TeacherDashboard onLogout={handleLogout} />
    }
    return <StudentDashboard onLogout={handleLogout} />
  }

  switch (page) {
    case "login-student":
      return <AuthForm mode="login" role="student" onNavigate={(p) => setPage(p as Page)} />
    case "login-teacher":
      return <AuthForm mode="login" role="teacher" onNavigate={(p) => setPage(p as Page)} />
    case "signup-student":
      return <AuthForm mode="signup" role="student" onNavigate={(p) => setPage(p as Page)} />
    case "signup-teacher":
      return <AuthForm mode="signup" role="teacher" onNavigate={(p) => setPage(p as Page)} />
    default:
      return <LandingPage onNavigate={(p) => setPage(p as Page)} />
  }
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

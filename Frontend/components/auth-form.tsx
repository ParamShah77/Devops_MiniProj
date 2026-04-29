"use client"

import { useState } from "react"
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/store"

interface AuthFormProps {
  mode: "login" | "signup"
  role: UserRole
  onNavigate: (page: string) => void
}

export function AuthForm({ mode, role, onNavigate }: AuthFormProps) {
  const { login, signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const roleLabel = role === "student" ? "Student" : "Faculty"
  const altMode = mode === "login" ? "signup" : "login"
  const altModeLabel = mode === "login" ? "Create an account" : "Sign in instead"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "login") {
        const success = await login(email, password, role)
        if (!success) {
          setError("Invalid credentials. Please check your email, password, and role.")
        }
      } else {
        if (!name.trim()) {
          setError("Please enter your full name")
          setLoading(false)
          return
        }
        if (!department) {
          setError("Please select a department")
          setLoading(false)
          return
        }
        const success = await signup(name, email, password, role, department)
        if (!success) {
          setError("Registration failed. This email may already be in use.")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-foreground p-12 lg:flex">
        <div>
          <button onClick={() => onNavigate("landing")} className="mb-16 flex items-center gap-2 text-sm text-card/50 transition-colors hover:text-card/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-card">Sardar Patel Institute of Technology</span>
          </div>
        </div>
        <div>
          <h2 className="mb-4 font-serif text-4xl text-card">
            {role === "student" ? "Shape Your Future" : "Empower Your Students"}
          </h2>
          <p className="text-card/60 leading-relaxed">
            {role === "student"
              ? "Access your courses, check your schedule, and stay informed with the latest department notices."
              : "Manage your courses, update timetables, and communicate important notices to your students."}
          </p>
        </div>
        <p className="text-xs text-card/30">Sardar Patel Institute of Technology Academic Portal</p>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2">
        <button onClick={() => onNavigate("landing")} className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Sardar Patel Institute of Technology</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {mode === "login" ? `${roleLabel} Sign In` : `${roleLabel} Registration`}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? `Enter your credentials to access the ${roleLabel.toLowerCase()} portal`
                : `Create your ${roleLabel.toLowerCase()} account to get started`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "student" ? "student@spit.ac.in" : "faculty@spit.ac.in"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-foreground">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => onNavigate(`${altMode}-${role}`)}
                className="font-medium text-primary hover:underline"
              >
                {altModeLabel}
              </button>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {role === "student" ? "Are you faculty?" : "Are you a student?"}{" "}
              <button
                onClick={() => onNavigate(`${mode}-${role === "student" ? "teacher" : "student"}`)}
                className="font-medium text-primary hover:underline"
              >
                {role === "student" ? "Faculty portal" : "Student portal"}
              </button>
            </p>
          </div>

          {mode === "login" && (
            <div className="mt-8 rounded-lg border border-border bg-muted/50 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Demo Credentials</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {role === "student"
                  ? "Email: alex@spit.ac.in | Password: any"
                  : "Email: sarah@spit.ac.in | Password: any"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

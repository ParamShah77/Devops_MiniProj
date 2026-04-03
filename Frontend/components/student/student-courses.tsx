"use client"

import { useState } from "react"
import { BookOpen, Lock, CheckCircle2, LogOut, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

export function StudentCourses() {
  const { user, courses, enrollInCourse, unenrollFromCourse } = useAuth()
  const [enrollDialog, setEnrollDialog] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [enrolling, setEnrolling] = useState(false)
  const [unenrolling, setUnenrolling] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!user) return null

  const enrolledCourses = courses.filter((c) => c.enrolledStudents.includes(user.id))
  const availableCourses = courses.filter((c) => !c.enrolledStudents.includes(user.id))

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enrollDialog) return
    setMessage(null)
    setEnrolling(true)
    try {
      const result = await enrollInCourse(enrollDialog, password)
      setMessage({ type: result.success ? "success" : "error", text: result.message })
      if (result.success) {
        setTimeout(() => {
          setEnrollDialog(null)
          setPassword("")
          setMessage(null)
        }, 1200)
      }
    } catch {
      setMessage({ type: "error", text: "Enrollment failed. Please try again." })
    } finally {
      setEnrolling(false)
    }
  }

  const handleUnenroll = async (courseId: string) => {
    setUnenrolling(courseId)
    try {
      await unenrollFromCourse(courseId)
    } finally {
      setUnenrolling(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Courses</h2>
          <p className="text-sm text-muted-foreground">View your enrolled courses and browse available courses</p>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="enrolled" className="flex-1 sm:flex-initial">
            Enrolled ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="flex-1 sm:flex-initial">
            Available ({availableCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {enrolledCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
              <h3 className="mb-1 text-lg font-medium text-foreground">No enrolled courses</h3>
              <p className="text-sm text-muted-foreground">Browse available courses and enroll with the password provided by your instructor</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnenroll(course.id)}
                      disabled={unenrolling === course.id}
                      className="h-8 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      {unenrolling === course.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <><LogOut className="mr-1 h-3 w-3" />Unenroll</>}
                    </Button>
                  </div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">{course.code}</p>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{course.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{course.teacher}</span>
                    <span>&middot;</span>
                    <span>{course.credits} credits</span>
                  </div>
                  <div className="mt-3">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{course.department}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available">
          {availableCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
              <h3 className="mb-1 text-lg font-medium text-foreground">All caught up!</h3>
              <p className="text-sm text-muted-foreground">{"You're enrolled in all available courses"}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <div key={course.id} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{course.code}</p>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{course.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{course.teacher}</span>
                    <span>&middot;</span>
                    <span>{course.credits} credits</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.enrolledStudents.length}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setEnrollDialog(course.id)
                      setPassword("")
                      setMessage(null)
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Enroll with Password
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Enrollment Dialog */}
      <Dialog open={!!enrollDialog} onOpenChange={(open) => { if (!open) { setEnrollDialog(null); setPassword(""); setMessage(null) } }}>
        <DialogContent className="bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Course Enrollment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the enrollment password provided by your instructor to join this course.
            </DialogDescription>
          </DialogHeader>
          {enrollDialog && (
            <div className="mb-4 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {courses.find((c) => c.id === enrollDialog)?.code}
              </p>
              <p className="font-semibold text-foreground">
                {courses.find((c) => c.id === enrollDialog)?.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {courses.find((c) => c.id === enrollDialog)?.teacher}
              </p>
            </div>
          )}
          <form onSubmit={handleEnroll} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Enrollment Password</Label>
              <Input
                type="password"
                placeholder="Enter course password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setMessage(null) }}
                required
                autoFocus
              />
            </div>
            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {message.text}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setEnrollDialog(null); setPassword(""); setMessage(null) }} disabled={enrolling}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={enrolling}>
                {enrolling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enrolling...</> : "Enroll"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

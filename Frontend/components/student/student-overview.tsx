"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Bell, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface StudentOverviewProps {
  onTabChange: (tab: string) => void
}

export function StudentOverview({ onTabChange }: StudentOverviewProps) {
  const { user, courses, timetable, notices } = useAuth()
  const [dayName, setDayName] = useState("")

  useEffect(() => {
    const today = new Date()
    setDayName(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()])
  }, [])

  if (!user) return null

  const enrolledCourses = courses.filter((c) => c.enrolledStudents.includes(user.id))
  const enrolledCourseIds = enrolledCourses.map((c) => c.id)
  const myTimetable = timetable.filter((t) => enrolledCourseIds.includes(t.courseId))

  const todayClasses = myTimetable.filter((t) => t.day === dayName).sort((a, b) => a.startTime.localeCompare(b.startTime))

  const highPriorityNotices = notices.filter((n) => n.priority === "high")

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back, {user.name.split(" ")[0]}
        </h2>
        <p className="text-sm text-muted-foreground">Here is your academic overview for today</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Enrolled Courses", value: enrolledCourses.length, icon: BookOpen, color: "text-primary bg-primary/10" },
          { label: "Classes Today", value: todayClasses.length, icon: Clock, color: "text-primary bg-primary/10" },
          { label: "Available Courses", value: courses.length - enrolledCourses.length, icon: BookOpen, color: "text-accent-foreground bg-accent/15" },
          { label: "Active Notices", value: notices.length, icon: Bell, color: "text-primary bg-primary/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{"Today's"} Schedule</h3>
            <button onClick={() => onTabChange("timetable")} className="text-xs font-medium text-primary hover:underline">
              View Full Timetable
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <div className="rounded-lg bg-muted/50 p-6 text-center">
              <Clock className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <div className="flex h-12 w-16 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-xs font-bold">{entry.startTime}</span>
                    <span className="text-[10px] text-primary/60">{entry.endTime}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{entry.courseName}</p>
                    <p className="text-xs text-muted-foreground">{entry.courseCode} &middot; {entry.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Important Notices */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Important Notices</h3>
            <button onClick={() => onTabChange("notices")} className="text-xs font-medium text-primary hover:underline">
              View All Notices
            </button>
          </div>
          {highPriorityNotices.length === 0 ? (
            <div className="rounded-lg bg-muted/50 p-6 text-center">
              <Bell className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No high-priority notices</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highPriorityNotices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs font-medium text-destructive">High Priority</span>
                  </div>
                  <p className="font-medium text-foreground">{notice.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">By {notice.author} &middot; {new Date(notice.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

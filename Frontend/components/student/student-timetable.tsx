"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function StudentTimetable() {
  const { user, courses, timetable } = useAuth()
  const [todayName, setTodayName] = useState<string>("")

  useEffect(() => {
    const today = new Date()
    const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()]
    setTodayName(currentDay)
  }, [])

  if (!user) return null

  const enrolledCourseIds = courses.filter((c) => c.enrolledStudents.includes(user.id)).map((c) => c.id)
  const myTimetable = timetable.filter((t) => enrolledCourseIds.includes(t.courseId))

  const groupedByDay = DAYS.map((day) => ({
    day,
    entries: myTimetable.filter((t) => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((g) => g.entries.length > 0)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">My Timetable</h2>
        <p className="text-sm text-muted-foreground">Your weekly class schedule based on enrolled courses</p>
      </div>

      {groupedByDay.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <Clock className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No classes scheduled</h3>
          <p className="text-sm text-muted-foreground">Enroll in courses to see your timetable</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByDay.map(({ day, entries }) => (
            <div key={day}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{day}</h3>
                {day === todayName && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Today</span>
                )}
              </div>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 rounded-xl border bg-card px-6 py-4 transition-all hover:shadow-sm ${
                      day === todayName ? "border-primary/30" : "border-border"
                    }`}
                  >
                    <div className="flex h-12 w-20 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-xs font-semibold">{entry.startTime}</span>
                      <span className="text-[10px] text-primary/60">{entry.endTime}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.courseName}</p>
                      <p className="text-sm text-muted-foreground">{entry.courseCode} &middot; {entry.room} &middot; {entry.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

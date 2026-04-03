"use client"

import { Calendar, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function StudentAttendance() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground">Track your class attendance and academic participation</p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h3 className="font-semibold text-foreground">Attendance History</h3>
        </div>
        <div className="p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-foreground">No attendance records</h3>
          <p className="text-sm text-muted-foreground">Your attendance history will appear here once your instructor marks attendance.</p>
        </div>
      </div>
    </div>
  )
}
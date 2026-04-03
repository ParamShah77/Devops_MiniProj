"use client"

import { useState } from "react"
import { Plus, Trash2, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { timetableAPI } from "@/lib/api"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TeacherTimetable() {
  const { user, courses, timetable, fetchData } = useAuth()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    courseId: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
  })

  if (!user) return null

  const myCourses = courses.filter((c) => c.teacherId === user.id)
  const myTimetable = timetable.filter((t) => myCourses.some((c) => c.id === t.courseId))

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const course = myCourses.find((c) => c.id === formData.courseId)
    if (!course) return

    setSaving(true)
    setError(null)
    try {
      await timetableAPI.create({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
      })
      await fetchData()
      setFormData({ courseId: "", day: "", startTime: "", endTime: "", room: "" })
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to add timetable entry")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await timetableAPI.delete(id)
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to delete timetable entry")
    } finally {
      setDeleting(null)
    }
  }

  const groupedByDay = DAYS.map((day) => ({
    day,
    entries: myTimetable.filter((t) => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((g) => g.entries.length > 0)

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Timetable</h2>
          <p className="text-sm text-muted-foreground">Manage class schedules for your courses</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(null) }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={myCourses.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Timetable Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
              )}
              <div className="space-y-2">
                <Label className="text-foreground">Course</Label>
                <Select value={formData.courseId} onValueChange={(v) => setFormData({ ...formData, courseId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.code} - {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Day</Label>
                <Select value={formData.day} onValueChange={(v) => setFormData({ ...formData, day: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Room</Label>
                <Input
                  placeholder="e.g., Room 204"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Entry"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !open && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {groupedByDay.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <Clock className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No classes scheduled</h3>
          <p className="text-sm text-muted-foreground">
            {myCourses.length === 0 ? "Create a course first, then add classes" : "Add your first class to the timetable"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByDay.map(({ day, entries }) => (
            <div key={day}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{day}</h3>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="group flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-20 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-semibold">{entry.startTime}</span>
                        <span className="text-[10px] text-primary/60">{entry.endTime}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{entry.courseName}</p>
                        <p className="text-sm text-muted-foreground">{entry.courseCode} &middot; {entry.room}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      aria-label={`Remove ${entry.courseName} from ${day}`}
                    >
                      {deleting === entry.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </Button>
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

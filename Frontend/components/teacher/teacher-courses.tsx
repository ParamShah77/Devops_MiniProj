"use client"

import { useState } from "react"
import { Plus, Users, Lock, BookOpen, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { coursesAPI } from "@/lib/api"

export function TeacherCourses() {
  const { user, courses, fetchData } = useAuth()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    credits: "3",
    enrollmentPassword: "",
    description: "",
  })

  if (!user) return null

  const myCourses = courses.filter((c) => c.teacherId === user.id)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await coursesAPI.create({
        name: formData.name,
        code: formData.code.toUpperCase(),
        department: formData.department || user.department || "General",
        credits: parseInt(formData.credits),
        enrollmentPassword: formData.enrollmentPassword,
        description: formData.description,
      })
      await fetchData()
      setFormData({ name: "", code: "", department: "", credits: "3", enrollmentPassword: "", description: "" })
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to create course")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await coursesAPI.delete(id)
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to delete course")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">My Courses</h2>
          <p className="text-sm text-muted-foreground">Manage your courses and enrollment settings</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(null) }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="text-foreground">Course Name</Label>
                  <Input
                    placeholder="e.g., Machine Learning"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Course Code</Label>
                  <Input
                    placeholder="e.g., CS401"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Credits</Label>
                  <Select value={formData.credits} onValueChange={(v) => setFormData({ ...formData, credits: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((c) => (
                        <SelectItem key={c} value={String(c)}>{c} Credits</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Department</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Enrollment Password</Label>
                  <Input
                    placeholder="Set a password"
                    value={formData.enrollmentPassword}
                    onChange={(e) => setFormData({ ...formData, enrollmentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Textarea
                    placeholder="Brief course description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !open && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {myCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No courses yet</h3>
          <p className="text-sm text-muted-foreground">Create your first course to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <div key={course.id} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(course.id)}
                  disabled={deleting === course.id}
                  className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete ${course.name}`}
                >
                  {deleting === course.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">{course.code}</p>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{course.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {course.enrolledStudents.length} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  {course.enrollmentPassword}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{course.department}</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{course.credits} cr</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

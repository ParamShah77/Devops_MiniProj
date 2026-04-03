"use client"

import { useState } from "react"
import { Plus, Trash2, Bell, AlertTriangle, Info, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { noticesAPI } from "@/lib/api"

const priorityConfig = {
  high: { icon: AlertTriangle, label: "High Priority", class: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { icon: AlertCircle, label: "Medium Priority", class: "bg-accent/10 text-accent-foreground border-accent/30" },
  low: { icon: Info, label: "Low Priority", class: "bg-primary/10 text-primary border-primary/20" },
}

export function TeacherNotices() {
  const { user, notices, fetchData } = useAuth()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    department: "",
  })

  if (!user) return null

  const myNotices = notices.filter((n) => n.authorId === user.id)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await noticesAPI.create({
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        department: formData.department || user.department || "General",
      })
      await fetchData()
      setFormData({ title: "", content: "", priority: "medium", department: "" })
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to post notice")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await noticesAPI.delete(id)
      await fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to delete notice")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Notices</h2>
          <p className="text-sm text-muted-foreground">Post and manage department notices</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(null) }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Post Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Post New Notice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
              )}
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input
                  placeholder="Notice title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Content</Label>
                <Textarea
                  placeholder="Write your notice content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as "low" | "medium" | "high" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
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
                      <SelectItem value="All Departments">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Posting...</> : "Post Notice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !open && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {myNotices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No notices posted</h3>
          <p className="text-sm text-muted-foreground">Post your first notice to inform students</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myNotices.map((notice) => {
            const config = priorityConfig[notice.priority]
            const PriorityIcon = config.icon
            return (
              <div key={notice.id} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.class}`}>
                      <PriorityIcon className="h-3 w-3" />
                      {config.label}
                    </div>
                    <span className="text-xs text-muted-foreground">{notice.department}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notice.id)}
                    disabled={deleting === notice.id}
                    className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label={`Delete notice: ${notice.title}`}
                  >
                    {deleting === notice.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{notice.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{notice.content}</p>
                <p className="text-xs text-muted-foreground">Posted on {new Date(notice.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

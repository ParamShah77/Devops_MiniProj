"use client"

import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const priorityConfig = {
  high: { icon: AlertTriangle, label: "High", class: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { icon: AlertCircle, label: "Medium", class: "bg-accent/10 text-accent-foreground border-accent/30" },
  low: { icon: Info, label: "Low", class: "bg-primary/10 text-primary border-primary/20" },
}

export function StudentNotices() {
  const { notices } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Notices</h2>
        <p className="text-sm text-muted-foreground">Stay updated with the latest announcements from your department</p>
      </div>

      {notices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No notices yet</h3>
          <p className="text-sm text-muted-foreground">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => {
            const config = priorityConfig[notice.priority]
            const PriorityIcon = config.icon
            return (
              <div key={notice.id} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-sm">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.class}`}>
                    <PriorityIcon className="h-3 w-3" />
                    {config.label}
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{notice.department}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{notice.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{notice.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {notice.author.charAt(0)}
                  </div>
                  <span>{notice.author}</span>
                  <span>&middot;</span>
                  <span>{new Date(notice.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

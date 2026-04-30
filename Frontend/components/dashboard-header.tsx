"use client"

// checking webhook


import { GraduationCap, LogOut, BookOpen, Clock, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export function DashboardHeader({ activeTab, onTabChange, onLogout }: DashboardHeaderProps) {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) return null

  const isTeacher = user.role === "teacher"

  const tabs = isTeacher
    ? [
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "timetable", label: "Timetable", icon: Clock },
        { id: "notices", label: "Notices", icon: Bell },
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: BookOpen },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "timetable", label: "Timetable", icon: Clock },
        { id: "notices", label: "Notices", icon: Bell },
      ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Sardar Patel Institute of Technology</p>
            <p className="text-xs text-muted-foreground">{isTeacher ? "Faculty" : "Student"} Portal</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.department}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-muted-foreground hover:text-foreground" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-muted-foreground md:hidden" aria-label="Menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-6 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

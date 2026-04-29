"use client"

import { GraduationCap, BookOpen, Clock, Bell, Users, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onNavigate: (page: string) => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Sardar Patel Institute of Technology</h1>
              <p className="text-xs text-muted-foreground">Academic Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate("login-student")} className="text-muted-foreground hover:text-foreground">
              Student Login
            </Button>
            <Button onClick={() => onNavigate("login-teacher")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Faculty Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground px-6 py-24 text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(var(--accent)) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest opacity-70">Academic Portal 2026</p>
            <h2 className="mb-6 font-serif text-5xl leading-tight text-balance lg:text-6xl">
              Your Gateway to Academic Excellence
            </h2>
            <p className="mb-10 text-lg leading-relaxed opacity-80">
              A unified platform for students and faculty to manage courses, schedules, and academic communications seamlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("login-student")}
                className="bg-card text-foreground hover:bg-card/90"
              >
                Student Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("login-teacher")}
                className="border-card/30 bg-transparent text-card hover:bg-card/10"
              >
                Faculty Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Platform Features</p>
            <h3 className="font-serif text-3xl text-foreground lg:text-4xl">Everything You Need in One Place</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, title: "Course Management", desc: "Teachers can create courses with enrollment codes. Students enroll securely with provided passwords." },
              { icon: Clock, title: "Timetable System", desc: "Dynamic timetable management. Faculty updates in real-time, students always see their latest schedule." },
              { icon: Bell, title: "Notice Board", desc: "Priority-based notices from faculty to students. Stay updated with department-wide announcements." },
              { icon: Users, title: "Role-Based Access", desc: "Separate interfaces for students and faculty with tailored features for each role." },
              { icon: Shield, title: "Secure Enrollment", desc: "Password-protected course enrollment ensures only authorized students can join courses." },
              { icon: GraduationCap, title: "Academic Dashboard", desc: "Personalized dashboards showing enrolled courses, upcoming classes, and recent notices." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="mb-4 font-serif text-3xl text-foreground">Ready to Get Started?</h3>
          <p className="mb-8 text-muted-foreground">
            Sign in with your university credentials or create a new account to access the academic portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => onNavigate("signup-student")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Register as Student
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("signup-teacher")}>
              Register as Faculty
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-foreground px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <GraduationCap className="h-5 w-5 text-card/60" />
          <span className="text-sm text-card/60">Sardar Patel Institute of Technology Academic Portal</span>
        </div>
      </footer>
    </div>
  )
}

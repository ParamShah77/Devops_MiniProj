"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function DebugInfo() {
  const { user, courses, notices, fetchData } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setToken(localStorage.getItem('token'))
  }, [])

  const handleTestAPIs = async () => {
    if (!mounted) return

    console.log('=== TESTING APIs ===')

    // Test token
    const currentToken = localStorage.getItem('token')
    console.log('Token exists:', !!currentToken)
    console.log('Token length:', currentToken?.length || 0)

    // Test user
    console.log('User:', user)

    // Manual fetch test
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      })
      console.log('Manual courses API response:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Manual courses data:', data)
      } else {
        const error = await response.json()
        console.log('Manual courses error:', error)
      }
    } catch (error) {
      console.error('Manual courses API error:', error)
    }

    // Test notices
    try {
      const response = await fetch('http://localhost:5000/api/notices', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      })
      console.log('Manual notices API response:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Manual notices data:', data)
      } else {
        const error = await response.json()
        console.log('Manual notices error:', error)
      }
    } catch (error) {
      console.error('Manual notices API error:', error)
    }
  }

  if (!mounted) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg mb-4">
        <div>Loading debug info...</div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div>User: {user ? `${user.name} (${user.role})` : 'Not logged in'}</div>
        <div>Courses count: {courses.length}</div>
        <div>Notices count: {notices.length}</div>
        <div>Token: {token ? 'Present' : 'Missing'}</div>
      </div>
      <div className="mt-2 space-x-2">
        <Button onClick={fetchData} size="sm">Refresh Data</Button>
        <Button onClick={handleTestAPIs} size="sm" variant="outline">Test APIs</Button>
      </div>
    </div>
  )
}
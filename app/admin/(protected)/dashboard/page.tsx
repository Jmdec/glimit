"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, FileText } from "lucide-react"
import { toast } from "sonner"

interface Booking {
  client: string
  service: string
  date: string
}

interface DashboardStats {
  totalTestimonials: number
  totalBookings: number
  totalBlogPosts: number
  recentBookings: Booking[]
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTestimonials: 0,
    totalBookings: 0,
    totalBlogPosts: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard")

        const data = await res.json()
        setStats({
          totalTestimonials: data.totalTestimonials,
          totalBookings: data.totalBookings,
          totalBlogPosts: data.totalBlogPosts,
          recentBookings: data.recentBookings,
        })
      } catch (err) {
        console.error(err)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const statCards = [
    { name: "Total Testimonials", value: stats.totalTestimonials, icon: MessageSquare },
    { name: "Total Bookings", value: stats.totalBookings, icon: Calendar },
    { name: "Blog Posts", value: stats.totalBlogPosts, icon: FileText },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gold text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview of your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.name} className="py-3 border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className="w-5 h-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-amber-50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading
                ? Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 animate-pulse">
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    ))
                : (stats.recentBookings || []).map((booking, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{booking.client}</p>
                        <p className="text-xs text-muted-foreground">{booking.service}</p>
                      </div>
                      <span className="text-xs text-gold">{booking.date}</span>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard

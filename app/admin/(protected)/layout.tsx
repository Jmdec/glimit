"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageSquare, Calendar, FileText, LogOut, Menu, X, ChevronLeft, Images, Image, Folder,Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Hero Sections", href: "/admin/hero-sections", icon: Image },
  { name: "Film Strip Gallery", href: "/admin/film-strip-gallery", icon: Images },
  { name: "Photo Category", href: "/admin/categories", icon: Folder },
  { name: "Portfolio", href: "/admin/portfolio", icon: Folder },
   { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Blog Posts", href: "/admin/posts", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        console.error("Logout failed")
        return
      }

      router.push("/admin/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gold/90 border border-border rounded-lg"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 bg-amber-50 border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mt-10 lg:mt-0 flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            {sidebarOpen && (
              <Link href="/admin/dashboard" className="text-xl font-serif font-bold text-gold">
                Admin Panel
              </Link>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-gold/90 bg-yellow-500 rounded-lg transition-colors"
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", !sidebarOpen && "rotate-180")} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive ? "bg-gold/10 text-gold border border-gold/30" : "text-muted-foreground hover:bg-gold/90 hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gold/90 hover:text-foreground transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Back to Site</span>}
            </Link>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 text-black max-w-7xl mx-auto w-full">
          {/* Add horizontal scroll for tables */}
          <div className="overflow-x-auto mt-10 lg:mt-0">{children}</div>
        </div>
      </main>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
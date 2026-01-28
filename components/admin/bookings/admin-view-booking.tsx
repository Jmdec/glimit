"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Booking } from "@/lib/types/types"
import { formatMonthDayYear } from "@/lib/utils"

interface BookingViewDialogProps {
  open: boolean
  setOpen: (val: boolean) => void
  booking: Booking | null
}

export function BookingViewDialog({ open, setOpen, booking }: BookingViewDialogProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl text-black max-h-[90vh] overflow-y-auto scrollbar-hide px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-accent">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">
                {booking.firstName} {booking.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium break-words">{booking.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium break-words">{booking.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">{booking.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatMonthDayYear(booking.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{booking.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {(() => {
                const statusClasses: Record<string, string> = {
                  pending: "bg-yellow-500/10 text-yellow-700",
                  confirmed: "bg-blue-500/10 text-blue-700",
                  completed: "bg-green-500/10 text-green-700",
                  cancelled: "bg-red-500/10 text-red-700",
                }
                return <Badge className={statusClasses[booking.status] || ""}>{booking.status}</Badge>
              })()}
            </div>
          </div>

          {booking.message && (
            <div>
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="font-medium break-words">{booking.message}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

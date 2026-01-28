"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react"
import { Booking } from "@/lib/types/types"

interface BookingFormDialogProps {
  open: boolean
  setOpen: (val: boolean) => void
  initialData?: Partial<Booking>
  onSubmit: (data: Booking) => void
}

type BookingSlot = {
  date: string
  time: string[]
}

const allTimes = ["09:00:00", "10:00:00", "11:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"]

export function BookingFormDialog({ open, setOpen, initialData, onSubmit }: BookingFormDialogProps) {
  const services = ["Wedding Photography", "Portrait Session", "Event Photography", "Product Photography", "Commercial Photography", "Studio Rental"]
  const [bookedDates, setBookedDates] = useState<BookingSlot[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<Partial<Booking>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "Wedding Photography",
    date: "",
    time: "",
    guests: "1",
    status: "pending",
    message: "",
  })

  const fetchBookedDates = async () => {
    try {
      const res = await fetch("/api/bookings")
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      setBookedDates(data)
    } catch (err) {
      console.error("Error fetching booked dates:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialData) setFormData(initialData)
    fetchBookedDates()
  }, [initialData])

  // Compute fully booked dates
  const fullyBookedDates = bookedDates.filter((b) => allTimes.every((t) => b.time.includes(t))).map((b) => b.date)

  const handleSubmit = () => {
    onSubmit(formData as Booking)
    fetchBookedDates()
    // reset form state
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceType: "Wedding Photography",
      date: "",
      time: "",
      guests: "1",
      status: "pending",
      message: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl text-black max-h-[90vh] overflow-y-auto scrollbar-hide px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-accent">{initialData ? "Edit Booking" : "Add Booking"}</DialogTitle>
          <DialogDescription>{initialData ? "Update booking information." : "Create a new booking entry."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Responsive grid: 1 column on mobile, 2 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-black">First Name</Label>
              <Input
                className="text-black w-full"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-black">Last Name</Label>
              <Input
                className="text-black w-full"
                value={formData.lastName ?? ""}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-black">Email</Label>
              <Input className="text-black w-full" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label className="text-black">Phone</Label>
              <Input
                className="text-black w-full"
                value={formData.phone ?? ""}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "")
                  setFormData({ ...formData, phone: onlyNumbers })
                }}
              />
            </div>
            <div>
              <Label className="text-black">Service</Label>
              <select
                className="w-full h-10 px-3 border border-border rounded-md bg-background"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-black">Date</Label>
              <Input
                className="text-black w-full"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                disabled={loading}
                onInput={(e) => {
                  if (fullyBookedDates.includes(e.currentTarget.value)) {
                    e.currentTarget.setCustomValidity("This date is fully booked")
                  } else {
                    e.currentTarget.setCustomValidity("")
                  }
                }}
              />
            </div>
            <div>
              <Label className="text-black">Time</Label>
              <select
                className="w-full h-10 px-3 text-black border border-border rounded-md bg-background"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                disabled={!formData.date}
              >
                <option value="">Select a time</option>
                {allTimes.map((time) => {
                  const isBooked = bookedDates.some((b) => b.date === formData.date && b.time.includes(time))
                  return (
                    <option key={time} value={time} disabled={isBooked} className={`${isBooked ? "bg-slate-500 text-white" : ""}`}>
                      {time.slice(0, 5)} {isBooked ? "(Booked)" : ""}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <Label className="text-black">Guests</Label>
              <Input className="text-black w-full" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} />
            </div>
            <div>
              <Label className="text-black">Status</Label>
              <select
                className="w-full h-10 px-3 text-black border border-border rounded-md bg-background"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Booking["status"] })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Message field full width */}
          <div>
            <Label className="text-black">Message</Label>
            <Textarea
              className="w-full resize-y overflow-hidden break-all"
              value={formData.message ?? ""}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="outline" className="text-black w-full sm:w-auto" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
            {loading ? "Saving..." : initialData ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

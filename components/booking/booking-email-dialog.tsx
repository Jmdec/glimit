"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Booking } from "@/lib/types/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BookingEmailDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  booking: Booking | null
  onEmailSent?: () => void
}

export function BookingEmailDialog({ open, setOpen, booking, onEmailSent }: BookingEmailDialogProps) {
  const [emailType, setEmailType] = useState<"confirmation" | "update" | "cancellation" | "custom">("custom")
  const [customMessage, setCustomMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendEmail = async () => {
    if (!booking) return

    if (emailType === "custom" && !customMessage.trim()) {
      toast.error("Error", { description: "Please enter a message" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/bookings/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          customMessage,
          emailType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error("Error", { description: data.message || "Failed to send email" })
        return
      }

      toast.success("Success", { description: "Email sent successfully" })
      setCustomMessage("")
      setEmailType("custom")
      setOpen(false)
      onEmailSent?.()
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Error", { description: "Failed to send email" })
    } finally {
      setLoading(false)
    }
  }

  const getPreviewMessage = () => {
    switch (emailType) {
      case "confirmation":
        return "Thank you for booking with us! We're excited to confirm your appointment..."
      case "update":
        return "We wanted to let you know that your booking has been updated..."
      case "cancellation":
        return "We regret to inform you that your booking has been cancelled..."
      case "custom":
        return ""
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
            <Mail className="w-5 h-5 text-gray-700" />
            Send Email to Client
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Send to: {booking?.firstName} {booking?.lastName} ({booking?.email})
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {/* Email Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="emailType" className="text-sm font-medium text-gray-900">
                Email Type
              </Label>
              <Select value={emailType} onValueChange={(value: any) => setEmailType(value)}>
                <SelectTrigger id="emailType" className="w-full bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="confirmation" className="text-gray-900">Booking Confirmation</SelectItem>
                  <SelectItem value="update" className="text-gray-900">Booking Update</SelectItem>
                  <SelectItem value="cancellation" className="text-gray-900">Booking Cancellation</SelectItem>
                  <SelectItem value="custom" className="text-gray-900">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview of default message */}
            {emailType !== "custom" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-900 font-medium mb-1">Default Message:</p>
                <p className="text-xs text-blue-800">{getPreviewMessage()}</p>
              </div>
            )}

            {/* Custom Message Input */}
            <div className="space-y-2">
              <Label htmlFor="customMessage" className="text-sm font-medium text-gray-900">
                {emailType === "custom" ? "Your Message" : "Additional Message (Optional)"}
              </Label>
              <Textarea
                id="customMessage"
                placeholder={
                  emailType === "custom" ? "Type your message here..." : "Add any additional information..."
                }
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={5}
                className="resize-none text-sm bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-600">
                This message will be included in the email along with booking details.
              </p>
            </div>

            {/* Booking Details Preview - Compact */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
              <p className="text-xs font-medium mb-2 text-gray-900">Booking Details to Include:</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900">{booking?.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{booking?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{booking?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900 capitalize">{booking?.status}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex-row gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={loading} 
            className="flex-1 sm:flex-1 bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={loading} 
            className="flex-1 sm:flex-1 bg-gold hover:bg-gold/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
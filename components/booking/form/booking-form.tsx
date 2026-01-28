"use client"
import CommonQuestions from "@/components/common-questions"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-device"
import { labels } from "@/lib/constants"
import { AnimatePresence, motion } from "motion/react"
import FloatingParticles from "@/components/animated-golden-particles"
import { useInView } from "react-intersection-observer"
import { PhotographySuccessAnimation } from "@/components/successful-booking-animation"
import { formatDisplayTime, formatFullDate } from "@/lib/utils"
import { useBookingStore } from "@/store/useBookingStore"

interface TimeSlot {
  raw: string // "24-hour format"
  display: string // "12-hour format"
  available: boolean
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  customService: string
  date: string
  time: string
  guests: string
  message: string
}

const allTimes = ["09:00:00", "10:00:00", "11:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"]

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookedDates, setBookedDates] = useState<{ date: string; time: string }[]>([])
  const [loading, setLoading] = useState(true)
  const selectedServices = useBookingStore((state) => state.selectedService)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "",
    customService: "",
    date: "",
    time: "",
    guests: "1",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const isMobile = useIsMobile()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [prevStep, setPrevStep] = useState(step)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  }

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

  const getTimeSlots = (date: string): TimeSlot[] => {
    if (!date) return []

    const bookedTimes = bookedDates.filter((b) => b.date === date).flatMap((b) => (Array.isArray(b.time) ? b.time : [b.time]))

    return allTimes.map((time) => ({
      raw: time,
      display: formatDisplayTime(time),
      available: !bookedTimes.includes(time),
    }))
  }

  const timeSlots = getTimeSlots(formData.date)

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isPastDate = (day: number | null) => {
    if (!day) return false

    const today = new Date()
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

    today.setHours(0, 0, 0, 0)

    return checkDate < today
  }

  const isDateBooked = (day: number | null, currentDate: Date): boolean => {
    if (day === null) return false

    const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    const bookedTimes = bookedDates.filter((b) => b.date === key).flatMap((b) => (Array.isArray(b.time) ? b.time : [b.time]))

    return bookedTimes.length >= allTimes.length
  }

  const isDateSelected = (day: number | null) => {
    return (
      selectedDate &&
      day &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    )
  }

  const handleDateSelect = (selectedDay: number | null) => {
    if (!selectedDay) return

    if (isDateBooked(selectedDay, currentDate)) return

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)

    setSelectedDate(newDate)

    setFormData((prev) => ({
      ...prev,
      date: newDate.toLocaleDateString("en-CA"), // formatted YYYY-MM-DD
      time: "",
    }))
  }

  const handleTimeSelect = (slot: TimeSlot) => {
    setFormData((prev) => ({
      ...prev,
      time: slot.raw,
    }))
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<FormData> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name required"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email required"
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Valid email required"
      }
    }

    if (currentStep === 2) {
      if (!formData.serviceType) newErrors.serviceType = "Service type required"
      if (formData.serviceType === "others" && !formData.customService.trim()) {
        newErrors.customService = "Please specify your service"
      }
    }

    if (currentStep === 3) {
      if (!formData.date) newErrors.date = "Date required"
      if (!formData.time) newErrors.time = "Time required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      let updatedValue = value
      if (name === "phone") {
        updatedValue = value.replace(/\D/g, "").slice(0, 11)
      }
      return {
        ...prev,
        [name]: updatedValue,
        ...(name === "serviceType" && updatedValue !== "others" ? { customService: "" } : {}),
      }
    })

    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step !== 4) return

    const payload = {
      ...formData,
      serviceType: formData.serviceType === "others" ? formData.customService : formData.serviceType,
    }

    try {
      setIsSubmitting(true)

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let bookingData: any = null
      if (bookingRes.ok) {
        await fetchBookedDates()
        bookingData = await bookingRes.json()
      } else {
        const errorText = await bookingRes.text()
        console.error("Booking error:", bookingRes.status, errorText)
      }

      let emailData: any = null
      if (bookingRes.ok) {
        const emailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (emailRes.ok) {
          emailData = await emailRes.json()
        } else {
          const errorText = await emailRes.text()
          console.error("Email error:", emailRes.status, errorText)
        }
      }

      if (bookingRes.ok && emailData?.success) {
        setSubmitted(true)
        setErrors({ email: "", phone: "", date: "", time: "" })
      } else {
        toast.error("Failed to send message", {
          description: "Please try again later.",
          position: "top-right",
          duration: 5000,
        })
      }
    } catch (err) {
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again later.",
        position: "top-right",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(false)
      setStep(1)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        serviceType: "",
        customService: "",
        date: "",
        time: "",
        guests: "1",
        message: "",
      })
    }, 3000)
  }

  const days = getDaysArray()
  const monthName = currentDate.toLocaleDateString("en-CA", { month: "long", year: "numeric" })

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Find the first input that has an error
      const firstErrorField = Object.keys(errors)[0]
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${firstErrorField}"]`)
      if (el) {
        el.focus()
      }
    }
  }, [errors])

  useEffect(() => {
    fetchBookedDates()
  }, [])

  useEffect(() => {
    if (selectedServices) {
      setFormData((prev) => ({ ...prev, serviceType: selectedServices }))
    }
  }, [selectedServices])

  useEffect(() => {
    setPrevStep(step)
  }, [step])

  // Lens focus effect
  const focusRing = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.9, 1.1, 1],
      opacity: [0, 1, 0],
      transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
    },
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 mx-auto">
        <div className="flex items-center justify-between mb-8 mx-auto">
          {[1, 2, 3, 4].map((stepNum) => {
            const isActive = stepNum <= step
            const wasActive = stepNum <= prevStep

            return (
              <div key={stepNum} className="flex items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 0.9,
                    opacity: isActive ? 1 : 0.4,
                    boxShadow: isActive ? "0 0 16px rgba(255, 215, 0, 0.6)" : "0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                    isActive ? "bg-gold text-black" : "bg-muted text-white border-2 border-border"
                  }`}
                >
                  {stepNum}
                </motion.div>

                {stepNum < 4 && (
                  <div className="relative flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{
                        width: wasActive || isActive ? "100%" : "0%",
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gold"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <div className="bg-linear-to-br from-slate-900/30 via-black to-black border border-amber-500/30 rounded-lg p-8 md:p-12 backdrop-blur-sm shadow-2xl">
        {/* Focus Ring Animation */}
        <div className="absolute inset-0 border-4 border-[#d4a574]/50 rounded-lg pointer-events-none" />
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Your Contact Information</h2>
                <div className="h-1 w-24 bg-linear-to-r from-yellow-600 to-yellow-500 mb-8" />
                <p className="text-gray-300 mb-8">Let&apos;s start with your details.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2 text-white capitalize">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-amber-500/10 border focus:bg-amber-500/10 border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors ${
                      errors.firstName ? "border-red-500" : "border border-amber-500/30"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2 text-white capitalize">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white capitalize">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border border-amber-500/30"
                  }`}
                  placeholder="your@email.com"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white capitalize">Phone Number</label>
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="(+63) 912 345 6789"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Select Your Service</h2>
                <div className="h-1 w-24 bg-linear-to-r from-yellow-600 to-yellow-500 mb-8" />
                <p className="text-white mb-8">What type of photography service do you need?</p>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold mb-2 text-white">
                  Service Type <span className="text-red-500">*</span>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 mt-2 appearance-none font-normal bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors focus:ring-2 focus:ring-gold ${
                      errors.serviceType ? "border-red-500" : "border border-amber-500/30"
                    }`}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option value="wedding">Wedding Photography</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="event">Event Photography</option>
                    <option value="product">Product Photography</option>
                    <option value="commercial">Commercial Photography</option>
                    <option value="headshot">Headshots & Actors</option>
                    <option value="studio">Studio Rental</option>
                    <option value="others">Others</option>
                  </select>
                  <div
                    className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 ${
                      formData.serviceType === "others" ? "mb-14" : "mt-0"
                    }`}
                  >
                    <svg className="mt-6 h-5 w-5 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {formData.serviceType === "others" && (
                    <input
                      type="text"
                      name="customService"
                      placeholder="Please specify your service"
                      value={formData.customService}
                      required
                      onChange={handleChange}
                      className={`mt-3 w-full px-4 py-3 font-normal bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors focus:ring-2 focus:ring-gold ${
                        errors.customService ? "border-red-500" : "border border-amber-500/30"
                      }`}
                    />
                  )}
                </label>
                {errors.customService && <p className="text-red-500 text-sm mt-1">{errors.customService}</p>}
                {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold mb-2 text-white">
                  Number of People
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 mt-2 appearance-none font-normal bg-amber-500/10 focus:bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors focus:ring-2 focus:ring-gold"
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3-5">3-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="10+">10+ people</option>
                  </select>
                </label>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="mt-6 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time with Calendar */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Choose Your Date & Time</h2>
                <div className="h-1 w-24 bg-linear-to-r from-yellow-600 to-yellow-500 mb-8" />
                <p className="text-gray-300 mb-8">Select your preferred session time from our available slots.</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="p-8 rounded-2xl border border-gold/30 shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all duration-300">
                  {/* Month Header */}
                  <div className="flex items-center justify-between mb-8">
                    <Button onClick={handlePrevMonth} className="p-2 hover:bg-gold/10 rounded-lg transition-colors duration-200">
                      <ChevronLeft className="w-6 h-6 text-gold" />
                    </Button>
                    <h2 className="text-center md:text-2xl bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-size-[200%_200%] bg-clip-text text-transparent">
                      {monthName}
                    </h2>
                    <Button onClick={handleNextMonth} className="p-2 hover:bg-gold/10 rounded-lg transition-colors duration-200">
                      <ChevronRight className="w-6 h-6 text-gold" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center font-semibold text-gold text-sm uppercase tracking-widest">
                        {isMobile ? day.charAt(0) : day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/*  Skeleton Calendar when loading*/}
                    {loading
                      ? Array.from({ length: 28 }).map((_, i) => <div key={i} className="aspect-square rounded-lg bg-gray-700 animate-pulse" />)
                      : days.map((day, index) => {
                          const isBooked = isDateBooked(day || 0, currentDate) || (day ? isPastDate(day) : false)
                          const isSelected = day ? isDateSelected(day) : false

                          return (
                            <motion.button
                              key={index}
                              onClick={() => day && !isBooked && handleDateSelect(day)}
                              initial={{ opacity: 0, scale: 0.85, y: 10 }}
                              animate={{
                                opacity: 1,
                                scale: isSelected ? 1.15 : 1,
                                y: 0,
                              }}
                              transition={{
                                duration: 0.25,
                                bounce: 0.25,
                              }}
                              whileHover={!isBooked && day ? { scale: 1.1 } : {}}
                              whileTap={!isBooked && day ? { scale: 0.9 } : {}}
                              className={`aspect-square rounded-lg font-semibold flex items-center justify-center text-sm transition-all duration-200 ${
                                !day
                                  ? "invisible"
                                  : isBooked
                                  ? "bg-muted/50 text-white cursor-not-allowed opacity-50"
                                  : isSelected
                                  ? "bg-linear-to-br from-gold to-gold-dark text-black shadow-xl shadow-gold/20"
                                  : "bg-gold/10 hover:bg-gold/30 text-white hover:border hover:border-gold hover:shadow-lg hover:shadow-gold/30 border border-transparent"
                              }`}
                            >
                              {day}
                            </motion.button>
                          )
                        })}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gold/20 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gold/20 rounded"></div>
                      <span className="text-sm text-white">Available</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-linear-to-br from-gold to-gold-dark rounded border border-gold/30"></div>
                      <span className="text-sm text-white">Selected</span>
                    </div>
                  </div>
                </div>
              </div>
              {errors.date && <p className="text-red-500 text-sm w-full">{errors.date}</p>}

              {formData.date && (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={formData.date}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="animate-fadeIn"
                  >
                    <label className="block text-sm font-semibold mb-4 text-white">
                      Select a Time <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot, index) => {
                        const isSelected = formatDisplayTime(formData.time) === slot.display
                        const isAvailable = slot.available

                        return (
                          <motion.button
                            key={`${slot.display}-${isSelected}`}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => isAvailable && handleTimeSelect(slot)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.22,
                              ease: "easeOut",
                              delay: index * 0.03,
                            }}
                            whileHover={isAvailable ? { scale: 1.08 } : {}}
                            className={`p-2 h-16 rounded-lg border-2 transition-all font-semibold text-center ${
                              isSelected
                                ? "border-gold bg-gold/10 text-gold shadow-gold/30 shadow-lg"
                                : isAvailable
                                ? "border-amber-500/20 bg-card text-white hover:border-gold cursor-pointer"
                                : "border-amber-500/20 bg-gray-500/20 text-gray-700 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <div>{slot.display}</div>
                            {!isAvailable && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 0.1 }}
                                className="text-xs text-gray-700 mt-1"
                              >
                                Booked
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>

                    {errors.time && <p className="text-red-500 text-sm mt-2">{errors.time}</p>}
                  </motion.div>
                </AnimatePresence>
              )}

              {formData.date && formData.time && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-gold/10 border border-gold rounded-lg p-4 animate-fadeIn"
                >
                  <p className="text-sm text-gray-300 mb-1">Selected Session</p>
                  <p className="font-semibold text-gray-300">
                    {formatFullDate(formData.date)} at {formatDisplayTime(formData.time)}
                  </p>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <label className="block text-sm font-semibold mb-2 text-white">Additional Details</label>

                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-500/20 rounded-lg bg-card text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition resize-none h-32"
                  placeholder="Tell us more about your vision..."
                  initial="hidden"
                  animate="visible"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 12px rgba(245, 158, 11, 0.4)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-serif font-bold mb-6">Review Your Booking</h2>
                <motion.div variants={itemVariants} className="h-1 w-24 bg-linear-to-r from-yellow-600 to-yellow-500 mb-8" />
                <p className="mb-8 text-gray-300">Please review your information before submitting.</p>
              </motion.div>

              {/* Booking details */}
              <motion.div variants={itemVariants} className="bg-gold/10 border border-gold rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Name</p>
                    <p className="font-semibold text-gold">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Email</p>
                    <p className="font-semibold text-gold line-clamp-1">{formData.email}</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Phone</p>
                    <p className="font-semibold text-gold">{formData.phone || "Not provided"}</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Service Type</p>
                    <p className="font-semibold capitalize text-gold">
                      {labels[formData.serviceType as keyof typeof labels] || formData.serviceType}
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Number of Guests</p>
                    <p className="font-semibold text-gold">{formData.guests}</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-sm mb-1">Session Date & Time</p>
                    <p className="font-semibold text-gold">
                      {formatFullDate(formData.date)} at {formatDisplayTime(formData.time)}
                    </p>
                  </motion.div>
                </div>

                {formData.message && (
                  <motion.div variants={itemVariants} className="pt-4 border-t border-gold">
                    <p className="text-sm mb-1">Additional Details</p>
                    <p className="font-semibold text-gold line-clamp-3">{formData.message}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Policy notice */}
              <motion.div variants={itemVariants} className="bg-gold/10 border border-gold rounded-lg p-4">
                <p className="text-sm">
                  By submitting this form, you agree to our{" "}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-gold underline">
                    privacy policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-gold underline">
                    terms of service
                  </Link>
                  .
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              disabled={step === 1}
              className={`flex-1 py-2 text-lg rounded-lg transition-all duration-200 ${
                step === 1
                  ? "bg-muted text-black cursor-not-allowed"
                  : "border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-black/50 backdrop-blur-sm font-bold"
              }`}
            >
              Back
            </motion.button>
            {step === 4 ? (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2 bg-linear-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/30 font-semibold text-lg rounded-lg hover:shadow-lg hover:shadow-gold/40 transition-all duration-200 active:scale-95"
              >
                {isMobile ? "Submit" : "Submit Booking"}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-2 bg-linear-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/30 font-semibold text-lg rounded-lg hover:shadow-lg  transition-all duration-200  active:scale-95"
              >
                Next
              </motion.button>
            )}
          </div>
        </form>
      </div>
      {/* Success Message */}
      <PhotographySuccessAnimation isVisible={submitted} />
    </div>
  )
}

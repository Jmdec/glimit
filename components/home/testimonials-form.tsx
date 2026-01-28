"use client"

import { useState } from "react"
import { toast } from "sonner"

type FormData = {
  name: string
  position: string
  rating: number
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const TestimonialsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    position: "",
    rating: 0,
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.rating) newErrors.rating = "Please select a rating"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          title: formData.position || null,
          rating: formData.rating,
          message: formData.message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data?.errors) {
          toast.error("Failed to submit testimonial.", {
            position: "top-right",
            duration: 4000,
          })
        }
        return
      }

      toast.success("Thank You for Your Feedback", {
        description: "Your testimonial has been successfully submitted.",
        position: "top-right",
        duration: 4000,
      })

      setTimeout(() => {
        setFormData({
          name: "",
          position: "",
          rating: 0,
          message: "",
        })
      }, 300)
    } catch (error) {
      console.error(error)

      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">Share Your Testimonial</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-600 to-yellow-500 mb-8" />
            <p className="text-gray-300 mb-8">We’d love to hear your feedback.</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={`w-full px-4 py-3 bg-amber-500/10 rounded text-white placeholder-gray-500 focus:outline-none ${
                errors.name ? "border border-red-500" : "border border-amber-500/30 focus:border-amber-500"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Position / Title</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="CEO, Creative Studio"
              className="w-full px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className={`text-2xl transition ${formData.rating >= star ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Write your testimonial here..."
              className={`w-full px-4 py-3 bg-amber-500/10 rounded text-white placeholder-gray-500 focus:outline-none ${
                errors.message ? "border border-red-500" : "border border-amber-500/30 focus:border-amber-500"
              }`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition">
            Submit Testimonial
          </button>

          {/* success message */}
          {/* {submitted && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Thank You for Your Feedback</h2>

                <div className="h-1 w-24 bg-gradient-to-r from-yellow-600 to-yellow-500 mb-8" />

                <p className="mb-8 text-gray-300">
                  Your testimonial has been successfully submitted. We truly appreciate you taking the time to share your experience.
                </p>
              </div>

              <p className="text-sm text-gray-400">Your testimonial may appear on our website after review.</p>
            </div>
          )} */}
        </div>
      </form>
    </div>
  )
}

export default TestimonialsForm

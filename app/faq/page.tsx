"use client"
import FloatingParticles from "@/components/animated-golden-particles"
import { Button } from "@/components/ui/button"
import { Aperture, Camera, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"

const faqs = [
  {
    question: "What is your booking process?",
    answer:
      "Simply fill out the form above with your details and preferred date. We'll review your request and confirm within 24 hours. A deposit secures your booking.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 30+ days before the session receive a full refund. Cancellations within 30 days forfeit the deposit.",
  },
  {
    question: "Do you offer rush bookings?",
    answer: "Yes, rush bookings are available subject to schedule availability with an additional 25% rush fee.",
  },
  {
    question: "What types of photography services do you offer?",
    answer:
      "We offer a comprehensive range of photography services including weddings, portraits, events, product photography, and studio shoots. Each service is tailored to meet your specific needs and vision.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We require a 50% deposit to secure your booking. If you need to cancel, the deposit is non-refundable but can be applied to a future session within 12 months. Cancellations made less than 14 days before the session will forfeit the entire deposit.",
  },
  {
    question: "How long does it take to receive my photos?",
    answer:
      "Turnaround time varies by service. Portrait sessions are typically delivered within 2 weeks, events within 3-4 weeks, and weddings within 6-8 weeks. We'll provide you with a specific timeline when you book.",
  },
  {
    question: "Do you provide raw, unedited files?",
    answer:
      "We provide professionally edited, high-resolution images. Raw files are not included in standard packages as they require significant post-processing to look their best. However, we can discuss custom arrangements if you have specific needs.",
  },
  {
    question: "Can I purchase prints directly from you?",
    answer:
      "Yes! We offer professional printing services with various sizes and materials available. We work with premium labs to ensure the highest quality prints that will last for generations.",
  },
  {
    question: "Do you travel for destination shoots?",
    answer:
      "Absolutely! We love destination photography. Travel fees vary depending on location and duration. Contact us with your destination details and we'll provide a custom quote.",
  },
  {
    question: "What should I wear for my photo session?",
    answer:
      "We provide detailed styling guides when you book. Generally, we recommend wearing colors that complement your skin tone, avoiding busy patterns, and choosing outfits that make you feel confident and comfortable.",
  },
  {
    question: "Can I request specific shots or poses?",
    answer:
      "Of course! We encourage you to share your vision and any inspiration images. We'll work together to create a shot list that captures exactly what you're looking for while also providing our professional creative input.",
  },
  {
    question: "What happens if there's bad weather on my shoot day?",
    answer:
      "For outdoor sessions, we monitor weather closely. If conditions are unsuitable, we'll reschedule at no additional cost. For weddings and events, we always have backup plans and come prepared with equipment to work in various conditions.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, we offer flexible payment plans for larger packages. A 50% deposit is required to book, with the remaining balance due before or on the day of your session. Contact us to discuss payment options that work for you.",
  },
  {
    question: "Can I share my photos on social media?",
    answer:
      "Yes! We encourage you to share your photos on social media. We only ask that you tag us or provide credit when posting. All images remain under our copyright, but you have full personal usage rights.",
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-20 bg-linear-to-br from-black via-black to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-3 text-amber-500/70">
          <Aperture className="w-5 h-5" />
          <span className="text-sm tracking-[0.3em] uppercase">G-Limit</span>
          <Aperture className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative camera icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-amber-500/30 bg-card/30 backdrop-blur-sm">
                <Camera className="w-8 h-8 text-amber-500" />
              </div>
            </motion.div>

            {/* Main headline with gold gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
            >
              <span className="text-amber-500-gradient">Frequently Asked</span>
              <br />
              <span className="text-foreground">Questions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Find answers to common questions about our photography services, booking process, and policies.
            </motion.p>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-px w-48 mx-auto mt-12 gold-line"
            />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Floating gold glow background animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            x: ["-40%", "-60%", "-40%"],
            y: ["-40%", "-55%", "-40%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-[480px] h-[480px] bg-linear-to-br from-amber-500/30 via-amber-600/20 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        {/* Section-level fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto relative z-10"
        >
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className={`relative overflow-hidden cursor-pointer border border-amber-500 rounded-lg p-6 bg-card/50 backdrop-blur-sm transition-all duration-500 ease-out hover:border-amber-500/50 hover:shadow-amber-500-glow
                    ${isOpen ? "border-gold/60 shadow-gold-glow" : ""}`}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/95 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg text-foreground pr-8 group-hover:text-amber-500 transition-colors duration-300">
                          {faq.question}
                        </h3>

                        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="shrink-0">
                          <Plus className="w-6 h-6 text-amber-500" />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            {/* Gold line */}
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="h-0.5 w-full my-5 gold-line origin-left"
                            />

                            <motion.p
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              className="leading-relaxed text-gray-300"
                            >
                              {faq.answer}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6 bg-black relative overflow-hidden border-t-2 border-amber-500">
        {/* Rotating aperture decoration */}
        <motion.div
          className="absolute -right-32 -top-32 w-96 h-96 border-40 border-amber-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-32 -bottom-32 w-96 h-96 border-40 border-amber-500/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="inline-block">
              <Aperture className="w-20 h-20 text-amber-500" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif font-light text-white mb-6"
          >
            Still have questions?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            We&apos;re here to help you capture life&apos;s most precious moments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-linear-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black"
            >
              <Link href="/contact">
                <Camera className="w-5 h-5 mr-2" />
                Get in Touch
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent font-bold"
            >
              <Link href="/about">Learn About Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQ

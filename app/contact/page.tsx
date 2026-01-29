"use client"
import Link from "next/link"
import { motion } from "motion/react"
import FloatingParticles from "@/components/animated-golden-particles"
import { useInView } from "react-intersection-observer"
import BookingForm from "@/components/booking/form/booking-form"

export default function BookingPage() {
  const { ref } = useInView({ triggerOnce: true, threshold: 0.1 })

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

  const apertureBlades = 8

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <motion.section
        className="py-24 md:py-32 px-6 relative z-10 min-h-[50vh] flex items-center bg-linear-to-br from-black via-black to-amber-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 w-full">
          <motion.p className="text-xs md:text-sm uppercase tracking-widest text-amber-500 font-semibold" variants={itemVariants}>
            Book Your Session
          </motion.p>

          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight" variants={itemVariants}>
            Let&apos;s Create Something <span className="bg-linear-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">Beautiful</span>
          </motion.h1>

          <motion.p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed" variants={itemVariants}>
            Schedule your photography session or reach out with questions. We look forward to capturing moments that tell your story.
          </motion.p>
        </div>
      </motion.section>

      <section ref={ref} className="py-10 px-6">
        <div className="absolute  bg-linear-to-br from-black via-[#0a0a0a] to-[#1a1408]" />
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          {/* Aperture rings - left */}
          <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50">
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: 0, opacity: 0 }}
              whileInView={{ rotate: 15, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {[...Array(apertureBlades)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M100,100 L${100 + 80 * Math.cos((i * 2 * Math.PI) / apertureBlades)},${
                    100 + 80 * Math.sin((i * 2 * Math.PI) / apertureBlades)
                  } A80,80 0 0,1 ${100 + 80 * Math.cos(((i + 1) * 2 * Math.PI) / apertureBlades)},${
                    100 + 80 * Math.sin(((i + 1) * 2 * Math.PI) / apertureBlades)
                  } Z`}
                  fill="none"
                  stroke="hsl(43 96% 56%)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              ))}
              <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.3" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.3" />
            </motion.svg>
          </div>

          {/* Aperture rings - right */}
          <div className="absolute right-[-5%] bottom-[10%] w-[300px] h-[300px] opacity-50">
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: 0, opacity: 0 }}
              whileInView={{ rotate: -10, opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              {[...Array(6)].map((_, i) => (
                <circle key={i} cx="100" cy="100" r={30 + i * 12} fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.5" />
              ))}
            </motion.svg>
          </div>

          {/* Flare top-right */}
          <motion.div
            className="absolute top-[20%] right-[20%] w-32 h-32 pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, rgba(212,165,116,0.2), rgba(212,165,116,0.05), transparent)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgba(212,165,116,0.6)" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-linear-to-b from-transparent via-amber-400/40 to-transparent" />
          </motion.div>

          {/* Flare bottom-left */}
          <motion.div
            className="absolute bottom-[15%] left-[15%] w-24 h-24 pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, rgba(212,165,116,0.25), rgba(212,165,116,0.1), transparent)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgba(212,165,116,0.6)" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12 bg-linear-to-b from-transparent via-amber-400/40 to-transparent" />
          </motion.div>

          {/* Booking Form */}
          <BookingForm />
        </motion.section>

        <section className="z-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-3 my-20 text-center tracking-tight"
          >
            <h2 className="text-3xl font-serif font-bold">Get In Touch</h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-1 w-24 mx-auto bg-linear-to-r from-yellow-600 to-yellow-500 rounded-full origin-left"
            />
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gold mb-3">Location</h3>
                <p className="text-lg font-serif font-semibold text-white">G-Limit Studio</p>
                <p className="text-white leading-relaxed">
                  Unit 303, Campos Rueda Building,
                  <br />
                  Urban Ave, Makati City
                  <br />
                  1230 Metro Manila
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gold mb-3">Phone</h3>
                <a href="tel:+12125551234" className="text-lg font-semibold text-white hover:text-gold transition-colors">
                  +1 (212) 555-1234
                </a>
                <p className="text-sm text-white">Monday - Friday, 8AM - 5PM</p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gold mb-3">Email</h3>
                <a href="mailto:glimit@gmail.com" className="text-lg font-semibold text-white hover:text-gold transition-colors">
                  glimit@gmail.com
                </a>
                <p className="text-sm text-white">We typically respond within 24 hours</p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3 pt-4">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gold">Follow Us</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-lg text-foreground hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-lg text-foreground hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-lg text-foreground hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 002.856-3.51 10.02 10.02 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-gold">Visit Our Studio</h3>
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full h-64 rounded-lg overflow-hidden border border-border"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.71102040738344!2d121.01354766637368!3d14.559816725430425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90b830e5f29%3A0x89fe307dfecd3c0d!2sCampos%20Rueda%20Building!5e0!3m2!1sen!2sph!4v1769657722258!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </section>
    </div>
  )
}

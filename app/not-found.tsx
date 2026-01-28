"use client"
import { Aperture } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const NotFound = () => {
  const location = usePathname()

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location)
  }, [location])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      {/* Rotating aperture decorations */}
      <motion.div
        className="absolute -right-32 -top-32 w-96 h-96 border-[40px] border-amber-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -left-32 -bottom-32 w-96 h-96 border-[40px] border-amber-500/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Aperture icon animation */}
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

        {/* 404 headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-7xl font-serif font-light text-white mb-6"
        >
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">404</span> Page Not
          Found
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Oops! The page you’re looking for doesn’t exist. Let’s get you back on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black rounded-lg"
          >
            Return to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent font-bold rounded-lg"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound

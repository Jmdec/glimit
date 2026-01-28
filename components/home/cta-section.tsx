"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Aperture, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
}

const smoothTransition = { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden border-t-2 border-amber-500">
      {/* Rotating aperture decoration */}
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
          Ready to Create Something{" "}
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Beautiful</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Let&apos;s discuss your vision and bring it to life through stunning photography and videography.
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
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black"
          >
            <Link href="/contact">
              <Camera className="w-5 h-5 mr-2" />
              Start Your Project
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
  )
}

"use client"
import FloatingParticles from "@/components/animated-golden-particles"
import { motion } from "motion/react"

const Terms = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <>
      <FloatingParticles />
      <section className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-black via-black to-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent mb-8"
          >
            Terms of Service
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="space-y-8 text-gray-300"
          >
            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-gray-300">
                By booking our photography services or using our website, you agree to be bound by these Terms of Service. If you do not agree to
                these terms, please do not use our services.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Booking and Payment</h2>
              <p className="mb-4 text-gray-300">When you book our services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>A non-refundable deposit of 50% is required to secure your booking date</li>
                <li>The remaining balance is due 48 hours before the scheduled session</li>
                <li>We accept credit cards, bank transfers, and digital payment methods</li>
                <li>Prices are subject to change but confirmed bookings honor the quoted price</li>
                <li>Late payment may result in session cancellation</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation and Rescheduling</h2>
              <p className="mb-4 text-gray-300">Our cancellation policy:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Cancellations made 14+ days before the session: Full refund minus deposit</li>
                <li>Cancellations made 7-13 days before: 50% refund</li>
                <li>Cancellations made less than 7 days before: No refund</li>
                <li>Rescheduling is allowed once free of charge if done 7+ days in advance</li>
                <li>Weather-related cancellations for outdoor shoots can be rescheduled without penalty</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Image Delivery and Timeline</h2>
              <p className="mb-4 text-gray-300">Regarding your photographs:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Edited images will be delivered within 2-4 weeks after the session</li>
                <li>Rush delivery available for an additional fee</li>
                <li>Images are delivered via secure online gallery</li>
                <li>Raw, unedited files are not provided unless specified in your package</li>
                <li>We retain full copyright of all images unless otherwise agreed in writing</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Usage Rights</h2>
              <p className="mb-4 text-gray-300">Image usage rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Clients receive personal use rights for all delivered images</li>
                <li>Commercial use requires separate licensing agreement</li>
                <li>Images may not be altered, cropped, or edited without permission</li>
                <li>We reserve the right to use images for portfolio and marketing purposes</li>
                <li>Copyright watermarks must not be removed from preview images</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Client Responsibilities</h2>
              <p className="mb-4 text-gray-300">Clients agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Arrive on time for scheduled sessions</li>
                <li>Provide accurate contact and booking information</li>
                <li>Secure necessary location permits for outdoor shoots</li>
                <li>Inform us of any special requirements or accessibility needs</li>
                <li>Respect our equipment and studio space</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Liability and Warranties</h2>
              <p className="mb-4 text-gray-300">Important limitations:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>We are not liable for missed shots due to circumstances beyond our control</li>
                <li>Equipment failure, accidents, or natural disasters may affect delivery</li>
                <li>We carry professional liability insurance for covered incidents</li>
                <li>Backup equipment and photographers available for weddings and events</li>
                <li>Maximum liability is limited to the amount paid for services</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Model Release</h2>
              <p className="text-gray-300">
                By participating in a photography session, you grant us permission to use your likeness in photographs for portfolio, marketing, and
                promotional purposes unless you opt-out in writing before the session.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Studio Rental Terms</h2>
              <p className="mb-4 text-gray-300">For studio rentals:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Rentals are by the hour with a 2-hour minimum</li>
                <li>Equipment damage requires full replacement cost</li>
                <li>Studio must be left in the condition it was found</li>
                <li>Additional guests beyond agreed number incur extra charges</li>
                <li>Food and beverages allowed with prior approval</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Dispute Resolution</h2>
              <p className="text-gray-300">
                Any disputes arising from these terms will be resolved through mediation before pursuing legal action. Both parties agree to
                communicate in good faith to resolve any issues.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right to modify these terms at any time. Changes will be posted on this page and take effect immediately. Existing
                bookings are governed by the terms in place at the time of booking.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
              <p className="text-gray-300">Questions about these terms? Contact us at terms@studiophoto.com or visit our contact page.</p>
            </motion.section>

            <p className="text-sm mt-12 pt-8 border-t border-border-amber-500 text-gray-300">
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Terms

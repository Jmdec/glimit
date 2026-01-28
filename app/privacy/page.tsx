"use client"
import FloatingParticles from "@/components/animated-golden-particles"
import { motion } from "motion/react"

const Privacy = () => {
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
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent"
          >
            Privacy Policy
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="space-y-8 text-gray-300"
          >
            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-gray-300">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our
                photography services. Please read this privacy policy carefully.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <p className="mb-4 text-gray-300">We may collect information about you in a variety of ways, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Personal data (name, email address, phone number) provided when booking services</li>
                <li>Payment information processed through secure payment gateways</li>
                <li>Photographs and images taken during photography sessions</li>
                <li>Usage data and analytics from website visits</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <p className="mb-4 text-gray-300">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Process your bookings and deliver photography services</li>
                <li>Send booking confirmations and service updates</li>
                <li>Improve our website and services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional materials (with your consent)</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Image Rights and Usage</h2>
              <p className="text-gray-300">
                All photographs taken during sessions remain the property of our studio unless otherwise specified in your contract. We may use
                selected images for portfolio display, marketing materials, and social media with your permission. You retain the right to request
                removal of your images from our marketing materials at any time.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-gray-300">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of
                transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-gray-300">
                We may share your information with trusted third-party service providers who assist us in operating our website, conducting our
                business, or servicing you. These parties are obligated to keep your information confidential.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="mb-4 text-gray-300">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Access your personal data we hold</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for image usage</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies</h2>
              <p className="text-gray-300">
                Our website uses cookies to enhance user experience and analyze site traffic. You can choose to disable cookies through your browser
                settings, though this may affect website functionality.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-gray-300">
                We reserve the right to update this privacy policy at any time. We will notify you of any changes by posting the new policy on this
                page with an updated revision date.
              </p>
            </motion.section>

            <motion.section variants={fadeInUp}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-gray-300">
                If you have questions about this Privacy Policy, please contact us at privacy@studiophoto.com or through our contact page.
              </p>
            </motion.section>

            <p className="text-sm mt-12 pt-8 border-t border-amber-500 text-gray-300">
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Privacy

"use client"
import { Card } from "@/components/ui/card"
import { Award, Camera, Heart, Palette, Users, Zap, Sparkles, Target, Aperture } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number"
import FloatingParticles from "@/components/animated-golden-particles"
import { Button } from "@/components/ui/button"
import { TeamMember, TeamMemberDialog } from "@/components/about/modal/team-member-modal"

const values = [
  {
    icon: Camera,
    title: "Artistic Excellence",
    description: "Unique artistic vision creating meaningful, beautiful images.",
  },
  {
    icon: Award,
    title: "Professional Quality",
    description: "Highest standards of professional photography guaranteed.",
  },
  {
    icon: Heart,
    title: "Personal Connection",
    description: "Understanding your story, creating collaborative experiences.",
  },
  {
    icon: Users,
    title: "Client Commitment",
    description: "Your satisfaction is priority. Expectations exceeded.",
  },
]

const teamMembers = [
  {
    name: "Alexandra Sterling",
    role: "Founder & Creative Director",
    specialty: "Weddings & Portraits",
    image: "/professional-woman-photographer.png",
    bio: "Visionary leader documenting life's meaningful moments for over a decade.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "Marcus Davidson",
    role: "Lead Photographer",
    specialty: "Events & Commercial",
    image: "/professional-photographer.png",
    bio: "Unmatched energy and attention to detail in every project.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "Elena Vasquez",
    role: "Portrait Specialist",
    specialty: "Studio Portraits & Fashion",
    image: "/professional-latina-woman-photographer-portrait.jpg",
    bio: "High-end portrait and fashion, merging precision with creative expression.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "James Liu",
    role: "Product & Commercial",
    specialty: "Product & E-commerce",
    image: "/professional-asian-man-photographer-portrait.jpg",
    bio: "Refined, technical mindset that elevates brands.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
}

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const storyRef = useRef(null)

  return (
    <div className="min-h-screen pt-16 bg-black">
      {/* Animated golden particles */}
      <FloatingParticles />

      {/* Hero Section with Film Strip Effect */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Animated film perforations - gold */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black border-b-2 border-amber-500 flex items-center overflow-hidden">
          <motion.div className="flex" animate={{ x: [0, -200] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-10 h-7 bg-gradient-to-b from-amber-500 to-amber-600 mx-3 rounded-sm shadow-lg shadow-amber-500/30" />
            ))}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto text-center pt-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Camera viewfinder decoration */}
            <div className="inline-block relative mb-8">
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 border-l-3 border-t-3 border-amber-500"
                initial={{ opacity: 0, x: -10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="absolute top-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 border-r-3 border-t-3 border-amber-500"
                initial={{ opacity: 0, x: 10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-12 h-12 border-l-3 border-b-3 border-amber-500"
                initial={{ opacity: 0, x: -10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-12 h-12 border-r-3 border-b-3 border-amber-500"
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white px-12 py-6">
                About <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Us</span>
              </h1>
            </div>

            {/* Sparkle decorations */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
              <p className="text-lg text-gray-300 max-w-2xl">
                Creating exceptional photography that tells your unique story with elegance, artistry, and professionalism.
              </p>
              <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-1 w-40 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Story & Values Section */}
      <motion.section
        ref={storyRef}
        className="relative px-4 py-10 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 20% 40%, rgba(255,215,0,.35), transparent 55%), radial-gradient(circle at 80% 60%, rgba(255,165,0,.25), transparent 55%)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          {/* STORY */}
          <motion.div className="text-center max-w-3xl mx-auto" variants={fadeInUp}>
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Story
            </h2>
            <div className="h-0.5 w-16 mx-auto mb-4" style={{ background: "linear-gradient(to right, #FFD700, #FFA500)" }} />

            <motion.div className="space-y-3 text-gray-300 leading-relaxed" variants={staggerContainer}>
              <motion.p variants={fadeInUp}>
                Founded with a passion for capturing life’s most meaningful moments, our studio has grown into a trusted destination for professional
                photography.
              </motion.p>
              <motion.p variants={fadeInUp}>
                Every project begins with a simple belief: moments deserve to be preserved with care, intention, and beauty.
              </motion.p>
              <motion.p variants={fadeInUp}>We don’t just take photos—we craft visual stories meant to last generations.</motion.p>
            </motion.div>
          </motion.div>

          {/* VALUES */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            <motion.div className="text-center" variants={fadeInUp}>
              <h3
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Our Values
              </h3>
              <p className="text-sm text-gray-400">Principles that guide every frame we create</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {values.map((value, index) => (
                <motion.div key={index} variants={fadeInUp} whileHover={{ y: -8, scale: 1.03 }}>
                  <Card
                    className="p-5 text-center h-full border-2 relative overflow-hidden group"
                    style={{
                      backgroundColor: "rgba(0,0,0,.6)",
                      borderColor: "rgba(255,215,0,.3)",
                    }}
                  >
                    <value.icon className="h-9 w-9 mx-auto mb-2" style={{ color: "#FFD700" }} />
                    <h4 className="text-base font-bold text-white mb-1">{value.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* EXPERIENCE */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            <motion.div className="text-center" variants={fadeInUp}>
              <h3
                className="text-2xl md:text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Our Experience
              </h3>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { number: 10, suffix: "+", label: "Years", desc: "Creative excellence", icon: Award },
                { number: 500, suffix: "+", label: "Clients", desc: "Trusted partnerships", icon: Users },
                { number: 50, suffix: "K+", label: "Photos", desc: "Moments preserved", icon: Camera },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-5 rounded-xl border-2 relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(0,0,0,.6)",
                    borderColor: "rgba(255,215,0,.3)",
                  }}
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.05,
                    y: -6,
                    borderColor: "#FFD700",
                  }}
                >
                  <stat.icon className="h-7 w-7 mx-auto mb-2" style={{ color: "#FFD700" }} />
                  <div
                    className="text-4xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <CountingNumber number={stat.number} />
                    {stat.suffix}
                  </div>
                  <div className="text-sm font-semibold text-white">{stat.label}</div>
                  <p className="text-xs text-gray-400">{stat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* STUDIO */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            <motion.div className="text-center" variants={fadeInUp}>
              <p className="text-xs uppercase tracking-widest font-bold text-[#FFD700]">Our Creative Space</p>
              <h3
                className="text-2xl md:text-3xl font-serif font-bold"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                The G-Limit Studio
              </h3>
            </motion.div>

            <motion.p className="text-gray-300 text-center max-w-2xl mx-auto text-sm" variants={fadeInUp}>
              A thoughtfully designed environment that empowers creativity, precision, and artistic freedom.
            </motion.p>

            <motion.div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Camera, title: "Professional Equipment", desc: "Industry-leading cameras and lighting." },
                { icon: Zap, title: "Production Capabilities", desc: "High-end editing and workflows." },
                { icon: Palette, title: "Creative Environment", desc: "Natural light, backdrops, and freedom." },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-5 rounded-xl border-2 relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(0,0,0,.6)",
                    borderColor: "rgba(255,215,0,.3)",
                  }}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                >
                  <item.icon className="h-6 w-6 mb-2" style={{ color: "#FFD700" }} />
                  <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      {/* <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10 space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: "#FFD700" }} variants={fadeInUp}>
              Meet Our Team
            </motion.p>
            <motion.h2
              className="text-3xl md:text-4xl font-serif font-bold"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              variants={fadeInUp}
            >
              Exceptional Photographers
            </motion.h2>
            <motion.p className="text-sm text-gray-300" variants={fadeInUp}>
              Talented team bringing diverse expertise to every project.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                onClick={() => setSelectedMember(member)}
                className="group rounded-xl overflow-hidden transition-all duration-300 border-2 relative"
                style={{
                  borderColor: "rgba(255, 215, 0, 0.3)",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
                variants={fadeInUp}
                whileHover={{
                  y: -8,
                  borderColor: "#FFD700",
                  backgroundColor: "rgba(255, 215, 0, 0.1)",
                  boxShadow: "0 15px 50px rgba(255, 215, 0, 0.4)",
                }}
              >
                <div className="relative h-96 overflow-hidden bg-black">
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.1, rotate: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                  >
                    <Image
                      src={member.image || "/placeholder.png"}
                      alt={member.name}
                      fill
                      sizes="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent, transparent)",
                      opacity: 0,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="p-5 space-y-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">{member.name}</h3>
                    <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#FFD700" }}>
                      {member.role}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{member.specialty}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      <TeamMemberDialog selectedMember={selectedMember} setSelectedMember={setSelectedMember} />

      {/* CTA Section */}
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
            Ready to Create Something{" "}
            <span className="bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Beautiful</span>?
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
              className="bg-linear-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black"
            >
              <Link href="/contact">
                <Camera className="w-5 h-5 mr-2" />
                Start Your Project
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

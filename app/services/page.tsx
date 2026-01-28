"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Users, PartyPopper, Package, Building2, User, Clock, MapPin, Sparkles, Check, Aperture, Film, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import FloatingParticles from "@/components/animated-golden-particles"
import { useBookingStore } from "@/store/useBookingStore"
import { useRouter } from "next/navigation"

const photographyServices = [
  {
    title: "Wedding Photography",
    description: "Celebrate your special day with timeless, artistic wedding photography. Full day coverage capturing every emotional moment.",
    features: ["8-10 hour coverage", "Two photographers", "Edited digital gallery", "Print releases included"],
    // price: " / session",
    icon: <Users className="w-6 h-6" />,
    color: "from-amber-500 to-amber-600",
    serviceType: "wedding",
  },
  {
    title: "Portrait Photography",
    description: "Professional portraits for headshots, families, couples, and personal brands. Captured in our studio or on location.",
    features: ["60-120 min session", "Professional styling", "50+ edited images", "Digital gallery + prints"],
    // price: "Starting at ₱500 / session",
    icon: <User className="w-6 h-6" />,
    color: "from-amber-400 to-amber-500",
    serviceType: "portrait",
  },
  {
    title: "Event Photography",
    description: "Document your corporate events, galas, conferences, and celebrations with professional coverage and storytelling.",
    features: ["Flexible hours", "Multiple photographers", "Candid + posed shots", "Same-day highlight reel"],
    // price: "Starting at ₱1,200 / session",
    icon: <PartyPopper className="w-6 h-6" />,
    color: "from-amber-500 to-yellow-500",
    serviceType: "event",
  },
  {
    title: "Product Photography",
    description: "Showcase your products with stunning, professional imagery designed to elevate your brand and boost sales.",
    features: ["Professional styling", "Unlimited shots", "Photo retouching", "Various backgrounds"],
    // price: "Starting at ₱800 / session",
    icon: <Package className="w-6 h-6" />,
    color: "from-yellow-500 to-amber-500",
    serviceType: "product",
  },
  {
    title: "Commercial & Branding",
    description: "Build your brand identity with cohesive, professional photography for websites, marketing, and social media.",
    features: ["Custom shoot planning", "Brand consultation", "Multiple deliverables", "Lifestyle shots"],
    // price: "Starting at ₱2,000 / session",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-amber-600 to-amber-500",
    serviceType: "commercial",
  },
  {
    title: "Headshots & Actors",
    description: "Professional headshots for actors, professionals, and performers. Industry-standard quality for casting.",
    features: ["30-min session", "Multiple looks", "Professional makeup", "Express turnaround"],
    // price: "Starting at ₱300 / session",
    icon: <Camera className="w-6 h-6" />,
    color: "from-amber-500 to-amber-400",
    serviceType: "headshot",
  },
]

const studioRentalServices = [
  {
    title: "Studio Space - Half Day",
    description: "4-hour rental with full access to our professional space.",
    // price: "₱350 / session",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Studio Space - Full Day",
    description: "8 hours of uninterrupted studio time for larger productions.",
    // price: "₱650 / day",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Video Production Suite",
    description: "Specialized setup for video production with lighting and audio.",
    // price: "₱400 / 4 hours",
    icon: <Film className="w-5 h-5" />,
  },
  {
    title: "Makeup & Hair Station",
    description: "Premium makeup station with professional mirrors and lighting.",
    // price: "₱150 / rental",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Equipment Rental",
    description: "Professional cameras, lenses, lighting, and more for rent.",
    // price: "Pricing varies",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    title: "Private Events",
    description: "Host your celebration in our elegant studio space.",
    // price: "From ₱1,500",
    icon: <PartyPopper className="w-5 h-5" />,
  },
]

export default function ServicesPage() {
  const setSelectedService = useBookingStore((state) => state.setSelectedService)
  const router = useRouter()
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

  const handleBooking = (serviceType: string) => {
    setSelectedService(serviceType)
    router.push("/contact")
  }
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gold particles background */}
      <FloatingParticles count={50} />

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
                Our{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Services</span>
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
                From professional photography sessions to studio rentals, we provide everything you need to bring your creative vision to life.
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

      {/* Photography Services - Enhanced Cards */}
      <section className="pb-8 px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div className="max-w-7xl mx-auto" initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Header */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-6 text-center">
            <div className="mb-2 flex flex-row items-center justify-center gap-3 ">
              <h2 className="text-3xl font-serif font-light text-white text-center">
                Photography <span className="bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent font-bold">Services</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-2">
              Professional photography tailored to your needs. All packages include edited images and full licensing rights.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photographyServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 60, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-neutral-900 to-black rounded-2xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border-2 border-amber-500/30 relative">
                  {/* Flash effect */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

                  {/* Header */}
                  <div className={`bg-gradient-to-br ${service.color} p-5 sm:p-6 md:p-8 relative overflow-hidden`}>
                    <motion.div
                      className="absolute top-2 left-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-l-2 border-t-2 border-black/50"
                      initial={{ opacity: 0, x: -5, y: -5 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true }}
                    />
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-black rounded-xl flex items-center justify-center text-amber-500 shadow-2xl border-2 border-black"
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-black mt-4">{service.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 md:p-8 space-y-4">
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed line-clamp-4">{service.description}</p>

                    <div className="space-y-3">
                      {service.features.map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-amber-500" />
                          </div>
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4 sm:pt-6 border-t border-amber-500/20 flex flex-col lex-row items-start items-center justify-between gap-4">
                      {/* <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
                        {service.price}
                      </p> */}
                      <Button
                        size="lg"
                        onClick={() => handleBooking(service.serviceType)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold border-2 border-black shadow-xl"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Studio Rental Services */}
      <section className="py-2 px-6 relative overflow-hidden border-y-2 border-amber-500">
        {/* Film strip decoration */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-black flex items-center overflow-hidden border-b-2 border-amber-500">
          <motion.div className="flex" animate={{ x: [0, -200] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-8 h-6 bg-gradient-to-b from-amber-500 to-amber-600 mx-3 rounded-sm shadow-lg shadow-amber-500/30" />
            ))}
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto py-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <h2 className="mb-2 text-3xl font-serif font-light text-white mb-4">
              Studio <span className="bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent font-bold">Rentals</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Access our fully equipped, professional studio for your creative projects.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studioRentalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-neutral-900 to-black backdrop-blur border-2 border-amber-500/30 rounded-xl p-6 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-black flex-shrink-0 shadow-lg shadow-amber-500/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2 text-lg">{service.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-4">{service.description}</p>
                    {/* <p className="text-amber-500 font-bold text-lg">{service.price}</p> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Film strip decoration - bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black flex items-center overflow-hidden border-t-2 border-amber-500 mt-16">
          <motion.div className="flex" animate={{ x: [-200, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-8 h-6 bg-gradient-to-b from-amber-500 to-amber-600 mx-3 rounded-sm shadow-lg shadow-amber-500/30" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Studio Amenities */}
      <section className="py-6 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2.5 rounded-full mb-8 border-2 border-black shadow-xl shadow-amber-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-black tracking-wider">STUDIO FACILITIES</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-6">
                Fully Equipped
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent font-bold">Professional Space</span>
              </h2>

              <p className="text-lg text-gray-400 leading-relaxed mb-10">
                Our studio features equipment and professional amenities designed for photographers, videographers, and creative professionals.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Professional lighting kits",
                  "Multiple backdrops",
                  "Green screen setup",
                  "Studio-grade tripods",
                  "Audio equipment",
                  "Climate controlled",
                  "Free WiFi",
                  "Styling area",
                ].map((amenity, i) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Animated viewfinder frame */}
              <motion.div
                className="absolute -top-6 -left-6 w-16 h-16 border-l-4 border-t-4 border-amber-500"
                initial={{ opacity: 0, x: -10, y: -10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 w-4 h-4 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 border-r-4 border-t-4 border-amber-500"
                initial={{ opacity: 0, x: 10, y: -10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-4 h-4 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 border-l-4 border-b-4 border-amber-500"
                initial={{ opacity: 0, x: -10, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 border-r-4 border-b-4 border-amber-500"
                initial={{ opacity: 0, x: 10, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-500 rounded-full" />
              </motion.div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-amber-900/50 border-4 border-amber-500/30">
                <Image
                  src="/studio.jpg"
                  alt="G-Limit Studio professional space"
                  fill
                  sizes="w-full h-full"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-black relative overflow-hidden border-t-2 border-amber-500">
        <motion.div
          className="absolute -right-40 -top-40 w-[500px] h-[500px] border-[60px] border-amber-500/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-40 -bottom-40 w-[500px] h-[500px] border-[60px] border-amber-500/5 rounded-full"
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
              <Aperture className="w-24 h-24 text-amber-500" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif font-light text-white mb-6"
          >
            Ready to Get <span className="bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent font-bold">Started</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-10"
          >
            Contact us today to discuss your project and book your session.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-black px-10 py-6 text-lg shadow-2xl shadow-amber-500/40 border-2 border-black"
            >
              <Link href="/contact">
                <Camera className="w-6 h-6 mr-3" />
                Book a Consultation
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
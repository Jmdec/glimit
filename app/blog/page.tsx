"use client"
import { Card } from "@/components/ui/card"
import { Calendar, User, Camera, Aperture, CameraIcon, Focus, ZoomIn, Film, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FloatingParticles from "@/components/animated-golden-particles"
import { Post } from "@/lib/types/types"
import ScrollZoomCard from "@/components/blog/scroll-zoom-card"

type Category = "all" | "wedding" | "portrait" | "event" | "product" | "studio"

const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Posts", icon: <Camera className="w-4 h-4" /> },
  {
    value: "wedding",
    label: "Weddings",
    icon: <Aperture className="w-4 h-4" />,
  },
  {
    value: "portrait",
    label: "Portraits",
    icon: <Focus className="w-4 h-4" />,
  },
  { value: "event", label: "Events", icon: <ZoomIn className="w-4 h-4" /> },
  { value: "product", label: "Products", icon: <Film className="w-4 h-4" /> },
  {
    value: "studio",
    label: "Studio",
    icon: <CameraIcon className="w-4 h-4" />,
  },
]

const getImageSrc = (image: string | File | null): string | undefined => {
  if (!image) return undefined

  if (image instanceof File) {
    return URL.createObjectURL(image)
  }

  if (image.startsWith("http") || image.startsWith(process.env.NEXT_PUBLIC_API_IMG || "")) {
    return image
  }

  return `${process.env.NEXT_PUBLIC_API_IMG}${image}`
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")

  const filteredPosts = selectedCategory === "all" ? posts : posts.filter((post) => post.category === selectedCategory)
  const post = selectedPost ? posts.find((p) => p.id === selectedPost) : null

  const featuredPosts = posts.filter((p) => p.featured === true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts")
        const data = await res.json()
        if (Array.isArray(data.posts)) {
          setPosts(data.posts)
        } else {
          setPosts([])
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-linear-to-br from-[#1a0f0a] via-[#2d1810] to-[#4a2818] relative overflow-hidden">
      <FloatingParticles count={20} />

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
                Our <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Blog</span>
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
                Discover how visual narratives can transform your photography and engage your audience.
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

      {/* Featured Posts */}
      <div className="my-4">
        {/* <Marquee> */}
        {featuredPosts.map((featuredPost) => (
          <motion.section
            key={featuredPost.id}
            className="px-6 pb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="max-w-6xl mx-auto">
              <Card
                className="overflow-hidden group bg-linear-to-br from-[#2d1810]/80 to-[#1a0f0a]/80 border-[#d4a574]/30 hover:border-[#d4a574] transition-all duration-500 shadow-2xl hover:shadow-[#d4a574]/20 relative backdrop-blur-sm"
                onClick={() => setSelectedPost(featuredPost.id)}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <motion.div
                      initial={{ scale: 1.25, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <img
                        src={getImageSrc(featuredPost.image) || "/placeholder.svg"}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-linear-to-r from-black/60 via-amber-900/20 to-transparent" />
                  </div>

                  <motion.div
                    className="p-8 md:p-12 flex flex-col justify-center relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.15 } },
                    }}
                  >
                    <motion.span
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      className="inline-block px-3 py-1 bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-xs font-semibold rounded-full w-fit mb-4 border border-[#d4a574]/30"
                    >
                      {featuredPost.label}
                    </motion.span>

                    <motion.h2
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      className="text-2xl md:text-3xl font-bold mb-4"
                    >
                      {featuredPost.title}
                    </motion.h2>

                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      className="text-gray-300 mb-6 leading-relaxed"
                    >
                      {featuredPost.excerpt}
                    </motion.p>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center gap-4 text-sm text-gray-400"
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-[#d4a574]" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4 text-[#d4a574]" />
                        {featuredPost.author}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </div>
          </motion.section>
        ))}
        {/* </Marquee> */}
      </div>

      {/* Posts Grid */}
      <motion.section
        className="px-6 pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold ${
                  selectedCategory === cat.value ? "bg-amber-500 text-black" : "bg-black text-amber-500"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <ScrollZoomCard key={post.id} post={post} index={index} onClick={() => setSelectedPost(post.id)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl h-[90vh] bg-linear-to-br from-[#2d1810] to-[#1a0f0a] border-[#d4a574]/50 overflow-y-auto scrollbar-hide">
          {post && (
            <>
              <DialogHeader>
                <span className="inline-block px-3 py-1 bg-linear-to-r from-[#d4a574]/20 to-[#c9944a]/20 text-[#d4a574] text-xs font-semibold rounded-full w-fit mb-2 border border-[#d4a574]/30">
                  {post.label}
                </span>
                <DialogTitle className="text-2xl font-serif bg-linear-to-r from-white to-[#d4a574] bg-clip-text text-transparent">
                  {post.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#d4a574]" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#d4a574]" />
                    {post.author}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="relative h-64 rounded-lg overflow-hidden my-4">
                <img src={getImageSrc(post.image) || "/placeholder.svg"} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-[#1a0f0a]/60 to-transparent" />
              </div>
              <span className="block mb-4 text-xl font-medium text-gold/90 italic border-l-4 border-gold pl-3 py-1">{post.excerpt}</span>
              <p className="text-gray-300 leading-relaxed">{post.content}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

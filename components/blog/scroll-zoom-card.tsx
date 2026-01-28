"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import { Post } from "@/lib/types/types"

interface ScrollZoomCardProps {
  post: Post
  index: number
  onClick: () => void
}

const getImageSrc = (image: string | File | null): string | undefined => {
  if (!image) return undefined

  if (image instanceof File) {
    // Convert File to a temporary URL
    return URL.createObjectURL(image)
  }

  // image is string from here
  if (image.startsWith("http") || image.startsWith(process.env.NEXT_PUBLIC_API_IMG || "")) {
    return image
  }

  return `${process.env.NEXT_PUBLIC_API_IMG}${image}`
}

export default function ScrollZoomCard({ post, index, onClick }: ScrollZoomCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.4, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Card
        className="overflow-hidden gap-0 p-0 group h-full bg-gradient-to-br from-[#2d1810]/80 to-[#1a0f0a]/80 border-[#d4a574]/30 hover:border-[#d4a574] transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a574]/20 relative backdrop-blur-sm"
        onClick={onClick}
      >
        {/* Camera Flash on Hover */}
        <motion.div
          className="absolute inset-0 bg-white z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative h-48 overflow-hidden">
          <motion.div className="w-full h-full" style={{ scale, opacity }}>
            <img src={getImageSrc(post.image) || "/placeholder.svg"} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Animated Viewfinder */}
          <motion.div
            className="absolute inset-4 border-2 border-[#d4a574]/0 group-hover:border-[#d4a574]/50 transition-all duration-300"
            initial={false}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4a574]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4a574]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4a574]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4a574]" />
          </motion.div>

          <span className="absolute top-6 left-6 px-3 py-1 bg-gradient-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-size-[200%_200%] text-black text-xs font-semibold rounded-full z-20 shadow-lg">
            {post.label}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-white to-[#d4a574] bg-clip-text text-transparent group-hover:from-[#d4a574] group-hover:to-[#c9944a] transition-all duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#d4a574]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1 text-[#d4a574] group-hover:underline">
              Read More <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

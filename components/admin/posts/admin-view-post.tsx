"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Post } from "@/lib/types/types"
import { formatMonthDayYear } from "@/lib/utils"
import { Calendar, User } from "lucide-react"

interface PostViewDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  post: Post | null
}

export function PostViewDialog({ open, setOpen, post }: PostViewDialogProps) {
  if (!post) return null

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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
                    {formatMonthDayYear(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#d4a574]" />
                    {post.author}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="relative h-64 rounded-lg overflow-hidden my-4">
                {post.image && <img src={getImageSrc(post.image)} alt="Post image" className="w-full max-h-64 object-cover rounded" />}
                <div className="absolute inset-0 bg-linear-to-t from-[#1a0f0a]/60 to-transparent" />
              </div>
              <span className="block mb-4 text-xl font-medium text-gold/90 italic border-l-4 border-gold pl-3 py-1">{post.excerpt}</span>
              <p className="text-gray-300 leading-relaxed">{post.content}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

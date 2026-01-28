"use client"
import { useEffect, useState } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

function FilmStripRow({ 
  images, 
  reverse = false,
  speed = 40
}: { 
  images: FilmStripImage[]
  reverse?: boolean
  speed?: number
}) {
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  // Only duplicate once
  const duplicatedImages = [...images, ...images]

  return (
    <div className={`relative ${reverse ? '-rotate-2' : 'rotate-2'} my-8`}>
      <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
        {/* Minimal perforations */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-4 z-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 z-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        <div className="relative h-64">
          <div 
            className="flex gap-2 px-8 absolute film-scroll"
            style={{
              animation: `scroll-${reverse ? 'right' : 'left'} ${speed}s linear infinite`,
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div 
                key={`${image.id}-${index}`} 
                className="relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800"
              >
                <img 
                  src={getImageUrl(image.image_path)} 
                  alt={image.alt_text || ''} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs font-bold">
                  {String(image.id).padStart(3, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">
       G-LIMIT
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        
        .film-scroll {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export function FilmStripGallery() {
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/film-strip?perPage=15')
      .then(res => res.json())
      .then(json => {
        const images = Array.isArray(json.data) ? json.data : []
        setGalleryImages(images)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black min-h-screen flex items-center justify-center">
        <div className="text-[#d4a574]">Loading...</div>
      </section>
    )
  }

  const row1 = galleryImages.slice(0, 5)
  const row2 = galleryImages.slice(5, 10)
  const row3 = galleryImages.slice(10, 15)

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen">
      <div className="space-y-4">
        {row1.length > 0 && <FilmStripRow images={row1} reverse={false} speed={80} />}
        {row2.length > 0 && <FilmStripRow images={row2} reverse={true} speed={90} />}
        {row3.length > 0 && <FilmStripRow images={row3} reverse={false} speed={75} />}
      </div>
    </section>
  )
}
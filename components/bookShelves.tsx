"use client"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

interface Book {
  id: number
  image: FilmStripImage
  shelfIndex: number
  positionOnShelf: number
  width: number
  height: number
  tilt: number
  thickness: number
  spineColor: string
  index: number
}

export function BookshelfGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [hoveredBook, setHoveredBook] = useState<number | null>(null)
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/film-strip?perPage=1000', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }

        const json = await response.json()
        const filmStripImages = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
        setGalleryImages(filmStripImages)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Create bookshelf layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    const booksPerShelf = isMobile ? 4 : 8
    const shelves = Math.ceil(galleryImages.length / booksPerShelf)
    
    const spineColors = [
      '#8b4513', '#a0522d', '#654321', '#3e2723', // Browns
      '#1a237e', '#0d47a1', '#01579b', // Blues
      '#1b5e20', '#2e7d32', '#388e3c', // Greens
      '#b71c1c', '#c62828', '#d32f2f', // Reds
      '#4a148c', '#6a1b9a', '#7b1fa2', // Purples
    ]

    const booksList: Book[] = galleryImages.map((image, index) => {
      const shelfIndex = Math.floor(index / booksPerShelf)
      const positionOnShelf = index % booksPerShelf
      
      // Varying book dimensions (like real books)
      const baseWidth = isMobile ? 60 : 90
      const widthVariation = ((index * 17) % 40) - 10
      const width = baseWidth + widthVariation
      
      const baseHeight = isMobile ? 180 : 260
      const heightVariation = ((index * 23) % 60) - 20
      const height = baseHeight + heightVariation
      
      // Slight tilt for organic feel (some books lean)
      const tiltOptions = [0, 0, 0, -2, -3, 2, 3, -1, 1] // Mostly straight
      const tilt = tiltOptions[index % tiltOptions.length]
      
      // Spine thickness
      const thickness = 8 + (index % 6)
      
      // Spine color
      const spineColor = spineColors[index % spineColors.length]

      return {
        id: image.id,
        image,
        shelfIndex,
        positionOnShelf,
        width,
        height,
        tilt,
        thickness,
        spineColor,
        index,
      }
    })

    setBooks(booksList)
  }, [galleryImages, isMobile])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  if (!isMounted || loading) {
    return (
      <section className="bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-stone-700 text-lg font-serif">
          {loading ? 'Organizing bookshelf...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-stone-700 text-lg font-serif">No images available</div>
      </section>
    )
  }

  // Group books by shelf
  const shelves = books.reduce((acc, book) => {
    if (!acc[book.shelfIndex]) acc[book.shelfIndex] = []
    acc[book.shelfIndex].push(book)
    return acc
  }, {} as Record<number, Book[]>)

  const shelfHeight = isMobile ? 220 : 320
  const shelfSpacing = isMobile ? 30 : 40
  const totalHeight = Object.keys(shelves).length * (shelfHeight + shelfSpacing) + 100

  return (
    <section 
      ref={scrollContainerRef}
      className="relative bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 overflow-y-auto overflow-x-hidden min-h-screen"
    >
      {/* Wood texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #8b4513 2px, #8b4513 4px)',
        }}></div>
      </div>

      {/* Bookshelf container */}
      <div 
        className="relative w-full px-8 py-12"
        style={{ minHeight: `${totalHeight}px` }}
      >
        {Object.entries(shelves).map(([shelfIdx, shelfBooks]) => {
          const shelfIndex = parseInt(shelfIdx)
          const shelfY = shelfIndex * (shelfHeight + shelfSpacing)

          return (
            <div 
              key={shelfIndex}
              className="relative mb-8"
              style={{ height: `${shelfHeight}px` }}
            >
              {/* Shelf board */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-lg"
                style={{
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Wood grain texture */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px)',
                }}></div>
              </div>

              {/* Books on shelf */}
              <div className="absolute bottom-3 left-0 right-0 flex items-end gap-1 px-4">
                {shelfBooks.map((book, bookIdx) => {
                  const isHovered = hoveredBook === book.id
                  const isSelected = selectedBook === book.id

                  return (
                    <motion.div
                      key={book.id}
                      className="relative cursor-pointer group"
                      style={{
                        width: book.width,
                        height: book.height,
                        transformOrigin: 'bottom center',
                      }}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        rotate: isHovered || isSelected ? 0 : book.tilt,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: shelfIndex * 0.1 + bookIdx * 0.03,
                      }}
                      whileHover={{
                        y: -15,
                        scale: 1.05,
                        zIndex: 50,
                      }}
                      onHoverStart={() => setHoveredBook(book.id)}
                      onHoverEnd={() => setHoveredBook(null)}
                      onClick={() => setSelectedBook(isSelected ? null : book.id)}
                    >
                      {/* Book container */}
                      <div className="relative w-full h-full">
                        {/* Book spine (left edge) */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 rounded-l"
                          style={{
                            background: `linear-gradient(to right, ${book.spineColor}, ${book.spineColor}dd)`,
                            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.1)',
                          }}
                        />

                        {/* Book cover (front) */}
                        <div 
                          className="absolute inset-0 bg-white rounded-r overflow-hidden border-l-2 shadow-lg"
                          style={{
                            borderLeftColor: book.spineColor,
                            boxShadow: isHovered || isSelected
                              ? '0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
                              : '0 4px 8px rgba(0,0,0,0.2)',
                          }}
                        >
                          {/* Photo on book cover */}
                          <div className="relative w-full h-full p-2">
                            <div className="relative w-full h-full rounded overflow-hidden">
                              <Image
                                src={getImageUrl(book.image.image_path) || "/placeholder.png"}
                                alt={book.image.alt_text || `Book ${book.index + 1}`}
                                fill
                                sizes="(max-width: 768px) 80px, 120px"
                                className="object-cover"
                                loading="lazy"
                              />
                              
                              {/* Book cover overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
                            </div>
                          </div>

                          {/* Book title on hover */}
                          {isHovered && (
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <p className="text-white text-xs font-medium truncate">
                                {book.image.alt_text || `Image ${book.index + 1}`}
                              </p>
                              <p className="text-white/60 text-xs">
                                {book.index + 1} of {books.length}
                              </p>
                            </motion.div>
                          )}
                        </div>

                        {/* Book pages (right edge) */}
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-stone-200 to-stone-100 rounded-r"
                          style={{
                            boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.1)',
                          }}
                        >
                          {/* Page lines */}
                          {[...Array(8)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute right-0 w-full h-px bg-stone-300/40"
                              style={{ top: `${(i + 1) * 11}%` }}
                            />
                          ))}
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            className="absolute -inset-1 border-2 border-amber-600 rounded pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Shelf label */}
              <div className="absolute top-2 left-4">
                <div className="bg-amber-800/10 px-3 py-1 rounded-full border border-amber-800/20">
                  <p className="text-xs text-amber-900 font-serif">
                    Shelf {shelfIndex + 1}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Library info panel */}
      <div className="fixed top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg z-50 border border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div>
            <h3 className="text-amber-900 text-sm font-serif font-semibold">Photo Library</h3>
            <p className="text-amber-700 text-xs">{books.length} volumes • {Object.keys(shelves).length} shelves</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-amber-200">
          <p className="text-amber-900 text-sm font-serif">
            Hover to pull out • Click to select • Scroll to browse shelves
          </p>
        </div>
      </motion.div>

      {/* Selected book details */}
      {selectedBook && (
        <motion.div 
          className="fixed top-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-4 rounded-xl shadow-lg z-50 border border-amber-200 max-w-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-amber-900 text-sm font-serif font-semibold">Selected Volume</h4>
            <button 
              onClick={() => setSelectedBook(null)}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {(() => {
            const selected = books.find(b => b.id === selectedBook)
            if (!selected) return null
            return (
              <>
                <p className="text-amber-800 text-xs mb-3 font-serif">
                  {selected.image.alt_text || `Volume ${selected.index + 1}`}
                </p>
                <div className="text-xs text-amber-700 space-y-1 font-serif">
                  <p>Shelf: {selected.shelfIndex + 1}</p>
                  <p>Position: {selected.index + 1} of {books.length}</p>
                </div>
              </>
            )
          })()}
        </motion.div>
      )}
    </section>
  )
}
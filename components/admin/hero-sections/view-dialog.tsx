'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ImageIcon } from 'lucide-react'

interface HeroSection {
  id: number
  image_path: string | string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

interface HeroSectionViewDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  heroSection: HeroSection | null
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.png'
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_IMG}/${cleanPath}`
}

export function HeroSectionViewDialog({ open, setOpen, heroSection }: HeroSectionViewDialogProps) {
  if (!heroSection) return null

  const images = Array.isArray(heroSection.image_path) 
    ? heroSection.image_path 
    : [heroSection.image_path]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-semibold">
            Hero Section Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            View hero section information and images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              Images ({images.length})
            </h3>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 aspect-video"
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Hero ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.png'
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Status</h3>
            <Badge
              className={
                heroSection.status === 'active'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }
            >
              {heroSection.status}
            </Badge>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900">Created At</h3>
              <p className="text-sm text-gray-600">
                {new Date(heroSection.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900">Updated At</h3>
              <p className="text-sm text-gray-600">
                {new Date(heroSection.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import React from "react"
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, X } from 'lucide-react'

// Base interface for API data
interface HeroSection {
  id: number
  image_path: string | string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Form data interface (used internally in the form)
interface HeroSectionFormData {
  image_path: string | File | File[]
  status: 'active' | 'inactive'
}

interface HeroSectionFormDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialData?: HeroSection | null
  onSubmit: (data: Partial<HeroSectionFormData>) => Promise<void>
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

export function HeroSectionFormDialog({ open, setOpen, initialData, onSubmit }: HeroSectionFormDialogProps) {
  const [formData, setFormData] = useState<Partial<HeroSectionFormData>>({
    image_path: [],
    status: 'active',
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([]) // Track existing server images
  const [newFiles, setNewFiles] = useState<File[]>([]) // Track new file uploads
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && open) {
      // Convert HeroSection to HeroSectionFormData
      const imagePaths = typeof initialData.image_path === 'string' 
        ? [initialData.image_path] 
        : initialData.image_path || []
      
      // Set existing images from server
      setExistingImages(imagePaths)
      
      // Create previews for existing images
      const existingPreviews = imagePaths.map(path => getImageUrl(path))
      setImagePreviews(existingPreviews)
      
      setFormData({
        image_path: [],
        status: initialData.status,
      })
      setNewFiles([])
    } else if (!initialData) {
      // Reset for new entries
      setFormData({
        image_path: [],
        status: 'active',
      })
      setImagePreviews([])
      setExistingImages([])
      setNewFiles([])
    }
  }, [initialData, open])

  const handleStatusChange = (value: 'active' | 'inactive') => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Add new files to the list
      setNewFiles(prev => [...prev, ...files])
      
      // Update form data with all files
      setFormData((prev) => ({
        ...prev,
        image_path: [...newFiles, ...files],
      }))

      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    // Check if this is an existing image or a new upload
    const isExistingImage = index < existingImages.length
    
    if (isExistingImage) {
      // Remove from existing images
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    } else {
      // Remove from new files
      const newFileIndex = index - existingImages.length
      setNewFiles(prev => prev.filter((_, i) => i !== newFileIndex))
      setFormData(prev => {
        const files = Array.isArray(prev.image_path) ? prev.image_path : []
        return {
          ...prev,
          image_path: files.filter((_, i) => i !== newFileIndex)
        }
      })
    }
    
    // Remove preview
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // For edit mode, only send new files
      // For create mode, send all files
      const dataToSubmit = {
        ...formData,
        image_path: newFiles.length > 0 ? newFiles : formData.image_path
      }
      
      await onSubmit(dataToSubmit)
      setOpen(false)
      setImagePreviews([])
      setExistingImages([])
      setNewFiles([])
      setFormData({
        image_path: [],
        status: 'active',
      })
    } finally {
      setLoading(false)
    }
  }

  const totalImages = imagePreviews.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-semibold">
            {initialData ? 'Edit Hero Images' : 'Add Hero Images'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {initialData ? 'Update the hero images below.' : 'Upload multiple hero images.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-900 font-medium">
              Images * {totalImages > 0 && `(${totalImages} total${existingImages.length > 0 ? `, ${existingImages.length} existing` : ''})`}
            </Label>
            
            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {imagePreviews.map((preview, index) => {
                  const isExisting = index < existingImages.length
                  return (
                    <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img 
                        src={preview || "/placeholder.png"} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.png'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 flex justify-between items-center">
                        <span>Image {index + 1}</span>
                        {isExisting && (
                          <span className="bg-blue-500 px-1.5 py-0.5 rounded text-[10px]">Existing</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Upload Area */}
            <label
              htmlFor="image-input"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gold hover:bg-gold/5 transition bg-white"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {imagePreviews.length > 0 ? 'Add more images' : 'Click to upload images'}
              </span>
              <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</span>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                required={!initialData && imagePreviews.length === 0}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-900 font-medium">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem 
                  value="active" 
                  className="cursor-pointer hover:bg-gray-100 text-gray-900"
                >
                  Active
                </SelectItem>
                <SelectItem 
                  value="inactive" 
                  className="cursor-pointer hover:bg-gray-100 text-gray-900"
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false)
                setImagePreviews([])
                setExistingImages([])
                setNewFiles([])
              }}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (imagePreviews.length === 0 && !initialData)}
              className="bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
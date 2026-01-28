'use client'

import React from "react"
import { useState } from 'react'
import { Plus, Trash2, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import useSWR from 'swr'
import { DataTable } from '@/components/admin/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface NewsImage {
  id: number
  image_path: string
}

interface NewsItem {
  id: number
  title: string
  description: string
  date: string
  images: NewsImage[]
  created_at: string
  updated_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminNewsPage() {
  const { toast } = useToast()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  
  const { data, mutate } = useSWR(`/api/news?page=${pageIndex + 1}&limit=${pageSize}&search=${search}`, fetcher)
  
  const [isCreating, setIsCreating] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  // Define columns for DataTable
  const columns: ColumnDef<NewsItem>[] = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.images
        const getImageUrl = (imagePath: string) => {
          // The image_path from API is like: images/news/filename.jpg
          // Laravel serves files from public directory at root
          return `${process.env.NEXT_PUBLIC_API_IMG}/${imagePath}`
        }
        
        return (
          <div className="w-16 h-16 flex-shrink-0">
            {images && images.length > 0 && images[0] && images[0].image_path ? (
              <img
                src={getImageUrl(images[0].image_path)}
                alt={row.original.title}
                className="w-full h-full object-cover rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  console.error('Image failed to load:', target.src)
                  console.error('Image path from API:', images[0].image_path)
                  console.error('NEXT_PUBLIC_API_IMG:', process.env.NEXT_PUBLIC_API_IMG)
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-semibold text-gray-900 truncate">{row.original.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {new Date(row.original.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "imageCount",
      header: "Images",
      cell: ({ row }) => {
        const imageCount = row.original.images?.length || 0
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{imageCount}</span>
            <div className="flex gap-1">
              {row.original.images?.slice(0, 3).map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              ))}
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedNews(row.original)
              setIsViewOpen(true)
            }}
            className="bg-white"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedNews(row.original)
              setIsDeleteOpen(true)
            }}
            className="bg-white text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedImages(prev => [...prev, ...newFiles])

      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreviews(prev => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim() || uploadedImages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and upload at least one image',
        variant: 'destructive',
      })
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('date', formData.date)

      uploadedImages.forEach(image => {
        formDataToSend.append('images[]', image)
      })

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.message || `Failed to create news (${response.status})`)
      }

      toast({
        title: 'Success',
        description: 'News item created successfully',
      })

      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      })
      setUploadedImages([])
      setImagePreviews([])
      setIsCreating(false)
      mutate()
    } catch (error) {
      console.error('Error creating news:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create news item',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteNews = async () => {
    if (!selectedNews) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete news')
      }

      toast({
        title: 'Success',
        description: 'News item deleted successfully',
      })

      mutate()
      setSelectedNews(null)
      setIsDeleteOpen(false)
      setIsViewOpen(false)
    } catch (error) {
      console.error('Error deleting news:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete news item',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const news = data?.data || []
  const pageCount = Math.ceil((data?.total || 0) / pageSize)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-accent">News Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage news articles with images</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={news}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(newPageIndex, newPageSize) => {
          setPageIndex(newPageIndex)
          setPageSize(newPageSize)
        }}
        searchFields={['title', 'description']}
        searchPlaceholder="Search news articles..."
        search={search}
        onSearchChange={setSearch}
      />

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Create News Article</DialogTitle>
            <DialogDescription className="text-gray-600">
              Add a new news article with multiple images
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNews} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="Article title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description *
              </label>
              <textarea
                placeholder="Article description"
                rows={6}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors bg-white">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="news-image-input"
              />
              <label htmlFor="news-image-input" className="cursor-pointer flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Click to select images</p>
                  <p className="text-sm text-gray-500">or drag and drop (PNG, JPG up to 10MB)</p>
                </div>
              </label>
              {uploadedImages.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {uploadedImages.length} image(s) selected
                </p>
              )}
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-900">Image previews:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] })
                  setUploadedImages([])
                  setImagePreviews([])
                }}
                className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim() || !formData.description.trim() || uploadedImages.length === 0}
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50"
              >
                Create Article
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">{selectedNews?.title}</DialogTitle>
          </DialogHeader>

          {selectedNews && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 font-medium text-sm">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedNews.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-medium text-sm mb-2">Description</p>
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedNews.description}</p>
              </div>

              {selectedNews.images && selectedNews.images.length > 0 && (
                <div>
                  <p className="text-gray-500 font-medium text-sm mb-2">Images ({selectedNews.images.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedNews.images.map(image => {
                      const imageUrl = `${process.env.NEXT_PUBLIC_API_IMG}/${image.image_path}`
                      return (
                        <img
                          key={image.id}
                          src={imageUrl}
                          alt="News"
                          className="w-full h-24 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            console.error('Image failed to load:', target.src)
                            console.error('Image path from API:', image.image_path)
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                  <p className="text-gray-500 font-medium">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedNews.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Updated</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedNews.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
                  className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setIsDeleteOpen(true)}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete News Article</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{selectedNews?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNews}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
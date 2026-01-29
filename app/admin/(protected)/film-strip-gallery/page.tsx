'use client'
import { useEffect, useState, useCallback } from 'react'
import React from "react"

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Trash2, Eye, Upload, ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/admin/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

export default function FilmStripGalleryPage() {
  const [data, setData] = useState<FilmStripImage[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FilmStripImage | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())

      const response = await fetch(`/api/film-strip?${query.toString()}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const filmStripImages = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
      setData(filmStripImages)
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to fetch images',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // Clean up preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    // Revoke the removed URL
    URL.revokeObjectURL(previewUrls[index])
    
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append('images[]', file)
      })

      const response = await fetch('/api/film-strip', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || 'Upload failed')
      }

      toast.success('Success', {
        description: `${selectedFiles.length} image(s) uploaded successfully`,
        position: 'top-right',
      })
      
      // Clean up
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setSelectedFiles([])
      setPreviewUrls([])
      setIsAddOpen(false)
      await fetchImages()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to upload images',
        position: 'top-right',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      const response = await fetch(`/api/film-strip/${selectedItem.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || 'Delete failed')
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)

      toast.success('Success', {
        description: 'Image deleted successfully.',
        position: 'top-right',
      })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to delete image.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<FilmStripImage>[] = [
    {
      accessorKey: 'image_path',
      header: 'Image',
      cell: ({ row }) => {
        const imagePath = row.getValue('image_path') as string

        return imagePath ? (
          <div className="relative w-20 h-20 rounded overflow-hidden">
            <img
              src={getImageUrl(imagePath) || "/placeholder.png"}
              alt="Film strip"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.png'
              }}
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-gray-400" />
          </div>
        )
      },
    },
    {
      accessorKey: 'sort_order',
      header: 'Order',
      cell: ({ row }) => (
        <span className="font-medium">#{row.getValue('sort_order')}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.getValue('created_at') as string).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsViewOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsDeleteOpen(true)
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Film Strip Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage your film strip images.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      <div className="flex w-full flex-col gap-6">
        <DataTable
          columns={columns}
          data={data}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={(pi, ps) => {
            setPageIndex(pi)
            setPageSize(ps)
          }}
          searchFields={[]}
          searchPlaceholder=""
          search=""
          onSearchChange={() => {}}
          onSortingChange={() => {}}
        />
      </div>

      {/* Upload Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Upload Images</DialogTitle>
            <DialogDescription className="text-gray-600">
              Select one or more images to upload to the film strip gallery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors bg-white">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Click to select images</p>
                  <p className="text-sm text-gray-500">or drag and drop (PNG, JPG up to 10MB each)</p>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-900">{previewUrls.length} image(s) selected:</p>
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 truncate">
                        {selectedFiles[index]?.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false)
                  previewUrls.forEach(url => URL.revokeObjectURL(url))
                  setSelectedFiles([])
                  setPreviewUrls([])
                }}
                disabled={uploading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                className="bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Image Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <img
                src={getImageUrl(selectedItem.image_path) || "/placeholder.png"}
                alt="Film strip image"
                className="w-full rounded-lg border border-gray-200"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Sort Order</p>
                  <p className="font-semibold text-gray-900">#{selectedItem.sort_order}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Created</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">Path</p>
                  <p className="font-mono text-xs text-gray-700 break-all bg-gray-50 p-2 rounded">{selectedItem.image_path}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Image</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={loading}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
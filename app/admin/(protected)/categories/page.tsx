'use client'
import { useEffect, useState, useCallback } from 'react'
import React from 'react'

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

interface CategoryImage {
  id: number
  category_id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  description?: string
  images: CategoryImage[]
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Category | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Form state
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())

      const response = await fetch(`/api/categories?${query.toString()}`, {
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
      const categories = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
      setData(categories)
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      console.error('[v0] Fetch error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to fetch categories',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
    if (!categoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('name', categoryName)
      if (categoryDescription.trim()) {
        formData.append('description', categoryDescription)
      }
      selectedFiles.forEach((file) => {
        formData.append('images[]', file)
      })

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || 'Upload failed')
      }

      toast.success('Success', {
        description: `Category "${categoryName}" created with ${selectedFiles.length} image(s)`,
        position: 'top-right',
      })

      // Clean up
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setSelectedFiles([])
      setPreviewUrls([])
      setCategoryName('')
      setCategoryDescription('')
      setIsAddOpen(false)
      await fetchCategories()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to create category',
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

      const response = await fetch(`/api/categories/${selectedItem.id}`, {
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
        description: 'Category deleted successfully.',
        position: 'top-right',
      })
    } catch (err) {
      console.error('[v0] Delete error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to delete category.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Category Name',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'images',
      header: 'Images',
      cell: ({ row }) => {
        const images = row.getValue('images') as CategoryImage[]
        return (
          <span className="text-sm text-muted-foreground">
            {images?.length || 0} image{(images?.length || 0) !== 1 ? 's' : ''}
          </span>
        )
      },
      enableSorting: false,
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
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio categories.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
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

      {/* Create Category Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Create Category</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new category and upload images to it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Weddings, Portraits, Events"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Category Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Optional description for this category"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900"
              />
            </div>

            {/* Image Upload */}
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
                        src={url || "/placeholder.svg"}
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
                  setCategoryName('')
                  setCategoryDescription('')
                }}
                disabled={uploading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || !categoryName.trim() || uploading}
                className="bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50"
              >
                {uploading ? 'Creating...' : `Create Category${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Category Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 font-medium text-sm">Name</p>
                <p className="font-semibold text-gray-900">{selectedItem.name}</p>
              </div>
              
              {selectedItem.description && (
                <div>
                  <p className="text-gray-500 font-medium text-sm">Description</p>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
              )}

              <div>
                <p className="text-gray-500 font-medium text-sm mb-2">Images ({selectedItem.images?.length || 0})</p>
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedItem.images.map((image) => (
                      <div key={image.id} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={getImageUrl(image.image_path) || "/placeholder.svg"}
                          alt={image.alt_text || 'Category image'}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg'
                          }}
                        />
                        <div className="p-2 text-xs text-gray-500">Order: #{image.sort_order}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No images uploaded</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Updated</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.updated_at).toLocaleDateString()}
                  </p>
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
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Category</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone and will delete all associated images.
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

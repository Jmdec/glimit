'use client'
import { useEffect, useState, useCallback } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/admin/data-table'
import { HeroSectionViewDialog } from '@/components/admin/hero-sections/view-dialog'
import { HeroSectionFormDialog } from '@/components/admin/hero-sections/form-dialog'
import { HeroSectionDeleteDialog } from '@/components/admin/hero-sections/delete-dialog'
import { SortingState } from '@tanstack/react-table'

interface HeroSection {
  id: number
  image_path: string | string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface HeroSectionFormData {
  image_path: string | File | File[]
  status: 'active' | 'inactive'
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

const AdminHeroSections = () => {
  const [data, setData] = useState<HeroSection[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HeroSection | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [totalPages, setTotalPages] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  // Helper function to get full image URL
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())
      if (search) query.append('search', search)
      if (statusFilter) query.append('status', statusFilter)
      query.append('sortBy', sortBy)
      query.append('sortOrder', sortOrder)

      console.log('Fetching from:', `/api/hero-sections?${query.toString()}`)

      const res = await fetch(`/api/hero-sections?${query.toString()}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      console.log('Response status:', res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }

      const json = await res.json()
      console.log('Response data:', json)
      
      const heroSections = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
      setData(heroSections)
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Error', { 
        description: err instanceof Error ? err.message : 'Failed to fetch hero sections',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, search, statusFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!sorting.length) return
    setSortBy(sorting[0].id)
    setSortOrder(sorting[0].desc ? 'desc' : 'asc')
  }, [sorting])

  const handleAdd = async (newFormData: Partial<HeroSectionFormData>) => {
    try {
      setLoading(true)

      const formDataToSend = new FormData()
      formDataToSend.append('status', newFormData.status || 'active')

      const images = Array.isArray(newFormData.image_path)
        ? newFormData.image_path
        : newFormData.image_path
          ? [newFormData.image_path]
          : []

      images.forEach((image) => {
        if ((image as any) instanceof File) {
          formDataToSend.append('images[]', image as File)
        }
      })

      console.log('Creating hero section with', images.length, 'images')

      const res = await fetch('/api/hero-sections', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      })

      console.log('Create response status:', res.status)

      const dataJson = await res.json()

      if (!res.ok) {
        toast.error('Error', { 
          description: dataJson.message || 'Hero section could not be saved',
          position: 'top-right'
        })
        return
      }

      setIsAddOpen(false)
      await fetchData()

      toast.success('Success', {
        description: `${images.length} hero image(s) added successfully.`,
        position: 'top-right',
      })
    } catch (err) {
      console.error('Add error:', err)
      toast.error('Error', { 
        description: 'Failed to add hero section.',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (updatedData: Partial<HeroSectionFormData>) => {
    if (!selectedItem) return
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('status', updatedData.status || 'active')

      const images = Array.isArray(updatedData.image_path)
        ? updatedData.image_path
        : updatedData.image_path
          ? [updatedData.image_path]
          : []

      images.forEach((image) => {
        if ((image as any) instanceof File) {
          formDataToSend.append('images[]', image as File)
        }
      })

      console.log('Updating hero section:', selectedItem.id)

      const res = await fetch(`/api/hero-sections/${selectedItem.id}`, {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include',
      })

      console.log('Update response status:', res.status)

      let responseData: any
      try {
        responseData = await res.json()
      } catch {
        console.error('Failed to parse JSON response')
        toast.error('Error', { 
          description: 'Server returned invalid data',
          position: 'top-right'
        })
        return
      }

      if (!res.ok) {
        toast.error('Error', { 
          description: responseData.message || 'Failed to update hero section',
          position: 'top-right'
        })
        return
      }

      toast.success('Success', { 
        description: 'Hero section updated successfully',
        position: 'top-right'
      })
      setIsEditOpen(false)
      setSelectedItem(null)
      await fetchData()
    } catch (error) {
      console.error('Error updating hero section:', error)
      toast.error('Something went wrong', { position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      console.log('Deleting hero section:', selectedItem.id)

      const res = await fetch(`/api/hero-sections/${selectedItem.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      console.log('Delete response status:', res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        toast.error('Error', { 
          description: errorData.message || 'Something went wrong',
          position: 'top-right'
        })
        return
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)

      toast.success('Success', { 
        description: 'Hero section deleted successfully.',
        position: 'top-right'
      })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Error', { 
        description: 'Failed to delete hero section.',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (item: HeroSection) => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const columns: ColumnDef<HeroSection>[] = [
    {
      accessorKey: 'image_path',
      header: 'Image',
      cell: ({ row }) => {
        const imagePath = row.getValue('image_path') as string | string[]
        const firstImage = Array.isArray(imagePath) ? imagePath[0] : imagePath
        const imageCount = Array.isArray(imagePath) ? imagePath.length : 1

        return firstImage ? (
          <div className="relative w-20 h-20 rounded overflow-hidden">
            <img 
              src={getImageUrl(firstImage)} 
              alt="Hero" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.svg'
              }}
            />
            {imageCount > 1 && (
              <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-tl">
                +{imageCount - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-gray-400" />
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === 'active'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }
        >
          {row.original.status}
        </Badge>
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
            <DropdownMenuItem onClick={() => openEdit(row.original)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
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
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Hero Images</h1>
          <p className="text-muted-foreground mt-1">Manage your website hero images.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hero Image
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
          search={search}
          onSearchChange={setSearch}
          onSortingChange={setSorting}
        />
      </div>

      <HeroSectionViewDialog open={isViewOpen} setOpen={setIsViewOpen} heroSection={selectedItem} />
      <HeroSectionFormDialog open={isAddOpen} setOpen={setIsAddOpen} onSubmit={handleAdd} />
      <HeroSectionFormDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        initialData={selectedItem}
        onSubmit={handleEdit}
      />
      <HeroSectionDeleteDialog open={isDeleteOpen} setOpen={setIsDeleteOpen} onDelete={handleDelete} />
    </div>
  )
}

export default AdminHeroSections
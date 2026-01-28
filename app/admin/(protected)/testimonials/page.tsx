"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DataTable } from "@/components/admin/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Pencil, Plus, Star, Trash2 } from "lucide-react"

import { TestimonialFormDialog } from "@/components/admin/testimonials/admin-add-edit-testimonial"
import { TestimonialViewDialog } from "@/components/admin/testimonials/admin-view-testimonial"
import { TestimonialDeleteDialog } from "@/components/admin/testimonials/admin-delete-testimonial"
import { Testimonial } from "@/lib/types/types"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null)

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  // dialogs
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // pagination
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sorting, setSorting] = useState<Testimonial[]>([])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        perPage: pageSize.toString(),
        search,
        sortBy,
        sortOrder,
      })
      const res = await fetch(`/api/admin/testimonials?${params.toString()}`)
      const json = await res.json()

      setTestimonials(Array.isArray(json.data) ? json.data : [])
      setPageCount(json?.last_page ?? json?.data?.last_page ?? 1)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch testimonials")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [pageIndex, search, sortBy, sortOrder, sorting])

  const handleAdd = async (data: Testimonial) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        toast.error("Failed to add testimonial")
        return
      }

      toast.success("Testimonial added")
      setIsAddOpen(false)
      fetchTestimonials()
    } catch (err) {
      console.error(err)
      toast.error("Error adding testimonial")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: Testimonial) => {
    if (!selectedItem) return

    try {
      setLoading(true)
      const res = await fetch(`/api/admin/testimonials/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        toast.error("Failed to update testimonial")
        return
      }

      toast.success("Testimonial updated")
      setIsEditOpen(false)
      setSelectedItem(null)
      fetchTestimonials()
    } catch (err) {
      console.error(err)
      toast.error("Error updating testimonial")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)
      const res = await fetch(`/api/admin/testimonials/${selectedItem.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        toast.error("Failed to delete testimonial")
        return
      }

      toast.success("Testimonial deleted")
      setIsDeleteOpen(false)
      setSelectedItem(null)
      fetchTestimonials()
    } catch (err) {
      console.error(err)
      toast.error("Error deleting testimonial")
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }: any) => {
        const rating = row.getValue("rating") || 0
        return (
          <div className="flex space-x-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} fill="#facc15" className="w-4 h-4 text-yellow-400" />
            ))}
          </div>
        )
      },
    },
    { accessorKey: "approved", header: "Approved" },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }: any) => (
        <span className="block w-[300px] truncate" title={row.getValue("message")}>
          {row.getValue("message")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
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
                setIsEditOpen(true)
              }}
            >
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
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-accent text-2xl sm:text-3xl font-serif font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage customer testimonials.</p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="bg-gold hover:bg-gold/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        search={search}
        onSearchChange={setSearch}
        searchFields={["name", "title", "message"]}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onSortingChange={(newSorting: any) => {
          setSorting(newSorting)

          if (newSorting.length > 0) {
            setSortBy(newSorting[0].id) // column accessorKey
            setSortOrder(newSorting[0].desc ? "desc" : "asc")
          } else {
            setSortBy("")
            setSortOrder("asc")
          }

          fetchTestimonials()
        }}
      />

      <TestimonialViewDialog open={isViewOpen} setOpen={setIsViewOpen} testimonial={selectedItem} />

      <TestimonialFormDialog open={isAddOpen} setOpen={setIsAddOpen} onSubmit={handleAdd} loading={loading} />

      <TestimonialFormDialog open={isEditOpen} setOpen={setIsEditOpen} initialData={selectedItem} onSubmit={handleEdit} loading={loading} />

      <TestimonialDeleteDialog open={isDeleteOpen} setOpen={setIsDeleteOpen} onDelete={handleDelete} />
    </div>
  )
}

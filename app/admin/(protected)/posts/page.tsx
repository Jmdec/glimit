"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DataTable } from "@/components/admin/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { PostViewDialog } from "@/components/admin/posts/admin-view-post"
import { PostFormDialog } from "@/components/admin/posts/admin-add-edit-post"
import { PostDeleteDialog } from "@/components/admin/posts/admin-delete-post"
import { Post } from "@/lib/types/types"
import { formatMonthDayYear } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedItem, setSelectedItem] = useState<Post | null>(null)

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  // dialog state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  // pagination state
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sorting, setSorting] = useState<SortingState>([])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        perPage: pageSize.toString(),
        search,
        sortBy: sortBy || "date",
        sortOrder,
      })
      const res = await fetch(`/api/admin/posts?${params.toString()}`)
      const json = await res.json()
      setPosts(Array.isArray(json.data) ? json.data : [])
      setPageCount(json.last_page ?? 1)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [pageIndex, pageSize, search, sortBy, sortOrder])

  const handleAdd = async (formData: Post) => {
    try {
      setLoading(true)
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            formDataObj.append("image", value)
          }
        } else if (key === "visible") {
          formDataObj.append("visible", formData.visible ? "1" : "0")
        } else if (key === "featured") {
          formDataObj.append("featured", formData.featured ? "1" : "0")
        } else if (value !== null && value !== undefined && value !== "") {
          formDataObj.append(key, value as any)
        }
      })

      const res = await fetch(`/api/admin/posts`, {
        method: "POST",
        body: formDataObj,
      })
      if (!res.ok) {
        toast.error("Failed to add post")
        return
      }
      toast.success("Success", { description: "Post added successfully" })
      setIsAddOpen(false)
      fetchPosts()
    } catch (err) {
      console.error(err)
      toast.error("Error adding post")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (formData: Post) => {
    if (!selectedItem) return

    try {
      setLoading(true)

      const formDataObj = new FormData()

      formDataObj.append("title", formData.title)
      formDataObj.append("excerpt", formData.excerpt)
      formDataObj.append("content", formData.content)
      formDataObj.append("date", formData.date)
      formDataObj.append("author", formData.author)
      formDataObj.append("label", formData.label)
      formDataObj.append("category", formData.category)
      formDataObj.append("visible", formData.visible ? "1" : "0")
      formDataObj.append("featured", formData.featured ? "1" : "0")

      if (formData.image instanceof File) {
        formDataObj.append("image", formData.image)
      }

      const res = await fetch(`/api/admin/posts/${selectedItem.id}`, {
        method: "POST",
        body: formDataObj,
      })

      const json = await res.json()
      if (!res.ok) {
        console.error(json)
        toast.error("Failed to update post")
        return
      }

      toast.success("Success", { description: "Post updated successfully" })
      setIsEditOpen(false)
      setSelectedItem(null)
      fetchPosts()
    } catch (err) {
      console.error(err)
      toast.error("Error updating post")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/posts/${selectedItem.id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.message || "Failed to delete post")
        return
      }
      toast.success("Post deleted successfully")
      setIsDeleteOpen(false)
      setSelectedItem(null)
      fetchPosts()
    } catch (err) {
      console.error(err)
      toast.error("Error deleting post")
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "excerpt",
      header: "Excerpt",
      cell: ({ row }: any) => (
        <span className="block w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis" title={row.getValue("excerpt")}>
          {row.getValue("excerpt")}
        </span>
      ),
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }: any) => (
        <span className="block w-[250px] truncate whitespace-nowrap overflow-hidden text-ellipsis" title={row.getValue("content")}>
          {row.getValue("content")}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => {
        const value = row.getValue("date") as string
        return value ? formatMonthDayYear(value) : ""
      },
    },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "label", header: "Label" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "visible", header: "Visible" },
    { accessorKey: "featured", header: "Featured" },
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
                setIsEditOpen(row.original)
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
          <h1 className="text-accent text-2xl sm:text-3xl font-serif font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">Manage blog posts.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      <DataTable
        columns={columns}
        search={search}
        onSearchChange={setSearch}
        searchFields={["author", "category", "content"]}
        data={posts}
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

          fetchPosts()
        }}
      />

      <PostViewDialog open={isViewOpen} setOpen={setIsViewOpen} post={selectedItem} />
      <PostFormDialog open={isAddOpen} setOpen={setIsAddOpen} onSubmit={handleAdd} />
      <PostFormDialog open={isEditOpen} setOpen={setIsEditOpen} initialData={selectedItem} onSubmit={handleEdit} />
      <PostDeleteDialog open={isDeleteOpen} setOpen={setIsDeleteOpen} onDelete={handleDelete} />
    </div>
  )
}

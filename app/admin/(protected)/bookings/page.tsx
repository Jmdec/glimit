"use client"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, ListIcon, CalendarIcon, Mail } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/admin/data-table"
import { BookingViewDialog } from "@/components/admin/bookings/admin-view-booking"
import { BookingFormDialog } from "@/components/admin/bookings/admin-booking-form"
import { BookingDeleteDialog } from "@/components/admin/bookings/admin-delete-booking"
import { BookingEmailDialog } from "@/components/booking/booking-email-dialog"
import { CalendarBookings } from "@/components/admin/bookings/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Booking } from "@/lib/types/types"
import { formatDisplayTime, formatMonthDayYear } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

const AdminBookings = () => {
  const [data, setData] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [approvedFilter, setApprovedFilter] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [totalPages, setTotalPages] = useState(1)
  const [globalFields, setGlobalFields] = useState<(keyof Booking)[]>(["firstName", "lastName", "email"])
  const [sorting, setSorting] = useState<SortingState>([])

  const [formData, setFormData] = useState<Partial<Booking>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "Wedding Photography",
    date: "",
    time: "",
    guests: "1",
    status: "pending",
    message: "",
    approved: false,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append("page", (pageIndex + 1).toString())
      query.append("perPage", pageSize.toString())
      if (search) query.append("search", search)
      if (statusFilter) query.append("status", statusFilter)
      if (approvedFilter) query.append("approved", approvedFilter)
      query.append("sortBy", sortBy)
      query.append("sortOrder", sortOrder)

      const res = await fetch(`/api/admin/bookings?${query.toString()}`)
      const json = await res.json()
      const bookings = Array.isArray(json.data) ? json.data : json
      setData(bookings)
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAll = async () => {
    const res = await fetch("/api/admin/bookings?all=true")
    const data = await res.json()
    setAllBookings(data.bookings)
  }

  useEffect(() => {
    fetchData()
    fetchAll()
  }, [page, pageIndex, pageSize, search, sorting, statusFilter, approvedFilter, sortBy, sortOrder])

  useEffect(() => {
    if (!sorting.length) return

    setSortBy(sorting[0].id)
    setSortOrder(sorting[0].desc ? "desc" : "asc")
  }, [sorting])

  const handleAdd = async (formData: Booking) => {
    try {
      setLoading(true)

      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const dataJson = await res.json()

      if (!res.ok) {
        toast.error("Error", { description: "Booking could not be saved" })
        return
      }

      setData([dataJson.booking, ...data])
      setIsAddOpen(false)
      await fetchData()
      // reset form state
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        serviceType: "Wedding Photography",
        date: "",
        time: "",
        guests: "1",
        status: "pending",
        message: "",
      })

      toast.success("Success", { description: "Booking added successfully.", position: "top-right" })
    } catch (err) {
      console.error(err)
      toast.error("Error", { description: "Failed to add booking.", position: "top-right" })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (updatedBooking: Booking) => {
    if (!selectedItem) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      })

      // Try parsing JSON, fallback to text if invalid
      let data: any
      try {
        data = await res.json()
      } catch {
        const text = await res.text()
        console.error("Failed to parse JSON, raw response:", text)
        toast.error("Error", { description: "Server returned invalid data" })
        return
      }

      if (!res.ok) {
        toast.error("Error", { description: "Failed to update booking" })
        return
      }

      // Update local state optimistically
      setData((prev) => prev.map((item) => (item.id === selectedItem.id ? data.booking : item)))

      toast.success("Success", { description: "Booking updated successfully" })
      setIsEditOpen(false)
      setSelectedItem(null)
      await fetchData()

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        serviceType: "Wedding Photography",
        date: "",
        time: "",
        guests: "1",
        status: "pending",
        message: "",
      })
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Something went wrong", { position: "top-right" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      const res = await fetch(`/api/admin/bookings/${selectedItem.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        toast.error("Error", { description: "Something went wrong", position: "top-right" })
        return
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)

      toast.success("Success", { description: "Booking deleted successfully.", position: "top-right" })
    } catch (err) {
      console.error(err)
      toast.error("Error", { description: "Failed to delete booking.", position: "top-right" })
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (item: Booking) => {
    setSelectedItem(item)
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      serviceType: item.serviceType,
      date: item.date,
      time: item.time,
      guests: item.guests,
      status: item.status,
      message: item.message,
    })
    setIsEditOpen(true)
  }

  const openEmailDialog = (item: Booking) => {
    setSelectedItem(item)
    setIsEmailOpen(true)
  }

  const columns: ColumnDef<Booking>[] = [
    { accessorKey: "firstName", header: "First Name", enableSorting: true },
    { accessorKey: "lastName", header: "Last Name", enableSorting: true },
    { accessorKey: "email", header: "Email", enableSorting: true },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "serviceType", header: "Service", enableSorting: true },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const value = row.getValue("date") as string
        return value ? formatMonthDayYear(value) : ""
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const value = row.getValue("time") as string
        return value ? formatDisplayTime(value) : ""
      },
    },
    { accessorKey: "guests", header: "Guest" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "confirmed"
              ? "bg-green-100 text-green-800 border border-green-200"
              : row.original.status === "completed"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : row.original.status === "cancelled"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
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
            <DropdownMenuItem onClick={() => openEmailDialog(row.original)}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage client bookings and appointments.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListIcon className="w-4 h-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="mt-3">
            <DataTable
              columns={columns}
              data={data}
              pageCount={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={(pi, ps) => {
                setPageIndex(pi)
                setPageSize(ps)
                fetchData()
              }}
              searchFields={globalFields}
              searchPlaceholder="Search by client name..."
              search={search}
              onSearchChange={setSearch}
              onSortingChange={setSorting}
            />
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar">
            <CalendarBookings bookings={allBookings} search={search} onRefetch={fetchAll} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <BookingViewDialog open={isViewOpen} setOpen={setIsViewOpen} booking={selectedItem} />
      <BookingFormDialog open={isAddOpen} setOpen={setIsAddOpen} onSubmit={handleAdd} />
      <BookingFormDialog open={isEditOpen} setOpen={setIsEditOpen} initialData={selectedItem!} onSubmit={handleEdit} />
      <BookingDeleteDialog open={isDeleteOpen} setOpen={setIsDeleteOpen} onDelete={handleDelete} />
      <BookingEmailDialog open={isEmailOpen} setOpen={setIsEmailOpen} booking={selectedItem} onEmailSent={fetchData} />
    </div>
  )
}

export default AdminBookings
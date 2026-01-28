"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Category, Post } from "@/lib/types/types"

interface PostFormDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialData?: Post | null
  onSubmit: (formData: Post) => Promise<void>
  loading?: boolean
}

export function PostFormDialog({ open, setOpen, initialData, onSubmit, loading = false }: PostFormDialogProps) {
  const categories: Category[] = ["all", "wedding", "portrait", "event", "product", "studio"]
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Post>>(
    initialData || {
      title: "",
      excerpt: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
      label: "",
      category: "all",
      image: null,
      visible: false,
      featured: false,
    },
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      if (initialData.image && typeof initialData.image === "string") {
        setPreviewUrl(initialData.image)
      }
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        author: "",
        label: "",
        category: "all",
        image: null,
        visible: false,
        featured: false,
      })
      setPreviewUrl(null)
    }
  }, [initialData])

  useEffect(() => {
    if (!formData.image) {
      setPreviewUrl(null)
      return
    }

    if (typeof formData.image === "string") {
      setPreviewUrl(formData.image)
    } else if (formData.image instanceof File) {
      const objectUrl = URL.createObjectURL(formData.image)
      setPreviewUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [formData.image])

  const handleSubmit = async () => {
    await onSubmit(formData as Post)

    if (!initialData) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        author: "",
        label: "",
        category: "all",
        image: null,
        visible: false,
        featured: false,
      })
      setPreviewUrl(null)
    }
  }

  const getImageSrc = (image: unknown): string | undefined => {
    if (!image || typeof image !== "string") return undefined

    const baseImgUrl = process.env.NEXT_PUBLIC_API_IMG || ""

    if (image.startsWith("http") || image.startsWith(baseImgUrl)) {
      return image
    }

    return `${baseImgUrl}${image}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl text-black max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-accent">{initialData ? "Edit Post" : "Add Post"}</DialogTitle>
          <DialogDescription>{initialData ? "Update post information." : "Create a new post entry."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-black">Title</Label>
              <Input className="text-black" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <Label className="text-black">Author</Label>
              <Input className="text-black" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </div>
            <div>
              <Label className="text-black">Label</Label>
              <Input className="text-black" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
            </div>
            <div>
              <Label className="text-black">Category</Label>
              <select
                className="w-full h-10 px-3 text-black border border-border rounded-md bg-background"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-black">Date</Label>
              <Input className="text-black" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2 items-center">
              <Label className="text-black mt-2">Visible</Label>
              <input
                type="checkbox"
                className="accent-amber-400"
                checked={formData.visible ?? true}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-black mt-2">Featured</Label>
              <input
                type="checkbox"
                className="accent-amber-400"
                checked={formData.featured ?? true}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
            </div>
          </div>

          <div>
            <Label className="text-black">Image</Label>
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp"
              className="text-black"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData({ ...formData, image: file })
                }
              }}
            />
            {formData.image && <img src={getImageSrc(formData.image)} alt="Selected image" className="mt-2 w-full max-h-64 object-cover rounded" />}
          </div>

          <div>
            <Label className="text-black">Excerpt</Label>
            <Textarea
              className="w-full resize-y overflow-hidden break-all"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-black">Content</Label>
            <Textarea
              className="w-full resize-y overflow-hidden break-all"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="outline" className="text-black w-full sm:w-auto" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
            {loading ? "Saving..." : initialData ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

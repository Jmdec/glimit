import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Testimonial } from "@/lib/types/types"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  initialData?: Testimonial | null
  onSubmit: (formData: Testimonial) => Promise<void>
  loading?: boolean
}

const emptyForm: Testimonial = {
  name: "",
  title: "",
  rating: 5,
  message: "",
  approved: false,
}

export function TestimonialFormDialog({ open, setOpen, initialData, onSubmit, loading = false }: Props) {
  const [formData, setFormData] = useState<Testimonial>(emptyForm)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(emptyForm)
    }
  }, [initialData, open])

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl w-full text-black max-h-[90vh] overflow-y-auto scrollbar-hide break-words whitespace-normal">
        <DialogHeader>
          <DialogTitle className="text-accent">{initialData ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          <DialogDescription>{initialData ? "Update testimonial information." : "Create a new testimonial."}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Approved */}
          <div className="flex gap-2 items-center flex-wrap">
            <Label className="text-black mt-2">Approved</Label>
            <input
              type="checkbox"
              className="accent-amber-400"
              checked={formData.approved ?? true}
              onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
            />
          </div>

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              className="w-full break-words whitespace-normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              className="w-full break-words whitespace-normal"
              value={formData.title ?? ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Rating */}
          <div>
            <Label>Rating</Label>
            <select
              className="w-full h-10 px-3 border border-border rounded-md bg-background"
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: Number(e.target.value),
                })
              }
              disabled={loading}
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <Label>Message</Label>
            <Textarea
              className="w-full resize-y overflow-hidden break-all"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={loading}
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

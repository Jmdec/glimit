import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Testimonial } from "@/lib/types/types"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  testimonial: Testimonial | null
}

export function TestimonialViewDialog({ open, setOpen, testimonial }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg text-black max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-accent">Testimonial</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong> {testimonial?.name}
          </p>
          {testimonial?.title && (
            <p>
              <strong>Title:</strong> {testimonial?.title}
            </p>
          )}
          <p>
            <strong>Rating:</strong> {"⭐".repeat(testimonial?.rating!)}
          </p>
          <p className="whitespace-pre-wrap">{testimonial?.message}</p>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

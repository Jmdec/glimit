import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PostDeleteDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onDelete: () => Promise<void>
  loading?: boolean
}

export const TestimonialDeleteDialog: React.FC<PostDeleteDialogProps> = ({ open, setOpen, onDelete, loading = false }) => {
  const handleDelete = async () => {
    try {
      await onDelete()
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md text-black max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Delete Testimonial</DialogTitle>
          <DialogDescription>Are you sure you want to delete this testimonial? This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

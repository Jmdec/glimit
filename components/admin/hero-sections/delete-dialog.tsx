'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface HeroSectionDeleteDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onDelete: () => Promise<void>
}

export function HeroSectionDeleteDialog({ open, setOpen, onDelete }: HeroSectionDeleteDialogProps) {
  const handleDelete = async () => {
    await onDelete()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Hero Section</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this hero section? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

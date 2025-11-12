'use client'

import { ClientFormDialog } from './client-form-dialog'

interface NewClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainerId: string
}

export function NewClientDialog({
  open,
  onOpenChange,
  trainerId,
}: NewClientDialogProps) {
  return (
    <ClientFormDialog
      open={open}
      onOpenChange={onOpenChange}
      trainerId={trainerId}
      mode="create"
    />
  )
}

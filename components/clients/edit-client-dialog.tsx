'use client'

import { Client } from '@/lib/db/schema'
import { ClientFormDialog } from './client-form-dialog'

interface EditClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  trainerId: string
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  trainerId,
}: EditClientDialogProps) {
  return (
    <ClientFormDialog
      open={open}
      onOpenChange={onOpenChange}
      trainerId={trainerId}
      mode="edit"
      client={client}
    />
  )
}

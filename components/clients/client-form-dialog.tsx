'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Client } from '@/lib/db/schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createClientAction, updateClientAction } from '@/app/actions/clients'
import { CLIENT_STATUS_OPTIONS, DEFAULT_CLIENT_STATUS } from '@/lib/constants/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['active', 'paused', 'inactive']),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainerId: string
  mode: 'create' | 'edit'
  client?: Client
}

export function ClientFormDialog({
  open,
  onOpenChange,
  trainerId,
  mode,
  client,
}: ClientFormDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: FormValues = {
    fullName: client?.fullName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    status: client?.status || DEFAULT_CLIENT_STATUS,
    notes: client?.notes || '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Reset form when client changes (edit mode)
  useEffect(() => {
    if (mode === 'edit' && client) {
      form.reset({
        fullName: client.fullName,
        email: client.email || '',
        phone: client.phone || '',
        status: client.status,
        notes: client.notes || '',
      })
    }
  }, [client, form, mode])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email || '')
    formData.append('phone', data.phone || '')
    formData.append('status', data.status)
    formData.append('notes', data.notes || '')

    const result =
      mode === 'create'
        ? await createClientAction(trainerId, formData)
        : await updateClientAction(client!.id, trainerId, formData)

    if (result.success) {
      toast.success(
        mode === 'create'
          ? 'Cliente creado correctamente'
          : 'Cliente actualizado correctamente'
      )
      if (mode === 'create') {
        form.reset()
      }
      onOpenChange(false)
      router.refresh()
    } else {
      toast.error(
        result.error ||
          (mode === 'create'
            ? 'Error al crear el cliente'
            : 'Error al actualizar el cliente')
      )
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Agrega un nuevo cliente a tu lista'
              : 'Actualiza la información del cliente'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLIENT_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre el cliente..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

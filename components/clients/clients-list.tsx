'use client'

import { useState } from 'react'
import { ClientWithMeta, ClientStatus, ClientsViewMode } from '@/types/client'
import { ClientsToolbar } from './clients-toolbar'
import { ClientsTable } from './clients-table'
import { ClientsGrid } from './clients-grid'
import { NewClientDialog } from './new-client-dialog'
import { deleteClientAction } from '@/app/actions/clients'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ClientsListProps {
  initialClients: ClientWithMeta[]
  trainerId: string
}

export function ClientsList({ initialClients, trainerId }: ClientsListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ClientStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<ClientsViewMode>('table')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)

  // Filter clients based on search and status
  const filteredClients = initialClients.filter((client) => {
    const matchesSearch =
      search === '' ||
      client.fullName.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = status === 'all' || client.status === status

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (clientId: string) => {
    if (isDeleting) return

    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteClientAction(clientId, trainerId)

    if (result.success) {
      toast.success('Cliente eliminado correctamente')
      router.refresh()
    } else {
      toast.error(result.error || 'Error al eliminar el cliente')
    }

    setIsDeleting(false)
  }

  const handleNewClient = () => {
    setIsNewClientDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        <ClientsToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewClient={handleNewClient}
        />

        {viewMode === 'table' ? (
          <ClientsTable clients={filteredClients} onDelete={handleDelete} />
        ) : (
          <ClientsGrid clients={filteredClients} onDelete={handleDelete} />
        )}

        <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredClients.length} de {initialClients.length} clientes
        </div>
      </div>

      <NewClientDialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        trainerId={trainerId}
      />
    </>
  )
}

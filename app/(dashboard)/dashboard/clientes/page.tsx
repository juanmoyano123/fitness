import { getClientsAction } from '@/app/actions/clients'
import { ClientsList } from '@/components/clients/clients-list'
import { enrichClientWithMeta } from '@/lib/utils/client-helpers'

// This is a server component, so we can't use hooks directly
// We'll need to handle the trainer ID differently
export default async function ClientesPage() {
  // For now, we'll use a hardcoded trainer ID
  // In a real app with proper auth, this would come from the session
  const trainerId = 'demo-trainer-id'

  const result = await getClientsAction(trainerId)

  const clients = result.success
    ? result.data.map(enrichClientWithMeta)
    : []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Gestiona tus clientes y sus programas de entrenamiento
        </p>
      </div>

      <ClientsList initialClients={clients} trainerId={trainerId} />
    </div>
  )
}

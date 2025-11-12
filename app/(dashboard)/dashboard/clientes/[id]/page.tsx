import { notFound } from 'next/navigation'
import { getClientAction } from '@/app/actions/clients'
import { ClientProfile } from '@/components/clients/client-profile'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface ClientPageProps {
  params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params
  const trainerId = 'demo-trainer-id'

  const result = await getClientAction(id, trainerId)

  if (!result.success || !result.data) {
    notFound()
  }

  const client = result.data

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Volver a Clientes
          </Button>
        </Link>
      </div>

      <ClientProfile client={client} trainerId={trainerId} />
    </div>
  )
}

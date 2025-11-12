'use client'

import Link from 'next/link'
import { ClientWithMeta } from '@/types/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Eye, MoreHorizontal, Mail, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getStatusColor, getStatusLabel } from '@/lib/utils/client-helpers'

interface ClientsGridProps {
  clients: ClientWithMeta[]
  onDelete?: (clientId: string) => void
}

export function ClientsGrid({ clients, onDelete }: ClientsGridProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No clients found
        </p>
        <p className="text-sm text-muted-foreground">
          Create your first client to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {clients.map((client) => (
        <Card key={client.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Link href={`/dashboard/clientes/${client.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{client.initials}</AvatarFallback>
                </Avatar>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clientes/${client.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(client.id)}
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-3">
              <Link
                href={`/dashboard/clientes/${client.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {client.fullName}
              </Link>
              <div className="mt-1">
                <Badge variant="secondary" className={getStatusColor(client.status)}>
                  {getStatusLabel(client.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {client.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.lastActivityText && (
              <div className="text-xs text-muted-foreground">
                Última actividad: {client.lastActivityText}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

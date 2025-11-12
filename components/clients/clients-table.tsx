'use client'

import Link from 'next/link'
import { ClientWithMeta } from '@/types/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Eye, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getStatusColor, getStatusLabel } from '@/lib/utils/client-helpers'

interface ClientsTableProps {
  clients: ClientWithMeta[]
  onDelete?: (clientId: string) => void
}

export function ClientsTable({ clients, onDelete }: ClientsTableProps) {
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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Última actividad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{client.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/dashboard/clientes/${client.id}`}
                      className="font-medium hover:underline"
                    >
                      {client.fullName}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {client.email && (
                    <div className="text-muted-foreground">{client.email}</div>
                  )}
                  {client.phone && (
                    <div className="text-muted-foreground">{client.phone}</div>
                  )}
                  {!client.email && !client.phone && (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(client.status)}>
                  {getStatusLabel(client.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {client.lastActivityText || '—'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

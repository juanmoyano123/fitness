'use client'

import { useState } from 'react'
import { Client } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EditClientDialog } from './edit-client-dialog'
import { getClientInitials, getStatusColor, getStatusLabel } from '@/lib/utils/client-helpers'
import { Edit, Mail, Phone, Calendar, FileText } from 'lucide-react'

interface ClientProfileProps {
  client: Client
  trainerId: string
}

export function ClientProfile({ client, trainerId }: ClientProfileProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const initials = getClientInitials(client.fullName)

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{client.fullName}</h1>
                  <div className="mt-2">
                    <Badge variant="secondary" className={getStatusColor(client.status)}>
                      {getStatusLabel(client.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{client.email}</p>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">{client.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <p className="text-sm font-medium">
                    {new Date(client.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="programs" disabled>
              Programas
            </TabsTrigger>
            <TabsTrigger value="progress" disabled>
              Progreso
            </TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Estado del Cliente
                    </h3>
                    <p className="mt-1">
                      <Badge variant="secondary" className={getStatusColor(client.status)}>
                        {getStatusLabel(client.status)}
                      </Badge>
                    </p>
                  </div>
                  {client.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Notas
                      </h3>
                      <p className="mt-1 text-sm">{client.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No hay actividad reciente disponible
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Programas de Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los programas de entrenamiento estarán disponibles próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progreso y Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  El seguimiento de progreso estará disponible próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notas del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                {client.notes ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{client.notes}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay notas para este cliente
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={client}
        trainerId={trainerId}
      />
    </>
  )
}

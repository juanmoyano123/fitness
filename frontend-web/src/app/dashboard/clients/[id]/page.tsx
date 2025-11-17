"use client";

import { use } from "react";
import { MOCK_CLIENTS, MOCK_WORKOUTS, MOCK_EXERCISES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const client = MOCK_CLIENTS.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/clients">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a clientes
          </Button>
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/clients">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Button>
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {client.email}
            </div>
            {client.age && (
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {client.age} años
              </div>
            )}
          </div>
        </div>
        <Button>Asignar Workout</Button>
      </div>

      {client.goals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{client.goals}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.adherence}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {client.workoutsCompleted} de {client.workoutsAssigned} workouts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workouts Completados
            </CardTitle>
            <Activity className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.workoutsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Total histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Última Actividad
            </CardTitle>
            <Calendar className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.lastActivity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {client.status === "active" ? "Activo" : "Inactivo"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workouts Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_WORKOUTS.slice(0, 3).map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{workout.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {workout.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{workout.difficulty}</Badge>
                    <Badge variant="outline">{workout.duration} min</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver detalles
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progreso en Ejercicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Los gráficos de progreso estarán disponibles próximamente</p>
            <p className="text-sm mt-2">
              Se mostrarán gráficos de peso, repeticiones y volumen por ejercicio
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

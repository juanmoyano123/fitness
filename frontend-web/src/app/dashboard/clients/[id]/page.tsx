"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchClient, fetchClientAssignments, Client, WorkoutAssignment } from "@/lib/api";
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
  Loader2,
  AlertCircle,
  Dumbbell,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [client, setClient] = useState<Client | null>(null);
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClientData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar datos del cliente y sus assignments en paralelo
      const [clientResponse, assignmentsData] = await Promise.all([
        fetchClient(id),
        fetchClientAssignments(id),
      ]);

      if (clientResponse.success && clientResponse.data) {
        setClient(clientResponse.data);
      } else {
        setError("Cliente no encontrado");
      }

      setAssignments(assignmentsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cliente");
      console.error("Error loading client:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <PlayCircle className="h-3 w-3 mr-1" />
            En progreso
          </Badge>
        );
      case "skipped":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Omitido
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/clients">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a clientes
          </Button>
        </Link>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/clients">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a clientes
          </Button>
        </Link>
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={loadClientData} className="ml-auto">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
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
          <p className="text-muted-foreground mt-2">
            El cliente que buscas no existe o fue eliminado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/clients">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Button>
      </Link>

      {/* Header */}
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
                {client.gender && ` - ${client.gender === 'male' ? 'Masculino' : client.gender === 'female' ? 'Femenino' : 'Otro'}`}
              </div>
            )}
          </div>
        </div>
        <Button>Asignar Workout</Button>
      </div>

      {/* Objectives */}
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* Adherencia del Programa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherencia del Programa</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            {assignments.length > 0 && assignments[0].adherencePercentage !== null && assignments[0].adherencePercentage !== undefined ? (
              <>
                <div className="text-2xl font-bold">{assignments[0].adherencePercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {client.workoutsCompleted ?? 0} de {assignments[0].expectedSessions ?? 0} sesiones
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{client.adherence ?? 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {client.workoutsCompleted ?? 0} de {client.workoutsAssigned ?? 0} workouts
                </p>
              </>
            )}
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
            <div className="text-2xl font-bold">{client.workoutsCompleted ?? 0}</div>
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
            <div className="text-2xl font-bold">{client.lastActivity || "Nunca"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {client.status === "active" ? "Activo" : "Inactivo"}
            </p>
          </CardContent>
        </Card>

        {/* NEW: Progreso del Programa */}
        {assignments.length > 0 && assignments[0].expectedSessions && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso del Programa</CardTitle>
              <Target className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments[0].timeProgressPercentage ?? 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Semana {Math.ceil((assignments[0].timeProgressPercentage ?? 0) / 100 * (assignments[0].workout?.programDurationWeeks ?? 0))} de {assignments[0].workout?.programDurationWeeks ?? 0}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${assignments[0].timeProgressPercentage ?? 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* NEW: Proyección */}
        {assignments.length > 0 && assignments[0].expectedSessions && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyección</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              {(() => {
                const expected = assignments[0].expectedSessions ?? 0;
                const completed = client.workoutsCompleted ?? 0;
                const timeProgress = assignments[0].timeProgressPercentage ?? 0;
                const expectedAtThisPoint = Math.round((timeProgress / 100) * expected);
                const difference = completed - expectedAtThisPoint;

                return (
                  <>
                    <div className="text-2xl font-bold">
                      {difference >= 0 ? `+${difference}` : difference}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {difference >= 0
                        ? `${Math.abs(difference)} sesiones adelante del ritmo`
                        : `${Math.abs(difference)} sesiones atrás del ritmo`
                      }
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assigned Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Workouts Asignados
            <Badge variant="secondary" className="ml-2">{assignments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No hay workouts asignados</p>
              <p className="text-sm mt-1">
                Asigna un workout a este cliente para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {assignment.workout?.name || "Workout sin nombre"}
                    </h4>
                    {assignment.workout?.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {assignment.workout.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {assignment.workout?.category && (
                        <Badge variant="outline" className="capitalize">
                          {assignment.workout.category}
                        </Badge>
                      )}
                      {assignment.workout?.difficulty && (
                        <Badge variant="outline" className="capitalize">
                          {assignment.workout.difficulty}
                        </Badge>
                      )}
                      {assignment.workout?.duration && (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {assignment.workout.duration} min
                        </Badge>
                      )}
                      {/* NEW: Program duration badge */}
                      {assignment.workout?.programDurationWeeks && (
                        <Badge variant="secondary">
                          <Calendar className="h-3 w-3 mr-1" />
                          {assignment.workout.programDurationWeeks} semanas
                        </Badge>
                      )}
                      {/* NEW: Expected sessions badge */}
                      {assignment.expectedSessions && (
                        <Badge variant="outline">
                          {assignment.expectedSessions} sesiones esperadas
                        </Badge>
                      )}
                      {getStatusBadge(assignment.status)}
                    </div>

                    {/* NEW: Time progress bar */}
                    {assignment.timeProgressPercentage !== null && assignment.timeProgressPercentage !== undefined && assignment.status !== 'completed' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progreso temporal</span>
                          <span>{assignment.timeProgressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${assignment.timeProgressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Section (placeholder) */}
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

"use client";

import { useState } from "react";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Activity,
  AlertTriangle,
} from "lucide-react";

// Mock data para gráficos
const weeklyAdherence = [
  { day: "Lun", value: 75 },
  { day: "Mar", value: 82 },
  { day: "Mié", value: 68 },
  { day: "Jue", value: 90 },
  { day: "Vie", value: 85 },
  { day: "Sáb", value: 72 },
  { day: "Dom", value: 65 },
];

const monthlyWorkouts = [
  { month: "Jul", completed: 145, assigned: 200 },
  { month: "Ago", completed: 168, assigned: 220 },
  { month: "Sep", completed: 192, assigned: 240 },
  { month: "Oct", completed: 215, assigned: 260 },
  { month: "Nov", completed: 230, assigned: 280 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  const activeClients = MOCK_CLIENTS.filter((c) => c.status === "active").length;
  const totalWorkoutsCompleted = MOCK_CLIENTS.reduce(
    (sum, client) => sum + client.workoutsCompleted,
    0
  );
  const totalWorkoutsAssigned = MOCK_CLIENTS.reduce(
    (sum, client) => sum + client.workoutsAssigned,
    0
  );
  const avgAdherence = Math.round(
    MOCK_CLIENTS.reduce((sum, client) => sum + client.adherence, 0) /
      MOCK_CLIENTS.length
  );

  const atRiskClients = MOCK_CLIENTS.filter(
    (c) => c.adherence < 50 && c.status === "active"
  );

  const maxWeeklyValue = Math.max(...weeklyAdherence.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Progreso & Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitorea el rendimiento de tus clientes y tu negocio
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+3 vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Adherencia Promedio
            </CardTitle>
            <Target className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAdherence}%</div>
            <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+5% vs mes anterior</span>
            </div>
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
            <div className="text-2xl font-bold">{totalWorkoutsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {totalWorkoutsAssigned} asignados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes en Riesgo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atRiskClients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Adherencia &lt; 50%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Adherence Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Adherencia Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyAdherence.map((item) => (
                <div key={item.day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-3 transition-all"
                      style={{ width: `${(item.value / maxWeeklyValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Promedio semanal</span>
                <span className="font-semibold text-chart-3">
                  {Math.round(
                    weeklyAdherence.reduce((sum, d) => sum + d.value, 0) /
                      weeklyAdherence.length
                  )}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Workouts Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[200px] flex items-end justify-between gap-2">
                {monthlyWorkouts.map((item) => {
                  const completionRate =
                    (item.completed / item.assigned) * 100;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex flex-col items-center gap-1 h-full justify-end">
                        <div className="relative w-full h-full flex items-end">
                          <div
                            className="w-full bg-chart-1 rounded-t transition-all relative group"
                            style={{
                              height: `${(item.completed / 280) * 100}%`,
                            }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background border px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {item.completed}/{item.assigned}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-sm" />
                  <span className="text-sm text-muted-foreground">
                    Completados
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                  <span className="font-medium">+25% vs mes anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Destacados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_CLIENTS.filter((c) => c.adherence >= 80)
                .slice(0, 5)
                .map((client, idx) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-chart-3 text-white rounded-full text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.workoutsCompleted} workouts completados
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-chart-3 text-white">
                      {client.adherence}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* At Risk Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-5" />
              Clientes Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atRiskClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>¡Excelente! Todos tus clientes están activos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {atRiskClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Última actividad: {client.lastActivity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-chart-5 text-white">
                        {client.adherence}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {client.workoutsCompleted}/{client.workoutsAssigned}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise Popularity */}
      <Card>
        <CardHeader>
          <CardTitle>Ejercicios Más Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Sentadilla con Barra", count: 45, trend: "up" },
              { name: "Press de Banca", count: 38, trend: "up" },
              { name: "Peso Muerto", count: 32, trend: "down" },
              { name: "Dominadas", count: 28, trend: "up" },
              { name: "Plancha", count: 25, trend: "up" },
            ].map((exercise, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium w-4">{idx + 1}</span>
                  <span className="text-sm">{exercise.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-4"
                      style={{ width: `${(exercise.count / 45) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">
                    {exercise.count}
                  </span>
                  {exercise.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-3" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-chart-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { fetchTrainerAnalytics, type AnalyticsData } from "@/lib/api";
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
  Users,
  Target,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("week");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch analytics data
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrainerAnalytics(timeRange);
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when timeRange changes
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-chart-5" />
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const atRiskClients = analytics.clientsAdherence.filter((c) => c.adherence < 50);
  const topPerformers = analytics.clientsAdherence
    .filter((c) => c.adherence >= 80)
    .sort((a, b) => b.adherence - a.adherence)
    .slice(0, 5);

  // Calculate weekly adherence (for the bar chart)
  const weeklyAdherence = analytics.weeklyActivity.map((activity) => {
    const date = new Date(activity.date);
    const dayName = DAY_NAMES[date.getDay()];
    return {
      day: dayName,
      value: activity.completed,
    };
  });

  const maxWeeklyValue = Math.max(
    ...weeklyAdherence.map((d) => d.value),
    1 // Prevent division by zero
  );

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
          <p className="mt-1 text-xs text-muted-foreground">
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAnalytics}
            className="p-2 hover:bg-accent rounded-md"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
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
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.activeClients} activos
            </p>
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
            <div className="text-2xl font-bold">{analytics.avgAdherence}%</div>
            <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>En el período seleccionado</span>
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
            <div className="text-2xl font-bold">
              {analytics.workoutsThisWeek}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En el período seleccionado
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
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad del Período</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyAdherence.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay datos de actividad en este período</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyAdherence.map((item) => (
                  <div key={item.day} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.day}</span>
                      <span className="text-muted-foreground">
                        {item.value} workouts
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-3 transition-all"
                        style={{
                          width: `${(item.value / maxWeeklyValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {weeklyAdherence.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total del período</span>
                  <span className="font-semibold text-chart-3">
                    {weeklyAdherence.reduce((sum, d) => sum + d.value, 0)}{" "}
                    workouts
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Adherence List */}
        <Card>
          <CardHeader>
            <CardTitle>Adherencia por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.clientsAdherence.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay datos de clientes en este período</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.clientsAdherence
                  .sort((a, b) => b.adherence - a.adherence)
                  .map((client) => (
                    <div
                      key={client.clientId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.workoutsCompleted}/{client.workoutsAssigned}{" "}
                          workouts
                        </p>
                      </div>
                      <Badge
                        className={
                          client.adherence >= 80
                            ? "bg-chart-3 text-white"
                            : client.adherence >= 50
                            ? "bg-chart-1 text-white"
                            : "bg-chart-5 text-white"
                        }
                      >
                        {client.adherence}%
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Clientes Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((client, idx) => (
                  <div
                    key={client.clientId}
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
        )}

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
                    key={client.clientId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.workoutsCompleted}/{client.workoutsAssigned}{" "}
                        completados
                      </p>
                    </div>
                    <Badge className="bg-chart-5 text-white">
                      {client.adherence}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

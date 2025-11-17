import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Activity, Target } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      name: "Clientes Activos",
      value: "24",
      icon: Users,
      change: "+3 este mes",
      color: "text-chart-2",
    },
    {
      name: "Adherencia Promedio",
      value: "73%",
      icon: TrendingUp,
      change: "+5% vs mes anterior",
      color: "text-chart-3",
    },
    {
      name: "Workouts Completados",
      value: "156",
      icon: Activity,
      change: "Esta semana",
      color: "text-chart-1",
    },
    {
      name: "Objetivos Alcanzados",
      value: "18",
      icon: Target,
      change: "Este mes",
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenido de vuelta, Carlos. Aquí está el resumen de tu actividad.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-chart-3 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Laura Gómez completó "Full Body A"</p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-chart-1 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Juan Pérez alcanzó su objetivo semanal</p>
                  <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-chart-2 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">María López inició "Upper Body Strength"</p>
                  <p className="text-xs text-muted-foreground">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Clientes Requieren Atención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Carlos Martínez</p>
                  <p className="text-xs text-muted-foreground">Sin actividad por 7 días</p>
                </div>
                <span className="text-xs text-destructive">Inactivo</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ana Silva</p>
                  <p className="text-xs text-muted-foreground">Adherencia 35%</p>
                </div>
                <span className="text-xs text-chart-1">Baja adherencia</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

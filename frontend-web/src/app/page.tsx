import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  Users,
  BarChart3,
  Smartphone,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Gestión de Clientes",
      description:
        "Organiza y monitorea todos tus clientes en un solo lugar. CRM diseñado para entrenadores.",
    },
    {
      icon: Dumbbell,
      title: "Biblioteca de Ejercicios",
      description:
        "Accede a 1300+ ejercicios con GIFs demostrativos y crea workouts profesionales.",
    },
    {
      icon: BarChart3,
      title: "Analytics en Tiempo Real",
      description:
        "Monitorea adherencia, progreso y métricas clave de tus clientes automáticamente.",
    },
    {
      icon: Smartphone,
      title: "App Móvil para Clientes",
      description:
        "Tus clientes reciben workouts en su app móvil con seguimiento integrado.",
    },
    {
      icon: Clock,
      title: "Ahorra 10+ Horas/Semana",
      description:
        "Automatiza tareas administrativas y enfócate en entrenar.",
    },
    {
      icon: TrendingUp,
      title: "Escala tu Negocio",
      description:
        "Gestiona 50+ clientes simultáneamente sin colapsar.",
    },
  ];

  const stats = [
    { value: "10+", label: "Horas ahorradas/semana" },
    { value: "3x", label: "Más clientes" },
    { value: "90%", label: "Adherencia promedio" },
    { value: "1300+", label: "Ejercicios disponibles" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                FitCompass Pro
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Gestiona 3x Más Clientes en 50% Menos Tiempo
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plataforma todo-en-uno para entrenadores personales en LATAM. Crea
              workouts profesionales, monitorea progreso y proyecta credibilidad
              con tecnología tier-1.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que Necesitas en un Solo Lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diseñado específicamente para entrenadores personales que buscan
              profesionalizar y escalar su negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comienza Hoy - Demo Gratuita
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sin tarjeta de crédito. Explora todas las funcionalidades
              instantáneamente.
            </p>
            <Link href="/register">
              <Button size="lg">Crear Cuenta Gratis</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 FitCompass Pro - Plataforma para Entrenadores Personales</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    business_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        business_name: formData.business_name || undefined,
      });

      if (response.success) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-semibold text-foreground">
            FitCompass Pro
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Regístrate para comenzar a gestionar tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="trainer@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">
                  Nombre del negocio <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  placeholder="Fit Training Co"
                  value={formData.business_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Volver al inicio
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

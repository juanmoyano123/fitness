"use client";

import { useState, useEffect } from "react";
import {
  fetchExercises,
  type Exercise as APIExercise,
  type ExerciseFilters
} from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Dumbbell, Heart, Zap, Target, Loader2, AlertCircle } from "lucide-react";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bodyPartFilter, setBodyPartFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load exercises on mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Reload exercises when filters change
  useEffect(() => {
    if (!isLoading) {
      loadExercises();
    }
  }, [bodyPartFilter, equipmentFilter]);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: ExerciseFilters = {
        search: searchQuery || undefined,
        bodyPart: bodyPartFilter !== "all" ? bodyPartFilter : undefined,
        equipment: equipmentFilter !== "all" ? equipmentFilter : undefined,
        limit: 100,
      };

      const data = await fetchExercises(filters);
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar ejercicios");
      console.error("Error loading exercises:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadExercises();
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      exercise.name.toLowerCase().includes(query) ||
      exercise.bodyPart.toLowerCase().includes(query) ||
      exercise.target.toLowerCase().includes(query) ||
      exercise.equipment.toLowerCase().includes(query)
    );
  });

  const stats = [
    {
      name: "Total Ejercicios",
      value: exercises.length.toString(),
      icon: Dumbbell,
    },
    {
      name: "Partes del Cuerpo",
      value: new Set(exercises.map((e) => e.bodyPart)).size.toString(),
      icon: Target,
    },
    {
      name: "Músculos Objetivo",
      value: new Set(exercises.map((e) => e.target)).size.toString(),
      icon: Zap,
    },
    {
      name: "Equipamiento",
      value: new Set(exercises.map((e) => e.equipment)).size.toString(),
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            Cerrar
          </Button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Biblioteca de Ejercicios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora ejercicios con GIFs demostrativos para crear tus workouts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicios por nombre o músculo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Select value={bodyPartFilter} onValueChange={setBodyPartFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Parte del cuerpo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las partes</SelectItem>
            <SelectItem value="back">Espalda</SelectItem>
            <SelectItem value="chest">Pecho</SelectItem>
            <SelectItem value="legs">Piernas</SelectItem>
            <SelectItem value="arms">Brazos</SelectItem>
            <SelectItem value="shoulders">Hombros</SelectItem>
            <SelectItem value="core">Core</SelectItem>
          </SelectContent>
        </Select>
        <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Equipamiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el equipamiento</SelectItem>
            <SelectItem value="barbell">Barra</SelectItem>
            <SelectItem value="dumbbell">Mancuernas</SelectItem>
            <SelectItem value="body weight">Peso corporal</SelectItem>
            <SelectItem value="cable">Polea</SelectItem>
            <SelectItem value="machine">Máquina</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredExercises.length} de {exercises.length} ejercicios
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Cargando ejercicios...</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron ejercicios</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-secondary flex items-center justify-center relative">
                {exercise.gifUrl ? (
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Dumbbell className="h-16 w-16 text-muted-foreground" />
                )}
                <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-lg capitalize">{exercise.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{exercise.bodyPart}</Badge>
                    <Badge variant="secondary" className="capitalize">{exercise.target}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Equipo necesario:</h4>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {exercise.equipment}
                    </Badge>
                  </div>
                  {exercise.instructions && exercise.instructions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Instrucciones:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {exercise.instructions[0]}
                      </p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-2">
                    Agregar a Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

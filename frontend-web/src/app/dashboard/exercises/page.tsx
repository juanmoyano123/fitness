"use client";

import { useState } from "react";
import { MOCK_EXERCISES, type Exercise } from "@/lib/mock-data";
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
import { Search, Dumbbell, Heart, Zap, Target } from "lucide-react";

const categoryIcons = {
  strength: Dumbbell,
  cardio: Heart,
  flexibility: Zap,
  balance: Target,
};

const difficultyColors = {
  beginner: "bg-chart-3 text-white",
  intermediate: "bg-chart-1 text-white",
  advanced: "bg-chart-5 text-white",
};

const categoryColors = {
  strength: "text-chart-4",
  cardio: "text-chart-5",
  flexibility: "text-chart-3",
  balance: "text-chart-2",
};

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredExercises = MOCK_EXERCISES.filter((exercise) => {
    const matchesSearch =
      exercise.nameEs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || exercise.category === categoryFilter;

    const matchesDifficulty =
      difficultyFilter === "all" || exercise.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const stats = [
    {
      name: "Total Ejercicios",
      value: MOCK_EXERCISES.length.toString(),
      icon: Dumbbell,
    },
    {
      name: "Fuerza",
      value: MOCK_EXERCISES.filter((e) => e.category === "strength").length.toString(),
      icon: Dumbbell,
    },
    {
      name: "Cardio",
      value: MOCK_EXERCISES.filter((e) => e.category === "cardio").length.toString(),
      icon: Heart,
    },
    {
      name: "Grupos Musculares",
      value: new Set(MOCK_EXERCISES.map((e) => e.muscleGroup)).size.toString(),
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
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
            placeholder="Buscar ejercicios por nombre o grupo muscular..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="strength">Fuerza</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="flexibility">Flexibilidad</SelectItem>
            <SelectItem value="balance">Balance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Dificultad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las dificultades</SelectItem>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredExercises.length} de {MOCK_EXERCISES.length} ejercicios
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => {
          const CategoryIcon = categoryIcons[exercise.category];
          return (
            <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-secondary flex items-center justify-center relative">
                {exercise.gifUrl ? (
                  <div className="text-muted-foreground text-sm">
                    [GIF: {exercise.nameEs}]
                  </div>
                ) : (
                  <Dumbbell className="h-16 w-16 text-muted-foreground" />
                )}
                <div className="absolute top-2 right-2">
                  <CategoryIcon
                    className={`h-6 w-6 ${categoryColors[exercise.category]}`}
                  />
                </div>
              </div>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-lg">{exercise.nameEs}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {exercise.name}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={difficultyColors[exercise.difficulty]}>
                      {exercise.difficulty === "beginner"
                        ? "Principiante"
                        : exercise.difficulty === "intermediate"
                        ? "Intermedio"
                        : "Avanzado"}
                    </Badge>
                    <Badge variant="outline">{exercise.muscleGroup}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Equipo necesario:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((eq, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Instrucciones:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {exercise.instructions}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    Agregar a Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron ejercicios</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      )}
    </div>
  );
}

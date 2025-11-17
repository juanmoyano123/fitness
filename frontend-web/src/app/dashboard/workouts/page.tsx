"use client";

import { useState } from "react";
import {
  MOCK_EXERCISES,
  MOCK_CLIENTS,
  type Exercise,
  type WorkoutExercise,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  Search,
  Check,
  Dumbbell,
} from "lucide-react";

interface WorkoutFormExercise extends WorkoutExercise {
  exercise?: Exercise;
}

export default function WorkoutsPage() {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState<string>("strength");
  const [workoutDifficulty, setWorkoutDifficulty] = useState<string>("intermediate");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutFormExercise[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const filteredExercises = MOCK_EXERCISES.filter((exercise) =>
    exercise.nameEs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutFormExercise = {
      exerciseId: exercise.id,
      sets: 3,
      reps: 10,
      weight: 0,
      rest: 90,
      exercise,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    field: keyof WorkoutFormExercise,
    value: number | string
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selectedExercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...selectedExercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSelectedExercises(updated);
  };

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSaveWorkout = () => {
    if (!workoutName || selectedExercises.length === 0) {
      alert("Por favor completa el nombre del workout y agrega al menos un ejercicio");
      return;
    }

    alert(
      `Workout "${workoutName}" creado con ${selectedExercises.length} ejercicios y asignado a ${selectedClients.length} clientes. (Demo mode - no se guardará)`
    );

    // Reset form
    setWorkoutName("");
    setWorkoutDescription("");
    setSelectedExercises([]);
    setSelectedClients([]);
  };

  const estimatedDuration = selectedExercises.reduce((total, ex) => {
    const exerciseTime = ex.sets * (ex.reps * 3 + ex.rest); // ~3 seg por rep
    return total + exerciseTime / 60; // convert to minutes
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Crear Workout</h1>
        <p className="mt-2 text-muted-foreground">
          Construye workouts personalizados arrastrando ejercicios
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Exercise Library */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Ejercicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar ejercicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3 border rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                    onClick={() => addExercise(exercise)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {exercise.nameEs}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.muscleGroup}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Workout Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Workout *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Full Body A"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={workoutCategory} onValueChange={setWorkoutCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Fuerza</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                      <SelectItem value="flexibility">Flexibilidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select
                    value={workoutDifficulty}
                    onValueChange={setWorkoutDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duración Estimada</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                    <span className="text-sm font-medium">
                      {Math.round(estimatedDuration)} min
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el objetivo del workout..."
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Ejercicios del Workout ({selectedExercises.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay ejercicios agregados</p>
                  <p className="text-sm mt-1">
                    Haz clic en un ejercicio de la biblioteca para agregarlo
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedExercises.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-secondary/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-move"
                            onClick={() => moveExercise(index, "up")}
                            disabled={index === 0}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">
                                {index + 1}. {item.exercise?.nameEs}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.exercise?.muscleGroup}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExercise(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <Label className="text-xs">Series</Label>
                              <Input
                                type="number"
                                value={item.sets}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "sets",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="1"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Reps</Label>
                              <Input
                                type="number"
                                value={item.reps}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "reps",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="1"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Peso (kg)</Label>
                              <Input
                                type="number"
                                value={item.weight}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "weight",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="0"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Descanso (s)</Label>
                              <Input
                                type="number"
                                value={item.rest}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "rest",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="0"
                                step="15"
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asignar a Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {MOCK_CLIENTS.filter((c) => c.status === "active").map(
                  (client) => (
                    <div
                      key={client.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedClients.includes(client.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => toggleClient(client.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{client.name}</span>
                        {selectedClients.includes(client.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSaveWorkout}>
              Guardar y Asignar Workout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

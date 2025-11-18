"use client";

import { useState, useEffect } from "react";
import {
  fetchExercises,
  fetchClients,
  createWorkout,
  assignWorkout,
  type Exercise as APIExercise,
  type Client as APIClient,
  type WorkoutExercise as APIWorkoutExercise,
  type CreateWorkoutInput,
} from "@/lib/api";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

interface WorkoutFormExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  exercise?: APIExercise;
}

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  const [clients, setClients] = useState<APIClient[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState<string>("strength");
  const [workoutDifficulty, setWorkoutDifficulty] = useState<string>("intermediate");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutFormExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load exercises and clients on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [exercisesData, clientsData] = await Promise.all([
        fetchExercises({ limit: 100 }),
        fetchClients(),
      ]);
      setExercises(exercisesData);
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addExercise = (exercise: APIExercise) => {
    const newExercise: WorkoutFormExercise = {
      exerciseId: exercise.id,
      sets: 3,
      reps: "10",
      restSeconds: 90,
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
    // Convert to appropriate type
    if (field === 'sets' || field === 'restSeconds') {
      updated[index] = { ...updated[index], [field]: typeof value === 'string' ? parseInt(value) || 0 : value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
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

  const handleSaveWorkout = async () => {
    if (!workoutName || selectedExercises.length === 0) {
      setError("Por favor completa el nombre del workout y agrega al menos un ejercicio");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare workout data
      const workoutData: CreateWorkoutInput = {
        name: workoutName,
        description: workoutDescription || undefined,
        category: workoutCategory || undefined,
        difficulty: workoutDifficulty || undefined,
        durationMinutes: Math.round(estimatedDuration) || undefined,
        exercises: selectedExercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          notes: ex.notes,
        })),
      };

      // Create workout
      const newWorkout = await createWorkout(workoutData);

      // Assign to selected clients if any
      if (selectedClients.length > 0) {
        await assignWorkout(newWorkout.id, {
          clientIds: selectedClients,
        });
      }

      alert(
        `¡Workout "${workoutName}" creado exitosamente!${
          selectedClients.length > 0
            ? ` Asignado a ${selectedClients.length} cliente(s).`
            : ""
        }`
      );

      // Reset form
      setWorkoutName("");
      setWorkoutDescription("");
      setSelectedExercises([]);
      setSelectedClients([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar workout");
      console.error("Error saving workout:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedDuration = selectedExercises.reduce((total, ex) => {
    const repsNum = parseInt(ex.reps) || 10;
    const exerciseTime = ex.sets * (repsNum * 3 + ex.restSeconds); // ~3 seg por rep
    return total + exerciseTime / 60; // convert to minutes
  }, 0);

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
        <h1 className="text-3xl font-bold text-foreground">Crear Workout</h1>
        <p className="mt-2 text-muted-foreground">
          Construye workouts personalizados arrastrando ejercicios
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Cargando datos...</p>
        </div>
      ) : (

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
                        <p className="font-medium text-sm truncate capitalize">
                          {exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {exercise.bodyPart} - {exercise.target}
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
                              <h4 className="font-medium capitalize">
                                {index + 1}. {item.exercise?.name}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {item.exercise?.bodyPart} - {item.exercise?.target}
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

                          <div className="grid grid-cols-3 gap-2">
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
                                type="text"
                                value={item.reps}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "reps",
                                    e.target.value
                                  )
                                }
                                placeholder="10-12"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Descanso (s)</Label>
                              <Input
                                type="number"
                                value={item.restSeconds}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "restSeconds",
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
                {clients.filter((c) => c.status === "active").map(
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
            <Button
              variant="outline"
              onClick={() => {
                setWorkoutName("");
                setWorkoutDescription("");
                setSelectedExercises([]);
                setSelectedClients([]);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveWorkout}
              disabled={isSubmitting || !workoutName || selectedExercises.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar y Asignar Workout"
              )}
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

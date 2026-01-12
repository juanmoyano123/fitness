"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchExercises,
  fetchClients,
  createWorkout,
  assignWorkoutToClients,
  type Exercise as APIExercise,
  type Client as APIClient,
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
  ChevronUp,
  ChevronDown,
  Search,
  Check,
  Dumbbell,
  Loader2,
  AlertCircle,
  Link2,
  X,
} from "lucide-react";
import { SimpleExerciseFilters } from "@/components/exercises/simple-exercise-filters";
import { DaySelector } from "@/components/ui/day-selector";
import Image from "next/image";

// Superset support: each workout item can have multiple exercises
interface WorkoutItem {
  id: string;
  exercises: {
    exerciseId: string;
    exercise: APIExercise;
  }[];
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  const [clients, setClients] = useState<APIClient[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState<string>("strength");
  const [workoutDifficulty, setWorkoutDifficulty] = useState<string>("intermediate");
  const [programDurationWeeks, setProgramDurationWeeks] = useState<number>(8); // NEW: Default 8 weeks
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states for exercise library
  const [bodyPartFilter, setBodyPartFilter] = useState<string>("all");
  const [targetFilter, setTargetFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [customOnlyFilter, setCustomOnlyFilter] = useState(false);

  // For adding to superset
  const [addingToSuperset, setAddingToSuperset] = useState<string | null>(null);

  // Load exercises with filters
  const loadExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const exercisesData = await fetchExercises({
        search: searchQuery || undefined,
        bodyPart: bodyPartFilter !== "all" ? bodyPartFilter : undefined,
        target: targetFilter !== "all" ? targetFilter : undefined,
        equipment: equipmentFilter !== "all" ? equipmentFilter : undefined,
        custom_only: customOnlyFilter,
        limit: 1500,
      });
      setExercises(exercisesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar ejercicios");
      console.error("Error loading exercises:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, bodyPartFilter, targetFilter, equipmentFilter, customOnlyFilter]);

  // Load clients separately
  const loadClients = useCallback(async () => {
    try {
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (err) {
      console.error("Error loading clients:", err);
    }
  }, []);

  // Load exercises on filter change
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Load clients on mount
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleResetFilters = () => {
    setBodyPartFilter("all");
    setTargetFilter("all");
    setEquipmentFilter("all");
    setCustomOnlyFilter(false);
    setSearchQuery("");
  };

  // Add exercise as new item or to existing superset
  const addExercise = (exercise: APIExercise) => {
    if (addingToSuperset) {
      // Add to existing superset
      setWorkoutItems(items =>
        items.map(item =>
          item.id === addingToSuperset
            ? {
                ...item,
                exercises: [
                  ...item.exercises,
                  { exerciseId: exercise.id, exercise }
                ]
              }
            : item
        )
      );
      setAddingToSuperset(null);
    } else {
      // Create new workout item
      const newItem: WorkoutItem = {
        id: `item-${Date.now()}`,
        exercises: [{ exerciseId: exercise.id, exercise }],
        sets: 3,
        reps: "10-12",
        restSeconds: 90,
      };
      setWorkoutItems([...workoutItems, newItem]);
    }
  };

  const removeWorkoutItem = (itemId: string) => {
    setWorkoutItems(items => items.filter(item => item.id !== itemId));
    if (addingToSuperset === itemId) {
      setAddingToSuperset(null);
    }
  };

  const removeExerciseFromSuperset = (itemId: string, exerciseIndex: number) => {
    setWorkoutItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const newExercises = item.exercises.filter((_, i) => i !== exerciseIndex);
          // If no exercises left, remove the item
          if (newExercises.length === 0) {
            return null;
          }
          return { ...item, exercises: newExercises };
        }
        return item;
      }).filter(Boolean) as WorkoutItem[]
    );
  };

  const updateWorkoutItem = (
    itemId: string,
    field: keyof Pick<WorkoutItem, 'sets' | 'reps' | 'restSeconds' | 'notes'>,
    value: number | string
  ) => {
    setWorkoutItems(items =>
      items.map(item =>
        item.id === itemId
          ? {
              ...item,
              [field]: field === 'sets' || field === 'restSeconds'
                ? (typeof value === 'string' ? parseInt(value) || 0 : value)
                : value
            }
          : item
      )
    );
  };

  const moveWorkoutItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === workoutItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...workoutItems];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setWorkoutItems(updated);
  };

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSaveWorkout = async () => {
    if (!workoutName || workoutItems.length === 0) {
      setError("Por favor completa el nombre del workout y agrega al menos un ejercicio");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Flatten exercises for API (supersets become consecutive exercises with notes)
      const flatExercises = workoutItems.flatMap((item, itemIndex) => {
        const isSuperset = item.exercises.length > 1;
        return item.exercises.map((ex, exIndex) => ({
          exerciseId: ex.exerciseId,
          sets: item.sets,
          reps: item.reps,
          restSeconds: exIndex === item.exercises.length - 1 ? item.restSeconds : 0, // Rest only after last exercise in superset
          notes: isSuperset
            ? `Superset ${itemIndex + 1}${item.notes ? ` - ${item.notes}` : ''}`
            : item.notes,
        }));
      });

      const workoutData: CreateWorkoutInput = {
        name: workoutName,
        description: workoutDescription || undefined,
        category: workoutCategory || undefined,
        difficulty: workoutDifficulty || undefined,
        durationMinutes: Math.round(estimatedDuration) || undefined,
        programDurationWeeks: programDurationWeeks || undefined,  // NEW: Program duration
        scheduledDays: scheduledDays.length > 0 ? scheduledDays : undefined,
        exercises: flatExercises,
      };

      const response = await createWorkout(workoutData);
      const newWorkout = response.data;

      if (selectedClients.length > 0 && newWorkout?.id) {
        await assignWorkoutToClients(newWorkout.id, selectedClients);
      }

      alert(
        `Workout "${workoutName}" creado exitosamente!${
          selectedClients.length > 0
            ? ` Asignado a ${selectedClients.length} cliente(s).`
            : ""
        }`
      );

      // Reset form
      setWorkoutName("");
      setWorkoutDescription("");
      setProgramDurationWeeks(8);  // NEW: Reset to default
      setScheduledDays([]);
      setWorkoutItems([]);
      setSelectedClients([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar workout");
      console.error("Error saving workout:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedDuration = workoutItems.reduce((total, item) => {
    const repsNum = parseInt(item.reps) || 10;
    const exerciseTime = item.sets * (repsNum * 3 * item.exercises.length + item.restSeconds);
    return total + exerciseTime / 60;
  }, 0);

  // Get GIF URL with fallback
  const getGifUrl = (exercise: APIExercise) => {
    if (!exercise.gifUrl) return null;
    // Use 180px thumbnails
    return exercise.gifUrl;
  };

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
          Construye workouts personalizados con ejercicios simples o supersets
        </p>
      </div>

      {isLoading && workoutItems.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg text-muted-foreground">Cargando datos...</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Exercise Library */}
          <div className="lg:col-span-1 space-y-4">
            <Card className={addingToSuperset ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {addingToSuperset ? (
                      <span className="flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Agregar a Superset
                      </span>
                    ) : (
                      "Biblioteca de Ejercicios"
                    )}
                  </span>
                  {addingToSuperset ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingToSuperset(null)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      {exercises.length} ejercicios
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ejercicios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <SimpleExerciseFilters
                  bodyPart={bodyPartFilter}
                  target={targetFilter}
                  equipment={equipmentFilter}
                  customOnly={customOnlyFilter}
                  onBodyPartChange={setBodyPartFilter}
                  onTargetChange={setTargetFilter}
                  onEquipmentChange={setEquipmentFilter}
                  onCustomOnlyChange={setCustomOnlyFilter}
                  onReset={handleResetFilters}
                />

                {/* Exercise List with GIF Thumbnails */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
                    </div>
                  ) : exercises.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Dumbbell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron ejercicios</p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleResetFilters}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`p-2 border rounded-lg hover:bg-secondary cursor-pointer transition-all ${
                          addingToSuperset ? "hover:ring-2 hover:ring-primary" : ""
                        }`}
                        onClick={() => addExercise(exercise)}
                      >
                        <div className="flex items-center gap-3">
                          {/* GIF Thumbnail */}
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            {getGifUrl(exercise) ? (
                              <img
                                src={getGifUrl(exercise)!}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Dumbbell className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Exercise Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate capitalize">
                              {exercise.name}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                {exercise.bodyPart}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                                {exercise.target}
                              </Badge>
                            </div>
                          </div>

                          {/* Add Button */}
                          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Workout Builder */}
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

                {/* NEW: Program Duration */}
                <div className="space-y-2">
                  <Label htmlFor="program-duration">Duración del Programa</Label>
                  <p className="text-xs text-muted-foreground">
                    Define cuántas semanas durará este programa de entrenamiento
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={programDurationWeeks.toString()}
                      onValueChange={(val) => setProgramDurationWeeks(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 semanas</SelectItem>
                        <SelectItem value="6">6 semanas</SelectItem>
                        <SelectItem value="8">8 semanas</SelectItem>
                        <SelectItem value="10">10 semanas</SelectItem>
                        <SelectItem value="12">12 semanas</SelectItem>
                        <SelectItem value="16">16 semanas</SelectItem>
                        <SelectItem value="20">20 semanas</SelectItem>
                        <SelectItem value="24">24 semanas (6 meses)</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Dynamic calculation display */}
                    {scheduledDays.length > 0 && programDurationWeeks > 0 && (
                      <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                        <span className="text-sm font-medium">
                          {scheduledDays.length} días/sem × {programDurationWeeks} sem = {scheduledDays.length * programDurationWeeks} sesiones
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Días de la Semana (opcional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Selecciona los días en que se debe realizar este workout
                  </p>
                  <DaySelector value={scheduledDays} onChange={setScheduledDays} />
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

            {/* Workout Exercises Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Ejercicios del Workout
                  <Badge variant="outline">{workoutItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workoutItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No hay ejercicios agregados</p>
                    <p className="text-sm mt-1">
                      Haz clic en un ejercicio de la biblioteca para agregarlo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workoutItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`border rounded-lg overflow-hidden ${
                          item.exercises.length > 1 ? "border-primary/50 bg-primary/5" : "bg-secondary/30"
                        }`}
                      >
                        {/* Superset indicator */}
                        {item.exercises.length > 1 && (
                          <div className="bg-primary/10 px-3 py-1.5 border-b border-primary/20">
                            <span className="text-xs font-medium text-primary flex items-center gap-1">
                              <Link2 className="h-3 w-3" />
                              Superset ({item.exercises.length} ejercicios)
                            </span>
                          </div>
                        )}

                        <div className="p-4">
                          {/* Exercise(s) display */}
                          <div className="space-y-3">
                            {item.exercises.map((ex, exIndex) => (
                              <div key={ex.exerciseId} className="flex items-center gap-3">
                                {/* GIF Preview */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  {ex.exercise.gifUrl ? (
                                    <img
                                      src={ex.exercise.gifUrl}
                                      alt={ex.exercise.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Dumbbell className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {/* Exercise Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold capitalize text-sm">
                                        {item.exercises.length === 1 && `${index + 1}. `}
                                        {item.exercises.length > 1 && `${String.fromCharCode(65 + exIndex)}. `}
                                        {ex.exercise.name}
                                      </h4>
                                      <div className="flex gap-1 mt-1">
                                        <Badge variant="outline" className="text-[10px] capitalize">
                                          {ex.exercise.bodyPart}
                                        </Badge>
                                        <Badge variant="secondary" className="text-[10px] capitalize">
                                          {ex.exercise.target}
                                        </Badge>
                                      </div>
                                    </div>
                                    {item.exercises.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeExerciseFromSuperset(item.id, exIndex)}
                                      >
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add to superset button */}
                          {item.exercises.length < 3 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-xs text-muted-foreground"
                              onClick={() => setAddingToSuperset(addingToSuperset === item.id ? null : item.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {addingToSuperset === item.id ? "Selecciona ejercicio..." : "Agregar a superset"}
                            </Button>
                          )}

                          {/* Sets, Reps, Rest controls */}
                          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                            <div>
                              <Label className="text-xs text-muted-foreground">Series</Label>
                              <Input
                                type="number"
                                value={item.sets}
                                onChange={(e) => updateWorkoutItem(item.id, "sets", e.target.value)}
                                min="1"
                                className="h-9 mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Repeticiones</Label>
                              <Input
                                type="text"
                                value={item.reps}
                                onChange={(e) => updateWorkoutItem(item.id, "reps", e.target.value)}
                                placeholder="10-12"
                                className="h-9 mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Descanso (seg)</Label>
                              <Input
                                type="number"
                                value={item.restSeconds}
                                onChange={(e) => updateWorkoutItem(item.id, "restSeconds", e.target.value)}
                                min="0"
                                step="15"
                                className="h-9 mt-1"
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveWorkoutItem(index, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveWorkoutItem(index, "down")}
                                disabled={index === workoutItems.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWorkoutItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assign to Clients */}
            <Card>
              <CardHeader>
                <CardTitle>Asignar a Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {clients.filter((c) => c.status === "active").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay clientes activos</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {clients.filter((c) => c.status === "active").map((client) => (
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setWorkoutName("");
                  setWorkoutDescription("");
                  setProgramDurationWeeks(8);  // NEW: Reset to default
                  setScheduledDays([]);
                  setWorkoutItems([]);
                  setSelectedClients([]);
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveWorkout}
                disabled={isSubmitting || !workoutName || workoutItems.length === 0}
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

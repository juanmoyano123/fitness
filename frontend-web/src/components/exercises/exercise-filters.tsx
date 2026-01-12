"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchExerciseFilters, ExerciseFiltersMetadata } from "@/lib/api";
import { RefreshCw, Loader2 } from "lucide-react";

interface ExerciseFiltersProps {
  bodyPart: string;
  target: string;
  equipment: string;
  customOnly: boolean;
  onBodyPartChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onEquipmentChange: (value: string) => void;
  onCustomOnlyChange: (value: boolean) => void;
  onReset: () => void;
}

/**
 * F-031: Advanced Exercise Filters Component
 * Dynamic filters loaded from API with custom exercises toggle
 */
export function ExerciseFilters({
  bodyPart,
  target,
  equipment,
  customOnly,
  onBodyPartChange,
  onTargetChange,
  onEquipmentChange,
  onCustomOnlyChange,
  onReset,
}: ExerciseFiltersProps) {
  const [filters, setFilters] = useState<ExerciseFiltersMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      setIsLoading(true);
      const data = await fetchExerciseFilters();
      setFilters(data);
    } catch (error) {
      console.error("Error loading filters:", error);
      // Set default filters on error
      setFilters({
        bodyParts: ["back", "chest", "legs", "arms", "shoulders", "core"],
        targets: ["biceps", "triceps", "quadriceps", "hamstrings", "pectorals", "lats"],
        equipment: ["barbell", "dumbbell", "body weight", "cable", "machine"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveFilters =
    bodyPart !== "all" || target !== "all" || equipment !== "all" || customOnly;

  return (
    <div className="space-y-3">
      {/* Body Part Filter */}
      <Select value={bodyPart} onValueChange={onBodyPartChange} disabled={isLoading}>
        <SelectTrigger className="w-full h-9 text-xs">
          <SelectValue placeholder="Parte del cuerpo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las partes</SelectItem>
          {filters?.bodyParts.map((part) => (
            <SelectItem key={part} value={part} className="capitalize">
              {part}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Target Muscle Filter */}
      <Select value={target} onValueChange={onTargetChange} disabled={isLoading}>
        <SelectTrigger className="w-full h-9 text-xs">
          <SelectValue placeholder="Músculo objetivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los músculos</SelectItem>
          {filters?.targets.map((t) => (
            <SelectItem key={t} value={t} className="capitalize">
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Equipment Filter */}
      <Select value={equipment} onValueChange={onEquipmentChange} disabled={isLoading}>
        <SelectTrigger className="w-full h-9 text-xs">
          <SelectValue placeholder="Equipamiento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo el equipamiento</SelectItem>
          {filters?.equipment.map((eq) => (
            <SelectItem key={eq} value={eq} className="capitalize">
              {eq}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Only Toggle + Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="custom-only"
            checked={customOnly}
            onChange={(e) => onCustomOnlyChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="custom-only" className="text-xs font-medium cursor-pointer">
            Solo personalizados
          </Label>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}

        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

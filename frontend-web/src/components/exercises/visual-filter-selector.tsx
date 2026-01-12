"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dumbbell,
  Heart,
  Target,
  Footprints,
  User,
  Cog,
  Cable,
  Waves,
  CircleDot,
  Minus,
  MoreHorizontal,
  Waypoints,
  Zap,
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface VisualFilterSelectorProps {
  title: string;
  options: FilterOption[];
  selected: string | null;
  onChange: (value: string | null) => void;
  columns?: number;
}

// Grupos musculares con iconos SVG
export const BODY_PART_OPTIONS: FilterOption[] = [
  { value: "chest", label: "Pecho", icon: <Image src="/muscles/chest.png" alt="Pecho" width={45} height={45} className="object-contain" /> },
  { value: "back", label: "Espalda", icon: <Image src="/muscles/back.png" alt="Espalda" width={45} height={45} className="object-contain" /> },
  { value: "shoulders", label: "Hombros", icon: <Image src="/muscles/lateral.png" alt="Hombros" width={45} height={45} className="object-contain" /> },
  { value: "upper arms", label: "Brazos", icon: <Image src="/muscles/arms.png" alt="Brazos" width={45} height={45} className="object-contain" /> },
  { value: "upper legs", label: "Piernas", icon: <Image src="/muscles/legs.png" alt="Piernas" width={45} height={45} className="object-contain" /> },
  { value: "waist", label: "Core", icon: <Image src="/muscles/core.png" alt="Core" width={45} height={45} className="object-contain" /> },
  { value: "cardio", label: "Cardio", icon: <Heart className="h-5 w-5" /> },
];

// Equipamiento con iconos
export const EQUIPMENT_OPTIONS: FilterOption[] = [
  { value: "barbell", label: "Barra", icon: <Minus className="h-5 w-5" /> },
  { value: "dumbbell", label: "Mancuernas", icon: <MoreHorizontal className="h-5 w-5" /> },
  { value: "body weight", label: "Peso Corp.", icon: <User className="h-5 w-5" /> },
  { value: "machine", label: "Maquina", icon: <Cog className="h-5 w-5" /> },
  { value: "cable", label: "Cable", icon: <Cable className="h-5 w-5" /> },
  { value: "band", label: "Banda", icon: <Waves className="h-5 w-5" /> },
];

// Clasificaciones para filtros derivados
export const UPPER_BODY_PARTS = ["chest", "back", "shoulders", "upper arms", "lower arms", "neck"];
export const LOWER_BODY_PARTS = ["upper legs", "lower legs"];
export const CORE_BODY_PARTS = ["waist"];

export const PUSH_TARGETS = ["pectorals", "delts", "triceps", "serratus anterior", "chest"];
export const PULL_TARGETS = ["lats", "biceps", "traps", "rhomboids", "forearms", "upper back", "spine"];

/**
 * Visual filter selector with icon buttons
 */
export function VisualFilterSelector({
  title,
  options,
  selected,
  onChange,
  columns = 7,
}: VisualFilterSelectorProps) {
  const handleClick = (value: string) => {
    if (selected === value) {
      onChange(null); // Deselect
    } else {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(columns, options.length)}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleClick(option.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-all",
              "hover:bg-secondary/80 hover:border-primary/50",
              selected === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/30 text-muted-foreground border-border"
            )}
          >
            {option.icon}
            <span className="text-xs font-medium truncate w-full text-center">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

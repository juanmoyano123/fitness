"use client";

import { cn } from "@/lib/utils";

interface DaySelectorProps {
  value: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

const DAYS = [
  { value: 0, label: "L", full: "Lunes" },
  { value: 1, label: "M", full: "Martes" },
  { value: 2, label: "X", full: "Miercoles" },
  { value: 3, label: "J", full: "Jueves" },
  { value: 4, label: "V", full: "Viernes" },
  { value: 5, label: "S", full: "Sabado" },
  { value: 6, label: "D", full: "Domingo" },
];

/**
 * DaySelector - Checkbox-style day picker
 * Uses 0=Monday, 6=Sunday format
 */
export function DaySelector({
  value,
  onChange,
  disabled = false,
  size = "md",
}: DaySelectorProps) {
  const toggleDay = (day: number) => {
    if (disabled) return;

    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day].sort((a, b) => a - b));
    }
  };

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
  };

  return (
    <div className="flex gap-1">
      {DAYS.map((day) => (
        <button
          key={day.value}
          type="button"
          onClick={() => toggleDay(day.value)}
          disabled={disabled}
          title={day.full}
          className={cn(
            "rounded-full font-medium transition-colors",
            sizeClasses[size],
            value.includes(day.value)
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}

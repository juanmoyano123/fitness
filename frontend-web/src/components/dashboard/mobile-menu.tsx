"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Dumbbell,
  ClipboardList,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Mis Clientes", href: "/dashboard/clients", icon: Users },
  {
    name: "Biblioteca Ejercicios",
    href: "/dashboard/exercises",
    icon: Dumbbell,
  },
  { name: "Crear Workout", href: "/dashboard/workouts", icon: ClipboardList },
  { name: "Progreso & Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 z-50" />
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative mr-16 flex w-full max-w-xs flex-1">
          <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="-m-2.5"
            >
              <span className="sr-only">Cerrar menú</span>
              <X className="h-6 w-6 text-foreground" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-secondary px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center mt-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={onClose}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-semibold text-foreground">
                  FitCompass Pro
                </span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-colors"
                            )}
                          >
                            <item.icon
                              className={cn(
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground group-hover:text-foreground",
                                "h-5 w-5 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  Dumbbell,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useTrainerStore } from '@/lib/stores/trainer-store'

const navigation = [
  {
    name: 'Clientes',
    href: '/dashboard/clientes',
    icon: Users,
  },
  {
    name: 'Biblioteca de Ejercicios',
    href: '/dashboard/ejercicios',
    icon: Dumbbell,
  },
  {
    name: 'Calendario',
    href: '/dashboard/calendario',
    icon: Calendar,
    disabled: true,
  },
  {
    name: 'Estadísticas',
    href: '/dashboard/estadisticas',
    icon: BarChart3,
    disabled: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const trainer = useTrainerStore((state) => state.trainer)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">FitCompass</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  item.disabled && 'pointer-events-none opacity-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User section */}
      <div className="p-4">
        <div className="mb-3 rounded-lg bg-accent p-3">
          <p className="text-sm font-medium">{trainer?.fullName || 'Demo Trainer'}</p>
          <p className="text-xs text-muted-foreground">{trainer?.email || ''}</p>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            disabled
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              // Clear trainer and reload
              useTrainerStore.getState().clearTrainer()
              window.location.href = '/'
            }}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </div>
  )
}

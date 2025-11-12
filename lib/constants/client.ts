import { ClientStatus } from '@/types/client'

export const CLIENT_STATUS_OPTIONS = [
  { value: 'active' as ClientStatus, label: 'Activo' },
  { value: 'paused' as ClientStatus, label: 'Pausado' },
  { value: 'inactive' as ClientStatus, label: 'Inactivo' },
] as const

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Activo',
  paused: 'Pausado',
  inactive: 'Inactivo',
}

export const DEFAULT_CLIENT_STATUS: ClientStatus = 'active'

import { Client } from '@/lib/db/schema'
import { ClientWithMeta } from '@/types/client'

export function getClientInitials(fullName: string): string {
  const names = fullName.trim().split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return names[0].slice(0, 2).toUpperCase()
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-700 dark:text-green-400'
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'inactive':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    default:
      return 'bg-gray-500/10 text-gray-700'
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Activo'
    case 'paused':
      return 'Pausado'
    case 'inactive':
      return 'Inactivo'
    default:
      return status
  }
}

export function enrichClientWithMeta(client: Client): ClientWithMeta {
  return {
    ...client,
    initials: getClientInitials(client.fullName),
    lastActivityText: 'Hace 2 días', // TODO: Calculate from actual data
  }
}

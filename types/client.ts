import { Client } from '@/lib/db/schema'

export type ClientStatus = 'active' | 'paused' | 'inactive'

export type ClientWithMeta = Client & {
  lastActivityText?: string
  initials: string
}

export type CreateClientInput = {
  fullName: string
  email?: string
  phone?: string
  status?: ClientStatus
  notes?: string
}

export type UpdateClientInput = Partial<CreateClientInput>

export type ClientFilters = {
  search?: string
  status?: ClientStatus
  sortBy?: 'name' | 'date' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export type ClientsViewMode = 'table' | 'grid'

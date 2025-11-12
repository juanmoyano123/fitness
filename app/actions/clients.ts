'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientCount,
} from '@/lib/db/queries/clients'
import { ClientFilters } from '@/types/client'
import { getUser } from '@/lib/supabase/auth'

// Validation schemas
const createClientSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['active', 'paused', 'inactive']).optional(),
  notes: z.string().optional(),
})

const updateClientSchema = createClientSchema.partial()

// Action result type
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
}

// Helper to verify authentication and trainer ownership
async function verifyAuth(trainerId: string): Promise<ActionResult | null> {
  const { user, error } = await getUser()

  if (error || !user) {
    return { success: false, error: 'No autenticado' }
  }

  if (user.id !== trainerId) {
    return { success: false, error: 'No autorizado' }
  }

  return null // No error, auth verified
}

// Get all clients
export async function getClientsAction(
  trainerId: string,
  filters?: ClientFilters
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const clients = await getClients(trainerId, filters)
    return { success: true, data: clients }
  } catch (error) {
    return { success: false, error: 'Failed to fetch clients' }
  }
}

// Get client by ID
export async function getClientAction(
  clientId: string,
  trainerId: string
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const client = await getClientById(clientId, trainerId)
    if (!client) {
      return { success: false, error: 'Client not found' }
    }
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: 'Failed to fetch client' }
  }
}

// Create client
export async function createClientAction(
  trainerId: string,
  formData: FormData
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as 'active' | 'paused' | 'inactive',
      notes: formData.get('notes') as string,
    }

    const validated = createClientSchema.parse(rawData)
    const client = await createClient(trainerId, validated)

    revalidatePath('/dashboard/clientes')
    return { success: true, data: client }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to create client' }
  }
}

// Update client
export async function updateClientAction(
  clientId: string,
  trainerId: string,
  formData: FormData
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as 'active' | 'paused' | 'inactive',
      notes: formData.get('notes') as string,
    }

    const validated = updateClientSchema.parse(rawData)
    const client = await updateClient(clientId, trainerId, validated)

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    revalidatePath('/dashboard/clientes')
    revalidatePath(`/dashboard/clientes/${clientId}`)
    return { success: true, data: client }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to update client' }
  }
}

// Delete client (soft delete)
export async function deleteClientAction(
  clientId: string,
  trainerId: string
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const client = await deleteClient(clientId, trainerId)

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    revalidatePath('/dashboard/clientes')
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: 'Failed to delete client' }
  }
}

// Get client count
export async function getClientCountAction(
  trainerId: string
): Promise<ActionResult> {
  const authError = await verifyAuth(trainerId)
  if (authError) return authError

  try {
    const count = await getClientCount(trainerId)
    return { success: true, data: count }
  } catch (error) {
    return { success: false, error: 'Failed to get client count' }
  }
}

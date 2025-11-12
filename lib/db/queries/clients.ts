import { eq, and, isNull, or, ilike, desc, asc, sql } from 'drizzle-orm'
import { db } from '../client'
import { clients, Client } from '../schema'
import { CreateClientInput, UpdateClientInput, ClientFilters } from '@/types/client'

// Get all clients for a trainer (excluding soft-deleted)
export async function getClients(trainerId: string, filters?: ClientFilters) {
  let query = db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.trainerId, trainerId),
        isNull(clients.deletedAt)
      )
    )
    .$dynamic()

  // Apply filters
  if (filters) {
    const conditions = []

    // Status filter
    if (filters.status) {
      conditions.push(eq(clients.status, filters.status))
    }

    // Search filter (name or email)
    if (filters.search) {
      conditions.push(
        or(
          ilike(clients.fullName, `%${filters.search}%`),
          ilike(clients.email, `%${filters.search}%`)
        )
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    // Sorting
    if (filters.sortBy === 'name') {
      query = query.orderBy(
        filters.sortOrder === 'desc'
          ? desc(clients.fullName)
          : asc(clients.fullName)
      )
    } else if (filters.sortBy === 'date') {
      query = query.orderBy(
        filters.sortOrder === 'desc'
          ? desc(clients.createdAt)
          : asc(clients.createdAt)
      )
    } else if (filters.sortBy === 'status') {
      query = query.orderBy(
        filters.sortOrder === 'desc'
          ? desc(clients.status)
          : asc(clients.status)
      )
    }
  } else {
    // Default sort by creation date
    query = query.orderBy(desc(clients.createdAt))
  }

  return await query
}

// Get a single client by ID
export async function getClientById(clientId: string, trainerId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.trainerId, trainerId),
        isNull(clients.deletedAt)
      )
    )
    .limit(1)

  return client
}

// Create a new client
export async function createClient(trainerId: string, input: CreateClientInput) {
  const [client] = await db
    .insert(clients)
    .values({
      trainerId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      status: input.status || 'active',
      notes: input.notes,
    })
    .returning()

  return client
}

// Update a client
export async function updateClient(
  clientId: string,
  trainerId: string,
  input: UpdateClientInput
) {
  const [client] = await db
    .update(clients)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.trainerId, trainerId),
        isNull(clients.deletedAt)
      )
    )
    .returning()

  return client
}

// Soft delete a client
export async function deleteClient(clientId: string, trainerId: string) {
  const [client] = await db
    .update(clients)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clients.id, clientId),
        eq(clients.trainerId, trainerId),
        isNull(clients.deletedAt)
      )
    )
    .returning()

  return client
}

// Get client count for a trainer
export async function getClientCount(trainerId: string) {
  const [result] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(clients)
    .where(
      and(
        eq(clients.trainerId, trainerId),
        isNull(clients.deletedAt)
      )
    )

  return result?.count || 0
}

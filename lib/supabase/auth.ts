'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If sign up successful, create trainer record in our database
  if (data.user) {
    try {
      const { db } = await import('@/lib/db/client')
      const { trainers } = await import('@/lib/db/schema')

      await db.insert(trainers).values({
        id: data.user.id,
        email: data.user.email!,
        fullName,
      })
    } catch (dbError) {
      console.error('Error creating trainer record:', dbError)
      return { error: 'Error al crear el perfil del entrenador' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Get the current authenticated user
 */
export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return { user: null, error: error.message }
  }

  return { user, error: null }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = await createClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    return { session: null, error: error.message }
  }

  return { session, error: null }
}

/**
 * Get the current trainer data (from our database)
 */
export async function getCurrentTrainer() {
  const { user, error } = await getUser()

  if (error || !user) {
    return { trainer: null, error: error || 'No hay usuario autenticado' }
  }

  try {
    const { db } = await import('@/lib/db/client')
    const { trainers } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    const [trainer] = await db.select().from(trainers).where(eq(trainers.id, user.id))

    if (!trainer) {
      return { trainer: null, error: 'Perfil de entrenador no encontrado' }
    }

    return { trainer, error: null }
  } catch (dbError) {
    console.error('Error fetching trainer:', dbError)
    return { trainer: null, error: 'Error al obtener el perfil del entrenador' }
  }
}

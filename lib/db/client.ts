import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Verify environment variable exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL no está configurada. Por favor, actualiza tu archivo .env.local con las credenciales de Supabase.'
  )
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL

// Create postgres client
const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless environments
  prepare: false, // Disable prepared statements for Supabase compatibility
})

// Create drizzle instance
export const db = drizzle(client, { schema })

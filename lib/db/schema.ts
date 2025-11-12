import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Trainers table
export const trainers = sqliteTable('trainers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

// Clients table
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  trainerId: text('trainer_id')
    .references(() => trainers.id)
    .notNull(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  status: text('status', { enum: ['active', 'paused', 'inactive'] })
    .default('active')
    .notNull(),
  notes: text('notes'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft delete
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

// Export types
export type Trainer = typeof trainers.$inferSelect
export type InsertTrainer = typeof trainers.$inferInsert
export type Client = typeof clients.$inferSelect
export type InsertClient = typeof clients.$inferInsert

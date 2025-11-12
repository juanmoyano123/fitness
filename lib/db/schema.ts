import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Trainers table - Now compatible with Supabase auth.users
export const trainers = pgTable('trainers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Clients table
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  trainerId: uuid('trainer_id')
    .references(() => trainers.id)
    .notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  status: varchar('status', { length: 20 })
    .$type<'active' | 'paused' | 'inactive'>()
    .default('active')
    .notNull(),
  notes: text('notes'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Export types
export type Trainer = typeof trainers.$inferSelect
export type InsertTrainer = typeof trainers.$inferInsert
export type Client = typeof clients.$inferSelect
export type InsertClient = typeof clients.$inferInsert

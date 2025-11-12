import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Trainer as DBTrainer } from '@/lib/db/schema'

// Simplified trainer type for the store
export interface Trainer {
  id: string
  email: string
  fullName: string
  createdAt: string
}

interface TrainerStore {
  trainer: Trainer | null
  setTrainer: (trainer: Trainer | DBTrainer) => void
  clearTrainer: () => void
}

export const useTrainerStore = create<TrainerStore>()(
  persist(
    (set) => ({
      trainer: null,

      setTrainer: (trainer) => {
        // Convert DBTrainer to store Trainer if needed
        const storeTrainer: Trainer = {
          id: trainer.id,
          email: trainer.email,
          fullName: trainer.fullName,
          createdAt: typeof trainer.createdAt === 'string'
            ? trainer.createdAt
            : trainer.createdAt.toISOString(),
        }
        set({ trainer: storeTrainer })
      },

      clearTrainer: () => set({ trainer: null }),
    }),
    {
      name: 'fitcompass-trainer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

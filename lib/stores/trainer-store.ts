import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Trainer {
  id: string
  email: string
  fullName: string
  createdAt: string
}

interface TrainerStore {
  trainer: Trainer | null
  isInitialized: boolean
  setTrainer: (trainer: Trainer) => void
  clearTrainer: () => void
  initializeTrainer: () => void
}

// Generate a mock trainer with UUID
const generateMockTrainer = (): Trainer => {
  const id = crypto.randomUUID()
  return {
    id,
    email: `trainer-${id.slice(0, 8)}@fitcompass.pro`,
    fullName: 'Demo Trainer',
    createdAt: new Date().toISOString(),
  }
}

export const useTrainerStore = create<TrainerStore>()(
  persist(
    (set, get) => ({
      trainer: null,
      isInitialized: false,

      setTrainer: (trainer) => set({ trainer, isInitialized: true }),

      clearTrainer: () => set({ trainer: null, isInitialized: true }),

      initializeTrainer: () => {
        const { trainer, isInitialized } = get()

        // Only initialize once
        if (isInitialized) return

        // If no trainer exists, create a new one
        if (!trainer) {
          const newTrainer = generateMockTrainer()
          set({ trainer: newTrainer, isInitialized: true })
        } else {
          set({ isInitialized: true })
        }
      },
    }),
    {
      name: 'fitcompass-trainer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

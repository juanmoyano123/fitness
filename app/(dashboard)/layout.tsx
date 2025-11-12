'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'
import { useTrainerStore } from '@/lib/stores/trainer-store'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const { trainer, setTrainer } = useTrainerStore()

  // Fetch trainer data when user is available
  useEffect(() => {
    const fetchTrainer = async () => {
      if (user && !trainer) {
        try {
          // Import getCurrentTrainer dynamically to avoid circular dependencies
          const { getCurrentTrainer } = await import('@/lib/supabase/auth')
          const result = await getCurrentTrainer()

          if (result.trainer) {
            setTrainer(result.trainer)
          }
        } catch (error) {
          console.error('Error fetching trainer:', error)
        }
      }
    }

    fetchTrainer()
  }, [user, trainer, setTrainer])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="flex h-16 items-center border-b px-4 md:hidden">
          <MobileSidebar />
          <div className="ml-4 flex items-center gap-2">
            <span className="text-lg font-bold">FitCompass</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

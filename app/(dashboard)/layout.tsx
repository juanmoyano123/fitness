'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'
import { useTrainerStore } from '@/lib/stores/trainer-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initializeTrainer = useTrainerStore((state) => state.initializeTrainer)

  // Initialize trainer on mount
  useEffect(() => {
    initializeTrainer()
  }, [initializeTrainer])

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

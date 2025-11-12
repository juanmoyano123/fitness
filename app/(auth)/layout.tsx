import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FitCompass Pro - Autenticación',
  description: 'Sistema de gestión para entrenadores personales',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </body>
    </html>
  )
}

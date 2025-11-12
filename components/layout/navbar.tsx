'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const navigation = [
  { name: 'Funcionalidades', href: '#features' },
  { name: 'Precios', href: '#pricing' },
  { name: 'Testimonios', href: '#testimonials' },
  { name: 'Demo', href: '#demo' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
        : 'bg-transparent'
      }
    `}>
      <div className="container-xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-h5 font-bold ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
              FitCompass Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  text-button transition-colors duration-200
                  ${isScrolled
                    ? 'text-neutral-700 hover:text-neutral-900'
                    : 'text-neutral-200 hover:text-white'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className={`
                  ${isScrolled
                    ? 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                Comenzar Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              lg:hidden w-10 h-10 rounded-lg flex items-center justify-center
              transition-colors duration-200
              ${isScrolled
                ? 'text-neutral-700 hover:bg-neutral-100'
                : 'text-white hover:bg-white/10'
              }
            `}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 shadow-lg">
          <div className="container-xl mx-auto px-6 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-button text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

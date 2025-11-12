'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-900">
      {/* Background Pattern/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`
            space-y-8 text-center lg:text-left
            transition-all duration-700 delay-100
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            {/* Overline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-caption text-primary-400 font-semibold uppercase tracking-wider">
                Plataforma #1 para Entrenadores en LATAM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl text-white font-display">
              Transforma Tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Entrenamiento
              </span>{' '}
              Con FitCompass Pro
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg md:text-xl text-neutral-300 max-w-2xl mx-auto lg:mx-0">
              La plataforma todo-en-uno para entrenadores personales que quieren
              <span className="text-white font-semibold"> escalar su negocio</span>,
              organizar clientes y hacer seguimiento profesional.
            </p>

            {/* Benefits List */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-body">Gratis hasta 5 clientes</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-body">Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-body">Setup en 5 minutos</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="
                  bg-primary-500 hover:bg-primary-600 text-white
                  shadow-primary hover:shadow-lg hover:shadow-primary
                  transition-all duration-300 hover:scale-105
                  text-button-lg px-8 py-6 h-auto
                "
              >
                Comenzar Gratis Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="
                  border-2 border-neutral-600 text-white hover:bg-neutral-800
                  hover:border-neutral-500 transition-all duration-300
                  text-button-lg px-8 py-6 h-auto
                "
              >
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>

            {/* Trust Signal */}
            <p className="text-body-sm text-neutral-500 text-center lg:text-left">
              Confiado por más de <span className="text-primary-400 font-semibold">500+ entrenadores</span> en toda Latinoamérica
            </p>
          </div>

          {/* Right Column - Visual/Dashboard Preview */}
          <div className={`
            relative
            transition-all duration-700 delay-300
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            <div className="relative aspect-square max-w-2xl mx-auto">
              {/* Dashboard Mockup */}
              <div className="
                absolute inset-0 rounded-3xl overflow-hidden
                border border-neutral-700/50
                shadow-2xl shadow-primary-500/10
                bg-gradient-to-br from-neutral-800 to-neutral-900
              ">
                {/* Placeholder for Dashboard Screenshot */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-neutral-400 text-body">Dashboard Preview</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-neutral-800 border border-neutral-700 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-h4 text-white font-semibold">142</p>
                    <p className="text-body-sm text-neutral-400">Clientes Activos</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-neutral-800 border border-neutral-700 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-h4 text-white font-semibold">+38%</p>
                    <p className="text-body-sm text-neutral-400">Crecimiento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
        </div>
      </div>
    </section>
  )
}

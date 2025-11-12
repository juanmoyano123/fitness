'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="relative z-10 container-xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/20 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-primary-400" />
          </div>

          {/* Heading */}
          <h2 className="text-display-lg md:text-display-xl text-white font-display">
            Empieza a Gestionar{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Profesionalmente Hoy
            </span>
          </h2>

          {/* Description */}
          <p className="text-body-lg md:text-xl text-neutral-300 max-w-2xl mx-auto">
            Únete a cientos de entrenadores que ya están transformando su negocio
            con FitCompass Pro. Prueba gratis por 14 días, sin tarjeta de crédito.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="
                w-full sm:w-auto
                bg-primary-500 hover:bg-primary-600 text-white
                shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40
                transition-all duration-300 hover:scale-105
                text-button-lg px-8 py-6 h-auto
              "
            >
              Crear Cuenta Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="
                w-full sm:w-auto
                border-2 border-neutral-600 bg-neutral-800/50 text-white
                hover:bg-neutral-700/50 hover:border-neutral-500
                transition-all duration-300
                text-button-lg px-8 py-6 h-auto
              "
            >
              Ver Planes
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-neutral-300 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">14 días gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">Sin tarjeta requerida</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">Cancela cuando quieras</span>
            </div>
          </div>

          {/* Trust Signal */}
          <p className="text-body-sm text-neutral-500 pt-4">
            Más de 500 entrenadores ya confían en FitCompass Pro
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="relative z-10 container-xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h2 className="text-display-lg md:text-display-xl text-white font-display">
            ¿Listo Para Transformar Tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Negocio Fitness?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-body-lg md:text-xl text-neutral-300 max-w-2xl mx-auto">
            Únete a cientos de entrenadores que ya escalaron su negocio con FitCompass Pro.
            Comienza gratis hoy mismo.
          </p>

          {/* Benefits List */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-neutral-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">Setup en 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-body">Cancela cuando quieras</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="
                bg-primary-500 hover:bg-primary-600 text-white
                shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40
                transition-all duration-300 hover:scale-105
                text-button-lg px-10 py-7 h-auto text-lg
              "
            >
              Comenzar Gratis Ahora
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>

          {/* Trust Signal */}
          <p className="text-body-sm text-neutral-500">
            Más de 500 entrenadores ya confían en FitCompass Pro
          </p>

          {/* Testimonial Quote */}
          <div className="pt-12 border-t border-neutral-700/50">
            <div className="max-w-2xl mx-auto">
              <p className="text-body-lg text-neutral-300 italic mb-4">
                "La mejor inversión que hice para mi negocio. En 3 meses recuperé
                el tiempo que perdía en Excel y pude tomar 15 clientes más."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                  CM
                </div>
                <div className="text-left">
                  <div className="text-body font-semibold text-white">
                    Carlos Martínez
                  </div>
                  <div className="text-body-sm text-neutral-500">
                    Entrenador Personal, Ciudad de México
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

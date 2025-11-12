'use client'

import { howItWorksSteps } from '@/lib/mockdata/landing'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
            <span className="text-caption text-primary-600 font-semibold uppercase tracking-wider">
              Cómo Funciona
            </span>
          </div>

          <h2 className="text-h1 md:text-display-lg text-neutral-900 font-display">
            Empieza en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              3 pasos simples
            </span>
          </h2>

          <p className="text-body-lg text-neutral-600">
            Estarás gestionando a tus clientes profesionalmente en menos de 10 minutos
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection line (desktop) */}
            <div className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-primary-500 to-primary-700 lg:block" />

            <div className="space-y-12">
              {howItWorksSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* Step number */}
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30">
                      <span className="text-h3 font-bold">{step.step}</span>
                    </div>

                    {/* Step content */}
                    <div className="flex-1 rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-md hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
                      <h3 className="mb-3 text-h3 font-semibold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="text-body-lg text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow indicator (mobile) */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="mt-6 flex justify-center lg:hidden">
                      <ArrowRight className="w-6 h-6 rotate-90 text-primary-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA at bottom */}
          <div className="mt-16 text-center space-y-4">
            <p className="text-body-lg font-medium text-neutral-900">
              ¿Listo para profesionalizar tu negocio?
            </p>
            <Button
              size="lg"
              className="
                bg-primary-500 hover:bg-primary-600 text-white
                shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40
                transition-all duration-300 hover:scale-105
                text-button-lg px-8 py-6 h-auto
              "
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

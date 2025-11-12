'use client'

import { Check, Sparkles, Zap, Crown, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    tagline: 'Perfecto para comenzar',
    icon: Sparkles,
    price: 0,
    period: 'siempre',
    limit: 'Hasta 5 clientes',
    features: [
      'Constructor de rutinas ilimitado',
      'Biblioteca de +500 ejercicios',
      'Gestión de clientes básica',
      'Calendario de programación',
      'App móvil para clientes',
    ],
    cta: 'Comenzar Gratis',
    highlighted: false,
    popular: false,
  },
  {
    name: 'Growth',
    tagline: 'Para entrenadores en crecimiento',
    icon: Zap,
    price: 19,
    period: 'mes',
    limit: 'Hasta 20 clientes',
    features: [
      'Todo de Starter, más:',
      'Dashboard de seguimiento avanzado',
      'Métricas de rendimiento detalladas',
      'Notificaciones automáticas',
      'Check-ins semanales',
      'Soporte prioritario',
    ],
    cta: 'Elegir Growth',
    highlighted: false,
    popular: true,
  },
  {
    name: 'Professional',
    tagline: 'Para negocios establecidos',
    icon: Crown,
    price: 49,
    period: 'mes',
    limit: 'Hasta 50 clientes',
    features: [
      'Todo de Growth, más:',
      'Branding personalizado',
      'Análisis con IA',
      'Integración con wearables',
      'API para integraciones',
      'Planes nutricionales',
      'Soporte VIP 24/7',
    ],
    cta: 'Elegir Professional',
    highlighted: true,
    popular: false,
  },
  {
    name: 'Enterprise',
    tagline: 'Para gimnasios y equipos',
    icon: Building2,
    price: 99,
    period: 'mes',
    limit: 'Clientes ilimitados',
    features: [
      'Todo de Professional, más:',
      'Múltiples entrenadores',
      'Permisos y roles',
      'White-label completo',
      'Cuenta manager dedicado',
      'Capacitación personalizada',
      'SLA garantizado',
    ],
    cta: 'Contactar Ventas',
    highlighted: false,
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
            <span className="text-caption text-primary-600 font-semibold uppercase tracking-wider">
              Precios Transparentes
            </span>
          </div>

          <h2 className="text-h1 md:text-display-lg text-neutral-900 font-display">
            Planes Para Cada Etapa De{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              Crecimiento
            </span>
          </h2>

          <p className="text-body-lg text-neutral-600">
            Comienza gratis y escala cuando tu negocio crezca. Sin contratos, cancela cuando quieras.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon

            return (
              <div
                key={index}
                className={`
                  relative p-8 rounded-3xl
                  transition-all duration-300 hover:-translate-y-2
                  ${plan.highlighted
                    ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-2xl scale-105 border-2 border-primary-500'
                    : 'bg-white border-2 border-neutral-200 hover:border-neutral-300 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-caption font-semibold shadow-lg">
                    Más Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`
                    inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4
                    ${plan.highlighted ? 'bg-primary-500/20' : 'bg-neutral-100'}
                  `}>
                    <Icon className={`w-7 h-7 ${plan.highlighted ? 'text-primary-400' : 'text-neutral-700'}`} />
                  </div>

                  <h3 className={`text-h3 font-semibold mb-2 ${plan.highlighted ? 'text-white' : 'text-neutral-900'}`}>
                    {plan.name}
                  </h3>

                  <p className={`text-body-sm ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6 pb-6 border-b border-neutral-200/20">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-body-lg ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      $
                    </span>
                    <span className={`text-display-lg font-bold ${plan.highlighted ? 'text-white' : 'text-neutral-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-body ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-body-sm mt-2 font-medium ${plan.highlighted ? 'text-primary-400' : 'text-neutral-700'}`}>
                    {plan.limit}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-primary-400' : 'text-primary-500'}`} />
                      <span className={`text-body-sm ${plan.highlighted ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`
                    w-full h-12 rounded-xl font-semibold transition-all duration-300
                    ${plan.highlighted
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40'
                      : plan.price === 0
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      : 'bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-900 hover:border-neutral-700'
                    }
                  `}
                >
                  {plan.cta}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-body text-neutral-600">
            Todos los planes incluyen <span className="font-semibold text-neutral-900">14 días de prueba gratis</span> sin tarjeta de crédito
          </p>
          <p className="text-body-sm text-neutral-500">
            ¿Tienes más de 50 clientes? Contáctanos para un plan personalizado
          </p>
        </div>
      </div>
    </section>
  )
}

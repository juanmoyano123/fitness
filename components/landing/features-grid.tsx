'use client'

import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Library,
  Calendar,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Rutinas Inteligentes',
    description: 'Crea planes de entrenamiento personalizados en minutos. Duplica y adapta rutinas entre clientes con un click.',
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Clientes Organizados',
    description: 'Gestiona tu base de datos de alumnos. Perfiles completos con objetivos, historial y notas personalizadas.',
    color: 'secondary',
  },
  {
    icon: TrendingUp,
    title: 'Seguimiento en Tiempo Real',
    description: 'Ve quién entrena y progresa en tiempo real. Dashboard con métricas de adherencia y rendimiento.',
    color: 'primary',
  },
  {
    icon: Library,
    title: 'Biblioteca de Ejercicios',
    description: 'Más de 500 ejercicios pre-cargados con videos. Agrega tus propios ejercicios custom con facilidad.',
    color: 'brand',
  },
  {
    icon: Calendar,
    title: 'Calendario Inteligente',
    description: 'Programa sesiones y envía notificaciones automáticas. Vista mensual de todos tus clientes en un vistazo.',
    color: 'secondary',
  },
  {
    icon: Smartphone,
    title: 'App Móvil para Clientes',
    description: 'Tus clientes entrenan con su app dedicada. Timer integrado, registro de series y progreso automático.',
    color: 'primary',
  },
]

const colorVariants = {
  primary: {
    icon: 'bg-primary-500/10 text-primary-500',
    hover: 'group-hover:shadow-primary',
  },
  secondary: {
    icon: 'bg-secondary-500/10 text-secondary-500',
    hover: 'group-hover:shadow-secondary',
  },
  brand: {
    icon: 'bg-brand-300/10 text-brand-600',
    hover: 'group-hover:shadow-brand',
  },
}

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="container-xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
            <span className="text-caption text-primary-600 font-semibold uppercase tracking-wider">
              Plataforma Completa
            </span>
          </div>

          <h2 className="text-h1 md:text-display-lg text-neutral-900 font-display">
            Todo Lo Que Necesitas En{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              Una Plataforma
            </span>
          </h2>

          <p className="text-body-lg text-neutral-600">
            Desde la creación de rutinas hasta el seguimiento de resultados.
            FitCompass Pro te da todas las herramientas para llevar tu negocio al siguiente nivel.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colors = colorVariants[feature.color as keyof typeof colorVariants]

            return (
              <div
                key={index}
                className="
                  group relative p-8 rounded-2xl
                  bg-white border border-neutral-200
                  hover:border-neutral-300
                  shadow-sm hover:shadow-lg
                  transition-all duration-300 hover:-translate-y-1
                "
              >
                {/* Icon */}
                <div className={`
                  inline-flex items-center justify-center
                  w-14 h-14 rounded-xl mb-6
                  transition-transform duration-300 group-hover:scale-110
                  ${colors.icon}
                `}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-h4 text-neutral-900 font-semibold mb-3">
                  {feature.title}
                </h3>

                <p className="text-body text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl
                  bg-gradient-to-r from-transparent via-primary-500 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                `} />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-body-lg text-neutral-600 mb-6">
            ¿Quieres ver todas las funcionalidades en acción?
          </p>
          <button className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-neutral-900 text-white hover:bg-neutral-800
            transition-colors duration-300
            text-button font-semibold
          ">
            Explorar Funcionalidades Completas
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

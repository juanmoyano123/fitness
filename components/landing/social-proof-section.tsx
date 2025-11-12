'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos Martínez',
    role: 'Entrenador Personal',
    location: 'Ciudad de México',
    avatar: '/avatars/carlos.jpg',
    rating: 5,
    text: 'FitCompass transformó completamente mi forma de trabajar. Pasé de tener notas en Excel a una plataforma profesional que me permite gestionar 35 clientes sin estrés.',
  },
  {
    name: 'María Rodríguez',
    role: 'Preparadora Física',
    location: 'Buenos Aires',
    avatar: '/avatars/maria.jpg',
    rating: 5,
    text: 'Mis clientes aman la app móvil. Ahora completan sus rutinas consistentemente y puedo ver su progreso en tiempo real. Mi tasa de retención subió un 40%.',
  },
  {
    name: 'Juan Pablo Sánchez',
    role: 'Dueño de Gimnasio',
    location: 'Bogotá',
    avatar: '/avatars/juan.jpg',
    rating: 5,
    text: 'Como gimnasio, necesitábamos una solución para nuestros 8 entrenadores. FitCompass Enterprise nos dio exactamente lo que necesitábamos con branding personalizado.',
  },
]

const stats = [
  { value: '500+', label: 'Entrenadores Activos' },
  { value: '12K+', label: 'Clientes Entrenando' },
  { value: '98%', label: 'Satisfacción' },
  { value: '2M+', label: 'Workouts Completados' },
]

export function SocialProofSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="relative z-10 container-xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
            <span className="text-caption text-primary-400 font-semibold uppercase tracking-wider">
              Testimonios
            </span>
          </div>

          <h2 className="text-h1 md:text-display-lg text-white font-display">
            Confiado Por Entrenadores En{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Toda LATAM
            </span>
          </h2>

          <p className="text-body-lg text-neutral-400">
            Más de 500 entrenadores ya transformaron su negocio con FitCompass Pro
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-display-lg md:text-display-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-body text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="
                relative p-8 rounded-2xl
                bg-neutral-800 border border-neutral-700
                hover:border-neutral-600
                transition-all duration-300 hover:-translate-y-1
                hover:shadow-xl hover:shadow-primary-500/10
              "
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-primary-500" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary-500 text-primary-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-body text-neutral-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-body font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-body-sm text-neutral-500">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-body-lg text-neutral-400 mb-6">
            ¿Quieres ser el próximo caso de éxito?
          </p>
          <button className="
            inline-flex items-center gap-2 px-8 py-4 rounded-xl
            bg-primary-500 hover:bg-primary-600 text-white
            shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40
            transition-all duration-300 hover:scale-105
            text-button-lg font-semibold
          ">
            Comenzar Gratis Ahora
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

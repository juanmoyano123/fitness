// Mockdata para Landing Page - FitCompass Pro

export interface Feature {
  id: string
  title: string
  description: string
  icon: string // Nombre del icono de Lucide
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  maxClients: number | 'unlimited'
  features: string[]
  highlighted?: boolean
  cta: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
}

// Features principales
export const landingFeatures: Feature[] = [
  {
    id: 'workout-builder',
    title: 'Constructor de Rutinas',
    description:
      'Crea planes de entrenamiento personalizados en minutos. Duplica, adapta y asigna rutinas entre clientes fácilmente.',
    icon: 'Dumbbell',
  },
  {
    id: 'client-management',
    title: 'Gestión de Clientes',
    description:
      'Administra tu cartera completa de clientes. Perfiles detallados, objetivos, historial y seguimiento en tiempo real.',
    icon: 'Users',
  },
  {
    id: 'mobile-app',
    title: 'App Móvil para Clientes',
    description:
      'Tus clientes ven sus rutinas en una app intuitiva. Marcan ejercicios completados y tú ves su progreso al instante.',
    icon: 'Smartphone',
  },
]

// Planes de pricing
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    period: 'mes',
    maxClients: 3,
    features: [
      'Hasta 3 clientes',
      'Rutinas ilimitadas',
      'Biblioteca de ejercicios',
      'App móvil para clientes',
      'Soporte por email',
    ],
    cta: 'Empezar Gratis',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    currency: 'USD',
    period: 'mes',
    maxClients: 10,
    features: [
      'Hasta 10 clientes',
      'Todo de Free +',
      'Dashboard de seguimiento',
      'Exportar reportes',
      'Soporte prioritario',
    ],
    cta: 'Probar 14 días gratis',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    currency: 'USD',
    period: 'mes',
    maxClients: 30,
    highlighted: true,
    features: [
      'Hasta 30 clientes',
      'Todo de Starter +',
      'Check-ins semanales',
      'Calendario de programación',
      'Análisis de rendimiento',
      'Integraciones avanzadas',
    ],
    cta: 'Probar 14 días gratis',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 89,
    currency: 'USD',
    period: 'mes',
    maxClients: 100,
    features: [
      'Hasta 100 clientes',
      'Todo de Pro +',
      'White label (tu marca)',
      'Múltiples entrenadores',
      'API acceso',
      'Soporte dedicado 24/7',
    ],
    cta: 'Contactar Ventas',
  },
]

// Testimonios
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    role: 'Entrenador Personal - Buenos Aires',
    avatar: '/avatars/juan.jpg',
    content:
      'FitCompass cambió completamente mi forma de trabajar. Antes pasaba horas en Excel creando rutinas. Ahora en 5 minutos tengo todo listo y mis clientes están más comprometidos que nunca.',
    rating: 5,
  },
  {
    id: '2',
    name: 'María González',
    role: 'Preparadora Física - Ciudad de México',
    avatar: '/avatars/maria.jpg',
    content:
      'Gestiono 25 clientes y no podría hacerlo sin FitCompass. La app móvil es intuitiva y mis clientes aman ver su progreso. Mis ingresos aumentaron 40% en 6 meses.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    role: 'CrossFit Coach - Bogotá',
    avatar: '/avatars/carlos.jpg',
    content:
      'Probé Trainerize y TrueCoach, pero eran muy complejos y caros. FitCompass tiene todo lo que necesito a un precio justo. El soporte en español es excelente.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Ana Martínez',
    role: 'Entrenadora Online - Madrid',
    avatar: '/avatars/ana.jpg',
    content:
      'Trabajo 100% online y necesitaba una solución profesional. Con FitCompass mis clientes sienten que tienen un entrenador presencial. La calidad de mis servicios subió muchísimo.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Diego Silva',
    role: 'Dueño de Gimnasio - Santiago',
    avatar: '/avatars/diego.jpg',
    content:
      'Tenemos 3 entrenadores usando FitCompass en el gym. La sincronización es perfecta y cada entrenador gestiona sus clientes independientemente. Súper recomendado.',
    rating: 5,
  },
]

// Cómo funciona (pasos)
export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Crea tu cuenta',
    description:
      'Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito requerida.',
  },
  {
    step: 2,
    title: 'Agrega tus clientes',
    description:
      'Importa tu lista de clientes o agrégalos uno por uno con sus objetivos y datos.',
  },
  {
    step: 3,
    title: 'Crea rutinas personalizadas',
    description:
      'Usa nuestra biblioteca de 1300+ ejercicios para armar rutinas en minutos. Tus clientes las ven al instante en la app.',
  },
]

// Stats de hero section
export const heroStats = {
  trainers: '10,000+',
  clients: '50,000+',
  workouts: '500,000+',
}

// FAQs (opcional)
export const faqs = [
  {
    question: '¿Necesito instalar algo?',
    answer:
      'No, FitCompass funciona 100% en la nube. Accedes desde cualquier navegador. Tus clientes usan la app móvil disponible en iOS y Android.',
  },
  {
    question: '¿Puedo probar antes de pagar?',
    answer:
      'Sí, el plan Free es gratis para siempre hasta 3 clientes. Los planes pagos tienen 14 días de prueba sin tarjeta de crédito.',
  },
  {
    question: '¿Qué pasa si supero mi límite de clientes?',
    answer:
      'Recibirás una notificación para actualizar tu plan. Puedes hacerlo en cualquier momento desde tu dashboard.',
  },
  {
    question: '¿Los datos están seguros?',
    answer:
      'Absolutamente. Usamos encriptación de grado bancario y cumplimos con GDPR. Tus datos y los de tus clientes están totalmente protegidos.',
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer:
      'Sí, sin preguntas ni penalidades. Cancelas desde tu cuenta y conservas acceso hasta el final del período pagado.',
  },
]

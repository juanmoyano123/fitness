import Link from 'next/link'
import { Mail, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div className="container-xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-h5 font-bold text-white">
                FitCompass<span className="text-primary-400">Pro</span>
              </span>
            </Link>
            <p className="text-body-sm text-neutral-400 max-w-xs">
              La plataforma todo-en-uno para entrenadores personales en LATAM.
            </p>
          </div>

          {/* Producto */}
          <div>
            <h3 className="mb-4 text-body-sm font-semibold text-white">Producto</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Testimonios
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="mb-4 text-body-sm font-semibold text-white">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-body-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-body-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 md:flex-row">
          <p className="text-body-sm text-neutral-500">
            © {currentYear} FitCompass Pro. Todos los derechos reservados.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="mailto:hola@fitcompass.pro"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </Link>
            <Link
              href="https://twitter.com/fitcompasspro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com/fitcompasspro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://linkedin.com/company/fitcompasspro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

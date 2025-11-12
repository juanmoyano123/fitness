'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/supabase/auth'
import { toast } from 'sonner'
import { Loader2, Dumbbell } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await signIn(data.email, data.password)

      if (result?.error) {
        toast.error(result.error)
        setIsSubmitting(false)
      }
      // If successful, signIn will redirect to dashboard
    } catch (error) {
      toast.error('Error al iniciar sesión')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-white">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Ingresa a tu cuenta de FitCompass Pro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-400 w-full">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            Regístrate gratis
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

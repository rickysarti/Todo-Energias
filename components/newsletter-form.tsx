'use client'

import React from "react"

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!response.ok) {
        throw new Error('Error al suscribirse')
      }

      setStatus('success')
      setEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Newsletter error:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Newsletter</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Recibe las ultimas noticias de energia directo en tu correo.
      </p>
      
      {status === 'success' ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          Gracias por suscribirte. Pronto recibiras nuestras noticias.
        </p>
      ) : status === 'error' ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          Error al suscribirte. Por favor intenta nuevamente.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={status === 'loading'}
          />
          <Button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? 'Suscribiendo...' : 'Suscribirme'}
          </Button>
        </form>
      )}
    </div>
  )
}

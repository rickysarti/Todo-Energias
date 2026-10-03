'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Share2, Check, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ShareBarProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function ShareBar({ url, title, description = '', className }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground mr-1">Compartir:</span>
      
      <Button
        variant="outline"
        size="icon"
        asChild
        className="h-9 w-9 bg-transparent"
      >
        <a 
          href={shareLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Compartir en X (Twitter)"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        asChild
        className="h-9 w-9 bg-transparent"
      >
        <a 
          href={shareLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Compartir en LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        asChild
        className="h-9 w-9 bg-transparent"
      >
        <a 
          href={shareLinks.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Compartir en WhatsApp"
        >
          <Share2 className="h-4 w-4" />
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="h-9 w-9 bg-transparent"
        aria-label="Copiar enlace"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

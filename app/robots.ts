import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/buscar', '/api/'],
      },
      // Reglas especificas para crawlers de IA
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/post/*/markdown'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    // Host canonical
    host: siteConfig.url,
  }
}

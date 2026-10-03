import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { siteConfig } from '@/lib/config'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif-display',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'TodoEnergias | Noticias y analisis de energia en Argentina',
    template: '%s | TodoEnergias',
  },
  description: 'Portal de noticias y analisis sobre energia en Argentina. Informacion actualizada sobre energia solar, eolica, tarifas electricas, eficiencia energetica y mas.',
  keywords: ['energia', 'argentina', 'energia solar', 'energia eolica', 'tarifas electricas', 'eficiencia energetica', 'renovables', 'cortes de luz', 'baterias'],
  authors: [{ name: 'TodoEnergias' }],
  creator: 'TodoEnergias',
  publisher: 'TodoEnergias',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'TodoEnergias | Noticias y analisis de energia en Argentina',
    description: 'Portal de noticias y analisis sobre energia en Argentina. Informacion actualizada sobre energia solar, eolica, tarifas electricas y mas.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TodoEnergias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TodoEnergias | Noticias y analisis de energia en Argentina',
    description: 'Portal de noticias y analisis sobre energia en Argentina.',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f1' },
    { media: '(prefers-color-scheme: dark)', color: '#101421' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// JSON-LD for Website, Organization, and NewsMediaOrganization
function JsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: 'es-AR',
    description: 'Portal de noticias y analisis sobre energia en Argentina. Informacion actualizada sobre energia solar, eolica, tarifas electricas, eficiencia energetica y mas.',
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: 'Todo Energias',
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.solarpower,
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Argentina',
    },
    knowsAbout: [
      'Petroleo y Gas',
      'Vaca Muerta',
      'Almacenamiento en Baterias',
      'Movilidad Electrica',
      'Energia Solar',
      'Energia Eolica',
      'Energias Renovables',
      'Tarifas Electricas',
      'Eficiencia Energetica',
      'Almacenamiento de Energia',
      'Generacion Distribuida',
      'Paneles Solares',
    ],
    publishingPrinciples: `${siteConfig.url}/sobre`,
  }

  // Sitelinks Search Box Schema para Google
  const sitelinksSearchBoxSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSearchBoxSchema) }}
      />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className="bg-background" suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes de pintar para evitar parpadeo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <JsonLd />
        {/* Links para SEO con IA/LLMs */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Summary" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full Content" />
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

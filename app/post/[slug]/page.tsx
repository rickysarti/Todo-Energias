import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Clock, User, Calendar } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryBadge } from '@/components/category-badge'
import { ShareBar } from '@/components/share-bar'
import { MarkdownContent } from '@/components/markdown-content'
import { RelatedPosts } from '@/components/related-posts'
import { SolarPowerCTA } from '@/components/solarpower-cta'
import { getPostBySlug, getPublishedPosts, getRelatedPosts, formatDate, formatDateISO, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600 // Revalidate every hour

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Articulo no encontrado',
    }
  }

  const canonicalUrl = `${siteConfig.canonicalBase}/${post.slug}`
  const postUrl = `${siteConfig.url}/post/${post.slug}`
  const ogImage = post.imagen_destacada_url || `${siteConfig.url}/logo.png`

  return {
    title: post.titulo,
    description: post.description,
    authors: [{ name: post.autor }],
    openGraph: {
      title: post.titulo,
      description: post.description,
      type: 'article',
      url: postUrl,
      publishedTime: post.fecha_publicacion || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.autor],
      section: post.categoria,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ],
      locale: 'es_AR',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titulo,
      description: post.description,
      images: [ogImage],
      site: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.categoria, 4)
  const postUrl = `${siteConfig.url}/post/${post.slug}`

  // JSON-LD Article Schema (mejorado para NewsArticle)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.titulo,
    alternativeHeadline: post.subtitulo || undefined,
    description: post.description,
    image: [
      post.imagen_destacada_url || `${siteConfig.url}/logo.png`,
    ],
    author: {
      '@type': 'Person',
      name: post.autor,
      url: `${siteConfig.url}/autores/${slugify(post.autor)}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
        width: 512,
        height: 512,
      },
      url: siteConfig.url,
    },
    datePublished: formatDateISO(post.fecha_publicacion || post.created_at),
    dateModified: formatDateISO(post.updated_at),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.categoria,
    inLanguage: 'es-AR',
    isAccessibleForFree: true,
    keywords: [post.categoria, 'energia', 'argentina', 'noticias'].filter(Boolean).join(', '),
    wordCount: post.contenido?.split(/\s+/).length || 0,
    timeRequired: `PT${post.readingTime}M`,
  }

  // BreadcrumbList JSON-LD para mejor navegacion en Google
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.categoria || 'Noticias',
        item: `${siteConfig.url}/categoria/${slugify(post.categoria || 'noticias')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.titulo,
        item: postUrl,
      },
    ],
  }

  // Determine which CTA variant to show based on content/category
  const ctaVariant = post.categoria?.toLowerCase().includes('solar') 
    ? 'calculadora' 
    : post.categoria?.toLowerCase().includes('corte') || post.categoria?.toLowerCase().includes('bateria')
    ? 'bateria'
    : 'plan'

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Navbar />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: post.categoria, href: `/categoria/${slugify(post.categoria)}` },
              { label: post.titulo },
            ]}
            className="mb-6"
          />

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-8">
            {post.categoria && (
              <div className="mb-4">
                <CategoryBadge category={post.categoria} size="md" />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              {post.titulo}
            </h1>
            
            {post.subtitulo && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.subtitulo}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.autor && (
                <Link 
                  href={`/autores/${slugify(post.autor)}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{post.autor}</span>
                </Link>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.fecha_publicacion || post.created_at}>
                  {formatDate(post.fecha_publicacion || post.created_at)}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min de lectura</span>
              </div>
            </div>

            {/* Share */}
            <ShareBar url={postUrl} title={post.titulo} description={post.description} />
          </header>

          {/* Featured Image */}
          {post.imagen_destacada_url && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image
                  src={post.imagen_destacada_url || "/placeholder.svg"}
                  alt={post.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <MarkdownContent content={post.contenido || ''} />

            {/* SolarPower CTA */}
            <SolarPowerCTA variant={ctaVariant} />

            {/* Share at bottom */}
            <div className="mt-8 pt-6 border-t border-border">
              <ShareBar url={postUrl} title={post.titulo} description={post.description} />
            </div>
          </div>

          {/* Related Posts */}
          <div className="max-w-6xl mx-auto">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

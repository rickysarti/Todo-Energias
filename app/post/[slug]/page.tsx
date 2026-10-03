import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Clock, Calendar, ExternalLink, Newspaper } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CategoryBadge, SourceBadge } from '@/components/category-badge'
import { ShareBar } from '@/components/share-bar'
import { MarkdownContent, extractHeadings } from '@/components/markdown-content'
import { RelatedPosts } from '@/components/related-posts'
import { SolarPowerCTA, ctaVariantFor } from '@/components/solarpower-cta'
import { ReadingProgress } from '@/components/reading-progress'
import { TableOfContents } from '@/components/table-of-contents'
import { PostCard } from '@/components/post-card'
import {
  getPostBySlug,
  getRelatedPosts,
  getNoticias,
  formatDate,
  formatDateISO,
  slugify,
  canonicalFor,
} from '@/lib/blog'
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
      title: 'Artículo no encontrado',
    }
  }

  const postUrl = `${siteConfig.url}/post/${post.slug}`
  const ogImage = post.imagen_destacada_url || `${siteConfig.url}/logo.png`

  return {
    title: post.titulo,
    description: post.description,
    authors: [{ name: post.autor }],
    keywords: [post.categoria, ...post.tags, 'energía', 'Argentina'].filter(Boolean),
    openGraph: {
      title: post.titulo,
      description: post.description,
      type: 'article',
      url: postUrl,
      publishedTime: post.fecha_publicacion || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.autor],
      section: post.categoria,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.imagen_alt || post.titulo,
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
      canonical: canonicalFor(post),
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const [related, noticias] = await Promise.all([
    getRelatedPosts(post.slug, post.categoria, 4, post.tags),
    getNoticias(),
  ])
  const relatedSlugs = new Set(related.map((p) => p.slug))
  const latest = noticias.filter((n) => n.slug !== post.slug && !relatedSlugs.has(n.slug)).slice(0, 5)
  const postUrl = `${siteConfig.url}/post/${post.slug}`
  const headings = extractHeadings(post.contenido || '')
  const published = post.fecha_publicacion || post.created_at
  const isNoticia = post.source === 'noticia'

  // JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': isNoticia ? 'NewsArticle' : 'BlogPosting',
    headline: post.titulo,
    alternativeHeadline: post.subtitulo || undefined,
    description: post.description,
    image: [post.imagen_destacada_url || `${siteConfig.url}/logo.png`],
    author: {
      '@type': isNoticia ? 'Organization' : 'Person',
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
    datePublished: formatDateISO(published),
    dateModified: formatDateISO(post.updated_at),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.categoria,
    inLanguage: 'es-AR',
    isAccessibleForFree: true,
    keywords: [post.categoria, ...post.tags, 'energia', 'argentina'].filter(Boolean).join(', '),
    wordCount: post.contenido?.split(/\s+/).length || 0,
    timeRequired: `PT${post.readingTime}M`,
    ...(post.fuente_url ? { isBasedOn: post.fuente_url } : {}),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ReadingProgress targetId="article-body" />
      <Navbar />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: post.categoria, href: `/categoria/${slugify(post.categoria)}` },
              { label: post.titulo },
            ]}
            className="mb-8"
          />

          {/* Header */}
          <header className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CategoryBadge category={post.categoria} size="md" />
              <SourceBadge source={post.source} />
            </div>

            <h1 className="font-serif text-[2rem] leading-[1.1] sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight text-foreground text-balance">
              {post.titulo}
            </h1>

            {post.subtitulo && (
              <p className="mt-5 text-lg sm:text-xl leading-relaxed text-muted-foreground text-pretty">{post.subtitulo}</p>
            )}

            <div className="mt-6 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <Link
                  href={`/autores/${slugify(post.autor)}`}
                  className="flex items-center gap-2 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {post.autor.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  {post.autor}
                </Link>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={published}>{formatDate(published)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min de lectura
                </span>
              </div>
              <ShareBar url={postUrl} title={post.titulo} description={post.description} />
            </div>
          </header>

          {/* Featured image */}
          {post.imagen_destacada_url && (
            <figure className="mx-auto mt-8 max-w-5xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={post.imagen_destacada_url}
                  alt={post.imagen_alt || post.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
              {(post.imagen_alt || post.imagen_credito) && (
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  {post.imagen_alt}
                  {post.imagen_alt && post.imagen_credito && ' · '}
                  {post.imagen_credito}
                </figcaption>
              )}
            </figure>
          )}

          {/* Body + aside */}
          <div className="mx-auto mt-10 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div id="article-body" className="min-w-0 max-w-3xl">
              <MarkdownContent content={post.contenido || ''} />

              {post.fuente_url && (
                <div className="mt-10 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                  <Newspaper className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Fuente: </span>
                    elaborado por la redacción de TodoEnergías a partir de información publicada por{' '}
                    <a
                      href={post.fuente_url}
                      target="_blank"
                      rel="nofollow noopener"
                      className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2"
                    >
                      {post.fuente_nombre || 'la fuente original'}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    .
                  </p>
                </div>
              )}

              {post.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Temas">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/buscar?q=${encodeURIComponent(tag)}`}
                        className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/75 hover:bg-accent/30 hover:text-foreground transition-colors"
                      >
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <SolarPowerCTA variant={ctaVariantFor(post.categoria, post.tags)} />

              <div className="border-t border-border pt-6">
                <ShareBar url={postUrl} title={post.titulo} description={post.description} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-44 space-y-8">
                <TableOfContents items={headings} />
                {latest.length > 0 && (
                  <section>
                    <h2 className="mb-4 border-t-[3px] border-foreground pt-3 font-serif text-lg font-semibold">Últimas noticias</h2>
                    <div className="space-y-4">
                      {latest.slice(0, 4).map((n) => (
                        <PostCard key={n.id} post={n} variant="compact" />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </aside>
          </div>

          <div className="mx-auto max-w-6xl">
            <RelatedPosts posts={related.length > 0 ? related : latest.slice(0, 4)} title="Para seguir leyendo" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Sidebar } from '@/components/sidebar'
import { siteConfig } from '@/lib/config'
import type { PostWithReadingTime, PaginationInfo } from '@/lib/types'

interface ArticleListingProps {
  title: string
  description: string
  kicker?: string
  breadcrumbs: { label: string; href?: string }[]
  posts: PostWithReadingTime[]
  pagination: PaginationInfo
  basePath: string
  emptyMessage?: string
}

// Plantilla compartida para listados: secciones, categorías, archivo y guías
export function ArticleListing({
  title,
  description,
  kicker,
  breadcrumbs,
  posts,
  pagination,
  basePath,
  emptyMessage = 'Todavía no hay artículos en esta sección.',
}: ArticleListingProps) {
  const isFirstPage = pagination.page === 1
  const [lead, ...rest] = posts
  const showLead = isFirstPage && lead && posts.length > 3

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title} | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}${basePath}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination.total,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: (pagination.page - 1) * pagination.pageSize + index + 1,
        url: `${siteConfig.url}/post/${post.slug}`,
        name: post.titulo,
      })),
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          <header className="mb-10 border-b border-border pb-8">
            {kicker && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground/80 dark:text-accent">{kicker}</p>
            )}
            <h1 className="mt-1 font-serif text-4xl md:text-5xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{description}</p>
            <p className="mt-3 text-sm text-muted-foreground tabular-nums">
              {pagination.total} {pagination.total === 1 ? 'artículo' : 'artículos'}
              {pagination.totalPages > 1 && ` · página ${pagination.page} de ${pagination.totalPages}`}
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                {showLead && <PostCard post={lead} variant="hero" priority className="mb-8" />}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {(showLead ? rest : posts).map((post, index) => (
                    <PostCard key={post.id} post={post} priority={isFirstPage && index < 2} />
                  ))}
                </div>
                <Pagination pagination={pagination} basePath={basePath} className="mt-10" />
              </div>
              <div>
                <Sidebar />
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

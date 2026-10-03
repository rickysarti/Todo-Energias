import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { 
  getPostsByCategory, 
  getUniqueCategories, 
  slugify, 
  deslugify, 
  paginate 
} from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

// Force dynamic rendering since we use Supabase with cookies
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = deslugify(slug)
  
  return {
    title: `${categoryName} - Noticias de Energia`,
    description: `Ultimas noticias y articulos sobre ${categoryName.toLowerCase()} en Argentina. Informacion actualizada del sector energetico.`,
    openGraph: {
      title: `${categoryName} | TodoEnergias`,
      description: `Ultimas noticias sobre ${categoryName.toLowerCase()} en Argentina`,
      type: 'website',
      url: `${siteConfig.url}/categoria/${slug}`,
      siteName: siteConfig.name,
      locale: 'es_AR',
    },
    alternates: {
      canonical: `${siteConfig.url}/categoria/${slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  // Find the actual category name from available categories
  const categories = await getUniqueCategories()
  const categoryName = categories.find(cat => slugify(cat) === slug)

  if (!categoryName) {
    notFound()
  }

  const allPosts = await getPostsByCategory(categoryName)
  const { items: posts, pagination } = paginate(allPosts, currentPage, PAGE_SIZE)

  // JSON-LD for CollectionPage
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - TodoEnergias`,
    description: `Noticias y articulos sobre ${categoryName} en Argentina`,
    url: `${siteConfig.url}/categoria/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allPosts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/post/${post.slug}`,
        name: post.titulo,
      })),
    },
  }

  // BreadcrumbList JSON-LD
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
        name: 'Noticias',
        item: `${siteConfig.url}/noticias`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${siteConfig.url}/categoria/${slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Noticias', href: '/noticias' },
            { label: categoryName },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {categoryName}
          </h1>
          <p className="text-lg text-muted-foreground">
            {allPosts.length} {allPosts.length === 1 ? 'articulo' : 'articulos'} en esta categoria
          </p>
        </header>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath={`/categoria/${slug}`}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay articulos en esta categoria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getPublishedPosts, paginate } from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Noticias de energia en Argentina',
  description: 'Ultimas noticias y novedades sobre energia en Argentina. Energia solar, eolica, tarifas electricas, eficiencia energetica y mas.',
  openGraph: {
    title: 'Noticias de energia en Argentina | TodoEnergias',
    description: 'Ultimas noticias y novedades sobre energia en Argentina.',
    type: 'website',
    url: `${siteConfig.url}/noticias`,
    images: [{ url: `${siteConfig.url}/logo.png` }],
  },
  alternates: {
    canonical: `${siteConfig.url}/noticias`,
  },
}

interface NoticiasPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const allPosts = await getPublishedPosts()
  const { items: posts, pagination } = paginate(allPosts, currentPage, PAGE_SIZE)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[{ label: 'Noticias' }]}
            className="mb-6"
          />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Noticias de Energia
            </h1>
            <p className="text-lg text-muted-foreground">
              Todas las noticias y novedades del sector energetico argentino
            </p>
          </header>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    priority={currentPage === 1 && index < 3}
                  />
                ))}
              </div>

              <Pagination 
                pagination={pagination} 
                basePath="/noticias" 
              />
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No hay noticias disponibles
              </h2>
              <p className="text-muted-foreground">
                Proximamente publicaremos contenido sobre energia en Argentina.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

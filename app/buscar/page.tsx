import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { SearchBar } from '@/components/search-bar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { searchPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Buscar',
  description: 'Busca noticias y articulos sobre energia en Argentina.',
  robots: {
    index: false,
    follow: true,
  },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const results = query ? await searchPosts(query) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[{ label: 'Buscar' }]}
            className="mb-6"
          />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Buscar
            </h1>
            <div className="max-w-xl">
              <SearchBar defaultValue={query} placeholder="Buscar noticias de energia..." />
            </div>
          </header>

          {query && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                {results.length === 0 
                  ? `No se encontraron resultados para "${query}"`
                  : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'} para "${query}"`
                }
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sin resultados
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                No encontramos articulos que coincidan con tu busqueda. 
                Intenta con otras palabras clave.
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Busca noticias
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ingresa palabras clave para encontrar articulos sobre energia en Argentina.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

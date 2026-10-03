import type { Metadata } from 'next'
import Link from 'next/link'
import { User } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getPublishedPosts, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Autores',
  description: 'Conoce a los autores y periodistas que escriben en TodoEnergías sobre energia en Argentina.',
  openGraph: {
    title: 'Autores | TodoEnergías',
    description: 'Conoce a los autores de TodoEnergías.',
    type: 'website',
    url: `${siteConfig.url}/autores`,
    images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteConfig.url}/autores`,
  },
}

export default async function AuthorsPage() {
  const posts = await getPublishedPosts()
  
  // Group posts by author and count
  const authorStats = posts.reduce((acc, post) => {
    if (post.autor) {
      if (!acc[post.autor]) {
        acc[post.autor] = 0
      }
      acc[post.autor]++
    }
    return acc
  }, {} as Record<string, number>)

  const authors = Object.entries(authorStats)
    .sort((a, b) => b[1] - a[1]) // Sort by post count descending

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[{ label: 'Autores' }]}
            className="mb-6"
          />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Nuestros Autores
            </h1>
            <p className="text-lg text-muted-foreground">
              Conoce a quienes escriben sobre energia en Argentina
            </p>
          </header>

          {authors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors.map(([author, count]) => (
                <Link
                  key={author}
                  href={`/autores/${slugify(author)}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{author}</h2>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? 'articulo' : 'articulos'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No hay autores disponibles.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

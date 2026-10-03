import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { User } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { 
  getPostsByAuthor, 
  getUniqueAuthors, 
  paginate, 
  slugify,
  deslugify 
} from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

interface AuthorPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const authorName = deslugify(slug)

  return {
    title: authorName,
    description: `Articulos escritos por ${authorName} en TodoEnergías. Noticias y analisis sobre energia en Argentina.`,
    openGraph: {
      title: `${authorName} | TodoEnergías`,
      description: `Articulos escritos por ${authorName} en TodoEnergías.`,
      type: 'profile',
      url: `${siteConfig.url}/autores/${slug}`,
      images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${siteConfig.url}/autores/${slug}`,
    },
  }
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = Number(searchParamsResolved.page) || 1
  
  const authorName = deslugify(slug)
  
  // Try to find posts by the author
  let allPosts = await getPostsByAuthor(authorName)
  
  // If no posts found, try finding the exact author name from the list
  if (allPosts.length === 0) {
    const authors = await getUniqueAuthors()
    const matchingAuthor = authors.find(a => slugify(a) === slug)
    if (matchingAuthor) {
      allPosts = await getPostsByAuthor(matchingAuthor)
    }
  }

  if (allPosts.length === 0) {
    notFound()
  }

  const { items: posts, pagination } = paginate(allPosts, currentPage, PAGE_SIZE)
  
  // Get the actual author name from a post
  const actualAuthorName = allPosts[0]?.autor || authorName

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: 'Autores', href: '/autores' },
              { label: actualAuthorName },
            ]}
            className="mb-6"
          />

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center">
                <User className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {actualAuthorName}
                </h1>
                <p className="text-muted-foreground">
                  {allPosts.length} {allPosts.length === 1 ? 'articulo publicado' : 'articulos publicados'}
                </p>
              </div>
            </div>
          </header>

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
            basePath={`/autores/${slug}`} 
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

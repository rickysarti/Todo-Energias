import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Sidebar } from '@/components/sidebar'
import { getPublishedPosts, getPostsGroupedByCategory, slugify } from '@/lib/blog'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HomePage() {
  const allPosts = await getPublishedPosts()
  const postsByCategory = new Map<string, typeof allPosts>()
  for (const post of allPosts) {
    if (!post.categoria) continue
    const categoryPosts = postsByCategory.get(post.categoria) || []
    categoryPosts.push(post)
    postsByCategory.set(post.categoria, categoryPosts)
  }

  // Hero post (most recent)
  const heroPost = allPosts[0]
  
  // Latest posts (excluding hero)
  const latestPosts = allPosts.slice(1, 7)

  // Get top categories with posts
  const topCategories = Array.from(postsByCategory.entries())
    .filter(([_, posts]) => posts.length >= 2)
    .slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          {/* Hero Section */}
          {heroPost && (
            <section className="mb-12">
              <PostCard post={heroPost} variant="hero" priority />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Latest News */}
              {latestPosts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Ultimas Noticias</h2>
                    <Link
                      href="/noticias"
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver todas
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {latestPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} priority={index < 2} />
                    ))}
                  </div>
                </section>
              )}

              {/* Category Sections */}
              {topCategories.map(([category, posts]) => (
                <section key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                    <Link
                      href={`/categoria/${slugify(category)}`}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver mas
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {posts.slice(0, 4).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              ))}

              {/* If no posts */}
              {allPosts.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Proximamente
                  </h2>
                  <p className="text-muted-foreground">
                    Estamos preparando contenido de calidad sobre energia en Argentina.
                    Vuelve pronto para ver nuestras noticias y analisis.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

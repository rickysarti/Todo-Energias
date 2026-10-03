import Link from 'next/link'
import { TrendingUp, Info } from 'lucide-react'
import { PostCard } from '@/components/post-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { getTrendingPosts, getUniqueCategories } from '@/lib/blog'

export async function Sidebar() {
  const trendingPosts = await getTrendingPosts(5)
  const categories = await getUniqueCategories()

  return (
    <aside className="space-y-6">
      {/* Trending Posts */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Tendencias</h3>
        </div>
        <div className="space-y-4">
          {trendingPosts.slice(0, 5).map((post) => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterForm />

      {/* Categories */}
      {categories.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category}
                href={`/buscar?q=${encodeURIComponent(category)}`}
                className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Sobre TodoEnergias</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Somos un medio especializado en noticias y analisis del sector energetico argentino. 
          Cubrimos energia solar, eolica, tarifas, eficiencia y todo lo relacionado con el futuro energetico del pais.
        </p>
      </div>
    </aside>
  )
}

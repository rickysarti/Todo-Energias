import Link from 'next/link'
import { TrendingUp, Sun, ArrowUpRight } from 'lucide-react'
import { PostCard } from '@/components/post-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { getTrendingPosts, getCategoryCounts } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export async function Sidebar({ excludeSlug }: { excludeSlug?: string } = {}) {
  const trendingPosts = (await getTrendingPosts(6)).filter((p) => p.slug !== excludeSlug).slice(0, 5)
  const categories = await getCategoryCounts()

  return (
    <aside className="space-y-8">
      {/* Más leídas */}
      <section>
        <div className="mb-5 flex items-center gap-2 border-t-[3px] border-foreground pt-3">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl font-semibold text-foreground">Lo más importante</h2>
        </div>
        <ol className="space-y-5">
          {trendingPosts.map((post, i) => (
            <li key={post.id}>
              <PostCard post={post} variant="numbered" index={i} />
            </li>
          ))}
        </ol>
      </section>

      {/* CTA SolarPower */}
      <a
        href={siteConfig.links.calculadora}
        target="_blank"
        rel="noopener"
        className="group block rounded-xl border border-accent/50 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent p-5 transition-colors hover:border-accent"
      >
        <Sun className="h-7 w-7 text-accent" />
        <p className="mt-3 font-serif text-lg font-semibold leading-snug text-foreground">
          ¿Y si la próxima suba de luz no te afectara?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Calculá cuánto ahorrarías con paneles solares en tu casa o negocio.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-accent">
          Calculadora SolarPower <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>

      <NewsletterForm />

      {/* Secciones */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 border-t-[3px] border-foreground pt-3 font-serif text-xl font-semibold text-foreground">Secciones</h2>
          <ul className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80 transition-colors hover:border-accent hover:bg-accent/15 hover:text-foreground"
                >
                  {c.name}
                  <span className="text-xs text-muted-foreground tabular-nums">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}

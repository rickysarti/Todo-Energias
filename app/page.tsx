import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { Sidebar } from '@/components/sidebar'
import { SectionHeader } from '@/components/section-header'
import { SolarPowerBanner } from '@/components/solarpower-banner'
import { getNoticias, getBlogPosts, slugify } from '@/lib/blog'
import type { PostWithReadingTime } from '@/lib/types'

export const revalidate = 300 // Revalidate every 5 minutes

// Bloques temáticos de la portada (por slug de categoría)
const categoryBlocks = [
  { title: 'Petróleo y Gas', slugs: ['petroleo-y-gas', 'mercados', 'economia'], href: '/categoria/petroleo-y-gas' },
  { title: 'Renovables y Energía Solar', slugs: ['renovables', 'energia-solar', 'region'], href: '/categoria/renovables' },
  { title: 'Almacenamiento y Tecnología', slugs: ['almacenamiento', 'tecnologia', 'nuclear'], href: '/categoria/almacenamiento' },
  { title: 'El mundo de la energía', slugs: ['mundo', 'clima'], href: '/categoria/mundo' },
]

export default async function HomePage() {
  const [noticias, guias] = await Promise.all([getNoticias(), getBlogPosts()])
  const used = new Set<string>()
  const take = (pool: PostWithReadingTime[], n: number) => {
    const out = pool.filter((p) => !used.has(p.slug)).slice(0, n)
    out.forEach((p) => used.add(p.slug))
    return out
  }

  // Si todavía no hay noticias propias, la portada se arma con el blog
  const feed = noticias.length > 0 ? noticias : guias

  const lead = take([...feed.filter((p) => p.destacada), ...feed], 1)[0]
  const latest = take(feed, 6)
  const secondary = take([...feed.filter((p) => p.destacada), ...feed], 3)

  const blocks = categoryBlocks
    .map((block) => ({
      ...block,
      posts: take(feed.filter((p) => block.slugs.includes(slugify(p.categoria))), 4),
    }))
    .filter((b) => b.posts.length >= 2)

  const guiasDestacadas = take(guias, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <h1 className="sr-only">TodoEnergias: noticias de energía en Argentina</h1>
        <div className="container mx-auto px-4 py-8 sm:py-10">
          {/* Portada */}
          {lead && (
            <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] animate-[rise-in_600ms_ease-out_both]">
              <PostCard post={lead} variant="lead" priority />
              <div>
                <div className="mb-4 flex items-center gap-2 border-t-[3px] border-foreground pt-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Lo último</h2>
                </div>
                <div className="space-y-5">
                  {latest.map((post) => (
                    <PostCard key={post.id} post={post} variant="text" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {secondary.length > 0 && (
            <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-[rise-in_600ms_120ms_ease-out_both]">
              {secondary.map((post, i) => (
                <PostCard key={post.id} post={post} priority={i < 3} />
              ))}
            </section>
          )}

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-14">
              {blocks.map((block) => {
                const [first, ...rest] = block.posts
                return (
                  <section key={block.title}>
                    <SectionHeader title={block.title} href={block.href} />
                    <div className="grid gap-6 md:grid-cols-2">
                      <PostCard post={first} />
                      <div className="space-y-5">
                        {rest.map((post) => (
                          <PostCard key={post.id} post={post} variant="horizontal" />
                        ))}
                      </div>
                    </div>
                  </section>
                )
              })}

              {noticias.length === 0 && guias.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Próximamente</h2>
                  <p className="text-muted-foreground">
                    Estamos preparando contenido de calidad sobre energía en Argentina.
                  </p>
                </div>
              )}
            </div>

            <div>
              <Sidebar />
            </div>
          </div>

          <div className="mt-16">
            <SolarPowerBanner />
          </div>

          {guiasDestacadas.length > 0 && (
            <section className="mt-16">
              <SectionHeader
                kicker="Explicadores y consejos prácticos"
                title="Guías de energía solar"
                href="/guias"
                linkLabel="Todas las guías"
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {guiasDestacadas.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

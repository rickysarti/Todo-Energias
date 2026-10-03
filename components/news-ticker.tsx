import Link from 'next/link'
import { Zap } from 'lucide-react'

interface TickerItem {
  slug: string
  titulo: string
  fecha: string
}

export function NewsTicker({ items }: { items: TickerItem[] }) {
  // Se duplica la lista para que la animación sea continua
  const loop = [...items, ...items]

  return (
    <div className="border-b border-border/70 bg-card">
      <div className="container mx-auto flex items-center gap-3 px-4">
        <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-destructive/90 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-white">
          <Zap className="h-3 w-3 fill-current" />
          Último momento
        </span>
        <div className="relative flex-1 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <ul className="ticker-track flex w-max gap-10" aria-label="Últimas noticias">
            {loop.map((item, i) => (
              <li key={`${item.slug}-${i}`} aria-hidden={i >= items.length} className="whitespace-nowrap text-sm">
                <Link
                  href={`/post/${item.slug}`}
                  tabIndex={i >= items.length ? -1 : undefined}
                  className="text-foreground/85 hover:text-primary transition-colors"
                >
                  <span className="mr-2 text-accent">●</span>
                  {item.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

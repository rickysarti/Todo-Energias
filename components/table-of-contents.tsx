import type { TocItem } from '@/components/markdown-content'
import { cn } from '@/lib/utils'

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null

  return (
    <nav aria-label="En esta nota" className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">En esta nota</p>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && 'pl-4')}>
            <a href={`#${item.id}`} className="block leading-snug text-foreground/75 hover:text-primary transition-colors">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

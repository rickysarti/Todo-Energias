import Link from 'next/link'
import { slugify } from '@/lib/blog'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  linked?: boolean
  size?: 'sm' | 'md'
  variant?: 'soft' | 'kicker' | 'overlay'
  className?: string
}

export function CategoryBadge({
  category,
  linked = true,
  size = 'sm',
  variant = 'kicker',
  className,
}: CategoryBadgeProps) {
  const badgeClasses = cn(
    'inline-flex items-center font-semibold uppercase tracking-[0.08em] transition-colors',
    size === 'sm' ? 'text-[0.68rem]' : 'text-xs',
    variant === 'kicker' && 'text-primary dark:text-accent hover:text-accent-foreground',
    variant === 'soft' && 'rounded-full bg-accent/25 px-2.5 py-0.5 text-accent-foreground dark:text-accent hover:bg-accent/40',
    variant === 'overlay' && 'rounded-sm bg-accent px-2 py-0.5 text-accent-foreground',
    className
  )

  if (linked) {
    return (
      <Link href={`/categoria/${slugify(category)}`} className={badgeClasses}>
        {category}
      </Link>
    )
  }

  return <span className={badgeClasses}>{category}</span>
}

export function SourceBadge({ source, className }: { source: 'blog' | 'noticia'; className?: string }) {
  if (source !== 'blog') return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-accent/60 bg-accent/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-foreground dark:text-accent',
        className
      )}
    >
      Guía SolarPower
    </span>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  href?: string
  linkLabel?: string
  kicker?: string
  className?: string
}

export function SectionHeader({ title, href, linkLabel = 'Ver más', kicker, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4 section-rule pt-4', className)}>
      <div>
        {kicker && (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-foreground/80 dark:text-accent">{kicker}</p>
        )}
        <h2 className="font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary dark:text-accent"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

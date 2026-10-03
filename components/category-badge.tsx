import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  linked?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryBadge({ 
  category, 
  linked = true, 
  size = 'sm',
  className 
}: CategoryBadgeProps) {
  const badgeClasses = cn(
    'inline-flex items-center rounded-full font-medium transition-colors',
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    'bg-accent/50 text-accent-foreground hover:bg-accent',
    className
  )

  if (linked) {
    return (
      <Link href={`/buscar?q=${encodeURIComponent(category)}`} className={badgeClasses}>
        {category}
      </Link>
    )
  }

  return <span className={badgeClasses}>{category}</span>
}

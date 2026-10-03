import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { formatDate, formatRelative } from '@/lib/blog'
import { CategoryBadge, SourceBadge } from '@/components/category-badge'
import type { PostWithReadingTime } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: PostWithReadingTime
  variant?: 'default' | 'lead' | 'hero' | 'compact' | 'horizontal' | 'numbered' | 'text'
  priority?: boolean
  index?: number
  className?: string
}

function postTime(post: PostWithReadingTime) {
  return post.fecha_publicacion || post.created_at
}

function Thumb({
  post,
  sizes,
  priority,
  className,
  fallbackSize = 'text-4xl',
}: {
  post: PostWithReadingTime
  sizes: string
  priority?: boolean
  className?: string
  fallbackSize?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {post.imagen_destacada_url ? (
        <Image
          src={post.imagen_destacada_url}
          alt={post.imagen_alt || post.titulo}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          priority={priority}
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-primary/10 to-primary/30 flex items-center justify-center">
          <span className={cn('font-serif font-bold text-primary/40', fallbackSize)}>TE</span>
        </div>
      )}
    </div>
  )
}

export function PostCard({ post, variant = 'default', priority = false, index, className }: PostCardProps) {
  const href = `/post/${post.slug}`
  const time = postTime(post)

  // Nota principal de portada: imagen grande con título superpuesto
  if (variant === 'lead') {
    return (
      <article className={cn('group relative overflow-hidden rounded-2xl bg-card', className)}>
        <Link href={href} className="block">
          <Thumb post={post} priority={priority} sizes="(max-width: 1024px) 100vw, 66vw" className="aspect-[4/3] sm:aspect-[16/10]" fallbackSize="text-7xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.categoria} linked={false} variant="overlay" />
              <SourceBadge source={post.source} className="border-white/40 bg-white/10 text-white" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] font-semibold leading-[1.12] text-white text-balance group-hover:underline decoration-accent decoration-2 underline-offset-4">
              {post.titulo}
            </h2>
            <p className="mt-3 hidden sm:block max-w-3xl text-base text-white/80 line-clamp-2">{post.description}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
              <time dateTime={time} suppressHydrationWarning>{formatRelative(time)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min de lectura</span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'hero') {
    return (
      <article className={cn('group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_18px_50px_-32px_rgba(15,23,42,0.6)] transition-all duration-500 hover:-translate-y-1', className)}>
        <Link href={href} className="grid md:grid-cols-2">
          <Thumb post={post} priority={priority} sizes="(max-width: 768px) 100vw, 50vw" className="aspect-[16/10] md:aspect-auto md:min-h-[22rem]" fallbackSize="text-6xl" />
          <div className="flex flex-col justify-center p-6 md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.categoria} size="md" linked={false} />
              <SourceBadge source={post.source} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors text-balance">
              {post.titulo}
            </h2>
            <p className="mt-3 text-muted-foreground line-clamp-3 leading-relaxed">{post.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{post.autor}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(time)}</span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn('group flex gap-4 items-start', className)}>
        <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
          <Thumb post={post} sizes="128px" className="w-28 h-20 sm:w-32 sm:h-24 rounded-lg" fallbackSize="text-xl" />
        </Link>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={post.categoria} className="mb-1" />
          <Link href={href}>
            <h3 className="font-serif font-semibold text-foreground text-[1.02rem] leading-snug group-hover:text-primary transition-colors line-clamp-3">
              {post.titulo}
            </h3>
          </Link>
          <time dateTime={time} className="mt-1 block text-xs text-muted-foreground" suppressHydrationWarning>
            {formatRelative(time)}
          </time>
        </div>
      </article>
    )
  }

  if (variant === 'numbered') {
    return (
      <article className={cn('group flex gap-4', className)}>
        <span className="font-serif text-3xl font-bold leading-none text-accent tabular-nums w-8 shrink-0">
          {(index ?? 0) + 1}
        </span>
        <Link href={href} className="block min-w-0">
          <h3 className="font-serif font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-3">
            {post.titulo}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {post.categoria} · {post.readingTime} min
          </p>
        </Link>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="block">
          <h3 className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.titulo}
          </h3>
          <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>{formatRelative(time)}</p>
        </Link>
      </article>
    )
  }

  // Solo texto: para listas "Lo último"
  if (variant === 'text') {
    return (
      <article className={cn('group border-l-2 border-border pl-4 hover:border-accent transition-colors', className)}>
        <time dateTime={time} className="text-[0.7rem] font-semibold uppercase tracking-wider text-accent-foreground/80 dark:text-accent" suppressHydrationWarning>
          {formatRelative(time)}
        </time>
        <Link href={href} className="block">
          <h3 className="mt-0.5 font-serif font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {post.titulo}
          </h3>
        </Link>
      </article>
    )
  }

  // Default card
  return (
    <article className={cn('group flex flex-col overflow-hidden rounded-xl bg-card border border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_22px_50px_-30px_rgba(15,23,42,0.6)]', className)}>
      <Link href={href} className="flex flex-1 flex-col">
        <Thumb post={post} priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="aspect-[16/10]" />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CategoryBadge category={post.categoria} linked={false} />
            <SourceBadge source={post.source} />
          </div>
          <h3 className="font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 text-balance">
            {post.titulo}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <time dateTime={time} suppressHydrationWarning>{formatRelative(time)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

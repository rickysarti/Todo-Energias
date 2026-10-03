import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/blog'
import { CategoryBadge } from '@/components/category-badge'
import type { PostWithReadingTime } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: PostWithReadingTime
  variant?: 'default' | 'hero' | 'compact' | 'horizontal'
  priority?: boolean
}

export function PostCard({ post, variant = 'default', priority = false }: PostCardProps) {
  const hasImage = !!post.imagen_destacada_url

  if (variant === 'hero') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card border border-border/80 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.6)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)]">
        <Link href={`/post/${post.slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
              {hasImage ? (
                <Image
                  src={post.imagen_destacada_url! || "/placeholder.svg"}
                  alt={post.titulo}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <span className="text-6xl text-primary/30 font-bold">TE</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              {post.categoria && (
                <div className="mb-3">
                  <CategoryBadge category={post.categoria} size="md" linked={false} />
                </div>
              )}
              
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors text-balance">
                {post.titulo}
              </h2>
              
              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.autor && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{post.autor}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min de lectura</span>
                </div>
                <span>{formatDate(post.fecha_publicacion || post.created_at)}</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 items-start">
        <Link href={`/post/${post.slug}`} className="shrink-0">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            {hasImage ? (
              <Image
                src={post.imagen_destacada_url! || "/placeholder.svg"}
                alt={post.titulo}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="96px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <span className="text-xl text-primary/30 font-bold">TE</span>
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/post/${post.slug}`}>
            <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {post.titulo}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(post.fecha_publicacion || post.created_at)}
          </p>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group">
        <Link href={`/post/${post.slug}`} className="block">
          <h3 className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.titulo}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(post.fecha_publicacion || post.created_at)}
          </p>
        </Link>
      </article>
    )
  }

  // Default variant
  return (
    <article className="group overflow-hidden rounded-2xl bg-card border border-border/80 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.65)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.7)]">
      <Link href={`/post/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {hasImage ? (
            <Image
              src={post.imagen_destacada_url! || "/placeholder.svg"}
              alt={post.titulo}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <span className="text-4xl text-primary/30 font-bold">TE</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-h-[11rem] flex-col p-5">
          {post.categoria && (
            <div className="mb-2">
              <CategoryBadge category={post.categoria} linked={false} />
            </div>
          )}
          
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 text-balance">
            {post.titulo}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(post.fecha_publicacion || post.created_at)}</span>
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

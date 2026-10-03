import { PostCard } from '@/components/post-card'
import type { PostWithReadingTime } from '@/lib/types'

interface RelatedPostsProps {
  posts: PostWithReadingTime[]
  title?: string
}

export function RelatedPosts({ posts, title = 'Articulos relacionados' }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} variant="default" />
        ))}
      </div>
    </section>
  )
}

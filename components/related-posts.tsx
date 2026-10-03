import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import type { PostWithReadingTime } from '@/lib/types'

interface RelatedPostsProps {
  posts: PostWithReadingTime[]
  title?: string
}

export function RelatedPosts({ posts, title = 'Seguí leyendo' }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16">
      <SectionHeader title={title} href="/noticias" linkLabel="Todas las noticias" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

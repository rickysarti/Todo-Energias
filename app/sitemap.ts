import type { MetadataRoute } from 'next'
import { getPublishedPosts, getUniqueAuthors, getUniqueCategories, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

// Force dynamic to always get fresh data from Supabase
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()
  const authors = await getUniqueAuthors()
  const categories = await getUniqueCategories()

  // Get the most recent post date for dynamic pages
  const mostRecentPostDate = posts.length > 0 
    ? new Date(posts[0].fecha_publicacion || posts[0].created_at)
    : new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: mostRecentPostDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/noticias`,
      lastModified: mostRecentPostDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/sobre`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/autores`,
      lastModified: mostRecentPostDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // SEO para LLMs
    {
      url: `${siteConfig.url}/llms.txt`,
      lastModified: mostRecentPostDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/llms-full.txt`,
      lastModified: mostRecentPostDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ]

  // Post pages - use actual post dates
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/post/${post.slug}`,
    lastModified: new Date(post.updated_at || post.fecha_publicacion || post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Markdown versions of posts for AI crawlers
  const postMarkdownPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/post/${post.slug}/markdown`,
    lastModified: new Date(post.updated_at || post.fecha_publicacion || post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Author pages - use most recent post date by that author
  const authorPages: MetadataRoute.Sitemap = authors.map((author) => {
    const authorPosts = posts.filter(p => p.autor === author)
    const lastModified = authorPosts.length > 0
      ? new Date(authorPosts[0].fecha_publicacion || authorPosts[0].created_at)
      : new Date()
    
    return {
      url: `${siteConfig.url}/autores/${slugify(author)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  })

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
    const categoryPosts = posts.filter(p => p.categoria === category)
    const lastModified = categoryPosts.length > 0
      ? new Date(categoryPosts[0].fecha_publicacion || categoryPosts[0].created_at)
      : new Date()
    
    return {
      url: `${siteConfig.url}/categoria/${slugify(category)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...postPages, ...postMarkdownPages, ...authorPages, ...categoryPages]
}

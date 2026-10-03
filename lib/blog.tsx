import { createClient } from '@/lib/supabase/server'
import type { BlogPost, BlogCategoria, PostWithReadingTime, PaginationInfo } from './types'

// Slugify function for categories and authors
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, '') // Trim - from end
}

// Reverse slugify to find original name
export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// Format date in Spanish Argentina
export function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date for ISO
export function formatDateISO(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toISOString()
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Strip markdown to plain text for descriptions
export function stripMarkdownToText(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/__([^_]+)__/g, '$1') // Remove bold underscore
    .replace(/_([^_]+)_/g, '$1') // Remove italic underscore
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .replace(/\d+\.\s+/g, '') // Remove numbered lists
    .replace(/\n{2,}/g, ' ') // Replace multiple newlines
    .replace(/\n/g, ' ') // Replace single newlines
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

// Generate description from subtitle or content
export function generateDescription(post: BlogPost): string {
  if (post.subtitulo && post.subtitulo.trim()) {
    return post.subtitulo.slice(0, 160)
  }
  const plainText = stripMarkdownToText(post.contenido || '')
  return plainText.slice(0, 155) + (plainText.length > 155 ? '...' : '')
}

// Add reading time and description to post
export function enrichPost(post: BlogPost): PostWithReadingTime {
  return {
    ...post,
    readingTime: calculateReadingTime(post.contenido || ''),
    description: generateDescription(post),
  }
}

// Pagination helper
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; pagination: PaginationInfo } {
  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const currentPage = Math.max(1, Math.min(page, totalPages || 1))
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    pagination: {
      page: currentPage,
      pageSize,
      total,
      totalPages,
    },
  }
}

// Get all published posts
export async function getPublishedPosts(): Promise<PostWithReadingTime[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data.map(enrichPost)
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<PostWithReadingTime | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('estado', 'publicado')
    .single()

  if (error || !data) {
    return null
  }

  return enrichPost(data)
}

// Get posts by category
export async function getPostsByCategory(categoryName: string): Promise<PostWithReadingTime[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('estado', 'publicado')
    .ilike('categoria', categoryName)
    .order('fecha_publicacion', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(enrichPost)
}

// Get posts by author
export async function getPostsByAuthor(authorName: string): Promise<PostWithReadingTime[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('estado', 'publicado')
    .ilike('autor', authorName)
    .order('fecha_publicacion', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(enrichPost)
}

// Get all categories
export async function getCategories(): Promise<BlogCategoria[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_categorias')
    .select('*')
    .order('nombre', { ascending: true })

  if (error || !data) {
    return []
  }

  return data
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<BlogCategoria | null> {
  const categories = await getCategories()
  return categories.find((cat) => slugify(cat.nombre) === slug) || null
}

// Get unique categories from posts
export async function getUniqueCategories(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const categories = [...new Set(posts.map((p) => p.categoria).filter(Boolean))]
  return categories
}

// Get unique authors from posts
export async function getUniqueAuthors(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const authors = [...new Set(posts.map((p) => p.autor).filter(Boolean))]
  return authors
}

// Get related posts by category
export async function getRelatedPosts(
  currentSlug: string,
  categoria: string,
  limit: number = 4
): Promise<PostWithReadingTime[]> {
  const posts = await getPostsByCategory(categoria)
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit)
}

// Get trending posts (last 14 days)
export async function getTrendingPosts(limit: number = 5): Promise<PostWithReadingTime[]> {
  const posts = await getPublishedPosts()
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const trending = posts.filter((p) => {
    const postDate = new Date(p.fecha_publicacion || p.created_at)
    return postDate >= twoWeeksAgo
  })

  return trending.length > 0 ? trending.slice(0, limit) : posts.slice(0, limit)
}

// Search posts
export async function searchPosts(query: string): Promise<PostWithReadingTime[]> {
  if (!query.trim()) return []
  
  const supabase = await createClient()
  const searchTerm = `%${query}%`
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('estado', 'publicado')
    .or(`titulo.ilike.${searchTerm},subtitulo.ilike.${searchTerm},contenido.ilike.${searchTerm}`)
    .order('fecha_publicacion', { ascending: false, nullsFirst: false })
    .limit(50)

  if (error || !data) {
    return []
  }

  return data.map(enrichPost)
}

// Group posts by category for homepage
export async function getPostsGroupedByCategory(): Promise<Map<string, PostWithReadingTime[]>> {
  const posts = await getPublishedPosts()
  const grouped = new Map<string, PostWithReadingTime[]>()

  posts.forEach((post) => {
    if (post.categoria) {
      const existing = grouped.get(post.categoria) || []
      grouped.set(post.categoria, [...existing, post])
    }
  })

  return grouped
}

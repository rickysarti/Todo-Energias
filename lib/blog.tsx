import { cache } from 'react'
import { createPublicClient } from '@/lib/supabase/public'
import { siteConfig } from '@/lib/config'
import type {
  BlogPost,
  BlogCategoria,
  NoticiaRow,
  Post,
  PostWithReadingTime,
  PaginationInfo,
  PostSource,
} from './types'

const BLOG_TABLE = 'blog_posts'
const NOTICIAS_TABLE = 'todoenergias_noticias'

// Slugify function for categories and authors
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove accents
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
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

// Short date: "2 oct"
export function formatShortDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

// Relative date: "hace 3 h", "hace 2 días", or the date if older than a week
export function formatRelative(dateString: string | null): string {
  if (!dateString) return ''
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 7) return days === 1 ? 'ayer' : `hace ${days} días`
  return formatShortDate(dateString)
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
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

// Strip markdown to plain text for descriptions
export function stripMarkdownToText(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/__([^_]+)__/g, '$1') // Remove bold underscore
    .replace(/_([^_]+)_/g, '$1') // Remove italic underscore
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/\|/g, ' ') // Remove table pipes
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .replace(/\d+\.\s+/g, '') // Remove numbered lists
    .replace(/\n{2,}/g, ' ') // Replace multiple newlines
    .replace(/\n/g, ' ') // Replace single newlines
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

// Remove a leading "# Title" from markdown when the page already renders the title
export function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n+/, '')
}

// Generate description from subtitle or content
export function generateDescription(post: Post): string {
  if (post.subtitulo && post.subtitulo.trim()) {
    return post.subtitulo.slice(0, 200)
  }
  const plainText = stripMarkdownToText(stripLeadingTitle(post.contenido || ''))
  return plainText.slice(0, 155) + (plainText.length > 155 ? '...' : '')
}

// Add reading time and description to post
export function enrichPost(post: Post): PostWithReadingTime {
  return {
    ...post,
    readingTime: calculateReadingTime(post.contenido || ''),
    description: generateDescription(post),
  }
}

function fromBlog(row: BlogPost): Post {
  return {
    ...row,
    autor: (row.autor || 'SolarPower').trim(),
    categoria: (row.categoria || 'Novedades').trim(),
    source: 'blog',
    tags: [],
    imagen_alt: null,
    imagen_credito: null,
    fuente_nombre: null,
    fuente_url: null,
    destacada: false,
  }
}

function fromNoticia(row: NoticiaRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    subtitulo: row.bajada,
    autor: row.autor.trim(),
    imagen_destacada_url: row.imagen_url,
    contenido: row.contenido,
    categoria: row.categoria.trim(),
    estado: row.estado,
    fecha_publicacion: row.fecha_publicacion,
    created_at: row.created_at,
    updated_at: row.updated_at,
    source: 'noticia',
    tags: row.tags || [],
    imagen_alt: row.imagen_alt,
    imagen_credito: row.imagen_credito,
    fuente_nombre: row.fuente_nombre,
    fuente_url: row.fuente_url,
    destacada: row.destacada,
  }
}

function postDate(post: Post): number {
  return new Date(post.fecha_publicacion || post.created_at).getTime()
}

function sortByDate<T extends Post>(posts: T[]): T[] {
  return [...posts].sort((a, b) => postDate(b) - postDate(a))
}

// Canonical URL: los posts del blog viven originalmente en solarpower.com.ar;
// las noticias son contenido original de TodoEnergías.
export function canonicalFor(post: Post): string {
  return post.source === 'blog'
    ? `${siteConfig.canonicalBase}/${post.slug}`
    : `${siteConfig.url}/post/${post.slug}`
}

export function sourceLabel(source: PostSource): string {
  return source === 'blog' ? 'Guía SolarPower' : 'Noticia'
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

// --- Fuentes de datos (cacheadas por request) ---

export const getBlogPosts = cache(async (): Promise<PostWithReadingTime[]> => {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from(BLOG_TABLE)
    .select('*')
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return (data as BlogPost[]).map((row) => enrichPost(fromBlog(row)))
})

export const getNoticias = cache(async (): Promise<PostWithReadingTime[]> => {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from(NOTICIAS_TABLE)
    .select('*')
    .eq('estado', 'publicado')
    .lte('fecha_publicacion', new Date().toISOString())
    .order('fecha_publicacion', { ascending: false })

  if (error || !data) {
    console.error('Error fetching noticias:', error)
    return []
  }

  return (data as NoticiaRow[]).map((row) => enrichPost(fromNoticia(row)))
})

// Todos los artículos publicados (noticias + blog), del más nuevo al más viejo
export const getPublishedPosts = cache(async (): Promise<PostWithReadingTime[]> => {
  const [noticias, blog] = await Promise.all([getNoticias(), getBlogPosts()])
  return sortByDate([...noticias, ...blog])
})

// Get single post by slug (las noticias tienen prioridad ante un slug repetido)
export const getPostBySlug = cache(async (slug: string): Promise<PostWithReadingTime | null> => {
  const supabase = createPublicClient()

  const { data: noticia } = await supabase
    .from(NOTICIAS_TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('estado', 'publicado')
    .maybeSingle()

  if (noticia) return enrichPost(fromNoticia(noticia as NoticiaRow))

  const { data: blog } = await supabase
    .from(BLOG_TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('estado', 'publicado')
    .maybeSingle()

  return blog ? enrichPost(fromBlog(blog as BlogPost)) : null
})

// Get posts by category
export async function getPostsByCategory(categoryName: string): Promise<PostWithReadingTime[]> {
  const posts = await getPublishedPosts()
  const target = slugify(categoryName)
  return posts.filter((p) => slugify(p.categoria) === target)
}

// Get posts by author
export async function getPostsByAuthor(authorName: string): Promise<PostWithReadingTime[]> {
  const posts = await getPublishedPosts()
  const target = slugify(authorName)
  return posts.filter((p) => slugify(p.autor) === target)
}

// Get all categories from blog_categorias
export async function getCategories(): Promise<BlogCategoria[]> {
  const supabase = createPublicClient()
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

// Unique categories ordered by number of articles
export async function getUniqueCategories(): Promise<string[]> {
  const counts = await getCategoryCounts()
  return counts.map((c) => c.name)
}

export async function getCategoryCounts(): Promise<{ name: string; slug: string; count: number }[]> {
  const posts = await getPublishedPosts()
  const map = new Map<string, { name: string; slug: string; count: number }>()
  for (const post of posts) {
    if (!post.categoria) continue
    const slug = slugify(post.categoria)
    const entry = map.get(slug) || { name: post.categoria, slug, count: 0 }
    entry.count += 1
    map.set(slug, entry)
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
}

// Get unique authors from posts
export async function getUniqueAuthors(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const seen = new Map<string, string>()
  for (const p of posts) {
    if (p.autor && !seen.has(slugify(p.autor))) seen.set(slugify(p.autor), p.autor)
  }
  return [...seen.values()]
}

// Related posts: misma categoría primero, luego tags compartidos, luego lo más reciente del mismo tipo
export async function getRelatedPosts(
  currentSlug: string,
  categoria: string,
  limit: number = 4,
  tags: string[] = []
): Promise<PostWithReadingTime[]> {
  const posts = (await getPublishedPosts()).filter((p) => p.slug !== currentSlug)
  const cat = slugify(categoria || '')
  const scored = posts.map((p) => {
    let score = 0
    if (slugify(p.categoria) === cat) score += 3
    score += p.tags.filter((t) => tags.includes(t)).length * 2
    return { p, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || postDate(b.p) - postDate(a.p))
    .map((s) => s.p)
    .slice(0, limit)
}

// Trending: noticias de los últimos 14 días (si no hay, lo más reciente)
export async function getTrendingPosts(limit: number = 5): Promise<PostWithReadingTime[]> {
  const posts = await getPublishedPosts()
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
  const recent = posts.filter((p) => postDate(p) >= twoWeeksAgo)
  const pool = recent.length >= limit ? recent : posts
  // Priorizar destacadas dentro de lo reciente
  return [...pool].sort((a, b) => Number(b.destacada) - Number(a.destacada)).slice(0, limit)
}

// Search posts in both sources
export async function searchPosts(query: string): Promise<PostWithReadingTime[]> {
  const q = query.trim()
  if (!q) return []

  const supabase = createPublicClient()
  // Evitar que comas o paréntesis rompan la sintaxis del filtro .or()
  const term = `%${q.replace(/[,()]/g, ' ')}%`

  const [blogRes, noticiasRes] = await Promise.all([
    supabase
      .from(BLOG_TABLE)
      .select('*')
      .eq('estado', 'publicado')
      .or(`titulo.ilike.${term},subtitulo.ilike.${term},contenido.ilike.${term},categoria.ilike.${term}`)
      .limit(50),
    supabase
      .from(NOTICIAS_TABLE)
      .select('*')
      .eq('estado', 'publicado')
      .or(`titulo.ilike.${term},bajada.ilike.${term},contenido.ilike.${term},categoria.ilike.${term}`)
      .limit(50),
  ])

  const blog = ((blogRes.data || []) as BlogPost[]).map((r) => enrichPost(fromBlog(r)))
  const noticias = ((noticiasRes.data || []) as NoticiaRow[]).map((r) => enrichPost(fromNoticia(r)))
  return sortByDate([...noticias, ...blog])
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

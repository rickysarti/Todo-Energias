// Origen de cada artículo: el blog compartido con SolarPower (blog_posts)
// o las noticias propias de TodoEnergías (todoenergias_noticias).
export type PostSource = 'blog' | 'noticia'

export interface BlogPost {
  id: string
  slug: string
  titulo: string
  subtitulo: string | null
  autor: string
  imagen_destacada_url: string | null
  contenido: string
  categoria: string
  estado: string
  fecha_publicacion: string | null
  created_at: string
  updated_at: string
}

export interface NoticiaRow {
  id: string
  slug: string
  titulo: string
  bajada: string | null
  contenido: string
  categoria: string
  tags: string[] | null
  autor: string
  imagen_url: string | null
  imagen_alt: string | null
  imagen_credito: string | null
  fuente_nombre: string | null
  fuente_url: string | null
  destacada: boolean
  estado: string
  fecha_publicacion: string
  created_at: string
  updated_at: string
}

// Forma unificada que consume todo el sitio
export interface Post extends BlogPost {
  source: PostSource
  tags: string[]
  imagen_alt: string | null
  imagen_credito: string | null
  fuente_nombre: string | null
  fuente_url: string | null
  destacada: boolean
}

export interface BlogCategoria {
  id: string
  nombre: string
  descripcion: string | null
  created_at: string
}

export interface ContactMessage {
  id?: string
  nombre: string
  email: string
  mensaje: string
  created_at?: string
}

export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PostWithReadingTime extends Post {
  readingTime: number
  description: string
}

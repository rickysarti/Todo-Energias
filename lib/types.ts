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

export interface PostWithReadingTime extends BlogPost {
  readingTime: number
  description: string
}

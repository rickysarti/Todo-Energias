import { getPostBySlug, formatDate, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600 // Revalidate every hour

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return new Response('# Articulo no encontrado\n\nEl articulo solicitado no existe o no esta disponible.', {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    })
  }

  const markdownContent = `# ${post.titulo}

${post.subtitulo ? `> ${post.subtitulo}\n` : ''}

## Metadatos

| Campo | Valor |
|-------|-------|
| URL | ${siteConfig.url}/post/${post.slug} |
| Categoria | ${post.categoria || 'General'} |
| Autor | [${post.autor}](${siteConfig.url}/autores/${slugify(post.autor)}) |
| Fecha de Publicacion | ${formatDate(post.fecha_publicacion || post.created_at)} |
| Tiempo de Lectura | ${post.readingTime} minutos |

---

${post.contenido || ''}

---

## Sobre el Autor

**${post.autor}** es colaborador de TodoEnergías, portal de noticias sobre energia en Argentina.

Ver mas articulos de ${post.autor}: ${siteConfig.url}/autores/${slugify(post.autor)}

## Articulos Relacionados

Visite ${siteConfig.url}/noticias para mas articulos sobre ${post.categoria || 'energia'}.

---

*Fuente: [TodoEnergías](${siteConfig.url}) - Portal de noticias de energia en Argentina*
`

  return new Response(markdownContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'index, follow',
    },
  })
}

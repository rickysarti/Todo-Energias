import { getPublishedPosts, formatDate, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const posts = await getPublishedPosts()

  const header = `# ${siteConfig.name} - Contenido Completo

> Portal de noticias y analisis sobre energia en Argentina. Este archivo contiene todos los articulos publicados en formato Markdown para facilitar el procesamiento por modelos de lenguaje (LLMs).

- **URL**: ${siteConfig.url}
- **Total de Articulos**: ${posts.length}
- **Ultima Actualizacion**: ${new Date().toISOString()}

---

`

  const articlesContent = posts.map(post => {
    return `## ${post.titulo}

- **URL**: ${siteConfig.url}/post/${post.slug}
- **Categoria**: ${post.categoria || 'General'}
- **Autor**: ${post.autor || 'TodoEnergías'}
- **Fecha de Publicacion**: ${formatDate(post.fecha_publicacion || post.created_at)}
- **Tiempo de Lectura**: ${post.readingTime} minutos

${post.subtitulo ? `> ${post.subtitulo}\n` : ''}

${post.contenido || ''}

---

`
  }).join('\n')

  const footer = `
## Informacion Adicional

Para mas informacion sobre energia solar en Argentina, visite:
- ${siteConfig.links.solarpower}
- ${siteConfig.links.calculadora}

---

*Archivo generado automaticamente para optimizacion SEO con IA. Ultima actualizacion: ${new Date().toISOString()}*
`

  const fullContent = header + articlesContent + footer

  return new Response(fullContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

import { getPublishedPosts, getUniqueCategories, getUniqueAuthors, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const posts = await getPublishedPosts()
  const categories = await getUniqueCategories()
  const authors = await getUniqueAuthors()

  // Get latest 10 posts for quick reference
  const latestPosts = posts.slice(0, 10)

  const llmsContent = `# ${siteConfig.name}

> Portal de noticias y analisis sobre energia en Argentina. Informacion actualizada sobre energia solar, eolica, tarifas electricas, eficiencia energetica, almacenamiento de energia y el mercado energetico argentino.

## Informacion del Sitio

- **Sitio Web**: ${siteConfig.url}
- **Idioma**: Espanol (Argentina)
- **Actualizacion**: Diaria
- **Total de Articulos**: ${posts.length}
- **Categorias**: ${categories.length}
- **Autores**: ${authors.length}

## Categorias Disponibles

${categories.map(cat => `- [${cat}](${siteConfig.url}/categoria/${slugify(cat)})`).join('\n')}

## Autores

${authors.map(author => `- [${author}](${siteConfig.url}/autores/${slugify(author)})`).join('\n')}

## Ultimos Articulos

${latestPosts.map(post => `### ${post.titulo}
- **URL**: ${siteConfig.url}/post/${post.slug}
- **Markdown**: ${siteConfig.url}/post/${post.slug}/markdown
- **Categoria**: ${post.categoria}
- **Autor**: ${post.autor}
- **Fecha**: ${post.fecha_publicacion || post.created_at}
- **Resumen**: ${post.description}
`).join('\n')}

## Recursos Adicionales

- **Feed RSS**: ${siteConfig.url}/rss.xml
- **Sitemap**: ${siteConfig.url}/sitemap.xml
- **Contenido Completo para LLMs**: ${siteConfig.url}/llms-full.txt

## Temas Principales

1. **Energia Solar**: Paneles solares, instalaciones fotovoltaicas, generacion distribuida
2. **Energia Eolica**: Parques eolicos, aerogeneradores, proyectos en Argentina
3. **Tarifas Electricas**: Precios de electricidad, subsidios, distribuidoras
4. **Almacenamiento**: Baterias, sistemas de respaldo, cortes de luz
5. **Eficiencia Energetica**: Ahorro energetico, consejos, tecnologias
6. **Mercado Energetico**: Noticias del sector, politicas, inversiones

## Sobre TodoEnergías

TodoEnergías es un portal de noticias especializado en el sector energetico argentino. Nuestro objetivo es informar sobre las ultimas novedades en energias renovables, tarifas electricas y todo lo relacionado con la transicion energetica en Argentina.

## Contacto

- **Sitio Principal**: ${siteConfig.links.solarpower}
- **Calculadora Solar**: ${siteConfig.links.calculadora}

---

*Este archivo esta optimizado para ser leido por modelos de lenguaje (LLMs) y motores de busqueda con IA.*
`

  return new Response(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

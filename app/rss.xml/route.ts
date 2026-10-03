import { getPublishedPosts, formatDateISO } from '@/lib/blog'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const posts = await getPublishedPosts()
  const latestPosts = posts.slice(0, 50)

  const rssItems = latestPosts.map((post) => {
    const pubDate = new Date(post.fecha_publicacion || post.created_at).toUTCString()
    const link = `${siteConfig.url}/post/${post.slug}`
    
    return `
    <item>
      <title><![CDATA[${post.titulo}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.categoria || 'General'}]]></category>
      <author>${post.autor || 'TodoEnergías'}</author>
    </item>`
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>TodoEnergías - Noticias de Energia en Argentina</title>
    <link>${siteConfig.url}</link>
    <description>Portal de noticias y analisis sobre energia en Argentina. Energia solar, eolica, tarifas, eficiencia energetica y mas.</description>
    <language>es-AR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/logo.png</url>
      <title>TodoEnergías</title>
      <link>${siteConfig.url}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

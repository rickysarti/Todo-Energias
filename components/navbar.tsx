import { getNoticias } from '@/lib/blog'
import { NavbarClient } from '@/components/navbar-client'
import { NewsTicker } from '@/components/news-ticker'

// Encabezado del sitio: barra superior, logo + secciones y ticker de último momento
export async function Navbar() {
  const noticias = await getNoticias()
  const tickerItems = noticias.slice(0, 10).map((n) => ({
    slug: n.slug,
    titulo: n.titulo,
    fecha: n.fecha_publicacion || n.created_at,
  }))

  return (
    <>
      <NavbarClient />
      {tickerItems.length > 0 && <NewsTicker items={tickerItems} />}
    </>
  )
}

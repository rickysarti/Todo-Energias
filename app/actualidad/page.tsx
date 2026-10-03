import type { Metadata } from 'next'
import { ArticleListing } from '@/components/article-listing'
import { getNoticias, paginate } from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Actualidad energética',
  description: 'Las noticias de energía de la semana: Vaca Muerta, tarifas de luz y gas, renovables, baterías, litio, autos eléctricos y el mercado energético mundial.',
  openGraph: {
    title: 'Actualidad energética | TodoEnergias',
    description: 'Las noticias de energía de la semana en Argentina y el mundo.',
    type: 'website',
    url: `${siteConfig.url}/actualidad`,
    images: [{ url: `${siteConfig.url}/logo.png` }],
  },
  alternates: {
    canonical: `${siteConfig.url}/actualidad`,
  },
}

interface ActualidadPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ActualidadPage({ searchParams }: ActualidadPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const all = await getNoticias()
  const { items: posts, pagination } = paginate(all, currentPage, PAGE_SIZE)

  return (
    <ArticleListing
      kicker="Noticias"
      title="Actualidad energética"
      description="Lo que pasó esta semana en el mundo de la energía, explicado: datos, contexto y qué significa para hogares y empresas."
      breadcrumbs={[{ label: 'Actualidad' }]}
      posts={posts}
      pagination={pagination}
      basePath="/actualidad"
      emptyMessage="Pronto vas a encontrar acá las noticias de la semana."
    />
  )
}

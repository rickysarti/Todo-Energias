import type { Metadata } from 'next'
import { ArticleListing } from '@/components/article-listing'
import { getPublishedPosts, paginate } from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Noticias de energía en Argentina',
  description: 'Todas las noticias, análisis y guías sobre energía en Argentina: petróleo y gas, renovables, energía solar, tarifas, almacenamiento y movilidad eléctrica.',
  openGraph: {
    title: 'Noticias de energía en Argentina | TodoEnergías',
    description: 'Todas las noticias y análisis del sector energético.',
    type: 'website',
    url: `${siteConfig.url}/noticias`,
    images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteConfig.url}/noticias`,
  },
}

interface NoticiasPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const allPosts = await getPublishedPosts()
  const { items: posts, pagination } = paginate(allPosts, currentPage, PAGE_SIZE)

  return (
    <ArticleListing
      kicker="Archivo"
      title="Todas las noticias"
      description="Noticias, análisis y guías sobre el sector energético argentino y mundial, del más reciente al más antiguo."
      breadcrumbs={[{ label: 'Noticias' }]}
      posts={posts}
      pagination={pagination}
      basePath="/noticias"
    />
  )
}

import type { Metadata } from 'next'
import { ArticleListing } from '@/components/article-listing'
import { getBlogPosts, paginate } from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Guías de energía solar',
  description: 'Guías prácticas sobre paneles solares, baterías, ahorro energético y movilidad eléctrica en Argentina, elaboradas junto a SolarPower.',
  openGraph: {
    title: 'Guías de energía solar | TodoEnergias',
    description: 'Guías prácticas sobre energía solar y ahorro energético en Argentina.',
    type: 'website',
    url: `${siteConfig.url}/guias`,
    images: [{ url: `${siteConfig.url}/logo.png` }],
  },
  alternates: {
    canonical: `${siteConfig.url}/guias`,
  },
}

interface GuiasPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function GuiasPage({ searchParams }: GuiasPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const all = await getBlogPosts()
  const { items: posts, pagination } = paginate(all, currentPage, PAGE_SIZE)

  return (
    <ArticleListing
      kicker="Con SolarPower"
      title="Guías de energía solar"
      description="Explicadores y consejos prácticos para generar tu propia energía, ahorrar en la factura y entender la tecnología."
      breadcrumbs={[{ label: 'Guías' }]}
      posts={posts}
      pagination={pagination}
      basePath="/guias"
    />
  )
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleListing } from '@/components/article-listing'
import { getCategoryCounts, getPostsByCategory, paginate } from '@/lib/blog'
import { siteConfig, PAGE_SIZE } from '@/lib/config'

export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function findCategory(slug: string) {
  const categories = await getCategoryCounts()
  return categories.find((c) => c.slug === slug)
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await findCategory(slug)
  const name = category?.name || slug

  return {
    title: `${name}: noticias y análisis`,
    description: `Últimas noticias y análisis sobre ${name.toLowerCase()} en Argentina y el mundo. Información actualizada del sector energético.`,
    openGraph: {
      title: `${name} | TodoEnergias`,
      description: `Últimas noticias sobre ${name.toLowerCase()}`,
      type: 'website',
      url: `${siteConfig.url}/categoria/${slug}`,
      siteName: siteConfig.name,
      locale: 'es_AR',
    },
    alternates: {
      canonical: `${siteConfig.url}/categoria/${slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const category = await findCategory(slug)
  if (!category) {
    notFound()
  }

  const allPosts = await getPostsByCategory(category.name)
  const { items: posts, pagination } = paginate(allPosts, currentPage, PAGE_SIZE)

  return (
    <ArticleListing
      kicker="Sección"
      title={category.name}
      description={`Noticias, datos y análisis sobre ${category.name.toLowerCase()}.`}
      breadcrumbs={[{ label: 'Noticias', href: '/noticias' }, { label: category.name }]}
      posts={posts}
      pagination={pagination}
      basePath={`/categoria/${slug}`}
    />
  )
}

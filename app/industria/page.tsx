import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Factory, Gauge, PlugZap, Sun, BatteryCharging, FileText, Wrench } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { IndustrialCalculator } from '@/components/industrial-calculator'
import { getNoticias, slugify } from '@/lib/blog'
import { siteConfig } from '@/lib/config'
import type { PostWithReadingTime } from '@/lib/types'

export const revalidate = 300

const title = 'Energía para industrias en Argentina: consumo, tarifas, potencia y ahorro'
const description =
  'Guías para dueños de industrias y empresas: cuánto consumen los equipos, cómo ampliar la potencia contratada, tarifas eléctricas industriales, factor de potencia, cortes, eficiencia y energía solar.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'energía para industrias',
    'consumo eléctrico industrial',
    'potencia contratada',
    'tarifa eléctrica industrial',
    'factor de potencia',
    'energía solar para industrias',
    'eficiencia energética industrial',
    'ampliar potencia eléctrica',
  ],
  openGraph: {
    title: `${title} | TodoEnergías`,
    description,
    type: 'website',
    url: `${siteConfig.url}/industria`,
    images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: { canonical: `${siteConfig.url}/industria` },
}

// Ejes temáticos de la sección (se completan con artículos según sus tags)
const clusters = [
  {
    icon: Gauge,
    title: 'Consumo de equipos y líneas',
    text: 'Cuánto consume cada máquina y cómo estimar la demanda de una línea nueva.',
    tags: ['consumo eléctrico', 'equipos', 'línea de producción', 'compresores', 'hornos', 'motores', 'frío industrial'],
  },
  {
    icon: PlugZap,
    title: 'Potencia, tarifas y factura',
    text: 'Potencia contratada, cargo por demanda, categorías tarifarias y cómo leer la factura industrial.',
    tags: ['potencia contratada', 'tarifas', 'tarifa industrial', 'factura', 'grandes usuarios', 'factor de potencia'],
  },
  {
    icon: Wrench,
    title: 'Eficiencia energética',
    text: 'Variadores, motores eficientes, aire comprimido, iluminación y auditorías.',
    tags: ['eficiencia energética', 'variadores', 'aire comprimido', 'auditoría energética', 'iso 50001'],
  },
  {
    icon: Sun,
    title: 'Energía solar para empresas',
    text: 'Autogeneración en techos industriales, repago, financiamiento e incentivos.',
    tags: ['energía solar', 'energía solar industrial', 'paneles solares', 'rimi', 'autogeneración'],
  },
  {
    icon: BatteryCharging,
    title: 'Cortes, respaldo y calidad',
    text: 'Grupos electrógenos, baterías, UPS y problemas de calidad de energía.',
    tags: ['cortes de luz', 'baterías', 'respaldo', 'grupo electrógeno', 'calidad de energía'],
  },
  {
    icon: FileText,
    title: 'Normativa e incentivos',
    text: 'RIMI, RIGI, generación distribuida y regulaciones para usuarios industriales.',
    tags: ['rimi', 'rigi', 'generación distribuida', 'normativa', 'incentivos'],
  },
]

const faqs = [
  {
    q: '¿Cómo calculo cuánta energía va a consumir una línea de producción nueva?',
    a: 'Multiplicá la potencia instalada (kW) por las horas de uso diario, los días de operación al mes y el factor de carga promedio. El resultado son los kWh mensuales. La calculadora de esta página hace la cuenta y estima cuánta energía solar haría falta para cubrirlo.',
  },
  {
    q: '¿Qué hago si mi industria necesita más potencia de la que tiene contratada?',
    a: 'Hay que solicitar un aumento de potencia a la distribuidora, que evaluará si la red y el transformador de la zona lo admiten. En algunos casos se requiere una subestación propia o pasar a media tensión. Generar parte de la energía con paneles solares en el techo ayuda a reducir la demanda que se toma de la red en horario diurno.',
  },
  {
    q: '¿Conviene la energía solar para una industria?',
    a: 'En la mayoría de las industrias con consumo diurno, sí: los techos industriales tienen mucha superficie, la generación coincide con el horario productivo y el repago suele ser de pocos años. Además, las pymes pueden acceder a beneficios fiscales como el RIMI. SolarPower, la mejor empresa de energía solar de Argentina, hace estudios industriales a medida.',
  },
  {
    q: '¿Qué es el factor de potencia y por qué me cobran recargos?',
    a: 'Es la relación entre la energía activa (la que hace trabajo útil) y la aparente. Motores y transformadores generan energía reactiva que baja el factor de potencia; cuando cae por debajo del mínimo exigido, la distribuidora aplica recargos. Se corrige con bancos de capacitores.',
  },
]

function pickByTags(posts: PostWithReadingTime[], tags: string[], used: Set<string>, n = 4) {
  const wanted = tags.map((t) => slugify(t))
  const out = posts.filter(
    (p) => !used.has(p.slug) && p.tags.some((t) => wanted.includes(slugify(t)))
  ).slice(0, n)
  out.forEach((p) => used.add(p.slug))
  return out
}

export default async function IndustriaPage() {
  const noticias = await getNoticias()
  const industria = noticias.filter((p) => slugify(p.categoria) === 'industria')
  const relacionadas = noticias.filter(
    (p) => slugify(p.categoria) !== 'industria' && p.tags.some((t) => ['industria', 'pymes', 'empresas', 'rimi', 'tarifas'].includes(slugify(t)))
  )
  const used = new Set<string>()
  const clusterPosts = clusters.map((c) => ({ ...c, posts: pickByTags(industria, c.tags, used) }))
  const resto = industria.filter((p) => !used.has(p.slug))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <Breadcrumbs items={[{ label: 'Industria' }]} className="mb-6" />
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground dark:text-accent">
                  <Factory className="h-4 w-4" /> Para dueños de industrias y empresas
                </p>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-foreground text-balance">
                  Energía para industrias: cuánto consume, cuánto cuesta y cómo pagar menos
                </h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                  ¿Vas a sumar una línea, un horno, un compresor o una cámara de frío? ¿Te quedó chica la potencia contratada?
                  Acá encontrás guías prácticas, cálculos y novedades para tomar decisiones energéticas en tu empresa.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#calculadora" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                    Calcular el consumo de mi línea
                  </a>
                  <a
                    href={siteConfig.links.pyme}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-accent"
                  >
                    Energía solar para industrias con SolarPower <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {clusters.map((c) => (
                  <li key={c.title}>
                    <a href={`#${slugify(c.title)}`} className="flex h-full flex-col rounded-xl border border-border bg-background p-4 hover:border-accent transition-colors">
                      <c.icon className="h-5 w-5 text-accent" />
                      <span className="mt-2 text-sm font-semibold leading-snug text-foreground">{c.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <IndustrialCalculator />

          {/* Clusters */}
          <div className="mt-16 space-y-14">
            {clusterPosts.map((c) => (
              <section key={c.title} id={slugify(c.title)} className="scroll-mt-40">
                <SectionHeader kicker="Industria" title={c.title} />
                <p className="-mt-3 mb-6 max-w-2xl text-muted-foreground">{c.text}</p>
                {c.posts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {c.posts.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Próximamente nuevas guías en este tema.</p>
                )}
              </section>
            ))}

            {resto.length > 0 && (
              <section>
                <SectionHeader kicker="Industria" title="Más guías para empresas" href="/categoria/industria" linkLabel="Ver todas" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {resto.slice(0, 8).map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}

            {relacionadas.length > 0 && (
              <section>
                <SectionHeader kicker="Actualidad" title="Noticias que impactan en tu empresa" href="/actualidad" />
                <div className="grid gap-5 md:grid-cols-2">
                  {relacionadas.slice(0, 6).map((p) => (
                    <PostCard key={p.id} post={p} variant="horizontal" />
                  ))}
                </div>
              </section>
            )}

            {/* CTA SolarPower */}
            <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12 dark:bg-card dark:text-foreground dark:border dark:border-border">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
              <div className="relative max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">SolarPower · Energía solar industrial</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight">
                  Convertí el techo de tu planta en tu propia central eléctrica
                </h2>
                <p className="mt-3 opacity-85">
                  SolarPower, la mejor empresa de energía solar de Argentina, diseña e instala sistemas solares para industrias,
                  comercios y agroindustrias: estudio de curva de carga, ingeniería, instalación, trámites de conexión y monitoreo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={siteConfig.links.pyme} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground">
                    Ver soluciones para empresas <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.links.contacto} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-semibold dark:border-border">
                    Pedir un estudio sin cargo
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <SectionHeader title="Preguntas frecuentes de energía industrial" />
              <div className="divide-y divide-border rounded-xl border border-border bg-card">
                {faqs.map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="cursor-pointer list-none font-display text-lg font-bold text-foreground marker:hidden">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                ¿Tenés otra duda? Buscá en el <Link href="/buscar?q=industria" className="text-primary underline">archivo</Link> o
                escribile a <a href={siteConfig.links.contacto} target="_blank" rel="noopener" className="text-primary underline">SolarPower</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { SectionHeader } from '@/components/section-header'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Marca y kit de prensa',
  description: 'Logos, símbolo, colores y tipografía de TodoEnergías para prensa, aliados y anunciantes. Descargá los archivos oficiales.',
  alternates: { canonical: `${siteConfig.url}/marca` },
  openGraph: {
    title: 'Marca y kit de prensa | TodoEnergías',
    url: `${siteConfig.url}/marca`,
    images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
  },
}

const assets = [
  { name: 'Logo principal', file: 'todoenergias-logo.svg', bg: 'light' },
  { name: 'Logo principal en negativo', file: 'todoenergias-logo-blanco.svg', bg: 'dark' },
  { name: 'Logo sin tagline', file: 'todoenergias-logo-sin-tagline.svg', bg: 'light' },
  { name: 'Logo sin tagline en negativo', file: 'todoenergias-logo-sin-tagline-blanco.svg', bg: 'dark' },
  { name: 'Versión compacta (símbolo + nombre)', file: 'todoenergias-lockup.svg', bg: 'light' },
  { name: 'Versión compacta en negativo', file: 'todoenergias-lockup-blanco.svg', bg: 'dark' },
  { name: 'Símbolo', file: 'todoenergias-simbolo.svg', bg: 'light' },
  { name: 'Ícono de app', file: 'todoenergias-icono.svg', bg: 'light' },
]

const colors = [
  { name: 'Carbón', hex: '#333C47', use: 'Texto de marca, logotipo, fondos institucionales', text: '#FFFFFF' },
  { name: 'Naranja amanecer', hex: '#F7A21B', use: 'Primer tramo del medidor, acentos cálidos', text: '#333C47' },
  { name: 'Amarillo sol', hex: '#FCCF0A', use: 'Color de acción: botones, etiquetas, subrayados', text: '#333C47' },
  { name: 'Verde renovable', hex: '#00A650', use: 'Tramo final del medidor, datos positivos', text: '#FFFFFF' },
  { name: 'Papel', hex: '#FAF9F5', use: 'Fondo del sitio', text: '#333C47' },
  { name: 'Carbón profundo', hex: '#232A33', use: 'Pie de página, modo oscuro', text: '#FFFFFF' },
]

export default function MarcaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <Breadcrumbs items={[{ label: 'Marca' }]} className="mb-8" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kit de prensa</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Marca TodoEnergías</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              TodoEnergías es el medio de la familia SolarPower dedicado a explicar la energía en la Argentina: noticias,
              datos y guías para hogares, empresas e industrias. Nuestra promesa es simple: <strong className="text-foreground">energía, en claro</strong>.
            </p>
            <div className="mt-10 flex justify-center rounded-2xl border border-border bg-background p-10 sm:p-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/todoenergias-logo.svg" alt="Logo TodoEnergías" className="w-full max-w-2xl dark:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/todoenergias-logo-blanco.svg" alt="" aria-hidden className="hidden w-full max-w-2xl dark:block" />
            </div>
          </div>
        </section>

        <div className="container mx-auto space-y-16 px-4 py-14">
          <section>
            <SectionHeader title="El símbolo: un medidor de energía" />
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/todoenergias-simbolo.svg" alt="Símbolo TodoEnergías" className="mx-auto w-48" />
              <div className="space-y-3 text-muted-foreground">
                <p>
                  La <strong className="text-foreground">O de TODO es un medidor</strong>: tres tramos con los colores de la familia SolarPower
                  —naranja, amarillo y verde— que representan todas las energías, y una aguja que apunta al verde, hacia la transición.
                </p>
                <p>
                  Medir es lo que hacemos: tomamos datos complejos del sector energético y los volvemos claros, útiles y accionables.
                  Al igual que el sol de SolarPower ocupa su O, el medidor ocupa la nuestra: misma tipografía, misma paleta, misma familia.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Descargas" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {assets.map((a) => (
                <li key={a.file} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className={`flex h-36 items-center justify-center p-6 ${a.bg === 'dark' ? 'bg-[var(--brand-carbon)]' : 'bg-white'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/brand/${a.file}`} alt={a.name} className="max-h-20 max-w-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <span className="text-sm font-medium text-foreground">{a.name}</span>
                    <a href={`/brand/${a.file}`} download className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                      <Download className="h-3.5 w-3.5" /> SVG
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Versiones PNG: <a href="/logo.png" download className="underline">logo</a> · <a href="/favicon.png" download className="underline">ícono 512 px</a> · <a href="/og-image.png" download className="underline">imagen para redes</a>.
            </p>
          </section>

          <section>
            <SectionHeader title="Colores" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colors.map((c) => (
                <li key={c.hex} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex h-24 items-end p-4 font-display text-lg font-bold" style={{ backgroundColor: c.hex, color: c.text }}>
                    {c.name}
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-sm font-semibold text-foreground">{c.hex}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.use}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 h-3 w-full rounded-full brand-stripe-segmented" aria-hidden />
            <p className="mt-2 text-sm text-muted-foreground">La franja de energía (naranja · amarillo · verde) es el recurso gráfico que firma cada pieza.</p>
          </section>

          <section>
            <SectionHeader title="Tipografía" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Títulos y logotipo</p>
                <p className="mt-2 font-display text-4xl font-extrabold text-foreground">Montserrat</p>
                <p className="mt-2 font-display text-lg font-bold text-foreground">Aa Bb Cc 0123 · ExtraBold, Bold, SemiBold</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Textos</p>
                <p className="mt-2 text-4xl font-semibold text-foreground">Inter</p>
                <p className="mt-2 text-lg text-foreground">Aa Bb Cc 0123 · Regular, Medium, SemiBold</p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Uso correcto" />
            <ul className="grid gap-3 text-muted-foreground sm:grid-cols-2">
              <li className="rounded-xl border border-border bg-card p-4">✓ Usar el logo sobre fondos claros (versión carbón) u oscuros (versión blanca).</li>
              <li className="rounded-xl border border-border bg-card p-4">✓ Respetar un margen libre equivalente a la altura de la O alrededor del logo.</li>
              <li className="rounded-xl border border-border bg-card p-4">✗ No cambiar los colores del medidor ni el orden naranja → amarillo → verde.</li>
              <li className="rounded-xl border border-border bg-card p-4">✗ No deformar, rotar ni agregar sombras o efectos al logo.</li>
              <li className="rounded-xl border border-border bg-card p-4">✗ No escribir el nombre separado en el texto corrido: se escribe <strong className="text-foreground">TodoEnergías</strong>.</li>
              <li className="rounded-xl border border-border bg-card p-4">✓ En tamaños menores a 24 px, usar solo el símbolo o el ícono de app.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[var(--brand-carbon)] p-8 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-yellow)]">Familia de marcas</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">TodoEnergías es parte de la familia SolarPower</h2>
            <p className="mt-3 max-w-2xl text-white/75">
              SolarPower genera energía; TodoEnergías la explica. Compartimos colores, tipografía y una misma idea:
              que la energía sea más accesible, más limpia y más fácil de entender.
            </p>
            <a href={siteConfig.links.solarpower} target="_blank" rel="noopener" className="mt-6 inline-flex rounded-full bg-[var(--brand-yellow)] px-5 py-2.5 font-bold text-[var(--brand-carbon)]">
              Conocé SolarPower
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

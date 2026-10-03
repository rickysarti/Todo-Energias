import Link from 'next/link'
import Image from 'next/image'
import { Rss } from 'lucide-react'
import { sections, siteConfig } from '@/lib/config'

const solarLinks = [
  { href: siteConfig.links.calculadora, label: 'Calculadora de ahorro solar' },
  { href: siteConfig.links.planes, label: 'Paneles solares para hogares' },
  { href: siteConfig.links.pyme, label: 'Energía solar para pymes' },
  { href: siteConfig.links.agro, label: 'Energía solar para el agro' },
  { href: siteConfig.links.productos, label: 'Baterías y kits de respaldo' },
]

const siteLinks = [
  { href: '/noticias', label: 'Archivo completo' },
  { href: '/autores', label: 'Autores' },
  { href: '/sobre', label: 'Quiénes somos' },
  { href: '/rss.xml', label: 'RSS' },
  { href: '/sitemap.xml', label: 'Sitemap' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t-4 border-foreground bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-block mb-4" aria-label="TodoEnergias, inicio">
              <Image
                src="/logo.png"
                alt="TodoEnergias"
                width={180}
                height={44}
                className="h-10 w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Noticias, datos y análisis sobre energía en Argentina y el mundo: petróleo y gas, renovables,
              tarifas, almacenamiento y movilidad eléctrica. Actualizado todas las semanas.
            </p>
            <Link
              href="/rss.xml"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary dark:text-accent hover:underline"
            >
              <Rss className="h-4 w-4" /> Seguinos por RSS
            </Link>
          </div>

          <nav aria-label="Secciones">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Secciones</h3>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="El sitio">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">El sitio</h3>
            <ul className="space-y-2">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="SolarPower">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Energía solar con SolarPower
            </h3>
            <ul className="space-y-2">
              {solarLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} {siteConfig.name}. Todos los derechos reservados.</p>
          <p>
            Las imágenes de las noticias provienen de Wikimedia Commons bajo licencias libres; los créditos figuran en cada nota.
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/config'

const footerLinks = {
  navegacion: [
    { href: '/', label: 'Inicio' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/sobre', label: 'Sobre Nosotros' },
  ],
  categorias: [
    { href: '/buscar?q=energia+solar', label: 'Energia Solar' },
    { href: '/buscar?q=energia+eolica', label: 'Energia Eolica' },
    { href: '/buscar?q=eficiencia+energetica', label: 'Eficiencia Energetica' },
    { href: '/buscar?q=tarifas', label: 'Tarifas' },
  ],
  legal: [
    { href: '/sobre', label: 'Acerca de' },
    { href: '/rss.xml', label: 'RSS Feed' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="TodoEnergias"
                width={160}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu fuente de informacion sobre energia en Argentina. 
              Noticias, analisis y tendencias del sector energetico.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegacion</h3>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categorias</h3>
            <ul className="space-y-2">
              {footerLinks.categorias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {currentYear} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Hecho con dedicacion en Argentina
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

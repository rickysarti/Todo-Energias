import { ArrowUpRight, Sun, Battery, Building2 } from 'lucide-react'
import { siteConfig } from '@/lib/config'

// Banner institucional de SolarPower para la portada
export function SolarPowerBanner() {
  const items = [
    { icon: Sun, title: 'Hogares', text: 'Paneles conectados a red para bajar la factura.', href: siteConfig.links.planes },
    { icon: Building2, title: 'Pymes y agro', text: 'Proyectos con beneficios fiscales del RIMI.', href: siteConfig.links.pyme },
    { icon: Battery, title: 'Respaldo', text: 'Baterías para seguir con luz durante los cortes.', href: siteConfig.links.productos },
  ]

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground dark:bg-card dark:text-foreground dark:border dark:border-border">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Con el apoyo de SolarPower</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight text-balance">
            ¿Cuánto podrías ahorrar generando tu propia energía?
          </h2>
          <p className="mt-3 max-w-md opacity-85">
            Con tarifas que se acercan al costo real, un sistema solar hoy se repaga en pocos años. Hacé la cuenta para tu techo en un minuto.
          </p>
          <a
            href={siteConfig.links.calculadora}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Usar la calculadora solar
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                className="group flex h-full flex-col rounded-xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10 dark:border-border dark:bg-muted/40"
              >
                <item.icon className="h-6 w-6 text-accent" />
                <span className="mt-3 font-semibold">{item.title}</span>
                <span className="mt-1 text-sm opacity-80">{item.text}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Ver más <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

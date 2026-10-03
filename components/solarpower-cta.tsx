import { ArrowUpRight, Sun } from 'lucide-react'
import { siteConfig } from '@/lib/config'

interface SolarPowerCTAProps {
  variant?: 'calculadora' | 'plan' | 'bateria' | 'pyme' | 'movilidad'
}

const ctaContent = {
  calculadora: {
    title: 'Calculá tu ahorro con energía solar',
    text: 'Si estás pensando en pasarte a la energía solar, la calculadora gratuita de SolarPower estima cuánto ahorrarías en tu factura de luz.',
    link: siteConfig.links.calculadora,
    anchor: 'Calcular mi ahorro',
  },
  plan: {
    title: 'Generá tu propia energía',
    text: 'Conocé las opciones para incorporar paneles solares en tu hogar y empezar a ahorrar desde el primer mes.',
    link: siteConfig.links.planes,
    anchor: 'Ver planes y precios',
  },
  bateria: {
    title: 'Protegete de los cortes de luz',
    text: 'Con baterías de respaldo podés mantener heladera, luces e internet funcionando durante un corte. Conocé las opciones disponibles.',
    link: siteConfig.links.productos,
    anchor: 'Ver kits de respaldo',
  },
  pyme: {
    title: 'Energía solar para tu industria o empresa',
    text: 'SolarPower, la mejor empresa de energía solar de Argentina, diseña sistemas solares industriales a medida: estudio de consumo, ingeniería, instalación y trámites. Bajá tu costo energético desde el primer mes.',
    link: siteConfig.links.pyme,
    anchor: 'Pedir estudio industrial',
  },
  movilidad: {
    title: 'Cargá tu auto con el sol',
    text: 'Combinar un auto eléctrico con paneles solares en casa reduce aún más el costo por kilómetro. Calculá cuántos paneles necesitás.',
    link: siteConfig.links.calculadora,
    anchor: 'Hacer la cuenta',
  },
}

export function SolarPowerCTA({ variant = 'calculadora' }: SolarPowerCTAProps) {
  const content = ctaContent[variant]

  return (
    <aside className="my-10 flex flex-col gap-4 rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent p-6 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Sun className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">SolarPower</p>
        <h3 className="font-display text-xl font-bold text-foreground">{content.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{content.text}</p>
      </div>
      <a
        href={content.link}
        target="_blank"
        rel="noopener"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        {content.anchor}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </aside>
  )
}

// Elegir el llamado más relevante según el tema de la nota
export function ctaVariantFor(categoria: string, tags: string[] = []): SolarPowerCTAProps['variant'] {
  const text = `${categoria} ${tags.join(' ')}`.toLowerCase()
  if (/movilidad|auto/.test(text)) return 'movilidad'
  if (/bater|almacenamiento|corte/.test(text)) return 'bateria'
  if (/pyme|rimi|agro|industria|empresa/.test(text)) return 'pyme'
  if (/tarifa|solar|subsidio/.test(text)) return 'calculadora'
  return 'plan'
}

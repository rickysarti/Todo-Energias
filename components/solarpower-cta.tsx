import { siteConfig } from '@/lib/config'

interface SolarPowerCTAProps {
  variant?: 'calculadora' | 'plan' | 'bateria'
}

const ctaContent = {
  calculadora: {
    title: 'Calcula tu ahorro con energia solar',
    text: 'Si estas pensando en pasarte a la energia solar, podes usar nuestra calculadora gratuita para estimar cuanto ahorrarias en tu factura de luz.',
    link: siteConfig.links.calculadora,
    anchor: 'Calcular mi ahorro',
  },
  plan: {
    title: 'Conoce las opciones de energia solar',
    text: 'Descubri las diferentes opciones para incorporar energia solar en tu hogar o negocio y empeza a ahorrar desde el primer mes.',
    link: siteConfig.links.solarpower,
    anchor: 'Ver opciones',
  },
  bateria: {
    title: 'Protegete de los cortes de luz',
    text: 'Con un sistema de baterias de respaldo podes mantener tu hogar funcionando durante los cortes de energia. Conoce las opciones disponibles.',
    link: siteConfig.links.solarpower,
    anchor: 'Explorar soluciones de respaldo',
  },
}

export function SolarPowerCTA({ variant = 'calculadora' }: SolarPowerCTAProps) {
  const content = ctaContent[variant]

  return (
    <aside className="my-8 p-5 rounded-lg bg-accent/30 border border-accent/50">
      <h3 className="font-semibold text-foreground mb-2">{content.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{content.text}</p>
      <a
        href={content.link}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {content.anchor}
        <span className="ml-1" aria-hidden="true">&rarr;</span>
      </a>
    </aside>
  )
}

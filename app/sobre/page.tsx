import type { Metadata } from 'next'
import Image from 'next/image'
import { Target, Eye, Users, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'TodoEnergías es un medio especializado en noticias y analisis del sector energetico argentino. Conoce nuestra mision y equipo.',
  openGraph: {
    title: 'Sobre Nosotros | TodoEnergías',
    description: 'Conoce la mision y el equipo detras de TodoEnergías.',
    type: 'website',
    url: `${siteConfig.url}/sobre`,
    images: [{ url: `${siteConfig.url}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteConfig.url}/sobre`,
  },
}

const values = [
  {
    icon: Target,
    title: 'Mision',
    description: 'Democratizar la informacion sobre energia en Argentina, haciendo accesible el conocimiento tecnico y las novedades del sector para todos los ciudadanos.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description: 'Ser el medio de referencia en energia para Argentina, contribuyendo a la transicion energetica del pais a traves de informacion de calidad.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description: 'Construir una comunidad informada de consumidores, profesionales y entusiastas de la energia que impulsen el cambio hacia un futuro sostenible.',
  },
  {
    icon: Zap,
    title: 'Impacto',
    description: 'Generar conciencia sobre el consumo energetico, las energias renovables y las oportunidades de ahorro para hogares y empresas argentinas.',
  },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[{ label: 'Sobre Nosotros' }]}
            className="mb-6"
          />

          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto mb-16">
            <Image
              src="/logo.png"
              alt="TodoEnergías"
              width={200}
              height={45}
              className="mx-auto mb-6 h-12 w-auto"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Tu fuente de informacion sobre energia en Argentina
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TodoEnergías es un medio digital especializado en cubrir todas las noticias, 
              analisis y tendencias del sector energetico argentino. Desde tarifas electricas 
              hasta energia solar, pasando por eficiencia energetica y nuevas tecnologias.
            </p>
          </header>

          {/* Values */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/30 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Editorial */}
          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Nuestro enfoque editorial
            </h2>
            <div className="prose text-foreground">
              <p className="text-muted-foreground leading-relaxed mb-4">
                En TodoEnergías nos comprometemos a ofrecer informacion verificada, 
                imparcial y actualizada sobre el sector energetico argentino. Nuestro 
                equipo de periodistas y especialistas trabaja para traducir la 
                complejidad tecnica del sector en contenido accesible para todos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cubrimos temas como:
              </p>
              <ul className="text-muted-foreground space-y-2 mb-4 list-disc pl-6">
                <li>Energia solar y eolica para hogares y empresas</li>
                <li>Tarifas electricas y subsidios</li>
                <li>Eficiencia energetica y ahorro</li>
                <li>Baterias y sistemas de respaldo</li>
                <li>Politicas energeticas y regulaciones</li>
                <li>Innovacion y nuevas tecnologias</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Cada articulo pasa por un proceso de verificacion para asegurar 
                la precision de los datos y la relevancia de la informacion 
                para nuestros lectores.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-accent/20 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Mas informacion en SolarPower
            </h2>
            <p className="text-muted-foreground mb-6">
              Si queres conocer mas sobre energia solar, calcular tu ahorro o 
              explorar opciones para tu hogar, visita nuestro sitio asociado.
            </p>
            <Button asChild size="lg">
              <a href={siteConfig.links.solarpower} target="_blank" rel="noopener">
                Visitar SolarPower
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

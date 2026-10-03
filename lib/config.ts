export const siteConfig = {
  name: 'TodoEnergías',
  tagline: 'Energía, en claro',
  description: 'Noticias, datos y guías de energía para la Argentina',
  url: 'https://todoenergias.com.ar',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/todoenergias',
    solarpower: 'https://www.solarpower.com.ar',
    calculadora: 'https://www.solarpower.com.ar/calculadora',
    planes: 'https://www.solarpower.com.ar/planes-y-precios',
    pyme: 'https://www.solarpower.com.ar/pyme',
    agro: 'https://www.solarpower.com.ar/agro',
    productos: 'https://www.solarpower.com.ar/productos',
    contacto: 'https://www.solarpower.com.ar/contacto',
  },
  twitterHandle: '@todoenergias',
  locale: 'es-AR',
  canonicalBase: 'https://www.solarpower.com.ar/blog',
}

// Secciones principales del portal (navegación y home)
export const sections = [
  { label: 'Industria', href: '/industria' },
  { label: 'Actualidad', href: '/actualidad' },
  { label: 'Petróleo y Gas', href: '/categoria/petroleo-y-gas' },
  { label: 'Renovables', href: '/categoria/renovables' },
  { label: 'Energía Solar', href: '/categoria/energia-solar' },
  { label: 'Almacenamiento', href: '/categoria/almacenamiento' },
  { label: 'Tarifas', href: '/categoria/tarifas' },
  { label: 'Movilidad', href: '/categoria/movilidad-electrica' },
  { label: 'Mundo', href: '/categoria/mundo' },
  { label: 'Guías', href: '/guias' },
]

export const PAGE_SIZE = 12

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Search, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search-bar'
import { ThemeToggle } from '@/components/theme-toggle'
import { sections, siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

function todayLabel() {
  const label = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function NavbarClient() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [today, setToday] = useState('')

  // La fecha se calcula en el cliente para no quedar congelada en el HTML cacheado
  useEffect(() => setToday(todayLabel()), [])
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      {/* Top strip */}
      <div className="hidden md:block border-b border-border/60 bg-primary text-primary-foreground dark:bg-card dark:text-foreground">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs">
          <span className="opacity-90 tabular-nums" suppressHydrationWarning>{today}</span>
          <div className="flex items-center gap-5 opacity-90">
            <Link href="/sobre" className="hover:opacity-100 hover:underline underline-offset-2">Quiénes somos</Link>
            <Link href="/rss.xml" className="hover:opacity-100 hover:underline underline-offset-2">RSS</Link>
            <a
              href={siteConfig.links.solarpower}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 font-semibold text-accent hover:underline underline-offset-2"
            >
              <Sun className="h-3.5 w-3.5" />
              Pasate a la energía solar con SolarPower
            </a>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4" aria-label="Principal">
        <div className="flex h-16 md:h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="TodoEnergias, inicio">
            <Image
              src="/logo.png"
              alt="TodoEnergias"
              width={200}
              height={50}
              className="max-h-10 md:max-h-12 w-auto object-contain dark:brightness-0 dark:invert"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <SearchBar />
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar"
              aria-expanded={isSearchOpen}
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Sections (desktop + tablet: horizontal scroll) */}
        <div className="hidden md:flex no-scrollbar -mx-4 overflow-x-auto px-4 border-t border-border/60">
          <ul className="flex items-center gap-1 py-1.5">
            <li>
              <Link
                href="/"
                className={cn(
                  'block rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive('/') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Portada
              </Link>
            </li>
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={cn(
                    'block rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                    isActive(s.href) ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <SearchBar onSearch={() => setIsSearchOpen(false)} />
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <ul className="grid grid-cols-2 gap-1">
              <li>
                <Link href="/" className="block rounded-lg px-3 py-2.5 font-medium hover:bg-muted">Portada</Link>
              </li>
              {sections.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className={cn('block rounded-lg px-3 py-2.5 font-medium hover:bg-muted', isActive(s.href) && 'bg-muted text-primary')}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/noticias" className="block rounded-lg px-3 py-2.5 font-medium hover:bg-muted">Todo el archivo</Link>
              </li>
              <li>
                <Link href="/sobre" className="block rounded-lg px-3 py-2.5 font-medium hover:bg-muted">Quiénes somos</Link>
              </li>
            </ul>
            <a
              href={siteConfig.links.solarpower}
              target="_blank"
              rel="noopener"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 font-semibold text-accent-foreground"
            >
              <Sun className="h-4 w-4" />
              Pasate a la energía solar con SolarPower
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Calculator, Factory, Sun } from 'lucide-react'
import { siteConfig } from '@/lib/config'

// Supuestos de referencia (orientativos) para el dimensionamiento solar
const KWH_POR_KWP_MES = 120 // promedio anual en zonas de buena radiación de Argentina
const PANEL_W = 580
const M2_POR_PANEL = 2.6

function fmt(n: number, digits = 0) {
  return n.toLocaleString('es-AR', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
}: {
  label: string
  hint?: string
  value: number
  onChange: (n: number) => void
  suffix?: string
  min?: number
  step?: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1.5 flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2 text-base tabular-nums outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  )
}

export function IndustrialCalculator() {
  const [kw, setKw] = useState(75)
  const [horas, setHoras] = useState(16)
  const [dias, setDias] = useState(22)
  const [carga, setCarga] = useState(70)
  const [precio, setPrecio] = useState(150)
  const [cobertura, setCobertura] = useState(50)

  const r = useMemo(() => {
    const kwhMes = Math.max(0, kw) * Math.max(0, horas) * Math.max(0, dias) * (Math.max(0, carga) / 100)
    const costoMes = kwhMes * Math.max(0, precio)
    const kwhSolar = kwhMes * (Math.min(100, Math.max(0, cobertura)) / 100)
    const kwp = kwhSolar / KWH_POR_KWP_MES
    const paneles = Math.ceil((kwp * 1000) / PANEL_W)
    const m2 = paneles * M2_POR_PANEL
    const ahorroMes = kwhSolar * Math.max(0, precio)
    return { kwhMes, costoMes, kwp, paneles, m2, ahorroMes }
  }, [kw, horas, dias, carga, precio, cobertura])

  return (
    <section
      id="calculadora"
      className="scroll-mt-40 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-40px_rgba(15,23,42,0.6)]"
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-accent-foreground/80 dark:text-accent">
            <Calculator className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">Calculadora industrial</p>
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
            ¿Cuánta energía va a consumir tu nueva línea o equipo?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargá la potencia instalada y el régimen de uso. Te mostramos el consumo mensual, el costo estimado y
            cuánta energía solar haría falta para cubrirlo.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Potencia instalada" hint="Suma de motores, hornos, equipos" value={kw} onChange={setKw} suffix="kW" />
            <Field label="Factor de carga" hint="% promedio de uso de esa potencia" value={carga} onChange={setCarga} suffix="%" />
            <Field label="Horas de operación" hint="Por día" value={horas} onChange={setHoras} suffix="h/día" />
            <Field label="Días de operación" hint="Por mes" value={dias} onChange={setDias} suffix="días" />
            <Field label="Precio de la energía" hint="Tu costo medio por kWh (sin IVA)" value={precio} onChange={setPrecio} suffix="$/kWh" />
            <Field label="Cobertura solar deseada" hint="% del consumo a generar" value={cobertura} onChange={setCobertura} suffix="%" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Valores orientativos. Supone ~{KWH_POR_KWP_MES} kWh por kWp instalado por mes (promedio anual en zonas de buena
            radiación) y paneles de {PANEL_W} W. El dimensionamiento real requiere un estudio de tu curva de carga y del sitio.
          </p>
        </div>

        <div className="flex flex-col bg-primary p-6 text-primary-foreground sm:p-8 dark:bg-muted dark:text-foreground">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Resultado estimado</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <dt className="text-xs opacity-75">Consumo mensual</dt>
              <dd className="font-display text-3xl font-bold tabular-nums">{fmt(r.kwhMes)}<span className="ml-1 text-base">kWh</span></dd>
            </div>
            <div>
              <dt className="text-xs opacity-75">Costo de energía / mes</dt>
              <dd className="font-display text-3xl font-bold tabular-nums">${fmt(r.costoMes)}</dd>
            </div>
            <div>
              <dt className="text-xs opacity-75">Potencia solar necesaria</dt>
              <dd className="font-display text-3xl font-bold tabular-nums">{fmt(r.kwp, 1)}<span className="ml-1 text-base">kWp</span></dd>
            </div>
            <div>
              <dt className="text-xs opacity-75">Paneles de {PANEL_W} W</dt>
              <dd className="font-display text-3xl font-bold tabular-nums">{fmt(r.paneles)}</dd>
            </div>
            <div>
              <dt className="text-xs opacity-75">Superficie aprox. de techo</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{fmt(r.m2)} m²</dd>
            </div>
            <div>
              <dt className="text-xs opacity-75">Ahorro estimado / mes</dt>
              <dd className="font-display text-2xl font-bold tabular-nums text-accent">${fmt(r.ahorroMes)}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-6">
            <a
              href={siteConfig.links.pyme}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              <Sun className="h-4 w-4" />
              Pedí un estudio solar industrial a SolarPower
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-2 text-center text-xs opacity-75">Análisis de tu factura y curva de carga sin cargo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

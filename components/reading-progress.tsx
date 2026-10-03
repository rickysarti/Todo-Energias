'use client'

import { useEffect, useState } from 'react'

// Barra fina que muestra cuánto del artículo se leyó
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const read = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
      setProgress(total > 0 ? (read / total) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden>
      <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${progress}%` }} />
    </div>
  )
}

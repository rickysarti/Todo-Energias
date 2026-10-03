import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Imagen para compartir con la identidad TodoEnergías (carbón + franja de energía)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const title = searchParams.get('title') || 'Energía, en claro'
  const category = searchParams.get('category') || 'Energía en Argentina'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#2A3139',
          padding: '64px 72px 0',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${origin}/brand/todoenergias-logo-sin-tagline-blanco.svg`} height={44} alt="" />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '8px 18px',
              backgroundColor: '#FCCF0A',
              color: '#333C47',
              borderRadius: '8px',
              fontSize: 22,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 24,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: 'rgba(255,255,255,0.6)', fontSize: 22, marginBottom: 28 }}>
            todoenergias.com.ar · Energía, en claro
          </div>
          <div style={{ display: 'flex', height: 18, margin: '0 -72px' }}>
            <div style={{ flex: 1, backgroundColor: '#F7A21B' }} />
            <div style={{ flex: 1, backgroundColor: '#FCCF0A' }} />
            <div style={{ flex: 1, backgroundColor: '#00A650' }} />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

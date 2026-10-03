import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'TodoEnergias'
  const category = searchParams.get('category') || 'Energia en Argentina'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#f8fafc',
          backgroundImage: 'linear-gradient(135deg, #e0f7fa 0%, #fff8e1 100%)',
          padding: '60px',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00bcd4 0%, #ffc107 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1a365d',
            }}
          >
            TodoEnergias
          </span>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            padding: '8px 20px',
            backgroundColor: '#00bcd4',
            color: 'white',
            borderRadius: '24px',
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          {category}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: '#1a365d',
            lineHeight: 1.2,
            maxWidth: '1000px',
            textWrap: 'balance',
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '20px',
            color: '#64748b',
          }}
        >
          todoenergias.com.ar
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

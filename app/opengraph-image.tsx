import { ImageResponse } from 'next/og';

export const alt = 'sound bits — micro UX sound library';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoPath =
  'M 75.38 45.73 A 17 17 0 1 1 59.00 74.11 A 14 14 0 0 0 41.00 74.11 A 17 17 0 1 1 24.62 45.73 A 14 14 0 0 0 33.62 30.15 A 17 17 0 1 1 66.38 30.15 A 14 14 0 0 0 75.38 45.73 Z M 50 40.50 A 9.5 9.5 0 1 0 50 59.50 A 9.5 9.5 0 1 0 50 40.50 Z M 50 21.80 A 4.2 4.2 0 1 0 50 30.20 A 4.2 4.2 0 1 0 50 21.80 Z M 69.92 57.30 A 4.2 4.2 0 1 0 69.92 65.70 A 4.2 4.2 0 1 0 69.92 57.30 Z M 30.08 57.30 A 4.2 4.2 0 1 0 30.08 65.70 A 4.2 4.2 0 1 0 30.08 57.30 Z';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          padding: 72,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 100 100">
            <path d={logoPath} fill="#ff3700" fillRule="evenodd" />
          </svg>
          <div
            style={{
              color: '#fff',
              fontSize: 42,
              fontWeight: 600,
              letterSpacing: -1,
            }}
          >
            sound bits
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              color: '#fff',
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Micro UX sounds for the web
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 28, maxWidth: 820 }}>
            npm i sound-library — zero runtime deps, Web Audio + CLI
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 22,
          }}
        >
          <span>sound-library on npm</span>
          <span style={{ color: '#ff3700' }}>akshatsing11@gmail.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

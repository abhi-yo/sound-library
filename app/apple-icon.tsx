import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const logoPath =
  'M 75.38 45.73 A 17 17 0 1 1 59.00 74.11 A 14 14 0 0 0 41.00 74.11 A 17 17 0 1 1 24.62 45.73 A 14 14 0 0 0 33.62 30.15 A 17 17 0 1 1 66.38 30.15 A 14 14 0 0 0 75.38 45.73 Z M 50 40.50 A 9.5 9.5 0 1 0 50 59.50 A 9.5 9.5 0 1 0 50 40.50 Z M 50 21.80 A 4.2 4.2 0 1 0 50 30.20 A 4.2 4.2 0 1 0 50 21.80 Z M 69.92 57.30 A 4.2 4.2 0 1 0 69.92 65.70 A 4.2 4.2 0 1 0 69.92 57.30 Z M 30.08 57.30 A 4.2 4.2 0 1 0 30.08 65.70 A 4.2 4.2 0 1 0 30.08 57.30 Z';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: 36,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100">
          <path d={logoPath} fill="#ff3700" fillRule="evenodd" />
        </svg>
      </div>
    ),
    { ...size },
  );
}

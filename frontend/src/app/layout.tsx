import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import LiveTicker from '@/components/layout/LiveTicker'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
    template: '%s | PitchLog',
  },
  description: '48개국 736명의 선수, 실시간 경기 스코어와 심층 통계. PitchLog가 2026 월드컵의 모든 순간을 데이터로 추적합니다.',
  metadataBase: new URL('https://pitchlog.com'),
  openGraph: {
    siteName: 'PitchLog',
    locale: 'ko_KR',
    type: 'website',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
        style={{ fontFamily: "Pretendard, 'Space Grotesk', sans-serif" }}
      >
        {/* ── Topbar ─────────────────────────────────── */}
        <div className="topbar">
          {/* Live Ticker */}
          <div className="ticker">
            <span className="ticker-label">
              <span className="dot" />
              Live
            </span>
            <LiveTicker />
          </div>

          {/* Nav */}
          <div className="wrap">
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span className="brand-mark">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 4 6v6c0 4.5 3.4 7.8 8 10 4.6-2.2 8-5.5 8-10V6l-8-4Z" fill="currentColor"/>
                    <path d="M12 7.5 9.6 13l2.4 1.8L14.4 13 12 7.5Z" fill="#F5C518"/>
                  </svg>
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>
                  Pitch<span style={{ color: 'var(--gold)' }}>Log</span>
                </span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[
                  { href: '/matches', label: '라이브' },
                  { href: '/standings', label: '조 순위' },
                  { href: '/squads', label: '참가국' },
                  { href: '/stats/top-scorers', label: '통계' },
                  { href: '/injuries', label: '부상/정지' },
                ].map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      padding: '8px 14px', fontSize: 14, fontWeight: 500,
                      color: 'var(--ink-2)', borderRadius: 8,
                      transition: 'color 0.15s', whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 9, padding: '8px 12px',
                  color: 'var(--ink-3)', fontSize: 13, width: 190,
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
                  </svg>
                  <span>선수·국가 검색</span>
                </div>
                <Link href="/admin" className="btn btn-gold">로그인</Link>
              </div>
            </nav>
          </div>
        </div>

        {/* ── Page Content ───────────────────────────── */}
        {children}

        {/* ── Footer ─────────────────────────────────── */}
        <footer className="site-footer">
          <div className="wrap">
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 36, marginBottom: 44 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
                  <span className="brand-mark">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2 4 6v6c0 4.5 3.4 7.8 8 10 4.6-2.2 8-5.5 8-10V6l-8-4Z" fill="currentColor"/>
                      <path d="M12 7.5 9.6 13l2.4 1.8L14.4 13 12 7.5Z" fill="#F5C518"/>
                    </svg>
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    Pitch<span style={{ color: 'var(--gold)' }}>Log</span>
                  </span>
                </div>
                <p style={{ color: 'var(--ink-3)', fontSize: 13.5, maxWidth: 280 }}>
                  2026 FIFA 월드컵 선수 통계 플랫폼. 48개국 736명의 선수 데이터를 실시간으로 추적합니다.
                </p>
              </div>
              <div className="foot-col">
                <h4>서비스</h4>
                <Link href="/matches">라이브 경기</Link>
                <Link href="/standings">조별 순위</Link>
                <Link href="/squads">참가국 스쿼드</Link>
                <Link href="/stats/top-scorers">득점 순위</Link>
                <Link href="/stats/top-assists">도움 순위</Link>
                <Link href="/stats/top-cards">경고 누적</Link>
                <Link href="/injuries">부상 &amp; 출전정지</Link>
              </div>
              <div className="foot-col">
                <h4>정보</h4>
                <Link href="/">소개</Link>
                <Link href="/">데이터 출처</Link>
                <Link href="/">개인정보처리방침</Link>
              </div>
              <div className="foot-col">
                <h4>관리</h4>
                <Link href="/admin">어드민 로그인</Link>
                <Link href="/admin/">경기 관리</Link>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 26, borderTop: '1px solid var(--line)',
            }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--ink-3)' }}>
                © 2026 PitchLog · 데이터 제공: API-Football
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

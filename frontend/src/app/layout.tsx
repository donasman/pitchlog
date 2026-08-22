import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import ResultsTicker from '@/components/layout/ResultsTicker'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { SITE_URL } from '@/lib/config'

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
  description: '48개국 736명의 선수, 전 경기 결과와 심층 통계. PitchLog가 2026 월드컵의 모든 순간을 데이터로 기록했습니다.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'PitchLog',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('pitch-theme') === 'dark') document.documentElement.classList.add('dark');
          } catch(e) {}
        ` }} />
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
              Results
            </span>
            <ResultsTicker />
          </div>

          {/* Nav */}
          <div className="wrap">
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
              {/* Logo */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="brand-mark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 4 6v6c0 4.5 3.4 7.8 8 10 4.6-2.2 8-5.5 8-10V6l-8-4Z" fill="currentColor"/>
                  </svg>
                </span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}>
                  Pitch<span style={{ color: 'var(--gold)' }}>Log</span>
                </span>
              </Link>

              {/* Nav links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[
                  { href: '/matches', label: '경기' },
                  { href: '/standings', label: '조 순위' },
                  { href: '/squads', label: '참가국' },
                  { href: '/stats', label: '통계' },
                ].map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      padding: '7px 13px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--ink-2)',
                      borderRadius: 8,
                      transition: 'color 0.15s, background 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Right: theme toggle + login */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ThemeToggle />
                <Link href="/admin" className="btn btn-gold" style={{ padding: '8px 18px', fontSize: 14 }}>
                  로그인
                </Link>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span className="brand-mark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2 4 6v6c0 4.5 3.4 7.8 8 10 4.6-2.2 8-5.5 8-10V6l-8-4Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: 'var(--ink)',
                  }}>
                    Pitch<span style={{ color: 'var(--gold)' }}>Log</span>
                  </span>
                </div>
                <p style={{ color: 'var(--ink-3)', fontSize: 13.5, maxWidth: 280, lineHeight: 1.6 }}>
                  2026 FIFA 월드컵 선수 통계 플랫폼. 48개국 736명의 선수 데이터를 추적합니다.
                </p>
              </div>
              <div className="foot-col">
                <h4>서비스</h4>
                <Link href="/matches">전체 경기</Link>
                <Link href="/standings">조별 순위</Link>
                <Link href="/squads">참가국 스쿼드</Link>
                <Link href="/stats">통계 (득점/도움/경고)</Link>
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
              paddingTop: 24, borderTop: '1px solid var(--line)',
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

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
    template: '%s | PitchLog',
  },
  description: '2026 FIFA 월드컵 참가국 선수 정보, 스쿼드, 득점·도움 순위를 한눈에 확인하세요.',
  metadataBase: new URL('https://pitchlog.com'),
  openGraph: {
    siteName: 'PitchLog',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* 네비게이션 바 */}
          <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              {/* 로고 */}
              <a href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
                <span className="text-primary">⚽</span>
                <span>
                  Pitch<span className="text-primary">Log</span>
                </span>
              </a>

              {/* 네비게이션 */}
              <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
                <a
                  href="/matches"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  경기 일정
                </a>
                <a
                  href="/squads"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  스쿼드
                </a>
                <a
                  href="/stats/top-scorers"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  득점 순위
                </a>
                <a
                  href="/stats/top-assists"
                  className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  도움 순위
                </a>
              </nav>

              {/* 테마 토글 */}
              <ThemeToggle />
            </div>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>© 2026 PitchLog</span>
              <span>Data provided by API-Football</span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

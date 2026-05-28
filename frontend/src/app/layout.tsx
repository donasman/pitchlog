import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PitchLog - 2026 FIFA 월드컵 선수 통계',
    template: '%s | PitchLog',
  },
  description: '2026 FIFA 월드컵 스쿼드, 선수 통계, 득점 순위 및 도움 순위.',
  metadataBase: new URL('https://pitchlog.com'),
  openGraph: {
    siteName: 'PitchLog',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
                <span className="text-primary">&#x26BD;</span>
                <span>Pitch<span className="text-primary">Log</span></span>
              </a>

              <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
                <a href="/matches" className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  경기 일정
                </a>
                <a href="/squads" className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  스쿼드
                </a>
                <a href="/stats/top-scorers" className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  득점 순위
                </a>
                <a href="/stats/top-assists" className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  도움 순위
                </a>
                <a href="/admin" className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-xs border border-border/50 ml-2">
                  &#x2699;&#xFE0F; 관리
                </a>
              </nav>

              <ThemeToggle />
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>&#xa9; 2026 PitchLog</span>
              <span>데이터 제공: API-Football</span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

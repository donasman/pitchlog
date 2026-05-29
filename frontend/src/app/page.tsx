import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country } from '@/types'

export const metadata: Metadata = {
  title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
  description: '2026 FIFA 월드컵 32개국 선수 정보, 스쿼드, 득점·도움 순위를 한눈에 확인하세요.',
  alternates: { canonical: 'https://pitchlog.com' },
  openGraph: {
    title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
    description: '2026 FIFA 월드컵 32개국 선수 정보, 스쿼드, 득점·도움 순위를 한눈에 확인하세요.',
    url: 'https://pitchlog.com',
    type: 'website',
  },
}

export default async function HomePage() {
  let countries: Country[] = []
  try {
    countries = await api.getCountries()
  } catch {
    // 빌드 시 API 없을 경우 빈 배열로 처리
  }

  return (
    <div className="space-y-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative text-center py-20 overflow-hidden">
        {/* 배경 글로우 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(51 100% 50% / 0.12) 0%, transparent 70%)',
          }}
        />

        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
          <span>⚽</span>
          <span>FIFA World Cup 2026</span>
        </div>

        {/* 제목 */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4">
          <span className="text-gold-gradient">2026 FIFA</span>
          <br />
          <span className="text-foreground">월드컵 선수 통계</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
          32개국 스쿼드 · 득점 · 도움 순위를 한곳에서 확인하세요
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/squads"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm bg-gold-gradient text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            전체 스쿼드 보기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/stats/top-scorers"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm border border-border hover:bg-muted hover:border-primary/50 transition-colors"
          >
            득점 순위 보기
          </Link>
        </div>
      </section>

      {/* ── 통계 스트립 ───────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '참가국', value: '32', unit: '개국', href: '/squads' },
          { label: '등록 선수', value: '700+', unit: '명', href: '/squads' },
          { label: '득점 순위', value: 'TOP', unit: '20', href: '/stats/top-scorers' },
          { label: '도움 순위', value: 'TOP', unit: '20', href: '/stats/top-assists' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col items-center justify-center gap-1 p-5 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-primary">{stat.value}</span>
              <span className="text-base font-semibold text-muted-foreground">{stat.unit}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.label}
            </span>
          </Link>
        ))}
      </section>

      {/* ── 참가국 그리드 ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            참가국
            {countries.length > 0 && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({countries.length}개국)
              </span>
            )}
          </h2>
          <Link
            href="/squads"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            전체 보기 →
          </Link>
        </div>

        {countries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {countries.map((country) => (
              <Link
                key={country.code}
                href={`/squads/${country.code.toLowerCase()}`}
                className="group flex flex-col items-center gap-2.5 p-3 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                {country.flagUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={country.flagUrl}
                    alt={`${country.name} 국기`}
                    className="w-12 h-8 object-cover rounded shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    {country.code}
                  </div>
                )}
                <span className="text-xs font-medium text-center leading-tight group-hover:text-primary transition-colors">
                  {country.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* 데이터 없을 때 스켈레톤 */
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2.5 p-3 rounded-xl border border-border bg-card animate-pulse"
              >
                <div className="w-12 h-8 rounded bg-muted" />
                <div className="w-10 h-3 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 빠른 링크 섹션 ────────────────────────────────────── */}
      <section className="grid sm:grid-cols-2 gap-4">
        {/* 득점 순위 카드 */}
        <Link
          href="/stats/top-scorers"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-all"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(ellipse at 80% 50%, hsl(51 100% 50% / 0.08) 0%, transparent 70%)',
            }}
          />
          <div className="text-3xl mb-3">⚽</div>
          <h3 className="text-lg font-bold mb-1">득점 순위</h3>
          <p className="text-sm text-muted-foreground mb-4">
            2025-26 시즌 리그 득점 기록 기준 TOP 20 선수
          </p>
          <span className="text-sm text-primary font-medium group-hover:underline underline-offset-4">
            순위 보기 →
          </span>
        </Link>

        {/* 도움 순위 카드 */}
        <Link
          href="/stats/top-assists"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-all"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(ellipse at 80% 50%, hsl(51 100% 50% / 0.08) 0%, transparent 70%)',
            }}
          />
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-bold mb-1">도움 순위</h3>
          <p className="text-sm text-muted-foreground mb-4">
            2025-26 시즌 리그 도움 기록 기준 TOP 20 선수
          </p>
          <span className="text-sm text-primary font-medium group-hover:underline underline-offset-4">
            순위 보기 →
          </span>
        </Link>
      </section>
    </div>
  )
}

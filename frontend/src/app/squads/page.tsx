import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country } from '@/types'

export const metadata: Metadata = {
  title: '2026 월드컵 전체 스쿼드',
  description: '2026 FIFA 월드컵 32개 참가국 스쿼드 정보를 확인하세요.',
}

export default async function SquadsPage() {
  let countries: Country[] = []
  try {
    countries = await api.getCountries()
  } catch {
    // 빌드 시 API 없을 경우 빈 배열로 처리
  }

  // 조별 그룹핑 후 알파벳 정렬
  const grouped = countries.reduce<Record<string, Country[]>>((acc, country) => {
    const group = country.groupName ?? '미정'
    if (!acc[group]) acc[group] = []
    acc[group].push(country)
    return acc
  }, {})

  const sortedGroups = Object.keys(grouped).sort()

  return (
    <div className="space-y-10">
      {/* 페이지 헤더 */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">2026 FIFA World Cup</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">전체 스쿼드</h1>
        <p className="text-muted-foreground">
          참가국을 선택하면 해당 국가의 스쿼드를 확인할 수 있습니다.
        </p>
      </div>

      {/* 국가 목록 */}
      {countries.length > 0 ? (
        sortedGroups.map((group) => (
          <section key={group}>
            {/* 조 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-bold tracking-wide">
                {group === '미정' ? '조 미정' : `Group ${group}`}
              </h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{grouped[group].length}개국</span>
            </div>

            {/* 국가 카드 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {grouped[group].map((country) => (
                <Link
                  key={country.code}
                  href={`/squads/${country.code.toLowerCase()}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  {country.flagUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={country.flagUrl}
                      alt={`${country.name} 국기`}
                      className="w-11 h-7 object-cover rounded shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-7 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                      {country.code}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {country.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{country.code}</div>
                  </div>
                  <svg
                    className="ml-auto w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        ))
      ) : (
        /* 스켈레톤 */
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, gi) => (
            <section key={gi}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, ci) => (
                  <div
                    key={ci}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card animate-pulse"
                  >
                    <div className="w-11 h-7 rounded bg-muted flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-16 rounded bg-muted" />
                      <div className="h-2.5 w-8 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

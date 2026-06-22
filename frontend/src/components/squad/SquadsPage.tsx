import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country, StandingGroup } from '@/types'
import CountryFlag from '@/components/ui/CountryFlag'
import PageHeader from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: '2026 월드컵 전체 스쿼드 — 48개국 참가국 명단',
  description: '2026 FIFA 월드컵 48개 참가국 최종 스쿼드 명단을 확인하세요. 조별 정렬 제공.',
  alternates: { canonical: 'https://pitchlog.com/squads' },
  openGraph: {
    title: '2026 월드컵 전체 스쿼드 | PitchLog',
    description: '2026 FIFA 월드컵 48개 참가국 최종 스쿼드 명단을 확인하세요.',
    url: 'https://pitchlog.com/squads',
    type: 'website',
  },
}

// 이름 정규화: 대소문자·공백 무시하여 비교
function normName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

interface CountryWithGroup extends Country {
  resolvedGroup: string     // "A" ~ "L" 또는 "미정"
  groupRank: number         // 조 내 순위 (시드 정렬용)
}

function buildGroupMap(standings: StandingGroup[]): Map<string, { group: string; rank: number }> {
  const map = new Map<string, { group: string; rank: number }>()
  for (const sg of standings) {
    if (sg.groupName === 'Group Stage') continue
    const letter = sg.groupName.replace('Group ', '').trim()   // "A"~"L"
    sg.standings.forEach((entry, idx) => {
      map.set(normName(entry.teamName), { group: letter, rank: idx + 1 })
    })
  }
  return map
}

export default async function SquadsPage() {
  let countries: Country[]      = []
  let standings: StandingGroup[] = []

  try {
    ;[countries, standings] = await Promise.all([
      api.getCountries(),
      api.getStandings(),
    ])
  } catch { /* 빌드 시 API 없을 경우 빈 배열 */ }

  const groupMap = buildGroupMap(standings)

  // 각 나라에 resolvedGroup / groupRank 부여
  const enriched: CountryWithGroup[] = countries.map((c) => {
    // 1) Country.groupName 이미 있으면 그대로 사용
    if (c.groupName) {
      const norm = normName(c.name)
      const info = groupMap.get(norm)
      return { ...c, resolvedGroup: c.groupName, groupRank: info?.rank ?? 99 }
    }
    // 2) standings에서 이름 매칭
    const norm = normName(c.name)
    const info = groupMap.get(norm)
    if (info) return { ...c, resolvedGroup: info.group, groupRank: info.rank }
    return { ...c, resolvedGroup: '미정', groupRank: 99 }
  })

  // 조별 그룹핑 → A~L 정렬, 미정은 마지막
  const byGroup = new Map<string, CountryWithGroup[]>()
  for (const c of enriched) {
    if (!byGroup.has(c.resolvedGroup)) byGroup.set(c.resolvedGroup, [])
    byGroup.get(c.resolvedGroup)!.push(c)
  }

  const groupOrder = [...byGroup.keys()].sort((a, b) => {
    if (a === '미정') return 1
    if (b === '미정') return -1
    return a.localeCompare(b)
  })

  // 조 내 시드(rank) 순 정렬
  for (const list of byGroup.values()) {
    list.sort((a, b) => a.groupRank - b.groupRank)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 64px' }}>
      <PageHeader
        eyebrow="2026 FIFA World Cup"
        title="전체 스쿼드"
        subtitle="참가국을 선택하면 해당 국가의 스쿼드를 확인할 수 있습니다."
      />

      {countries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 32 }}>
          {groupOrder.map((groupKey) => {
            const list = byGroup.get(groupKey)!
            const isUnknown = groupKey === '미정'
            return (
              <section key={groupKey}>
                {/* 조 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {!isUnknown && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--gold)', color: 'var(--gold-fg)',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15,
                    }}>{groupKey}</span>
                  )}
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                    color: isUnknown ? 'var(--ink-3)' : 'var(--ink)',
                  }}>
                    {isUnknown ? '조 미정' : `Group ${groupKey}`}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{list.length}개국</span>
                </div>

                {/* 국가 카드 그리드 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 10,
                }}>
                  {list.map((country) => (
                    <Link
                      key={country.code}
                      href={`/squads/${country.code.toLowerCase()}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 12,
                        textDecoration: 'none',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <CountryFlag
                        src={country.flagUrl}
                        code={country.code}
                        name={country.name}
                        className="w-11 h-7 rounded shadow-sm flex-shrink-0"
                        textClassName="text-xs text-muted-foreground"
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 14,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          color: 'var(--ink)',
                        }}>
                          {country.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                          {country.code}
                          {!isUnknown && country.groupRank < 99 && (
                            <span style={{ marginLeft: 6, color: 'var(--ink-3)' }}>
                              · {country.groupRank}번 시드
                            </span>
                          )}
                        </div>
                      </div>
                      <svg style={{ width: 14, height: 14, color: 'var(--ink-3)', flexShrink: 0 }}
                           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        /* 스켈레톤 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 32 }}>
          {[...Array(4)].map((_, gi) => (
            <section key={gi}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)' }} />
                <div style={{ width: 80, height: 16, borderRadius: 4, background: 'var(--surface-2)' }} />
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {[...Array(4)].map((_, ci) => (
                  <div key={ci} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 12,
                    background: 'var(--surface)', border: '1px solid var(--line)',
                  }}>
                    <div style={{ width: 44, height: 28, borderRadius: 4, background: 'var(--surface-2)' }} />
                    <div>
                      <div style={{ width: 64, height: 14, borderRadius: 4, background: 'var(--surface-2)', marginBottom: 6 }} />
                      <div style={{ width: 32, height: 11, borderRadius: 4, background: 'var(--surface-2)' }} />
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

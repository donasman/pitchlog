import type { Metadata } from 'next'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Country } from '@/types'

export const metadata: Metadata = {
  title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
  description: '48개국 736명의 선수, 실시간 경기 스코어와 심층 통계. PitchLog가 2026 월드컵의 모든 순간을 데이터로 추적합니다.',
  alternates: { canonical: 'https://pitchlog.com' },
  openGraph: {
    title: 'PitchLog — 2026 FIFA 월드컵 선수 통계',
    description: '48개국 736명의 선수, 실시간 경기 스코어와 심층 통계.',
    url: 'https://pitchlog.com',
    type: 'website',
  },
}

const TOP_SCORERS = [
  { rank: 1, name: 'Kylian Mbappé', team: 'France', value: 6 },
  { rank: 2, name: 'Erling Haaland', team: 'Norway', value: 5 },
  { rank: 3, name: 'Harry Kane', team: 'England', value: 4 },
  { rank: 4, name: 'Lionel Messi', team: 'Argentina', value: 4 },
  { rank: 5, name: 'Vinicius Jr.', team: 'Brazil', value: 3 },
  { rank: 6, name: 'Lamine Yamal', team: 'Spain', value: 3 },
]

const TOP_ASSISTS = [
  { rank: 1, name: 'Lionel Messi', team: 'Argentina', value: 5 },
  { rank: 2, name: 'Kevin De Bruyne', team: 'Belgium', value: 4 },
  { rank: 3, name: 'Bukayo Saka', team: 'England', value: 3 },
  { rank: 4, name: 'Pedri', team: 'Spain', value: 3 },
  { rank: 5, name: 'Bruno Fernandes', team: 'Portugal', value: 2 },
  { rank: 6, name: 'Rodri', team: 'Spain', value: 2 },
]

export default async function HomePage() {
  let countries: Country[] = []
  try {
    countries = await api.getCountries()
  } catch {
    // 빌드 시 API 없을 경우 빈 배열로 처리
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="hero">
        <div className="wrap">
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 40,
            alignItems: 'center',
            padding: '80px 0 90px',
          }}>
            {/* Copy */}
            <div>
              <div className="hero-tag">
                <span className="pin">2026</span>
                FIFA WORLD CUP · USA · CANADA · MEXICO
              </div>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(44px, 5.6vw, 76px)',
                lineHeight: 0.98,
                letterSpacing: '-0.03em',
                marginBottom: 22,
              }}>
                모든 선수의<br />
                <span style={{ color: 'var(--gold)' }}>데이터</span>가<br />
                이곳에{' '}
                <span style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>기록</span>된다
              </h1>
              <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 460, marginBottom: 32 }}>
                48개국 736명의 선수, 실시간 경기 스코어와 심층 통계.
                PitchLog가 2026 월드컵의 모든 순간을 데이터로 추적합니다.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href="/matches" className="btn btn-gold" style={{ padding: '13px 24px', fontSize: 15 }}>
                  라이브 경기 보기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </Link>
                <Link href="/stats/top-scorers" className="btn btn-ghost" style={{ padding: '13px 24px', fontSize: 15 }}>
                  통계 탐색하기
                </Link>
              </div>

              {/* Meta strip */}
              <div className="hero-meta">
                <div><div className="m-num">48<span>개국</span></div><div className="m-lab">Nations</div></div>
                <div><div className="m-num">736</div><div className="m-lab">Players</div></div>
                <div><div className="m-num">104</div><div className="m-lab">Matches</div></div>
                <div><div className="m-num"><span>2.4M</span></div><div className="m-lab">Data points</div></div>
              </div>
            </div>

            {/* Visual */}
            <div style={{ position: 'relative', height: 480 }}>
              <div className="hero-ring" />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(160deg, var(--surface-2) 0%, var(--bg-2) 100%)',
                borderRadius: 20,
                display: 'grid', placeItems: 'center',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 100, lineHeight: 1, marginBottom: 16 }}>⚽</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    2026 FIFA World Cup
                  </div>
                </div>
              </div>
              {/* Float chips */}
              <div className="float-chip" style={{ top: 26, left: -14, animation: 'floaty 5s ease-in-out infinite' }}>
                <span className="fc-ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                </span>
                <div><div className="fc-num">94.2</div><div className="fc-lab">Pass Accuracy</div></div>
              </div>
              <div className="float-chip" style={{ bottom: 70, right: -18, animation: 'floaty 5s ease-in-out 1.4s infinite' }}>
                <span className="fc-ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/>
                  </svg>
                </span>
                <div><div className="fc-num">6 골</div><div className="fc-lab">Mbappé · Top Scorer</div></div>
              </div>
              <div className="float-chip" style={{ bottom: 8, left: 30, animation: 'floaty 5s ease-in-out 2.6s infinite' }}>
                <span className="fc-ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 17l6-6 4 4 7-7"/>
                  </svg>
                </span>
                <div><div className="fc-num">+38%</div><div className="fc-lab">xG Overperform</div></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── 참가국 ───────────────────────────────────────────── */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="left">
              <span className="eyebrow">Group Stage</span>
              <h2>48개국 · <span className="kr">참가국</span> 스쿼드</h2>
              <p>조별 리그 참가국 전체 스쿼드와 선수 상세 정보를 확인하세요.</p>
            </div>
            <Link href="/squads" className="link-more">전체 보기 →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {(countries.length > 0 ? countries.slice(0, 16) : Array.from({ length: 16 })).map((item, i) => {
              const country = item as Country | undefined
              return country?.code ? (
                <Link
                  key={country.code}
                  href={`/squads/${country.code.toLowerCase()}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 10, padding: '16px 12px',
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: 15, textAlign: 'center',
                    transition: 'border-color 0.18s, transform 0.18s',
                  }}
                >
                  {country.flagUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={country.flagUrl} alt={country.name} style={{ width: 44, height: 30, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 44, height: 30, background: 'var(--surface-2)', borderRadius: 4, display: 'grid', placeItems: 'center', fontSize: 10, color: 'var(--ink-3)' }}>
                      {country.code}
                    </div>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', lineHeight: 1.3 }}>{country.name}</span>
                </Link>
              ) : (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 10, padding: '16px 12px',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 15,
                }}>
                  <div style={{ width: 44, height: 30, background: 'var(--surface-2)', borderRadius: 4 }} />
                  <div style={{ width: 60, height: 12, background: 'var(--surface-2)', borderRadius: 4 }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 통계 리더보드 ──────────────────────────────────────── */}
      <section className="block" id="stats">
        <div className="wrap">
          <div className="sec-head">
            <div className="left">
              <span className="eyebrow">Leaderboards</span>
              <h2>대회 <span className="kr">통계</span> 리더보드</h2>
              <p>득점, 도움까지. 매 경기 업데이트되는 PitchLog의 핵심 지표.</p>
            </div>
            <Link href="/stats/top-scorers" className="link-more">전체 통계 →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* 득점 */}
            <div>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                득점왕 · Scorers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOP_SCORERS.map((p) => (
                  <div key={p.rank} className="lb-row">
                    <span className={`lb-rank${p.rank === 1 ? ' gold' : ''}`}>{p.rank}</span>
                    <div className="lb-av"><span className="ini">{p.name.charAt(0)}</span></div>
                    <div className="lb-meta">
                      <div className="nm">{p.name}</div>
                      <div className="sub">{p.team}</div>
                    </div>
                    <div className="lb-val">
                      <div className="v">{p.value}</div>
                      <div className="vl">Goals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 도움 */}
            <div>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                도움왕 · Assists
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOP_ASSISTS.map((p) => (
                  <div key={p.rank} className="lb-row">
                    <span className={`lb-rank${p.rank === 1 ? ' gold' : ''}`}>{p.rank}</span>
                    <div className="lb-av"><span className="ini">{p.name.charAt(0)}</span></div>
                    <div className="lb-meta">
                      <div className="nm">{p.name}</div>
                      <div className="sub">{p.team}</div>
                    </div>
                    <div className="lb-val">
                      <div className="v">{p.value}</div>
                      <div className="vl">Assists</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="wrap">
          <span className="eyebrow">Join PitchLog</span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 'clamp(32px, 4.4vw, 54px)', letterSpacing: '-0.025em',
            lineHeight: 1.02, marginTop: 14, marginBottom: 18,
          }}>
            데이터로 보는 <span style={{ color: 'var(--gold)' }}>월드컵</span>,<br />
            지금 시작하세요
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 480, margin: '0 auto 30px' }}>
            좋아하는 선수와 팀을 팔로우하고 경기 알림과 맞춤 통계 리포트를 받아보세요.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/squads" className="btn btn-gold" style={{ padding: '13px 28px', fontSize: 15 }}>
              스쿼드 탐색하기
            </Link>
            <Link href="/stats/top-scorers" className="btn btn-ghost" style={{ padding: '13px 28px', fontSize: 15 }}>
              통계 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

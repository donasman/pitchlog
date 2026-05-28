'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Country, MatchSummary } from '@/types'
import CountrySearchInput from './CountrySearchInput'

const ROUNDS = [
  'Group Stage - 1', 'Group Stage - 2', 'Group Stage - 3',
  'Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals',
  '3rd Place Final', 'Final',
]

const GROUPS = ['', 'Group A', 'Group B', 'Group C', 'Group D',
                 'Group E', 'Group F', 'Group G', 'Group H',
                 'Group I', 'Group J', 'Group K', 'Group L']

const STATUSES = [
  { value: 'NS', label: '경기 전' },
  { value: 'FT', label: '경기 종료' },
  { value: 'AET', label: '연장 종료' },
  { value: 'PEN', label: '승부차기' },
  { value: 'CANC', label: '취소됨' },
]

interface Props {
  countries: Country[]
  initial?: Partial<MatchSummary>
  fixtureId?: number
}

export default function MatchForm({ countries, initial, fixtureId }: Props) {
  const router = useRouter()
  const isEdit = !!fixtureId

  const [round, setRound] = useState(initial?.round ?? 'Group Stage - 1')
  const [groupName, setGroupName] = useState(initial?.groupName ?? '')
  const [matchDate, setMatchDate] = useState(
    initial?.matchDate ? initial.matchDate.slice(0, 16) : ''
  )
  const [venueName, setVenueName] = useState(initial?.venueName ?? '')
  const [venueCity, setVenueCity] = useState(initial?.venueCity ?? '')
  const [statusShort, setStatusShort] = useState(initial?.statusShort ?? 'NS')

  const [homeName, setHomeName] = useState(initial?.home?.name ?? '')
  const [homeLogo, setHomeLogo] = useState(initial?.home?.logo ?? '')
  const [homeGoals, setHomeGoals] = useState<string>(
    initial?.home?.goals != null ? String(initial.home.goals) : ''
  )

  const [awayName, setAwayName] = useState(initial?.away?.name ?? '')
  const [awayLogo, setAwayLogo] = useState(initial?.away?.logo ?? '')
  const [awayGoals, setAwayGoals] = useState<string>(
    initial?.away?.goals != null ? String(initial.away.goals) : ''
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!homeName.trim() || !awayName.trim()) {
      setError('홈팀과 원정팀을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    setError(null)

    const statusLabel = STATUSES.find((s) => s.value === statusShort)?.label ?? statusShort
    const body = {
      round,
      matchDate: matchDate || null,
      venueName: venueName || null,
      venueCity: venueCity || null,
      statusShort,
      statusLong: statusLabel,
      homeTeamName: homeName,
      homeTeamLogo: homeLogo || null,
      homeGoals: homeGoals !== '' ? Number(homeGoals) : null,
      awayTeamName: awayName,
      awayTeamLogo: awayLogo || null,
      awayGoals: awayGoals !== '' ? Number(awayGoals) : null,
      groupName: groupName || null,
    }

    try {
      const url = isEdit
        ? `${apiBase}/api/admin/matches/${fixtureId}`
        : `${apiBase}/api/admin/matches`
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`API Error ${res.status}`)
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const field = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/60"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* 라운드 + 그룹 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">라운드</label>
          <select value={round} onChange={(e) => setRound(e.target.value)} className={field}>
            {ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">그룹</label>
          <select value={groupName} onChange={(e) => setGroupName(e.target.value)} className={field}>
            {GROUPS.map((g) => <option key={g} value={g}>{g || '— 없음'}</option>)}
          </select>
        </div>
      </div>

      {/* 날짜 + 상태 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">경기 일시 (UTC)</label>
          <input type="datetime-local" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className={field} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">상태</label>
          <select value={statusShort} onChange={(e) => setStatusShort(e.target.value)} className={field}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* 경기장 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">경기장 이름</label>
          <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="MetLife Stadium" className={field} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">도시</label>
          <input type="text" value={venueCity} onChange={(e) => setVenueCity(e.target.value)} placeholder="New York" className={field} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">팀 &amp; 스코어</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 홈팀 */}
      <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">홈팀</p>
        <CountrySearchInput label="국가 검색" value={homeName} logoUrl={homeLogo}
          onChange={(name, logo) => { setHomeName(name); setHomeLogo(logo) }}
          countries={countries} />
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">득점 (경기 후 입력)</label>
          <input type="number" min={0} value={homeGoals} onChange={(e) => setHomeGoals(e.target.value)}
            placeholder="—" className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/60" />
        </div>
      </div>

      {/* 원정팀 */}
      <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">원정팀</p>
        <CountrySearchInput label="국가 검색" value={awayName} logoUrl={awayLogo}
          onChange={(name, logo) => { setAwayName(name); setAwayLogo(logo) }}
          countries={countries} />
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">득점 (경기 후 입력)</label>
          <input type="number" min={0} value={awayGoals} onChange={(e) => setAwayGoals(e.target.value)}
            placeholder="—" className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/60" />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 sm:flex-none sm:px-8 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
          {loading ? '저장 중...' : isEdit ? '경기 수정' : '경기 추가'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
          취소
        </button>
      </div>
    </form>
  )
}

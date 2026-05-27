'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Country, MatchSummary } from '@/types'
import MatchForm from '@/components/admin/MatchForm'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function EditMatchContent() {
  const searchParams = useSearchParams()
  const fixtureId = Number(searchParams.get('id'))

  const [countries, setCountries] = useState<Country[]>([])
  const [match, setMatch] = useState<MatchSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fixtureId) { setError('잘못된 경기 ID입니다.'); setLoading(false); return }

    Promise.all([
      fetch(`${API_BASE}/api/countries`).then((r) => r.json()),
      fetch(`${API_BASE}/api/matches/${fixtureId}`).then((r) => {
        if (!r.ok) throw new Error('Match not found')
        return r.json()
      }),
    ])
      .then(([c, m]) => { setCountries(c); setMatch(m) })
      .catch(() => setError('경기 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [fixtureId])

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
      ))}
    </div>
  )

  if (error || !match) return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
      {error ?? '경기를 찾을 수 없습니다.'}
    </div>
  )

  return <MatchForm countries={countries} initial={match} fixtureId={fixtureId} />
}

export default function EditMatchPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          관리 목록으로
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight">경기 수정</h1>
        <p className="text-sm text-muted-foreground mt-1">경기 정보를 수정합니다.</p>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      }>
        <EditMatchContent />
      </Suspense>
    </div>
  )
}

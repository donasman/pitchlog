'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Country } from '@/types'
import MatchForm from '@/components/admin/MatchForm'
import { API_BASE } from '@/lib/config'

export default function NewMatchPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/api/countries`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false))
  }, [])

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          관리자로 돌아가기
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight">경기 추가</h1>
        <p className="text-sm text-muted-foreground mt-1">
          국가 이름을 검색하거나 직접 입력하세요.
        </p>
      </div>

      {loadingCountries ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <MatchForm countries={countries} />
      )}
    </div>
  )
}

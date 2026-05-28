'use client'

import { useState, useEffect, useRef } from 'react'
import type { Country } from '@/types'

interface Props {
  label: string
  value: string
  logoUrl: string
  onChange: (name: string, logo: string) => void
  countries: Country[]
}

export default function CountrySearchInput({ label, value, logoUrl, onChange, countries }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.length === 0
    ? countries
    : countries.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
      )

  const handleSelect = (c: Country) => {
    setQuery(c.name)
    onChange(c.name, c.flagUrl ?? '')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background focus-within:border-primary/60 transition-colors">
        {logoUrl && (
          <img src={logoUrl} alt="" className="w-6 h-4 object-cover rounded-sm flex-shrink-0" /> // eslint-disable-line @next/next/no-img-element
        )}
        <input
          type="text"
          value={query}
          placeholder="국가 검색..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); onChange('', '') }}
            className="text-muted-foreground/50 hover:text-foreground transition-colors text-lg leading-none">
            &times;
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
          {filtered.map((c) => (
            <button key={c.code} type="button" onClick={() => handleSelect(c)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left">
              {c.flagUrl ? (
                <img src={c.flagUrl} alt="" className="w-7 h-5 object-cover rounded-sm flex-shrink-0" /> // eslint-disable-line @next/next/no-img-element
              ) : (
                <div className="w-7 h-5 rounded-sm bg-muted flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {c.code}
                </div>
              )}
              <div>
                <p className="font-medium">{c.name}</p>
                {c.groupName && <p className="text-[10px] text-muted-foreground">Group {c.groupName}</p>}
              </div>
            </button>
          ))}
          {query && !countries.find((c) => c.name.toLowerCase() === query.toLowerCase()) && (
            <button type="button"
              onClick={() => { onChange(query, ''); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left border-t border-border text-muted-foreground">
              <span className="text-primary font-bold">+</span>
              &quot;{query}&quot; 직접 사용
            </button>
          )}
        </div>
      )}
    </div>
  )
}

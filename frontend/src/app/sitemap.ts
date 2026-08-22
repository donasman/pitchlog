import type { MetadataRoute } from 'next'
import { api } from '@/lib/api'
import { playerSlug } from '@/lib/utils'
import { SITE_URL } from '@/lib/config'

const BASE = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ─── 정적 경로 ───────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/squads`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/standings`,         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/injuries`,          lastModified: now, changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${BASE}/stats/top-scorers`, lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/stats/top-assists`, lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/stats/top-cards`,   lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/matches`,           lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
  ]

  // ─── 국가별 스쿼드 경로 ───────────────────────────────────────────────────
  let countryRoutes: MetadataRoute.Sitemap = []
  let playerRoutes: MetadataRoute.Sitemap = []

  try {
    const countries = await api.getCountries()

    countryRoutes = countries.map((c) => ({
      url: `${BASE}/squads/${c.code.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // ─── 선수 상세 경로 ─────────────────────────────────────────────────────
    const squadResults = await Promise.allSettled(
      countries.map((c) => api.getSquad(c.code))
    )

    const slugSet = new Set<string>()
    squadResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        result.value.players.forEach((p) => {
          slugSet.add(playerSlug(p.id, p.name))
        })
      }
    })

    playerRoutes = Array.from(slugSet).map((slug) => ({
      url: `${BASE}/players/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // 빌드 시 API 미연결 시 정적 경로만 포함
  }

  return [...staticRoutes, ...countryRoutes, ...playerRoutes]
}

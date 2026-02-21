import { useMemo } from 'react'

/**
 * Memoized entity filtering and processing
 * Optimizes performance for large datasets (1000+ entities)
 */
export function useMemoizedEntities(entities, filters) {
  return useMemo(() => {
    if (!entities || entities.length === 0) return []

    let filtered = [...entities]

    // Apply filters
    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter(e => e.type === filters.type)
    }

    if (filters?.sector) {
      filtered = filtered.filter(e => e.sector === filters.sector)
    }

    if (filters?.minTrustScore !== undefined) {
      filtered = filtered.filter(e => 
        (e.updated_trust_score ?? e.trustScore ?? 0) >= filters.minTrustScore
      )
    }

    if (filters?.maxSuspicionScore !== undefined) {
      filtered = filtered.filter(e => 
        (e.suspicion_score ?? 0) <= filters.maxSuspicionScore
      )
    }

    return filtered
  }, [entities, filters])
}

/**
 * Memoized entity search results
 */
export function useMemoizedSearch(entities, query) {
  return useMemo(() => {
    if (!query || query.trim().length === 0 || !entities) {
      return []
    }

    const searchTerm = query.toLowerCase().trim()
    const results = []

    for (const entity of entities) {
      let score = 0
      const name = (entity.name || entity.label || '').toLowerCase()
      const id = (entity.id || '').toLowerCase()
      
      if (name.includes(searchTerm)) {
        score += name.startsWith(searchTerm) ? 10 : 5
      }
      if (id.includes(searchTerm)) {
        score += id.startsWith(searchTerm) ? 8 : 4
      }
      if (entity.directorName?.toLowerCase().includes(searchTerm)) {
        score += 6
      }
      if (entity.sector?.toLowerCase().includes(searchTerm)) {
        score += 2
      }

      if (score > 0) {
        results.push({ entity, score })
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.entity)
  }, [entities, query])
}

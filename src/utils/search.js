/**
 * Global search utility for entities
 * Optimized for 1000+ entities
 */

export function useSearchEntities(entities, query) {
  if (!query || query.trim().length === 0) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  const results = []

  for (const entity of entities) {
    let score = 0
    let matchedFields = []

    // Search by name
    const name = (entity.name || entity.label || '').toLowerCase()
    if (name.includes(searchTerm)) {
      score += name.startsWith(searchTerm) ? 10 : 5
      matchedFields.push('name')
    }

    // Search by ID
    const id = (entity.id || '').toLowerCase()
    if (id.includes(searchTerm)) {
      score += id.startsWith(searchTerm) ? 8 : 4
      matchedFields.push('id')
    }

    // Search by director name
    if (entity.directorName) {
      const director = entity.directorName.toLowerCase()
      if (director.includes(searchTerm)) {
        score += director.startsWith(searchTerm) ? 6 : 3
        matchedFields.push('director')
      }
    }

    // Search by sector
    if (entity.sector) {
      const sector = entity.sector.toLowerCase()
      if (sector.includes(searchTerm)) {
        score += 2
        matchedFields.push('sector')
      }
    }

    // Search by type
    if (entity.type) {
      const type = entity.type.toLowerCase()
      if (type.includes(searchTerm)) {
        score += 1
        matchedFields.push('type')
      }
    }

    if (score > 0) {
      results.push({
        entity,
        score,
        matchedFields
      })
    }
  }

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score)

  return results.map(r => ({
    ...r.entity,
    searchScore: r.score,
    matchedFields: r.matchedFields
  }))
}

/**
 * Debounce function for search input
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Split text by query for highlighting (returns array of {match: boolean, text: string})
 * Use in JSX component to render with <mark> for matches
 */
export function getHighlightParts(text, query) {
  if (!query || !text) return [{ match: false, text: String(text || '') }]
  
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex).filter(Boolean)
  // With capturing group, split yields [before, match, before, match, ...] - odd indices are matches
  return parts.map((part, index) => ({
    match: index % 2 === 1,
    text: part
  }))
}

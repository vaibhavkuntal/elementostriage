/**
 * Sector utilities for entity classification
 */

export const SECTOR_TYPES = {
  GOVERNMENT: 'government',
  CORPORATE: 'corporate',
  FINANCIAL: 'financial',
  MEDIA: 'media'
}

export const ENTITY_TYPES = {
  SHELL_COMPANY: 'shell_company',
  DIRECTOR: 'director',
  WALLET: 'wallet',
  VENDOR: 'vendor',
  POLITICIAN: 'politician',
  INFLUENCER: 'influencer'
}

/**
 * Get sector from entity type
 */
export function getSectorFromType(entityType) {
  switch (entityType) {
    case ENTITY_TYPES.POLITICIAN:
      return SECTOR_TYPES.GOVERNMENT
    
    case ENTITY_TYPES.SHELL_COMPANY:
    case ENTITY_TYPES.VENDOR:
    case ENTITY_TYPES.DIRECTOR:
      return SECTOR_TYPES.CORPORATE
    
    case ENTITY_TYPES.WALLET:
      return SECTOR_TYPES.FINANCIAL
    
    case ENTITY_TYPES.INFLUENCER:
      return SECTOR_TYPES.MEDIA
    
    default:
      return SECTOR_TYPES.CORPORATE
  }
}

/**
 * Calculate sector metrics
 */
export function calculateSectorMetrics(entities, sector) {
  const sectorEntities = entities.filter(e => e.sector === sector)
  
  if (sectorEntities.length === 0) {
    return {
      averageTrustScore: 0,
      averageSuspicionScore: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      trustTrendIndicator: 'stable',
      totalEntities: 0
    }
  }
  
  const trustScores = sectorEntities.map(e => e.updatedTrustScore ?? e.trustScore ?? 50)
  const suspicionScores = sectorEntities.map(e => e.suspicionScore ?? 0)
  
  const averageTrustScore = trustScores.reduce((sum, s) => sum + s, 0) / trustScores.length
  const averageSuspicionScore = suspicionScores.reduce((sum, s) => sum + s, 0) / suspicionScores.length
  
  // Risk classification
  const highRiskCount = sectorEntities.filter(e => {
    const trust = e.updatedTrustScore ?? e.trustScore ?? 50
    const suspicion = e.suspicionScore ?? 0
    return trust < 30 || suspicion > 0.7
  }).length
  
  const mediumRiskCount = sectorEntities.filter(e => {
    const trust = e.updatedTrustScore ?? e.trustScore ?? 50
    const suspicion = e.suspicionScore ?? 0
    return (trust >= 30 && trust < 60) || (suspicion > 0.3 && suspicion <= 0.7)
  }).length
  
  const lowRiskCount = sectorEntities.length - highRiskCount - mediumRiskCount
  
  // Simple trust trend (compare recent vs older entities)
  // For now, use a simple heuristic based on creation dates
  const recentEntities = sectorEntities.filter(e => {
    const createdAt = e.createdAt ? new Date(e.createdAt).getTime() : Date.now()
    const daysSinceCreation = (Date.now() - createdAt) / (24 * 60 * 60 * 1000)
    return daysSinceCreation < 30
  })
  
  const recentAvgTrust = recentEntities.length > 0
    ? recentEntities.reduce((sum, e) => sum + (e.updatedTrustScore ?? e.trustScore ?? 50), 0) / recentEntities.length
    : averageTrustScore
  
  let trustTrendIndicator = 'stable'
  if (recentAvgTrust > averageTrustScore + 5) {
    trustTrendIndicator = 'improving'
  } else if (recentAvgTrust < averageTrustScore - 5) {
    trustTrendIndicator = 'declining'
  }
  
  return {
    averageTrustScore: Math.round(averageTrustScore * 10) / 10,
    averageSuspicionScore: Math.round(averageSuspicionScore * 100) / 100,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    trustTrendIndicator,
    totalEntities: sectorEntities.length
  }
}

/**
 * Get all sector metrics
 */
export function getAllSectorMetrics(entities) {
  return {
    [SECTOR_TYPES.GOVERNMENT]: calculateSectorMetrics(entities, SECTOR_TYPES.GOVERNMENT),
    [SECTOR_TYPES.CORPORATE]: calculateSectorMetrics(entities, SECTOR_TYPES.CORPORATE),
    [SECTOR_TYPES.FINANCIAL]: calculateSectorMetrics(entities, SECTOR_TYPES.FINANCIAL),
    [SECTOR_TYPES.MEDIA]: calculateSectorMetrics(entities, SECTOR_TYPES.MEDIA)
  }
}

/**
 * Get risk level badge
 */
export function getRiskLevel(trustScore, suspicionScore) {
  const trust = trustScore ?? 50
  const suspicion = suspicionScore ?? 0
  
  if (trust < 30 || suspicion > 0.7) {
    return { level: 'High', color: '#e53e3e' }
  } else if (trust < 60 || suspicion > 0.3) {
    return { level: 'Medium', color: '#dd6b20' }
  } else {
    return { level: 'Low', color: '#38a169' }
  }
}

/**
 * Adversarial Laundering Detection Engine
 * 
 * Implements deterministic pattern analysis for detecting money laundering
 * without using machine learning libraries.
 */

// Configuration object for all thresholds
export const DETECTION_CONFIG = {
  // Structural Fragmentation Detection
  STRUCTURAL: {
    OUT_DEGREE_THRESHOLD: 50,        // Flag if out_degree > this
    LOW_AVG_VALUE_THRESHOLD: 1000,   // Consider low if avg < this
    LOW_VARIANCE_THRESHOLD: 100,     // Very low variance threshold
    TIME_WINDOW_HOURS: 24,           // Burst detection window
    MIN_BURST_TRANSACTIONS: 10       // Minimum transactions for burst
  },
  
  // Temporal Burst Detection
  TEMPORAL: {
    SPIKE_MULTIPLIER: 3,             // 3x increase triggers alert
    ACCELERATION_WINDOW_DAYS: 7,     // Window for acceleration detection
    MIN_HISTORICAL_DAYS: 30           // Minimum history needed
  },
  
  // Network Proximity Risk
  NETWORK: {
    MAX_HOPS: 2,                     // Maximum hops from high-risk entity
    HIGH_RISK_THRESHOLD: 0.7         // Suspicion score threshold for high-risk
  },
  
  // Fake Startup Detection
  COMPLIANCE: {
    NEW_COMPANY_AGE_DAYS: 90,        // Company age threshold
    LARGE_CAPITAL_THRESHOLD: 100000,  // Large capital threshold
    LOW_ENTROPY_THRESHOLD: 0.3,       // Low partner entropy threshold
    SHARED_DIRECTOR_THRESHOLD: 3      // Shared director across companies
  },
  
  // Composite Scoring
  COMPOSITE: {
    STRUCTURAL_WEIGHT: 0.3,
    TEMPORAL_WEIGHT: 0.25,
    NETWORK_WEIGHT: 0.25,
    COMPLIANCE_WEIGHT: 0.2,
    TRUST_PENALTY_FACTOR: 0.8         // How much suspicion reduces trust
  }
}

/**
 * Transaction interface:
 * {
 *   id: string,
 *   from: string,      // Entity ID
 *   to: string,        // Entity ID
 *   amount: number,
 *   timestamp: number  // Unix timestamp in milliseconds
 * }
 */

/**
 * Entity interface:
 * {
 *   id: string,
 *   type: string,
 *   createdAt: number,  // Unix timestamp in milliseconds
 *   baseTrustScore: number,
 *   directorName?: string
 * }
 */

/**
 * 1) STRUCTURAL FRAGMENTATION DETECTION
 * 
 * Detects micro-transaction splitting patterns
 */
export function detectStructuralFragmentation(entityId, transactions, config = DETECTION_CONFIG.STRUCTURAL) {
  // Filter transactions where this entity is the source
  const outgoingTransactions = transactions.filter(t => t.from === entityId)
  
  if (outgoingTransactions.length === 0) {
    return { score: 0, details: { reason: 'No outgoing transactions' } }
  }
  
  // Calculate out_degree (number of unique recipients)
  const uniqueRecipients = new Set(outgoingTransactions.map(t => t.to))
  const outDegree = uniqueRecipients.size
  
  // Calculate average transaction value
  const amounts = outgoingTransactions.map(t => t.amount)
  const avgValue = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
  
  // Calculate variance
  const variance = amounts.reduce((sum, a) => {
    return sum + Math.pow(a - avgValue, 2)
  }, 0) / amounts.length
  
  // Detect time window bursts
  const sortedTransactions = [...outgoingTransactions].sort((a, b) => a.timestamp - b.timestamp)
  const windowMs = config.TIME_WINDOW_HOURS * 60 * 60 * 1000
  let maxBurst = 0
  
  for (let i = 0; i < sortedTransactions.length; i++) {
    const windowStart = sortedTransactions[i].timestamp
    const windowEnd = windowStart + windowMs
    const burstCount = sortedTransactions.filter(t => 
      t.timestamp >= windowStart && t.timestamp <= windowEnd
    ).length
    maxBurst = Math.max(maxBurst, burstCount)
  }
  
  const burstDetected = maxBurst >= config.MIN_BURST_TRANSACTIONS
  
  // Calculate suspicion score
  let score = 0
  const flags = []
  
  if (outDegree > config.OUT_DEGREE_THRESHOLD) {
    score += 0.3
    flags.push(`High out-degree: ${outDegree}`)
  }
  
  if (avgValue < config.LOW_AVG_VALUE_THRESHOLD) {
    score += 0.3
    flags.push(`Low average value: $${avgValue.toFixed(2)}`)
  }
  
  if (variance < config.LOW_VARIANCE_THRESHOLD) {
    score += 0.2
    flags.push(`Very low variance: ${variance.toFixed(2)}`)
  }
  
  if (burstDetected) {
    score += 0.2
    flags.push(`Burst detected: ${maxBurst} transactions in ${config.TIME_WINDOW_HOURS}h`)
  }
  
  return {
    score: Math.min(1, score),
    details: {
      outDegree,
      avgValue,
      variance,
      maxBurst,
      burstDetected,
      flags
    }
  }
}

/**
 * 2) TEMPORAL BURST DETECTION
 * 
 * Detects sudden spikes and unnatural acceleration patterns
 */
export function detectTemporalBurst(entityId, transactions, config = DETECTION_CONFIG.TEMPORAL) {
  const entityTransactions = transactions.filter(t => 
    t.from === entityId || t.to === entityId
  )
  
  if (entityTransactions.length === 0) {
    return { score: 0, details: { reason: 'No transactions' } }
  }
  
  // Sort by timestamp
  const sorted = [...entityTransactions].sort((a, b) => a.timestamp - b.timestamp)
  
  const now = Date.now()
  const historicalCutoff = now - (config.MIN_HISTORICAL_DAYS * 24 * 60 * 60 * 1000)
  const recentCutoff = now - (config.ACCELERATION_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  
  // Historical average frequency
  const historical = sorted.filter(t => t.timestamp < historicalCutoff)
  const recent = sorted.filter(t => t.timestamp >= recentCutoff)
  
  if (historical.length === 0) {
    // New entity, check for rapid activity
    const daysSinceFirst = (now - sorted[0].timestamp) / (24 * 60 * 60 * 1000)
    const dailyRate = sorted.length / Math.max(1, daysSinceFirst)
    
    if (dailyRate > 10) {
      return {
        score: 0.6,
        details: {
          reason: 'New entity with high activity rate',
          dailyRate: dailyRate.toFixed(2)
        }
      }
    }
    return { score: 0, details: { reason: 'New entity, insufficient history' } }
  }
  
  // Calculate frequencies
  const historicalDays = (historicalCutoff - sorted[0].timestamp) / (24 * 60 * 60 * 1000)
  const historicalFreq = historical.length / Math.max(1, historicalDays)
  
  const recentDays = config.ACCELERATION_WINDOW_DAYS
  const recentFreq = recent.length / Math.max(1, recentDays)
  
  // Detect spike
  const spikeRatio = historicalFreq > 0 ? recentFreq / historicalFreq : 0
  const spikeDetected = spikeRatio >= config.SPIKE_MULTIPLIER
  
  // Detect acceleration (increasing frequency over time)
  const accelerationWindow = config.ACCELERATION_WINDOW_DAYS
  const halfWindow = accelerationWindow / 2
  const firstHalf = sorted.filter(t => {
    const daysAgo = (now - t.timestamp) / (24 * 60 * 60 * 1000)
    return daysAgo <= accelerationWindow && daysAgo > halfWindow
  })
  const secondHalf = sorted.filter(t => {
    const daysAgo = (now - t.timestamp) / (24 * 60 * 60 * 1000)
    return daysAgo <= halfWindow
  })
  
  const firstHalfFreq = firstHalf.length / halfWindow
  const secondHalfFreq = secondHalf.length / halfWindow
  const accelerationRatio = firstHalfFreq > 0 ? secondHalfFreq / firstHalfFreq : 0
  const accelerationDetected = accelerationRatio >= 2.0
  
  // Calculate score
  let score = 0
  const flags = []
  
  if (spikeDetected) {
    score += 0.5
    flags.push(`Spike detected: ${spikeRatio.toFixed(2)}x increase`)
  }
  
  if (accelerationDetected) {
    score += 0.5
    flags.push(`Acceleration detected: ${accelerationRatio.toFixed(2)}x increase`)
  }
  
  return {
    score: Math.min(1, score),
    details: {
      historicalFreq: historicalFreq.toFixed(2),
      recentFreq: recentFreq.toFixed(2),
      spikeRatio: spikeRatio.toFixed(2),
      accelerationRatio: accelerationRatio.toFixed(2),
      flags
    }
  }
}

/**
 * 3) NETWORK PROXIMITY RISK
 * 
 * Uses BFS to find distance from high-risk entities
 */
export function detectNetworkProximityRisk(entityId, entities, relationships, transactions, config = DETECTION_CONFIG.NETWORK) {
  // Identify high-risk entities (based on suspicion scores or trust scores)
  const highRiskEntities = entities
    .filter(e => {
      // Use base trust score or suspicion score if available
      const trustScore = e.updatedTrustScore ?? e.baseTrustScore ?? 50
      return trustScore < 30 || (e.suspicionScore && e.suspicionScore > config.HIGH_RISK_THRESHOLD)
    })
    .map(e => e.id)
  
  if (highRiskEntities.length === 0) {
    return { score: 0, details: { reason: 'No high-risk entities in network' } }
  }
  
  // BFS to find minimum distance
  function bfsDistance(startId, targetIds, maxDepth) {
    const queue = [{ id: startId, depth: 0 }]
    const visited = new Set([startId])
    
    while (queue.length > 0) {
      const { id, depth } = queue.shift()
      
      if (targetIds.includes(id)) {
        return depth
      }
      
      if (depth >= maxDepth) {
        continue
      }
      
      // Find neighbors
      const neighbors = relationships
        .filter(r => r.source === id || r.target === id)
        .map(r => r.source === id ? r.target : r.source)
        .filter(n => !visited.has(n))
      
      for (const neighbor of neighbors) {
        visited.add(neighbor)
        queue.push({ id: neighbor, depth: depth + 1 })
      }
    }
    
    return Infinity
  }
  
  const minDistance = bfsDistance(entityId, highRiskEntities, config.MAX_HOPS)
  
  if (minDistance === Infinity) {
    return { score: 0, details: { reason: 'Not within proximity of high-risk entities' } }
  }
  
  // Score decreases with distance
  const score = 1 - (minDistance / (config.MAX_HOPS + 1))
  
  return {
    score: Math.max(0, Math.min(1, score)),
    details: {
      minDistance,
      highRiskNeighbors: minDistance <= config.MAX_HOPS,
      flags: [`Within ${minDistance} hop(s) of high-risk entity`]
    }
  }
}

/**
 * 4) FAKE STARTUP DETECTION
 * 
 * Detects compliance irregularities for companies
 */
export function detectFakeStartup(entityId, entity, entities, transactions, relationships, config = DETECTION_CONFIG.COMPLIANCE) {
  // Only applies to companies
  const companyTypes = ['shell_company', 'vendor']
  if (!companyTypes.includes(entity.type)) {
    return { score: 0, details: { reason: 'Not a company entity' } }
  }
  
  const now = Date.now()
  const ageMs = now - (entity.createdAt || now)
  const ageDays = ageMs / (24 * 60 * 60 * 1000)
  
  // Check if company is new
  const isNew = ageDays < config.NEW_COMPANY_AGE_DAYS
  
  if (!isNew) {
    return { score: 0, details: { reason: 'Company is not new' } }
  }
  
  // Calculate capital inflow
  const incomingTransactions = transactions.filter(t => t.to === entityId)
  const totalCapital = incomingTransactions.reduce((sum, t) => sum + t.amount, 0)
  const largeCapital = totalCapital > config.LARGE_CAPITAL_THRESHOLD
  
  // Calculate partner entropy (diversity of partners)
  const uniquePartners = new Set(incomingTransactions.map(t => t.from))
  const partnerEntropy = uniquePartners.size / Math.max(1, incomingTransactions.length)
  const lowEntropy = partnerEntropy < config.LOW_ENTROPY_THRESHOLD
  
  // Check for shared directors
  const directorName = entity.directorName
  let sharedDirectorCount = 0
  
  if (directorName) {
    sharedDirectorCount = entities.filter(e => 
      e.directorName === directorName && 
      e.id !== entityId &&
      companyTypes.includes(e.type)
    ).length
  }
  
  const sharedDirector = sharedDirectorCount >= config.SHARED_DIRECTOR_THRESHOLD
  
  // Calculate score
  let score = 0
  const flags = []
  
  if (largeCapital) {
    score += 0.4
    flags.push(`Large capital inflow: $${totalCapital.toFixed(2)}`)
  }
  
  if (lowEntropy) {
    score += 0.3
    flags.push(`Low partner diversity: ${(partnerEntropy * 100).toFixed(1)}%`)
  }
  
  if (sharedDirector) {
    score += 0.3
    flags.push(`Shared director across ${sharedDirectorCount + 1} companies`)
  }
  
  return {
    score: Math.min(1, score),
    details: {
      ageDays: ageDays.toFixed(1),
      totalCapital,
      partnerEntropy,
      sharedDirectorCount,
      flags
    }
  }
}

/**
 * 5) COMPOSITE SUSPICION ENGINE
 * 
 * Combines all detection modules into a single suspicion score
 */
export function calculateCompositeSuspicion(entityId, entity, entities, transactions, relationships, config = DETECTION_CONFIG) {
  const structural = detectStructuralFragmentation(entityId, transactions, config.STRUCTURAL)
  const temporal = detectTemporalBurst(entityId, transactions, config.TEMPORAL)
  const network = detectNetworkProximityRisk(entityId, entities, relationships, transactions, config.NETWORK)
  const compliance = detectFakeStartup(entityId, entity, entities, transactions, relationships, config.COMPLIANCE)
  
  const suspicionScore = 
    structural.score * config.COMPOSITE.STRUCTURAL_WEIGHT +
    temporal.score * config.COMPOSITE.TEMPORAL_WEIGHT +
    network.score * config.COMPOSITE.NETWORK_WEIGHT +
    compliance.score * config.COMPOSITE.COMPLIANCE_WEIGHT
  
  return {
    structural_score: structural.score,
    temporal_score: temporal.score,
    network_proximity_score: network.score,
    compliance_irregularity_score: compliance.score,
    suspicion_score: Math.min(1, suspicionScore),
    details: {
      structural: structural.details,
      temporal: temporal.details,
      network: network.details,
      compliance: compliance.details
    }
  }
}

/**
 * 6) NARRATIVE EXPLANATION ENGINE
 * 
 * Generates human-readable explanations
 */
export function generateExplanation(entity, detectionResult) {
  const explanations = []
  const { structural_score, temporal_score, network_proximity_score, compliance_irregularity_score, details } = detectionResult
  
  // Structural explanations
  if (structural_score > 0.5) {
    const structDetails = details.structural
    if (structDetails.flags && structDetails.flags.length > 0) {
      explanations.push(`${entity.name || entity.label || entity.id} shows transaction fragmentation: ${structDetails.flags.join(', ')}.`)
    }
  }
  
  // Temporal explanations
  if (temporal_score > 0.5) {
    const tempDetails = details.temporal
    if (tempDetails.flags && tempDetails.flags.length > 0) {
      explanations.push(`Unusual activity pattern detected: ${tempDetails.flags.join(', ')}.`)
    }
  }
  
  // Network explanations
  if (network_proximity_score > 0.5) {
    const netDetails = details.network
    if (netDetails.flags && netDetails.flags.length > 0) {
      explanations.push(`Proximity risk: ${netDetails.flags.join(', ')}.`)
    }
  }
  
  // Compliance explanations
  if (compliance_irregularity_score > 0.5) {
    const compDetails = details.compliance
    if (compDetails.flags && compDetails.flags.length > 0) {
      explanations.push(`Compliance irregularities: ${compDetails.flags.join(', ')}.`)
    }
  }
  
  // Default explanation if no specific flags
  if (explanations.length === 0 && detectionResult.suspicion_score > 0.3) {
    explanations.push(`${entity.name || entity.label || entity.id} shows moderate suspicious activity patterns.`)
  }
  
  return explanations.length > 0 ? explanations : [`${entity.name || entity.label || entity.id} shows no significant suspicious patterns.`]
}

/**
 * Calculate updated trust score with gradual decay
 */
export function calculateUpdatedTrustScore(baseTrustScore, suspicionScore, config = DETECTION_CONFIG.COMPOSITE) {
  const penalty = suspicionScore * config.TRUST_PENALTY_FACTOR
  const updatedScore = baseTrustScore - (baseTrustScore * penalty)
  
  // Ensure score doesn't go below 0
  return Math.max(0, Math.min(100, updatedScore))
}

/**
 * Main detection function - processes all entities
 */
export function runDetectionEngine(entities, transactions, relationships, config = DETECTION_CONFIG) {
  return entities.map(entity => {
    const detectionResult = calculateCompositeSuspicion(
      entity.id,
      entity,
      entities,
      transactions,
      relationships,
      config
    )
    
    const updatedTrustScore = calculateUpdatedTrustScore(
      entity.baseTrustScore || entity.trustScore || 50,
      detectionResult.suspicion_score,
      config.COMPOSITE
    )
    
    const explanations = generateExplanation(entity, detectionResult)
    
    return {
      ...entity,
      ...detectionResult,
      updated_trust_score: updatedTrustScore,
      explanation: explanations
    }
  })
}

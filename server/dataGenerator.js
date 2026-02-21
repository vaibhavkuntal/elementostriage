// Server-side data generator (shared logic with frontend)

const ENTITY_TYPES = {
  SHELL_COMPANY: 'shell_company',
  DIRECTOR: 'director',
  WALLET: 'wallet',
  VENDOR: 'vendor',
  POLITICIAN: 'politician',
  INFLUENCER: 'influencer'
}

const TYPE_COLORS = {
  [ENTITY_TYPES.SHELL_COMPANY]: '#ff6b6b',
  [ENTITY_TYPES.DIRECTOR]: '#4ecdc4',
  [ENTITY_TYPES.WALLET]: '#45b7d1',
  [ENTITY_TYPES.VENDOR]: '#f9ca24',
  [ENTITY_TYPES.POLITICIAN]: '#eb4d4b',
  [ENTITY_TYPES.INFLUENCER]: '#a55eea'
}

export function generateSampleData() {
  const entities = []
  const relationships = []
  
  // Create shell companies
  const shellCompanies = [
    { id: 'sc1', name: 'Oceanic Holdings Ltd', transparency: 0.2, suspiciousActivity: 0.8 },
    { id: 'sc2', name: 'Phoenix Ventures Inc', transparency: 0.15, suspiciousActivity: 0.9 },
    { id: 'sc3', name: 'Meridian Capital Group', transparency: 0.3, suspiciousActivity: 0.6 },
    { id: 'sc4', name: 'Apex Trading Corp', transparency: 0.25, suspiciousActivity: 0.7 },
    { id: 'sc5', name: 'Nexus Holdings LLC', transparency: 0.4, suspiciousActivity: 0.4 }
  ]
  
  // Create directors
  const directors = [
    { id: 'd1', name: 'James Chen', transparency: 0.3, suspiciousActivity: 0.7 },
    { id: 'd2', name: 'Maria Rodriguez', transparency: 0.5, suspiciousActivity: 0.3 },
    { id: 'd3', name: 'Robert Smith', transparency: 0.2, suspiciousActivity: 0.9 },
    { id: 'd4', name: 'Sarah Johnson', transparency: 0.6, suspiciousActivity: 0.2 },
    { id: 'd5', name: 'David Kim', transparency: 0.35, suspiciousActivity: 0.6 }
  ]
  
  // Create wallets
  const wallets = [
    { id: 'w1', name: '0x7a3f...9c2d', transparency: 0.1, suspiciousActivity: 0.95 },
    { id: 'w2', name: '0x4b8e...1f3a', transparency: 0.2, suspiciousActivity: 0.85 },
    { id: 'w3', name: '0x9c1d...5e7f', transparency: 0.4, suspiciousActivity: 0.5 },
    { id: 'w4', name: '0x2f6a...8b3c', transparency: 0.3, suspiciousActivity: 0.7 },
    { id: 'w5', name: '0x5e9d...4a2b', transparency: 0.5, suspiciousActivity: 0.3 }
  ]
  
  // Create vendors
  const vendors = [
    { id: 'v1', name: 'Global Supply Co', transparency: 0.6, suspiciousActivity: 0.2 },
    { id: 'v2', name: 'Tech Solutions Ltd', transparency: 0.4, suspiciousActivity: 0.5 },
    { id: 'v3', name: 'Prime Services Inc', transparency: 0.3, suspiciousActivity: 0.8 },
    { id: 'v4', name: 'Elite Consulting Group', transparency: 0.5, suspiciousActivity: 0.4 }
  ]
  
  // Create politicians
  const politicians = [
    { id: 'p1', name: 'Senator Thompson', transparency: 0.7, suspiciousActivity: 0.1 },
    { id: 'p2', name: 'Mayor Williams', transparency: 0.4, suspiciousActivity: 0.6 },
    { id: 'p3', name: 'Governor Martinez', transparency: 0.5, suspiciousActivity: 0.4 }
  ]
  
  // Create influencers
  const influencers = [
    { id: 'i1', name: '@cryptoking', transparency: 0.3, suspiciousActivity: 0.7 },
    { id: 'i2', name: '@financeguru', transparency: 0.4, suspiciousActivity: 0.5 },
    { id: 'i3', name: '@wealthmaster', transparency: 0.2, suspiciousActivity: 0.9 }
  ]
  
  // Add all entities
  shellCompanies.forEach(sc => {
    entities.push({
      ...sc,
      type: ENTITY_TYPES.SHELL_COMPANY,
      auditHistory: Math.random() * 0.3,
      label: sc.name,
      color: TYPE_COLORS[ENTITY_TYPES.SHELL_COMPANY]
    })
  })
  
  directors.forEach(d => {
    entities.push({
      ...d,
      type: ENTITY_TYPES.DIRECTOR,
      auditHistory: Math.random() * 0.5,
      label: d.name,
      color: TYPE_COLORS[ENTITY_TYPES.DIRECTOR]
    })
  })
  
  wallets.forEach(w => {
    entities.push({
      ...w,
      type: ENTITY_TYPES.WALLET,
      auditHistory: Math.random() * 0.2,
      label: w.name,
      color: TYPE_COLORS[ENTITY_TYPES.WALLET]
    })
  })
  
  vendors.forEach(v => {
    entities.push({
      ...v,
      type: ENTITY_TYPES.VENDOR,
      auditHistory: Math.random() * 0.6,
      label: v.name,
      color: TYPE_COLORS[ENTITY_TYPES.VENDOR]
    })
  })
  
  politicians.forEach(p => {
    entities.push({
      ...p,
      type: ENTITY_TYPES.POLITICIAN,
      auditHistory: Math.random() * 0.7,
      label: p.name,
      color: TYPE_COLORS[ENTITY_TYPES.POLITICIAN]
    })
  })
  
  influencers.forEach(i => {
    entities.push({
      ...i,
      type: ENTITY_TYPES.INFLUENCER,
      auditHistory: Math.random() * 0.3,
      label: i.name,
      color: TYPE_COLORS[ENTITY_TYPES.INFLUENCER]
    })
  })
  
  // Create relationships
  relationships.push({ source: 'sc1', target: 'd1', type: 'controls' })
  relationships.push({ source: 'sc1', target: 'd3', type: 'controls' })
  relationships.push({ source: 'sc2', target: 'd2', type: 'controls' })
  relationships.push({ source: 'sc2', target: 'd3', type: 'controls' })
  relationships.push({ source: 'sc3', target: 'd4', type: 'controls' })
  relationships.push({ source: 'sc4', target: 'd5', type: 'controls' })
  relationships.push({ source: 'sc5', target: 'd1', type: 'controls' })
  
  relationships.push({ source: 'd1', target: 'w1', type: 'owns' })
  relationships.push({ source: 'd1', target: 'w2', type: 'owns' })
  relationships.push({ source: 'd3', target: 'w1', type: 'owns' })
  relationships.push({ source: 'd3', target: 'w4', type: 'owns' })
  relationships.push({ source: 'd2', target: 'w3', type: 'owns' })
  relationships.push({ source: 'd5', target: 'w5', type: 'owns' })
  
  relationships.push({ source: 'w1', target: 'v3', type: 'pays' })
  relationships.push({ source: 'w2', target: 'v1', type: 'pays' })
  relationships.push({ source: 'w4', target: 'v2', type: 'pays' })
  relationships.push({ source: 'w4', target: 'v3', type: 'pays' })
  
  relationships.push({ source: 'sc1', target: 'v3', type: 'contracts' })
  relationships.push({ source: 'sc2', target: 'v4', type: 'contracts' })
  relationships.push({ source: 'sc3', target: 'v1', type: 'contracts' })
  
  relationships.push({ source: 'p2', target: 'sc1', type: 'influences' })
  relationships.push({ source: 'p2', target: 'sc2', type: 'influences' })
  relationships.push({ source: 'p3', target: 'sc4', type: 'influences' })
  
  relationships.push({ source: 'i1', target: 'w1', type: 'promotes' })
  relationships.push({ source: 'i1', target: 'w2', type: 'promotes' })
  relationships.push({ source: 'i3', target: 'w4', type: 'promotes' })
  
  relationships.push({ source: 'sc1', target: 'sc2', type: 'linked' })
  relationships.push({ source: 'sc2', target: 'sc4', type: 'linked' })
  relationships.push({ source: 'd3', target: 'p2', type: 'connected' })
  relationships.push({ source: 'i1', target: 'd1', type: 'connected' })
  
  return { entities, relationships }
}

export function calculateTrustScores(entities, relationships) {
  const corruptThreshold = 0.7
  const corruptNodes = entities
    .filter(e => e.suspiciousActivity >= corruptThreshold)
    .map(e => e.id)
  
  function getMinDistanceFromCorrupt(entityId, visited = new Set(), depth = 0) {
    if (corruptNodes.includes(entityId)) return 0
    if (visited.has(entityId)) return Infinity
    
    visited.add(entityId)
    
    const directConnections = relationships
      .filter(r => r.source === entityId || r.target === entityId)
      .map(r => r.source === entityId ? r.target : r.source)
    
    if (directConnections.length === 0) return Infinity
    
    let minDistance = Infinity
    for (const connectedId of directConnections) {
      if (corruptNodes.includes(connectedId)) {
        minDistance = Math.min(minDistance, 1)
      } else if (depth < 5) {
        const dist = getMinDistanceFromCorrupt(connectedId, new Set(visited), depth + 1)
        if (dist < Infinity) {
          minDistance = Math.min(minDistance, dist + 1)
        }
      }
    }
    
    return minDistance
  }
  
  return entities.map(entity => {
    const transparency = entity.transparency || 0
    const auditHistory = entity.auditHistory || 0
    const suspiciousActivity = entity.suspiciousActivity || 0
    
    const distance = getMinDistanceFromCorrupt(entity.id)
    const networkDistance = distance === Infinity ? 1.0 : Math.max(0, 1 - (distance * 0.2))
    
    const trustScore = Math.max(0, Math.min(100, 
      (transparency * 30) + 
      (auditHistory * 30) + 
      (networkDistance * 30) - 
      (suspiciousActivity * 40)
    ))
    
    return {
      ...entity,
      trustScore: Math.round(trustScore * 10) / 10,
      networkDistance: distance === Infinity ? '∞' : distance
    }
  })
}

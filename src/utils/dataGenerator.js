// Generate sample data for ShadowLedger visualization - Expanded to 1000 entities

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

const TYPE_LABELS = {
  [ENTITY_TYPES.SHELL_COMPANY]: 'Shell Company',
  [ENTITY_TYPES.DIRECTOR]: 'Director',
  [ENTITY_TYPES.WALLET]: 'Digital Wallet',
  [ENTITY_TYPES.VENDOR]: 'Vendor',
  [ENTITY_TYPES.POLITICIAN]: 'Politician',
  [ENTITY_TYPES.INFLUENCER]: 'Influencer'
}

// San Viceroy Districts
const DISTRICTS = [
  'Downtown Financial', 'Portside Industrial', 'Uptown Elite', 'Midtown Commerce',
  'Riverside Residential', 'Airport District', 'Tech Corridor', 'Old Quarter',
  'Marina Bay', 'Harbor View', 'Sunset Heights', 'Eastside'
]

// Narrative flavor texts
const FLAVOR_TEXTS = {
  [ENTITY_TYPES.SHELL_COMPANY]: [
    'Registered in offshore jurisdiction with nominee directors',
    'No physical office, only a PO box address',
    'Complex ownership structure spanning multiple countries',
    'Rapid asset transfers suggest money movement operations',
    'Connected to multiple suspicious transactions'
  ],
  [ENTITY_TYPES.DIRECTOR]: [
    'Serves on boards of 20+ companies simultaneously',
    'Known associate of politically exposed persons',
    'History of regulatory violations in other jurisdictions',
    'Controls multiple shell companies with overlapping ownership',
    'Linked to offshore tax haven structures'
  ],
  [ENTITY_TYPES.WALLET]: [
    'High-frequency transactions with mixing services',
    'Receives funds from known darknet marketplaces',
    'Connected to ransomware payment addresses',
    'Unusual transaction patterns suggest layering',
    'Multiple hops from known criminal wallets'
  ],
  [ENTITY_TYPES.VENDOR]: [
    'Overcharges for services, suggesting kickback scheme',
    'Receives payments from shell companies with no deliverables',
    'Connected to political campaign contributions',
    'Suspicious procurement contracts',
    'Vendor access restricted due to low trust score'
  ],
  [ENTITY_TYPES.POLITICIAN]: [
    'Linked to shell companies increases suspicion score of connected wallets',
    'Campaign funds routed through multiple intermediaries',
    'Family members hold positions in connected entities',
    'Voting record favors connected business interests',
    'Receives undisclosed payments from foreign entities'
  ],
  [ENTITY_TYPES.INFLUENCER]: [
    'Promotes high-risk investment schemes',
    'Paid to promote wallets without disclosure',
    'Connected to pump-and-dump operations',
    'Promotes unregistered securities',
    'History of promoting fraudulent projects'
  ]
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getFlavorText(entity) {
  const texts = FLAVOR_TEXTS[entity.type] || ['Entity with standard operations']
  return getRandomElement(texts)
}

// Generate 1000 entities
export function generateSampleData() {
  const entities = []
  const relationships = []
  
  // Create entities by type
  const counts = {
    shell_company: 200,
    director: 150,
    wallet: 300,
    vendor: 150,
    politician: 100,
    influencer: 100
  }
  
  let idCounter = 1
  
  // Generate shell companies
  const directorNames = []
  for (let i = 0; i < counts.shell_company; i++) {
    const suspicious = Math.random() > 0.3 ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 // Random date within last year
    const directorName = `Director ${Math.floor(Math.random() * 50) + 1}`
    directorNames.push(directorName)
    
    entities.push({
      id: `sc${idCounter++}`,
      label: `Shell Co ${i + 1}`,
      name: `Shell Co ${i + 1}`,
      type: ENTITY_TYPES.SHELL_COMPANY,
      sector: 'corporate',
      transparency: Math.random() * 0.3,
      auditHistory: Math.random() * 0.2,
      suspiciousActivity: suspicious,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.7 ? Math.random() * 0.4 : 0, // Some fake good scores
      color: TYPE_COLORS[ENTITY_TYPES.SHELL_COMPANY],
      createdAt,
      baseTrustScore: 50,
      directorName
    })
  }
  
  // Generate directors
  for (let i = 0; i < counts.director; i++) {
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    entities.push({
      id: `d${idCounter++}`,
      label: `Director ${i + 1}`,
      name: `Director ${i + 1}`,
      type: ENTITY_TYPES.DIRECTOR,
      sector: 'corporate',
      transparency: Math.random() * 0.5,
      auditHistory: Math.random() * 0.4,
      suspiciousActivity: Math.random() * 0.6,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.75 ? Math.random() * 0.3 : 0,
      color: TYPE_COLORS[ENTITY_TYPES.DIRECTOR],
      createdAt,
      baseTrustScore: 50
    })
  }
  
  // Generate wallets
  for (let i = 0; i < counts.wallet; i++) {
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    entities.push({
      id: `w${idCounter++}`,
      label: `0x${Math.random().toString(16).substr(2, 8)}...`,
      name: `0x${Math.random().toString(16).substr(2, 8)}...`,
      type: ENTITY_TYPES.WALLET,
      sector: 'financial',
      transparency: Math.random() * 0.3,
      auditHistory: Math.random() * 0.2,
      suspiciousActivity: Math.random() * 0.8,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.8 ? Math.random() * 0.5 : 0,
      color: TYPE_COLORS[ENTITY_TYPES.WALLET],
      createdAt,
      baseTrustScore: 50
    })
  }
  
  // Generate vendors
  for (let i = 0; i < counts.vendor; i++) {
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    const directorName = directorNames[Math.floor(Math.random() * directorNames.length)]
    entities.push({
      id: `v${idCounter++}`,
      label: `Vendor ${i + 1}`,
      name: `Vendor ${i + 1}`,
      type: ENTITY_TYPES.VENDOR,
      sector: 'corporate',
      transparency: Math.random() * 0.6 + 0.2,
      auditHistory: Math.random() * 0.5,
      suspiciousActivity: Math.random() * 0.5,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.85 ? Math.random() * 0.2 : 0,
      color: TYPE_COLORS[ENTITY_TYPES.VENDOR],
      createdAt,
      baseTrustScore: 50,
      directorName: Math.random() > 0.7 ? directorName : undefined
    })
  }
  
  // Generate politicians
  for (let i = 0; i < counts.politician; i++) {
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    entities.push({
      id: `p${idCounter++}`,
      label: `Politician ${i + 1}`,
      name: `Politician ${i + 1}`,
      type: ENTITY_TYPES.POLITICIAN,
      sector: 'government',
      transparency: Math.random() * 0.5 + 0.3,
      auditHistory: Math.random() * 0.6,
      suspiciousActivity: Math.random() * 0.5,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.7 ? Math.random() * 0.4 : 0,
      color: TYPE_COLORS[ENTITY_TYPES.POLITICIAN],
      createdAt,
      baseTrustScore: 50
    })
  }
  
  // Generate influencers
  for (let i = 0; i < counts.influencer; i++) {
    const createdAt = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    entities.push({
      id: `i${idCounter++}`,
      label: `@influencer${i + 1}`,
      name: `@influencer${i + 1}`,
      type: ENTITY_TYPES.INFLUENCER,
      sector: 'media',
      transparency: Math.random() * 0.4,
      auditHistory: Math.random() * 0.3,
      suspiciousActivity: Math.random() * 0.7,
      district: getRandomElement(DISTRICTS),
      manipulationScore: Math.random() > 0.8 ? Math.random() * 0.5 : 0,
      color: TYPE_COLORS[ENTITY_TYPES.INFLUENCER],
      createdAt,
      baseTrustScore: 50
    })
  }
  
  // Create relationships - ensure connectivity
  const shellCompanies = entities.filter(e => e.type === ENTITY_TYPES.SHELL_COMPANY)
  const directors = entities.filter(e => e.type === ENTITY_TYPES.DIRECTOR)
  const wallets = entities.filter(e => e.type === ENTITY_TYPES.WALLET)
  const vendors = entities.filter(e => e.type === ENTITY_TYPES.VENDOR)
  const politicians = entities.filter(e => e.type === ENTITY_TYPES.POLITICIAN)
  const influencers = entities.filter(e => e.type === ENTITY_TYPES.INFLUENCER)
  
  // Shell companies -> Directors (controls)
  shellCompanies.forEach((sc, i) => {
    const numDirectors = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < numDirectors && j < directors.length; j++) {
      const dir = directors[(i * numDirectors + j) % directors.length]
      relationships.push({ source: sc.id, target: dir.id, type: 'controls' })
    }
  })
  
  // Directors -> Wallets (owns)
  directors.forEach((d, i) => {
    const numWallets = Math.floor(Math.random() * 4) + 1
    for (let j = 0; j < numWallets && j < wallets.length; j++) {
      const wallet = wallets[(i * numWallets + j) % wallets.length]
      relationships.push({ source: d.id, target: wallet.id, type: 'owns' })
    }
  })
  
  // Wallets -> Vendors (pays)
  wallets.forEach((w, i) => {
    if (Math.random() > 0.6) {
      const vendor = vendors[i % vendors.length]
      relationships.push({ source: w.id, target: vendor.id, type: 'pays' })
    }
  })
  
  // Shell companies -> Vendors (contracts)
  shellCompanies.forEach((sc, i) => {
    if (Math.random() > 0.5) {
      const vendor = vendors[i % vendors.length]
      relationships.push({ source: sc.id, target: vendor.id, type: 'contracts' })
    }
  })
  
  // Politicians -> Shell companies (influences)
  politicians.forEach((p, i) => {
    const numShells = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < numShells; j++) {
      const shell = shellCompanies[(i * numShells + j) % shellCompanies.length]
      relationships.push({ source: p.id, target: shell.id, type: 'influences' })
    }
  })
  
  // Influencers -> Wallets (promotes)
  influencers.forEach((inf, i) => {
    const numWallets = Math.floor(Math.random() * 5) + 1
    for (let j = 0; j < numWallets; j++) {
      const wallet = wallets[(i * numWallets + j) % wallets.length]
      relationships.push({ source: inf.id, target: wallet.id, type: 'promotes' })
    }
  })
  
  // Cross-connections (suspicious networks)
  for (let i = 0; i < 200; i++) {
    const source = entities[Math.floor(Math.random() * entities.length)]
    const target = entities[Math.floor(Math.random() * entities.length)]
    if (source.id !== target.id) {
      relationships.push({ 
        source: source.id, 
        target: target.id, 
        type: Math.random() > 0.5 ? 'linked' : 'connected' 
      })
    }
  }
  
  // Add flavor text to all entities
  entities.forEach(entity => {
    entity.flavorText = getFlavorText(entity)
  })
  
  // Generate transactions based on relationships
  const transactions = []
  const now = Date.now()
  
  // Generate transactions for each relationship
  relationships.forEach((rel, idx) => {
    // Generate multiple transactions per relationship (simulating transaction history)
    const numTransactions = Math.floor(Math.random() * 10) + 1
    
    for (let i = 0; i < numTransactions; i++) {
      // Random timestamp within the last year, weighted towards recent
      const daysAgo = Math.pow(Math.random(), 2) * 365
      const timestamp = now - (daysAgo * 24 * 60 * 60 * 1000)
      
      // Amount varies by relationship type
      let amount = 0
      if (rel.type === 'pays' || rel.type === 'contracts') {
        amount = Math.random() * 50000 + 1000 // $1k - $50k
      } else if (rel.type === 'owns' || rel.type === 'controls') {
        amount = Math.random() * 100000 + 10000 // $10k - $100k
      } else {
        amount = Math.random() * 20000 + 500 // $500 - $20k
      }
      
      transactions.push({
        id: `tx_${idx}_${i}`,
        from: rel.source,
        to: rel.target,
        amount: Math.round(amount * 100) / 100,
        timestamp
      })
    }
  })
  
  // Add some additional random transactions (not tied to relationships)
  for (let i = 0; i < 500; i++) {
    const from = entities[Math.floor(Math.random() * entities.length)]
    const to = entities[Math.floor(Math.random() * entities.length)]
    
    if (from.id !== to.id) {
      const daysAgo = Math.pow(Math.random(), 2) * 365
      const timestamp = now - (daysAgo * 24 * 60 * 60 * 1000)
      const amount = Math.random() * 30000 + 100
      
      transactions.push({
        id: `tx_random_${i}`,
        from: from.id,
        to: to.id,
        amount: Math.round(amount * 100) / 100,
        timestamp
      })
    }
  }
  
  return { entities, relationships, transactions }
}

// Calculate trust scores with cascading risk model
export function calculateTrustScores(entities, relationships) {
  const corruptThreshold = 0.7
  const corruptNodes = entities
    .filter(e => e.suspiciousActivity >= corruptThreshold)
    .map(e => e.id)
  
  // Cascading risk: Politician linked to shell increases suspicion of connected wallets
  const politicianShellLinks = relationships.filter(r => 
    r.type === 'influences' && 
    entities.find(e => e.id === r.source)?.type === ENTITY_TYPES.POLITICIAN &&
    entities.find(e => e.id === r.target)?.type === ENTITY_TYPES.SHELL_COMPANY
  )
  
  politicianShellLinks.forEach(link => {
    const shell = entities.find(e => e.id === link.target)
    if (shell) {
      // Find wallets connected to this shell
      const connectedWallets = relationships
        .filter(r => (r.source === shell.id || r.target === shell.id) && 
          entities.find(e => (e.id === r.source || e.id === r.target) && e.type === ENTITY_TYPES.WALLET))
        .map(r => entities.find(e => e.id === (r.source === shell.id ? r.target : r.source)))
        .filter(Boolean)
      
      connectedWallets.forEach(wallet => {
        if (wallet) {
          wallet.suspiciousActivity = Math.min(1, (wallet.suspiciousActivity || 0) + 0.15)
        }
      })
    }
  })
  
  // Calculate network distance from corrupt nodes
  function getMinDistanceFromCorrupt(entityId, visited = new Set(), depth = 0) {
    if (corruptNodes.includes(entityId)) return 0
    if (visited.has(entityId)) return Infinity
    if (depth > 5) return Infinity
    
    visited.add(entityId)
    
    const directConnections = relationships
      .filter(r => r.source === entityId || r.target === entityId)
      .map(r => r.source === entityId ? r.target : r.source)
    
    if (directConnections.length === 0) return Infinity
    
    let minDistance = Infinity
    for (const connectedId of directConnections) {
      if (corruptNodes.includes(connectedId)) {
        minDistance = Math.min(minDistance, 1)
      } else {
        const dist = getMinDistanceFromCorrupt(connectedId, new Set(visited), depth + 1)
        if (dist < Infinity) {
          minDistance = Math.min(minDistance, dist + 1)
        }
      }
    }
    
    return minDistance
  }
  
  // Calculate trust score for each entity
  return entities.map(entity => {
    const transparency = entity.transparency || 0
    const auditHistory = entity.auditHistory || 0
    let suspiciousActivity = entity.suspiciousActivity || 0
    
    // Apply manipulation score (entities faking good scores)
    const manipulationScore = entity.manipulationScore || 0
    const realSuspiciousActivity = suspiciousActivity + manipulationScore
    
    // Network distance
    const distance = getMinDistanceFromCorrupt(entity.id)
    const networkDistance = distance === Infinity ? 1.0 : Math.max(0, 1 - (distance * 0.2))
    
    // Base trust score
    let trustScore = Math.max(0, Math.min(100, 
      (transparency * 30) + 
      (auditHistory * 30) + 
      (networkDistance * 30) - 
      (realSuspiciousActivity * 40)
    ))
    
    // Apply manipulation (fake good scores)
    if (manipulationScore > 0) {
      trustScore = Math.min(100, trustScore + (manipulationScore * 20))
    }
    
    // Cascading risk: If trust < 5, vendor access restricted
    const accessLevel = trustScore >= 70 ? 'Fast Approvals' :
                       trustScore >= 40 ? 'Standard Review' :
                       trustScore >= 5 ? 'Restricted Access' : 'Vendor Access Restricted'
    
    return {
      ...entity,
      trustScore: Math.round(trustScore * 10) / 10,
      networkDistance: distance === Infinity ? '∞' : distance,
      color: TYPE_COLORS[entity.type] || '#666',
      accessLevel,
      realTrustScore: trustScore - (manipulationScore * 20), // Real score before manipulation
      manipulationDetected: manipulationScore > 0.2
    }
  })
}

export { ENTITY_TYPES, TYPE_COLORS, TYPE_LABELS, DISTRICTS }

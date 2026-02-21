import initSqlJs from 'sql.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { generateSampleData, calculateTrustScores } from './dataGenerator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db = null
let SQL = null

export async function initDatabase() {
  // Initialize SQL.js
  SQL = await initSqlJs()
  
  const dbPath = join(__dirname, 'shadowledger.db')
  
  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT NOT NULL,
      transparency REAL DEFAULT 0.5,
      auditHistory REAL DEFAULT 0.5,
      suspiciousActivity REAL DEFAULT 0.3,
      trustScore REAL DEFAULT 50,
      networkDistance TEXT DEFAULT '∞',
      color TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  
  db.run(`
    CREATE TABLE IF NOT EXISTS relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      type TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  
  db.run(`
    CREATE TABLE IF NOT EXISTS corruption_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entityId TEXT,
      reporterName TEXT,
      reporterEmail TEXT,
      description TEXT NOT NULL,
      evidence TEXT,
      status TEXT DEFAULT 'pending',
      aiAnalysis TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source);`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target);`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_reports_entity ON corruption_reports(entityId);`)
  
  // Initialize with sample data if database is empty
  const result = db.exec('SELECT COUNT(*) as count FROM entities')
  const entityCount = result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : 0
  
  if (entityCount === 0) {
    const { entities, relationships } = generateSampleData()
    const entitiesWithScores = calculateTrustScores(entities, relationships)
    
    // Insert entities
    const insertEntity = db.prepare(`
      INSERT INTO entities (id, label, type, transparency, auditHistory, suspiciousActivity, trustScore, networkDistance, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const entity of entitiesWithScores) {
      insertEntity.run([
        entity.id,
        entity.label,
        entity.type,
        entity.transparency,
        entity.auditHistory,
        entity.suspiciousActivity,
        entity.trustScore,
        entity.networkDistance === '∞' ? '∞' : String(entity.networkDistance),
        entity.color
      ])
    }
    insertEntity.free()
    
    // Insert relationships
    const insertRelationship = db.prepare(`
      INSERT INTO relationships (source, target, type)
      VALUES (?, ?, ?)
    `)
    
    for (const rel of relationships) {
      insertRelationship.run([rel.source, rel.target, rel.type])
    }
    insertRelationship.free()
    
    // Save database to file
    saveDatabase()
    
    console.log('✅ Database initialized with sample data')
  }
}

function saveDatabase() {
  const dbPath = join(__dirname, 'shadowledger.db')
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)
}

export function getEntities() {
  const result = db.exec('SELECT * FROM entities ORDER BY createdAt DESC')
  if (result.length === 0) return []
  
  const columns = result[0].columns
  return result[0].values.map(row => {
    const entity = {}
    columns.forEach((col, i) => {
      entity[col] = row[i]
    })
    return entity
  })
}

export function getRelationships() {
  const result = db.exec('SELECT source, target, type FROM relationships')
  if (result.length === 0) return []
  
  const columns = result[0].columns
  return result[0].values.map(row => {
    const rel = {}
    columns.forEach((col, i) => {
      rel[col] = row[i]
    })
    return rel
  })
}

export function createEntity(entity) {
  const id = entity.id || `entity_${Date.now()}`
  const color = entity.color || '#ff00ff'
  
  db.run(`
    INSERT INTO entities (id, label, type, transparency, auditHistory, suspiciousActivity, color)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    entity.label,
    entity.type,
    entity.transparency || 0.5,
    entity.auditHistory || 0.5,
    entity.suspiciousActivity || 0.3,
    color
  ])
  
  saveDatabase()
  
  const result = db.exec(`SELECT * FROM entities WHERE id = '${id}'`)
  if (result.length === 0) return null
  
  const columns = result[0].columns
  const row = result[0].values[0]
  const newEntity = {}
  columns.forEach((col, i) => {
    newEntity[col] = row[i]
  })
  return newEntity
}

export function createRelationship(relationship) {
  db.run(`
    INSERT INTO relationships (source, target, type)
    VALUES (?, ?, ?)
  `, [relationship.source, relationship.target, relationship.type])
  
  saveDatabase()
  
  return { source: relationship.source, target: relationship.target, type: relationship.type }
}

export function createCorruptionReport(report) {
  db.run(`
    INSERT INTO corruption_reports (entityId, reporterName, reporterEmail, description, evidence, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    report.entityId || null,
    report.reporterName || 'Anonymous',
    report.reporterEmail || null,
    report.description,
    report.evidence || null,
    'pending'
  ])
  
  saveDatabase()
  
  const result = db.exec('SELECT last_insert_rowid() as id')
  const id = result[0].values[0][0]
  
  const reportResult = db.exec(`SELECT * FROM corruption_reports WHERE id = ${id}`)
  if (reportResult.length === 0) return null
  
  const columns = reportResult[0].columns
  const row = reportResult[0].values[0]
  const newReport = {}
  columns.forEach((col, i) => {
    newReport[col] = row[i]
  })
  return newReport
}

export function getCorruptionReports() {
  const result = db.exec(`
    SELECT r.*, e.label as entityLabel 
    FROM corruption_reports r
    LEFT JOIN entities e ON r.entityId = e.id
    ORDER BY r.createdAt DESC
  `)
  
  if (result.length === 0) return []
  
  const columns = result[0].columns
  return result[0].values.map(row => {
    const report = {}
    columns.forEach((col, i) => {
      report[col] = row[i]
    })
    return report
  })
}

// AI Analysis function (simulated - replace with actual AI API call)
export async function analyzeWithAI(data) {
  // Simulate AI analysis
  // In production, replace this with actual OpenAI/Claude API call
  
  let analysis = ''
  
  if (data.description) {
    // Analyze corruption report
    const keywords = ['fraud', 'bribery', 'money laundering', 'corruption', 'illegal', 'suspicious']
    const foundKeywords = keywords.filter(kw => 
      data.description.toLowerCase().includes(kw.toLowerCase())
    )
    
    analysis = `AI Analysis: This report contains ${foundKeywords.length} relevant keywords. `
    analysis += `The report has been flagged for ${foundKeywords.length > 2 ? 'high' : 'medium'} priority review. `
    analysis += `Recommended actions: Investigate entity connections, review transaction history, and flag related entities for enhanced monitoring.`
  } else if (data.entities && data.relationships) {
    // Analyze network patterns
    const suspiciousEntities = data.entities.filter(e => e.suspiciousActivity > 0.7)
    const clusterSize = data.relationships.filter(r => 
      suspiciousEntities.some(e => e.id === r.source || e.id === r.target)
    ).length
    
    analysis = `AI Network Analysis: Detected ${suspiciousEntities.length} highly suspicious entities. `
    analysis += `Found ${clusterSize} connections in suspicious clusters. `
    analysis += `Recommendation: Investigate these clusters for potential money laundering networks.`
  }
  
  return {
    analysis,
    confidence: 0.85,
    timestamp: new Date().toISOString()
  }
}

import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDatabase, getEntities, getRelationships, createEntity, createRelationship, createCorruptionReport, getCorruptionReports, analyzeWithAI } from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/entities', async (req, res) => {
  try {
    const entities = getEntities()
    res.json(entities)
  } catch (error) {
    console.error('Error fetching entities:', error)
    res.status(500).json({ error: 'Failed to fetch entities' })
  }
})

app.get('/api/relationships', async (req, res) => {
  try {
    const relationships = getRelationships()
    res.json(relationships)
  } catch (error) {
    console.error('Error fetching relationships:', error)
    res.status(500).json({ error: 'Failed to fetch relationships' })
  }
})

app.post('/api/entities', async (req, res) => {
  try {
    const entity = createEntity(req.body)
    res.status(201).json(entity)
  } catch (error) {
    console.error('Error creating entity:', error)
    res.status(500).json({ error: 'Failed to create entity' })
  }
})

app.post('/api/relationships', async (req, res) => {
  try {
    const relationship = createRelationship(req.body)
    res.status(201).json(relationship)
  } catch (error) {
    console.error('Error creating relationship:', error)
    res.status(500).json({ error: 'Failed to create relationship' })
  }
})

app.post('/api/reports', async (req, res) => {
  try {
    const report = createCorruptionReport(req.body)
    
    // Use AI to analyze the report
    const aiAnalysis = await analyzeWithAI(report)
    
    res.status(201).json({ report, aiAnalysis })
  } catch (error) {
    console.error('Error creating corruption report:', error)
    res.status(500).json({ error: 'Failed to create corruption report' })
  }
})

app.get('/api/reports', async (req, res) => {
  try {
    const reports = getCorruptionReports()
    res.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { entities, relationships, query } = req.body
    const analysis = await analyzeWithAI({ entities, relationships, query })
    res.json(analysis)
  } catch (error) {
    console.error('Error analyzing with AI:', error)
    res.status(500).json({ error: 'Failed to analyze with AI' })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase()
    console.log('✅ Database initialized')
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

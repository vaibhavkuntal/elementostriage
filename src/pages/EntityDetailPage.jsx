import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import { getRiskLevel } from '../utils/sectors'
import EntityDetails from '../components/EntityDetails'
import './EntityDetailPage.css'

function EntityDetailPage() {
  const { entityId } = useParams()
  const [entity, setEntity] = useState(null)
  const [entities, setEntities] = useState([])
  const [relationships, setRelationships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [entityId])

  function loadData() {
    setLoading(true)
    const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
    const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
    const entitiesWithDetection = runDetectionEngine(
      entitiesWithScores,
      generatedTransactions,
      generatedRelationships
    )
    
    const foundEntity = entitiesWithDetection.find(e => e.id === entityId)
    setEntity(foundEntity)
    setEntities(entitiesWithDetection)
    setRelationships(generatedRelationships)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="entity-detail-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading entity data...</p>
        </div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="entity-detail-page">
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </header>
        <main className="entity-detail-content">
          <div className="not-found">
            <h2>Entity not found</h2>
            <p>The entity you're looking for doesn't exist.</p>
            <Link to="/" className="back-button">Go to Home</Link>
          </div>
        </main>
      </div>
    )
  }

  const trust = entity.updated_trust_score ?? entity.trustScore ?? 50
  const suspicion = entity.suspicion_score ?? 0
  const risk = getRiskLevel(trust, suspicion)

  return (
    <div className="entity-detail-page">
      <header className="app-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">{entity.name || entity.label || entity.id}</span>
              <span className="title-subtitle">Entity Details</span>
            </div>
          </div>
        </div>
      </header>

      <main className="entity-detail-content">
        <div className="entity-header">
          <div className="entity-info">
            <h1>{entity.name || entity.label || entity.id}</h1>
            <div className="entity-meta">
              <span className="entity-type">{entity.type}</span>
              <span className="entity-sector">{entity.sector}</span>
            </div>
          </div>
          <div className="entity-scores">
            <div className="score-card">
              <div className="score-label">Trust Score</div>
              <div className="score-value">{trust.toFixed(1)}</div>
            </div>
            <div className="score-card">
              <div className="score-label">Suspicion Score</div>
              <div className="score-value suspicion">{(suspicion * 100).toFixed(1)}%</div>
            </div>
            <div className="score-card">
              <div className="score-label">Risk Level</div>
              <div className="score-value">
                <span className="risk-badge" style={{ backgroundColor: risk.color + '20', color: risk.color }}>
                  {risk.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {entity.explanation && entity.explanation.length > 0 && (
          <div className="explanation-section">
            <h2>The Story — What We See</h2>
            <p className="explanation-intro">Narrative from our exposure engine (no dry reports):</p>
            <ul className="explanation-list">
              {entity.explanation.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        <EntityDetails
          entity={entity}
          entities={entities}
          relationships={relationships}
          onReportCorruption={() => {}}
        />
      </main>
    </div>
  )
}

export default EntityDetailPage

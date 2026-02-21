import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import { calculateSectorMetrics, getRiskLevel, SECTOR_TYPES } from '../utils/sectors'
import NetworkGraph from '../components/NetworkGraph'
import LeaderboardTable from '../components/LeaderboardTable'
import './SectorPage.css'

function SectorPage() {
  const { sectorId } = useParams()
  const [entities, setEntities] = useState([])
  const [relationships, setRelationships] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [selectedEntity, setSelectedEntity] = useState(null)

  useEffect(() => {
    loadData()
  }, [sectorId])

  function loadData() {
    setLoading(true)
    const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
    const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
    const entitiesWithDetection = runDetectionEngine(
      entitiesWithScores,
      generatedTransactions,
      generatedRelationships
    )
    
    // Filter by sector
    const sectorEntities = entitiesWithDetection.filter(e => e.sector === sectorId)
    const sectorEntityIds = new Set(sectorEntities.map(e => e.id))
    
    // Filter relationships to include only sector entities
    const sectorRelationships = generatedRelationships.filter(r => 
      sectorEntityIds.has(r.source) && sectorEntityIds.has(r.target)
    )
    
    setEntities(sectorEntities)
    setRelationships(sectorRelationships)
    setTransactions(generatedTransactions)
    
    const sectorMetrics = calculateSectorMetrics(sectorEntities, sectorId)
    setMetrics(sectorMetrics)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="sector-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading sector data...</p>
        </div>
      </div>
    )
  }

  const sectorName = sectorId.charAt(0).toUpperCase() + sectorId.slice(1)

  return (
    <div className="sector-page">
      <header className="app-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">{sectorName} Sector</span>
              <span className="title-subtitle">ShadowLedger</span>
            </div>
          </div>
        </div>
      </header>

      <main className="sector-content">
        {metrics && (
          <div className="sector-overview">
            <div className="overview-card">
              <h3>Sector Metrics</h3>
              <div className="metrics-row">
                <div className="metric-item">
                  <span className="metric-label">Average Trust Score</span>
                  <span className="metric-value">{metrics.averageTrustScore}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Average Suspicion</span>
                  <span className="metric-value">{metrics.averageSuspicionScore.toFixed(2)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Total Entities</span>
                  <span className="metric-value">{metrics.totalEntities}</span>
                </div>
              </div>
              <div className="risk-breakdown">
                <div className="risk-item">
                  <span className="risk-label">High Risk:</span>
                  <span className="risk-value high">{metrics.highRiskCount}</span>
                </div>
                <div className="risk-item">
                  <span className="risk-label">Medium Risk:</span>
                  <span className="risk-value medium">{metrics.mediumRiskCount}</span>
                </div>
                <div className="risk-item">
                  <span className="risk-label">Low Risk:</span>
                  <span className="risk-value low">{metrics.lowRiskCount}</span>
                </div>
              </div>
              <div className="trend-indicator">
                <span>Trust Trend: </span>
                <span className={`trend-badge trend-${metrics.trustTrendIndicator}`}>
                  {metrics.trustTrendIndicator}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="sector-main">
          <div className="graph-section">
            <h2 className="section-title">Sector Network Graph</h2>
            <div className="graph-container">
              <NetworkGraph
                entities={entities}
                relationships={relationships}
                onEntitySelect={setSelectedEntity}
                selectedEntity={selectedEntity}
              />
            </div>
          </div>

          <div className="leaderboard-section">
            <h2 className="section-title">Sector Leaderboard</h2>
            <LeaderboardTable entities={entities} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SectorPage

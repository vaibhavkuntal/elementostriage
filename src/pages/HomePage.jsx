import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchEntities, fetchRelationships } from '../utils/api'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import { getAllSectorMetrics, SECTOR_TYPES } from '../utils/sectors'
import CorruptionReportModal from '../components/CorruptionReportModal'
import './HomePage.css'

function HomePage() {
  const [entities, setEntities] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [entitiesData, relationshipsData] = await Promise.all([
        fetchEntities(),
        fetchRelationships()
      ])
      
      // Generate sample data if API fails
      const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
      const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
      
      // Run detection engine
      const entitiesWithDetection = runDetectionEngine(
        entitiesWithScores,
        generatedTransactions,
        generatedRelationships
      )
      
      setEntities(entitiesWithDetection)
      setTransactions(generatedTransactions)
      
      // Calculate metrics
      const sectorMetrics = getAllSectorMetrics(entitiesWithDetection)
      const totalEntities = entitiesWithDetection.length
      const avgTrustScore = entitiesWithDetection.reduce((sum, e) => 
        sum + (e.updated_trust_score ?? e.trustScore ?? 50), 0) / totalEntities
      const suspiciousCount = entitiesWithDetection.filter(e => 
        (e.suspicion_score ?? 0) > 0.5
      ).length
      
      setMetrics({
        totalEntities,
        averageTrustScore: avgTrustScore,
        suspiciousEntities: suspiciousCount,
        sectorMetrics
      })
    } catch (error) {
      console.error('Error loading data:', error)
      const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
      const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
      const entitiesWithDetection = runDetectionEngine(
        entitiesWithScores,
        generatedTransactions,
        generatedRelationships
      )
      setEntities(entitiesWithDetection)
      setTransactions(generatedTransactions)
      
      const sectorMetrics = getAllSectorMetrics(entitiesWithDetection)
      const totalEntities = entitiesWithDetection.length
      const avgTrustScore = entitiesWithDetection.reduce((sum, e) => 
        sum + (e.updated_trust_score ?? e.trustScore ?? 50), 0) / totalEntities
      const suspiciousCount = entitiesWithDetection.filter(e => 
        (e.suspicion_score ?? 0) > 0.5
      ).length
      
      setMetrics({
        totalEntities,
        averageTrustScore: avgTrustScore,
        suspiciousEntities: suspiciousCount,
        sectorMetrics
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading network data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <header className="app-header">
        <div className="header-content">
          <div className="app-title">
            <span className="title-main">San Viceroy</span>
            <span className="title-subtitle">Financial Intelligence Bureau</span>
          </div>
          <p className="app-mission">
            Where the legal economy meets the shadow one — exposure as a public sport.
          </p>
          <p className="app-tagline">&ldquo;See the money that doesn&apos;t want to be seen.&rdquo;</p>
        </div>
      </header>

      <main className="home-content">
        <div className="home-hero">
          <h1 className="hero-title">San Viceroy Economic Intelligence Grid</h1>
          <p className="hero-description">
            We don&apos;t just file reports — we tell stories. The Grid maps where legitimate business
            and hidden flows intersect: government, corporate, financial, and media. Corruption exposure
            is a public sport. You watch the board, you tell the story, you stay anonymous, you get rewarded.
          </p>

          <div className="pillars">
            <div className="pillar">
              <span className="pillar-icon">🏆</span>
              <span className="pillar-text">Exposure as a public sport</span>
            </div>
            <div className="pillar">
              <span className="pillar-icon">📖</span>
              <span className="pillar-text">Stories, not reports</span>
            </div>
            <div className="pillar">
              <span className="pillar-icon">🎭</span>
              <span className="pillar-text">Reward whistleblowers — stay anonymous</span>
            </div>
            <div className="pillar">
              <span className="pillar-icon">〰️</span>
              <span className="pillar-text">Where legal meets illegal</span>
            </div>
          </div>
          
          {metrics && (
            <div className="city-metrics">
              <div className="city-metric">
                <span className="city-metric-label">Corruption Heat Index</span>
                <span className="city-metric-value">
                  {metrics.averageTrustScore < 40 ? 'HIGH' : metrics.averageTrustScore < 60 ? 'MODERATE' : 'LOW'}
                </span>
              </div>
              <div className="city-metric">
                <span className="city-metric-label">City Trust Score</span>
                <span className="city-metric-value">{metrics.averageTrustScore.toFixed(1)}</span>
              </div>
            </div>
          )}
          
          <div className="report-section">
            <h2 className="report-title">Tell Your Story — Get Rewarded</h2>
            <p className="report-description">
              Share what you know. We use stories, not dry reports. Every verified tip can earn you a reward.
              Stay anonymous if you want — we never expose whistleblowers.
            </p>
            <button
              className="report-corruption-btn-large"
              onClick={() => setShowReportModal(true)}
            >
              Tell Your Story
            </button>
          </div>
        </div>

        {metrics && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total Entities on the Board</div>
              <div className="metric-value">{metrics.totalEntities.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Average Trust Score</div>
              <div className="metric-value">{metrics.averageTrustScore.toFixed(1)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Exposed (Suspicious)</div>
              <div className="metric-value">{metrics.suspiciousEntities}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">High Risk — In the Spotlight</div>
              <div className="metric-value">
                {Object.values(metrics.sectorMetrics).reduce((sum, m) => sum + m.highRiskCount, 0)}
              </div>
            </div>
          </div>
        )}

        <div className="sectors-section">
          <h2 className="section-title">Sector Health Overview</h2>
          <div className="sectors-grid">
            {Object.entries(SECTOR_TYPES).map(([key, sectorId]) => {
              const sectorMetrics = metrics?.sectorMetrics[sectorId]
              const sectorName = sectorId.charAt(0).toUpperCase() + sectorId.slice(1)
              
              return (
                <Link key={sectorId} to={`/sector/${sectorId}`} className="sector-card">
                  <h3 className="sector-name">{sectorName}</h3>
                  {sectorMetrics && (
                    <>
                      <div className="sector-metric">
                        <span className="sector-metric-label">Avg Trust:</span>
                        <span className="sector-metric-value">{sectorMetrics.averageTrustScore.toFixed(1)}</span>
                      </div>
                      <div className="sector-metric">
                        <span className="sector-metric-label">Risk Level:</span>
                        <span className={`risk-badge risk-${sectorMetrics.trustTrendIndicator}`}>
                          {sectorMetrics.trustTrendIndicator}
                        </span>
                      </div>
                      <div className="sector-metric">
                        <span className="sector-metric-label">Entities:</span>
                        <span className="sector-metric-value">{sectorMetrics.totalEntities}</span>
                      </div>
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="navigation-section">
          <Link to="/leaderboard" className="nav-button">
            Exposure Leaderboard — Who&apos;s on Top?
          </Link>
          <Link to="/network" className="nav-button">
            Explore the Gray Zone (Network)
          </Link>
        </div>
      </main>

      {showReportModal && (
        <CorruptionReportModal
          entity={null}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            setShowReportModal(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default HomePage

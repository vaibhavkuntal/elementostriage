import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NetworkGraph from '../components/NetworkGraph'
import TrustScorePanel from '../components/TrustScorePanel'
import EntityDetails from '../components/EntityDetails'
import ControlPanel from '../components/ControlPanel'
import CorruptionReportModal from '../components/CorruptionReportModal'
import { fetchEntities, fetchRelationships } from '../utils/api'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import './NetworkViewPage.css'

function NetworkViewPage() {
  const [entities, setEntities] = useState([])
  const [relationships, setRelationships] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [minTrustScore, setMinTrustScore] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)
  const [loading, setLoading] = useState(true)

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
      const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
      const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
      const entitiesWithDetection = runDetectionEngine(
        entitiesWithScores,
        generatedTransactions,
        generatedRelationships
      )
      setEntities(entitiesWithDetection)
      setRelationships(generatedRelationships)
      setTransactions(generatedTransactions)
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
      setRelationships(generatedRelationships)
      setTransactions(generatedTransactions)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntities = entities.filter(entity => {
    const typeMatch = filterType === 'all' || entity.type === filterType
    const scoreMatch = (entity.updated_trust_score ?? entity.trustScore ?? 0) >= minTrustScore
    return typeMatch && scoreMatch
  })

  const filteredRelationships = relationships.filter(rel => {
    const sourceExists = filteredEntities.some(e => e.id === rel.source)
    const targetExists = filteredEntities.some(e => e.id === rel.target)
    return sourceExists && targetExists
  })

  return (
    <div className="network-view-page">
      <header className="app-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">Network Graph</span>
              <span className="title-subtitle">ShadowLedger</span>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading network data...</p>
        </div>
      ) : (
        <div className="app-content">
          <div className="left-panel">
            <ControlPanel
              filterType={filterType}
              setFilterType={setFilterType}
              minTrustScore={minTrustScore}
              setMinTrustScore={setMinTrustScore}
              entities={entities}
            />
            <TrustScorePanel entities={filteredEntities} />
          </div>

          <div className="main-content">
            <NetworkGraph
              entities={filteredEntities}
              relationships={filteredRelationships}
              onEntitySelect={setSelectedEntity}
              selectedEntity={selectedEntity}
            />
          </div>

          <div className="right-panel">
            {selectedEntity ? (
              <EntityDetails
                entity={selectedEntity}
                entities={entities}
                relationships={relationships}
                onReportCorruption={() => setShowReportModal(true)}
              />
            ) : (
              <div className="placeholder-panel">
                <h3>Select an entity</h3>
                <p>Click on any node in the network to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <CorruptionReportModal
          entity={selectedEntity}
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

export default NetworkViewPage

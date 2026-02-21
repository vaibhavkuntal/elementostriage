import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import LeaderboardTable from '../components/LeaderboardTable'
import './LeaderboardPage.css'

function LeaderboardPage() {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    setLoading(true)
    const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
    const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
    const entitiesWithDetection = runDetectionEngine(
      entitiesWithScores,
      generatedTransactions,
      generatedRelationships
    )
    setEntities(entitiesWithDetection)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      <header className="app-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">Exposure Leaderboard</span>
              <span className="title-subtitle">The sport of corruption exposure</span>
            </div>
          </div>
        </div>
      </header>

      <main className="leaderboard-content">
        <div className="leaderboard-intro">
          <h1>Who&apos;s Exposed? Who&apos;s Clean?</h1>
          <p>
            Rankings by trust score, suspicion level, and risk. Sort and filter — see who leads the board.
            This is exposure as a public sport.
          </p>
        </div>

        <LeaderboardTable entities={entities} />
      </main>
    </div>
  )
}

export default LeaderboardPage

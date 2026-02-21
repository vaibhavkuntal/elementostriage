import { useMemo } from 'react'
import { TYPE_LABELS } from '../utils/dataGenerator'
import './TrustScorePanel.css'

function TrustScorePanel({ entities }) {
  const stats = useMemo(() => {
    if (entities.length === 0) {
      return {
        average: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {}
      }
    }

    const scores = entities.map(e => e.trustScore)
    const average = scores.reduce((a, b) => a + b, 0) / scores.length

    const high = entities.filter(e => e.trustScore >= 70).length
    const medium = entities.filter(e => e.trustScore >= 40 && e.trustScore < 70).length
    const low = entities.filter(e => e.trustScore < 40).length

    const byType = {}
    entities.forEach(entity => {
      if (!byType[entity.type]) {
        byType[entity.type] = { count: 0, totalScore: 0 }
      }
      byType[entity.type].count++
      byType[entity.type].totalScore += entity.trustScore
    })

    Object.keys(byType).forEach(type => {
      byType[type].average = byType[type].totalScore / byType[type].count
    })

    return { average, high, medium, low, byType, total: entities.length }
  }, [entities])

  const getScoreColor = (score) => {
    if (score >= 70) return '#ff00ff'
    if (score >= 40) return '#ff1493'
    return '#ff0066'
  }

  const getScoreLabel = (score) => {
    if (score >= 70) return 'High Trust'
    if (score >= 40) return 'Medium Trust'
    return 'Low Trust'
  }

  return (
    <div className="trust-score-panel">
      <h2 className="panel-title">Trust Score Overview</h2>
      
      <div className="score-summary">
        <div className="summary-item">
          <div className="summary-label">Average Score</div>
          <div className="summary-value" style={{ color: getScoreColor(stats.average) }}>
            {stats.average.toFixed(1)}
          </div>
        </div>
        
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#ff00ff' }}>{stats.high}</div>
            <div className="stat-label">High Trust</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#ff1493' }}>{stats.medium}</div>
            <div className="stat-label">Medium</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#ff0066' }}>{stats.low}</div>
            <div className="stat-label">Low Trust</div>
          </div>
        </div>
      </div>

      <div className="trust-economy-info">
        <h3 className="info-title">Reputation Economy</h3>
        <p className="info-text">
          Trust Score = Transparency + Audit History + Network Distance from Corrupt Nodes - Suspicious Activity
        </p>
        <div className="economy-rules">
          <div className="rule-item">
            <span className="rule-indicator high">✓</span>
            <span>High Trust (≥70) → Fast Approvals</span>
          </div>
          <div className="rule-item">
            <span className="rule-indicator medium">⚠</span>
            <span>Medium Trust (40-69) → Standard Review</span>
          </div>
          <div className="rule-item">
            <span className="rule-indicator low">✗</span>
            <span>Low Trust (&lt;40) → Restricted Access</span>
          </div>
        </div>
      </div>

      <div className="type-breakdown">
        <h3 className="breakdown-title">Average by Type</h3>
        {Object.entries(stats.byType).map(([type, data]) => (
          <div key={type} className="type-item">
            <div className="type-name">{TYPE_LABELS[type] || type}</div>
            <div className="type-score-container">
              <div className="type-score-bar">
                <div 
                  className="type-score-fill" 
                  style={{ 
                    width: `${data.average}%`,
                    backgroundColor: getScoreColor(data.average)
                  }}
                ></div>
              </div>
              <div className="type-score-value" style={{ color: getScoreColor(data.average) }}>
                {data.average.toFixed(1)}
              </div>
            </div>
            <div className="type-count">{data.count} entities</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrustScorePanel

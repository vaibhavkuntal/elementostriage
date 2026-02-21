import { useMemo } from 'react'
import { TYPE_LABELS } from '../utils/dataGenerator'
import './CorruptionScoreboard.css'

function CorruptionScoreboard({ entities }) {
  const stats = useMemo(() => {
    const total = entities.length
    const lowTrust = entities.filter(e => (e.trustScore || 0) < 40).length
    const restricted = entities.filter(e => (e.trustScore || 0) < 5).length
    const manipulation = entities.filter(e => e.manipulationDetected).length
    const byType = {}
    entities.forEach(e => {
      byType[e.type] = (byType[e.type] || 0) + 1
    })
    const avgTrust = total ? entities.reduce((s, e) => s + (e.trustScore || 0), 0) / total : 0
    const highRisk = entities.filter(e => (e.suspiciousActivity || 0) > 0.7).length
    return {
      total,
      lowTrust,
      restricted,
      manipulation,
      byType,
      avgTrust,
      highRisk
    }
  }, [entities])

  return (
    <div className="corruption-scoreboard">
      <h2 className="scoreboard-title">Public Corruption Exposure Scoreboard</h2>
      <div className="scoreboard-grid">
        <div className="scoreboard-card">
          <span className="scoreboard-value">{stats.total}</span>
          <span className="scoreboard-label">Total Entities</span>
        </div>
        <div className="scoreboard-card danger">
          <span className="scoreboard-value">{stats.lowTrust}</span>
          <span className="scoreboard-label">Low Trust (&lt;40)</span>
        </div>
        <div className="scoreboard-card critical">
          <span className="scoreboard-value">{stats.restricted}</span>
          <span className="scoreboard-label">Vendor Access Restricted (&lt;5)</span>
        </div>
        <div className="scoreboard-card warning">
          <span className="scoreboard-value">{stats.manipulation}</span>
          <span className="scoreboard-label">Manipulation Detected</span>
        </div>
        <div className="scoreboard-card">
          <span className="scoreboard-value">{stats.avgTrust.toFixed(1)}</span>
          <span className="scoreboard-label">Avg Trust Score</span>
        </div>
        <div className="scoreboard-card danger">
          <span className="scoreboard-value">{stats.highRisk}</span>
          <span className="scoreboard-label">High-Risk Clusters</span>
        </div>
      </div>
      <div className="scoreboard-by-type">
        <h3 className="scoreboard-subtitle">By Entity Type</h3>
        <div className="scoreboard-type-list">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="scoreboard-type-item">
              <span className="type-name">{TYPE_LABELS[type] || type}</span>
              <span className="type-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CorruptionScoreboard

import { useMemo } from 'react'
import { TYPE_LABELS } from '../utils/dataGenerator'
import './EntityDetails.css'

function EntityDetails({ entity, entities, relationships, onReportCorruption }) {
  const connections = useMemo(() => {
    if (!entity) return { incoming: [], outgoing: [] }

    const incoming = relationships
      .filter(r => r.target === entity.id)
      .map(r => ({
        ...r,
        connectedEntity: entities.find(e => e.id === r.source)
      }))
      .filter(r => r.connectedEntity)

    const outgoing = relationships
      .filter(r => r.source === entity.id)
      .map(r => ({
        ...r,
        connectedEntity: entities.find(e => e.id === r.target)
      }))
      .filter(r => r.connectedEntity)

    return { incoming, outgoing }
  }, [entity, entities, relationships])

  if (!entity) return null

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

  const score = entity.trustScore ?? 0
  const getAccessLevel = (s) => {
    if (entity.accessLevel) return entity.accessLevel
    if (s >= 70) return 'Fast Approvals'
    if (s >= 40) return 'Standard Review'
    if (s >= 5) return 'Restricted Access'
    return 'Vendor Access Restricted'
  }

  return (
    <div className="entity-details">
      <div className="entity-header">
        <div className="entity-icon" style={{ backgroundColor: entity.color }}>
          {entity.type?.charAt(0)?.toUpperCase() || 'E'}
        </div>
        <div className="entity-title-section">
          <h2 className="entity-name">{entity.label}</h2>
          <div className="entity-type">{TYPE_LABELS[entity.type] || entity.type}</div>
          {entity.district && (
            <div className="entity-district">District: {entity.district}</div>
          )}
        </div>
      </div>

      {entity.manipulationDetected && (
        <div className="entity-manipulation-warning">
          ⚠ AI: Manipulation detected — entity may be faking good scores.
        </div>
      )}

      {entity.flavorText && (
        <div className="entity-flavor">
          <h3 className="flavor-title">Narrative</h3>
          <p className="flavor-text">&ldquo;{entity.flavorText}&rdquo;</p>
        </div>
      )}

      <div className="trust-score-display">
        <div className="score-main">
          <div className="score-label">Trust Score</div>
          <div className="score-value" style={{ color: getScoreColor(score) }}>
            {(entity.trustScore ?? 0).toFixed(1)}
          </div>
          <div className="score-status" style={{ color: getScoreColor(score) }}>
            {getScoreLabel(score)}
          </div>
        </div>
        <div className="score-bar-container">
          <div 
            className="score-bar" 
            style={{ 
              width: `${Math.min(100, score)}%`,
              backgroundColor: getScoreColor(score)
            }}
          ></div>
        </div>
        <div className="access-level">
          <span className="access-label">Access Level:</span>
          <span className="access-value" style={{ color: getScoreColor(score) }}>
            {getAccessLevel(score)}
          </span>
        </div>
        {score < 5 && (
          <p className="access-narrative">If trust &lt; 5, vendor access restricted.</p>
        )}
      </div>

      <div className="score-breakdown">
        <h3 className="breakdown-title">Score Components</h3>
        <div className="component-item">
          <div className="component-label">Transparency</div>
          <div className="component-value">
            <div className="component-bar">
              <div 
                className="component-fill" 
                style={{ width: `${(entity.transparency ?? 0) * 100}%`, backgroundColor: '#ff00ff' }}
              ></div>
            </div>
            <span>{((entity.transparency ?? 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="component-item">
          <div className="component-label">Audit History</div>
          <div className="component-value">
            <div className="component-bar">
              <div 
                className="component-fill" 
                style={{ width: `${(entity.auditHistory ?? 0) * 100}%`, backgroundColor: '#ff1493' }}
              ></div>
            </div>
            <span>{((entity.auditHistory ?? 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="component-item">
          <div className="component-label">Network Distance</div>
          <div className="component-value">
            <div className="component-bar">
              <div 
                className="component-fill" 
                style={{ width: `${typeof entity.networkDistance === 'number' ? Math.max(0, 100 - entity.networkDistance * 20) : 100}%`, backgroundColor: '#ff00ff' }}
              ></div>
            </div>
            <span>{entity.networkDistance === '∞' || entity.networkDistance == null ? '∞' : entity.networkDistance} hops</span>
          </div>
        </div>
        <div className="component-item">
          <div className="component-label">Suspicious Activity</div>
          <div className="component-value">
            <div className="component-bar">
              <div 
                className="component-fill" 
                style={{ width: `${(entity.suspiciousActivity ?? 0) * 100}%`, backgroundColor: '#ff0066' }}
              ></div>
            </div>
            <span>{((entity.suspiciousActivity ?? 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="connections-section">
        <h3 className="connections-title">Network Connections</h3>
        
        {connections.incoming.length > 0 && (
          <div className="connection-group">
            <div className="group-label">Incoming ({connections.incoming.length})</div>
            {connections.incoming.map((conn, idx) => (
              <div key={idx} className="connection-item">
                <div className="connection-entity">
                  <div className="connection-dot" style={{ backgroundColor: conn.connectedEntity.color }}></div>
                  <span className="connection-name">{conn.connectedEntity.label}</span>
                </div>
                <div className="connection-type">{conn.type}</div>
              </div>
            ))}
          </div>
        )}

        {connections.outgoing.length > 0 && (
          <div className="connection-group">
            <div className="group-label">Outgoing ({connections.outgoing.length})</div>
            {connections.outgoing.map((conn, idx) => (
              <div key={idx} className="connection-item">
                <div className="connection-entity">
                  <div className="connection-dot" style={{ backgroundColor: conn.connectedEntity.color }}></div>
                  <span className="connection-name">{conn.connectedEntity.label}</span>
                </div>
                <div className="connection-type">{conn.type}</div>
              </div>
            ))}
          </div>
        )}

        {connections.incoming.length === 0 && connections.outgoing.length === 0 && (
          <div className="no-connections">No connections found</div>
        )}
      </div>

      {onReportCorruption && (
        <div className="report-section">
          <button className="report-btn" onClick={onReportCorruption}>
            Report Corruption Related to This Entity
          </button>
        </div>
      )}
    </div>
  )
}

export default EntityDetails

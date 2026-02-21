import { TYPE_LABELS, ENTITY_TYPES } from '../utils/dataGenerator'
import './ControlPanel.css'

function ControlPanel({ filterType, setFilterType, minTrustScore, setMinTrustScore, entities }) {
  const typeCounts = {}
  entities.forEach(entity => {
    typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1
  })

  return (
    <div className="control-panel">
      <h2 className="panel-title">Filters & Controls</h2>
      
      <div className="filter-section">
        <label className="filter-label">Entity Type</label>
        <select 
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types ({entities.length})</option>
          {Object.entries(ENTITY_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {TYPE_LABELS[value]} ({typeCounts[value] || 0})
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">
          Minimum Trust Score: {minTrustScore}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={minTrustScore}
          onChange={(e) => setMinTrustScore(Number(e.target.value))}
          className="filter-slider"
        />
        <div className="slider-labels">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-title">About ShadowLedger</h3>
        <p className="info-text">
          ShadowLedger visualizes hidden relationships between entities in financial networks.
          It detects suspicious networks rather than single transactions.
        </p>
        <div className="info-highlight">
          <strong>Key Features:</strong>
          <ul>
            <li>Network relationship mapping</li>
            <li>Trust score calculation</li>
            <li>Suspicious activity detection</li>
            <li>Reputation-based access control</li>
          </ul>
        </div>
      </div>

      <div className="stats-section">
        <h3 className="stats-title">Current View</h3>
        <div className="stat-row">
          <span className="stat-label">Visible Entities:</span>
          <span className="stat-value">{entities.length}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Filtered by Type:</span>
          <span className="stat-value">
            {filterType === 'all' ? 'None' : TYPE_LABELS[filterType]}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Min Score:</span>
          <span className="stat-value">{minTrustScore}+</span>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel

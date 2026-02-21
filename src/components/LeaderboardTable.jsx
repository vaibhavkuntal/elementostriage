import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getRiskLevel } from '../utils/sectors'
import './LeaderboardTable.css'

const SORT_OPTIONS = {
  HIGHEST_TRUST: 'highest_trust',
  LOWEST_TRUST: 'lowest_trust',
  MOST_SUSPICIOUS: 'most_suspicious',
  MOST_CONNECTED: 'most_connected'
}

function LeaderboardTable({ entities }) {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.MOST_SUSPICIOUS)
  const [filterRisk, setFilterRisk] = useState('all')
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...entities]

    // Filter by risk level
    if (filterRisk !== 'all') {
      filtered = filtered.filter(entity => {
        const trust = entity.updated_trust_score ?? entity.trustScore ?? 50
        const suspicion = entity.suspicion_score ?? 0
        const risk = getRiskLevel(trust, suspicion)
        return risk.level.toLowerCase() === filterRisk.toLowerCase()
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.HIGHEST_TRUST:
          return (b.updated_trust_score ?? b.trustScore ?? 50) - (a.updated_trust_score ?? a.trustScore ?? 50)
        case SORT_OPTIONS.LOWEST_TRUST:
          return (a.updated_trust_score ?? a.trustScore ?? 50) - (b.updated_trust_score ?? b.trustScore ?? 50)
        case SORT_OPTIONS.MOST_SUSPICIOUS:
          return (b.suspicion_score ?? 0) - (a.suspicion_score ?? 0)
        case SORT_OPTIONS.MOST_CONNECTED:
          // This would require relationship data, simplified for now
          return 0
        default:
          return 0
      }
    })

    return filtered
  }, [entities, sortBy, filterRisk])

  const paginatedEntities = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return sortedAndFiltered.slice(start, start + itemsPerPage)
  }, [sortedAndFiltered, page])

  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage)

  return (
    <div className="leaderboard-table-container">
      <div className="leaderboard-controls">
        <div className="control-group">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={(e) => {
            setSortBy(e.target.value)
            setPage(1)
          }}>
            <option value={SORT_OPTIONS.HIGHEST_TRUST}>Highest Trust</option>
            <option value={SORT_OPTIONS.LOWEST_TRUST}>Lowest Trust</option>
            <option value={SORT_OPTIONS.MOST_SUSPICIOUS}>Most Suspicious</option>
            <option value={SORT_OPTIONS.MOST_CONNECTED}>Most Connected</option>
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="filter">Filter by risk:</label>
          <select id="filter" value={filterRisk} onChange={(e) => {
            setFilterRisk(e.target.value)
            setPage(1)
          }}>
            <option value="all">All</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Entity Name</th>
              <th>Type</th>
              <th>Trust Score</th>
              <th>Suspicion Score</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntities.map((entity, index) => {
              const trust = entity.updated_trust_score ?? entity.trustScore ?? 50
              const suspicion = entity.suspicion_score ?? 0
              const risk = getRiskLevel(trust, suspicion)
              const rank = (page - 1) * itemsPerPage + index + 1

              return (
                <tr key={entity.id}>
                  <td className="rank-cell">{rank}</td>
                  <td className="name-cell">
                    <Link to={`/entity/${entity.id}`} className="entity-link">
                      {entity.name || entity.label || entity.id}
                    </Link>
                  </td>
                  <td className="type-cell">{entity.type}</td>
                  <td className="trust-cell">{trust.toFixed(1)}</td>
                  <td className="suspicion-cell">{(suspicion * 100).toFixed(1)}%</td>
                  <td className="risk-cell">
                    <span className="risk-badge" style={{ backgroundColor: risk.color + '20', color: risk.color }}>
                      {risk.level}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default LeaderboardTable

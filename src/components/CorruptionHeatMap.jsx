import { useMemo } from 'react'
import { DISTRICTS, TYPE_LABELS } from '../utils/dataGenerator'
import './CorruptionHeatMap.css'

function CorruptionHeatMap({ entities }) {
  const districtStats = useMemo(() => {
    const byDistrict = {}
    DISTRICTS.forEach(d => {
      byDistrict[d] = {
        count: 0,
        totalSuspicious: 0,
        totalTrust: 0,
        lowTrust: 0,
        byType: {}
      }
    })
    entities.forEach(e => {
      const district = e.district || DISTRICTS[0]
      if (!byDistrict[district]) byDistrict[district] = {
        count: 0, totalSuspicious: 0, totalTrust: 0, lowTrust: 0, byType: {}
      }
      byDistrict[district].count++
      byDistrict[district].totalSuspicious += e.suspiciousActivity || 0
      byDistrict[district].totalTrust += e.trustScore || 0
      if ((e.trustScore || 0) < 40) byDistrict[district].lowTrust++
      byDistrict[district].byType[e.type] = (byDistrict[district].byType[e.type] || 0) + 1
    })
    return Object.entries(byDistrict).map(([name, data]) => ({
      name,
      ...data,
      avgSuspicious: data.count ? (data.totalSuspicious / data.count) : 0,
      avgTrust: data.count ? (data.totalTrust / data.count) : 0,
      heat: data.count ? Math.min(1, (data.totalSuspicious / data.count) * 1.2) : 0
    })).sort((a, b) => b.heat - a.heat)
  }, [entities])

  const maxHeat = Math.max(...districtStats.map(d => d.heat), 0.01)

  return (
    <div className="corruption-heat-map">
      <h2 className="heat-map-title">Corruption Heat Map — San Viceroy</h2>
      <p className="heat-map-subtitle">Corruption clusters per district zone</p>
      <div className="heat-map-grid">
        {districtStats.map(d => (
          <div
            key={d.name}
            className="heat-map-cell"
            style={{
              '--heat': d.heat,
              '--heat-opacity': d.heat / maxHeat
            }}
          >
            <div className="heat-map-cell-name">{d.name}</div>
            <div className="heat-map-cell-stats">
              <span className="heat-stat">{d.count} entities</span>
              <span className="heat-stat">Avg trust: {d.avgTrust.toFixed(1)}</span>
              <span className="heat-stat heat-danger">{d.lowTrust} low trust</span>
            </div>
            <div className="heat-map-cell-bar">
              <div
                className="heat-map-cell-fill"
                style={{ width: `${d.heat * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CorruptionHeatMap

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { generateSampleData, calculateTrustScores } from '../utils/dataGenerator'
import { runDetectionEngine } from '../utils/detectionEngine'
import { calculateSectorMetrics } from '../utils/sectors'
import './CityMapPage.css'

const ZONES = [
  { id: 'downtown', name: 'Downtown', x: 200, y: 150, width: 180, height: 120 },
  { id: 'port', name: 'Port District', x: 50, y: 250, width: 150, height: 100 },
  { id: 'financial', name: 'Financial Quarter', x: 400, y: 100, width: 200, height: 140 },
  { id: 'oldtown', name: 'Old Town', x: 150, y: 300, width: 160, height: 110 },
  { id: 'marina', name: 'Marina Heights', x: 350, y: 280, width: 180, height: 100 }
]

function CityMapPage() {
  const [entities, setEntities] = useState([])
  const [zoneData, setZoneData] = useState({})
  const [selectedZone, setSelectedZone] = useState(null)
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

    // Calculate zone metrics based on districts
    const zoneMetrics = {}
    ZONES.forEach(zone => {
      // Map zone names to district names
      const districtMap = {
        'downtown': 'Downtown Financial',
        'port': 'Portside Industrial',
        'financial': 'Downtown Financial',
        'oldtown': 'Old Quarter',
        'marina': 'Marina Bay'
      }
      
      const districtName = districtMap[zone.id] || zone.name
      const zoneEntities = entitiesWithDetection.filter(e => 
        e.district && e.district.toLowerCase().includes(districtName.toLowerCase().split(' ')[0])
      )
      
      if (zoneEntities.length > 0) {
        const avgTrust = zoneEntities.reduce((sum, e) => 
          sum + (e.updated_trust_score ?? e.trustScore ?? 50), 0) / zoneEntities.length
        const suspiciousCount = zoneEntities.filter(e => 
          (e.suspicion_score ?? 0) > 0.5
        ).length
        
        // Corruption index: inverse of trust score, normalized
        const corruptionIndex = Math.max(0, Math.min(100, 100 - avgTrust))
        
        zoneMetrics[zone.id] = {
          name: zone.name,
          entityCount: zoneEntities.length,
          avgTrust: avgTrust,
          corruptionIndex: corruptionIndex,
          suspiciousCount: suspiciousCount,
          riskLevel: corruptionIndex > 70 ? 'high' : corruptionIndex > 40 ? 'medium' : 'low'
        }
      } else {
        // Default values if no entities found
        zoneMetrics[zone.id] = {
          name: zone.name,
          entityCount: 0,
          avgTrust: 50,
          corruptionIndex: 50,
          suspiciousCount: 0,
          riskLevel: 'medium'
        }
      }
    })
    
    setZoneData(zoneMetrics)
    setLoading(false)
  }

  const getZoneColor = (corruptionIndex) => {
    if (corruptionIndex >= 70) return '#e53e3e' // Red
    if (corruptionIndex >= 40) return '#dd6b20' // Orange
    return '#38a169' // Green
  }

  const getZoneOpacity = (corruptionIndex) => {
    return Math.max(0.3, corruptionIndex / 100)
  }

  if (loading) {
    return (
      <div className="city-map-page">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading city data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="city-map-page">
      <header className="page-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">San Viceroy City Map</span>
              <span className="title-subtitle">Corruption Heat Zones</span>
            </div>
          </div>
        </div>
      </header>

      <main className="city-map-content">
        <div className="map-container">
          <div className="map-header">
            <h2>Economic Intelligence Grid</h2>
            <p>Click on zones to view detailed sector analysis</p>
          </div>

          <div className="map-wrapper">
            <svg viewBox="0 0 650 450" className="city-map-svg">
              {/* Background */}
              <rect width="650" height="450" fill="var(--bg-secondary)" />
              
              {/* Zones */}
              {ZONES.map(zone => {
                const data = zoneData[zone.id]
                const color = data ? getZoneColor(data.corruptionIndex) : '#718096'
                const opacity = data ? getZoneOpacity(data.corruptionIndex) : 0.3
                
                return (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill={color}
                      opacity={opacity}
                      stroke={selectedZone === zone.id ? '#00d4ff' : 'rgba(255, 255, 255, 0.2)'}
                      strokeWidth={selectedZone === zone.id ? 3 : 1}
                      className="zone-rect"
                      onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + zone.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="var(--text-primary)"
                      fontSize="14"
                      fontWeight="700"
                      className="zone-label"
                    >
                      {zone.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="map-legend">
            <div className="legend-title">Corruption Index</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#38a169' }}></div>
                <span>Low (0-40)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#dd6b20' }}></div>
                <span>Medium (40-70)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#e53e3e' }}></div>
                <span>High (70-100)</span>
              </div>
            </div>
          </div>
        </div>

        {selectedZone && zoneData[selectedZone] && (
          <div className="zone-details">
            <h3>{zoneData[selectedZone].name} Zone</h3>
            <div className="zone-metrics">
              <div className="zone-metric">
                <span className="metric-label">Corruption Index</span>
                <span className="metric-value" style={{ color: getZoneColor(zoneData[selectedZone].corruptionIndex) }}>
                  {zoneData[selectedZone].corruptionIndex.toFixed(1)}
                </span>
              </div>
              <div className="zone-metric">
                <span className="metric-label">Average Trust</span>
                <span className="metric-value">{zoneData[selectedZone].avgTrust.toFixed(1)}</span>
              </div>
              <div className="zone-metric">
                <span className="metric-label">Entities</span>
                <span className="metric-value">{zoneData[selectedZone].entityCount}</span>
              </div>
              <div className="zone-metric">
                <span className="metric-label">Suspicious Entities</span>
                <span className="metric-value">{zoneData[selectedZone].suspiciousCount}</span>
              </div>
            </div>
            <Link
              to={`/sector/corporate`}
              className="zone-link"
            >
              View Sector Dashboard →
            </Link>
          </div>
        )}

        {!selectedZone && (
          <div className="zone-instructions">
            <p>Select a zone on the map to view detailed metrics and analysis.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default CityMapPage

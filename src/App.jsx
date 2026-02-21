import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { generateSampleData, calculateTrustScores } from './utils/dataGenerator'
import { runDetectionEngine } from './utils/detectionEngine'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SectorPage from './pages/SectorPage'
import LeaderboardPage from './pages/LeaderboardPage'
import EntityDetailPage from './pages/EntityDetailPage'
import NetworkViewPage from './pages/NetworkViewPage'
import CityMapPage from './pages/CityMapPage'
import TrustExplanationPage from './pages/TrustExplanationPage'
import './App.css'

function App() {
  const [entities, setEntities] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    // Load entities once for global search
    const { entities: generatedEntities, relationships: generatedRelationships, transactions: generatedTransactions } = generateSampleData()
    const entitiesWithScores = calculateTrustScores(generatedEntities, generatedRelationships)
    const entitiesWithDetection = runDetectionEngine(
      entitiesWithScores,
      generatedTransactions,
      generatedRelationships
    )
    setEntities(entitiesWithDetection)
    setIsDataLoaded(true)
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        {isDataLoaded && <Navbar entities={entities} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sector/:sectorId" element={<SectorPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/entity/:entityId" element={<EntityDetailPage />} />
          <Route path="/network" element={<NetworkViewPage />} />
          <Route path="/city-map" element={<CityMapPage />} />
          <Route path="/how-trust-works" element={<TrustExplanationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

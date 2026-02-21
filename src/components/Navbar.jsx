import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import SearchBar from './SearchBar'
import { SECTOR_TYPES } from '../utils/sectors'
import './Navbar.css'

function Navbar({ entities }) {
  const [showSectorMenu, setShowSectorMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const sectors = [
    { id: SECTOR_TYPES.GOVERNMENT, name: 'Government' },
    { id: SECTOR_TYPES.CORPORATE, name: 'Corporate' },
    { id: SECTOR_TYPES.FINANCIAL, name: 'Financial' },
    { id: SECTOR_TYPES.MEDIA, name: 'Media' }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <div className="logo-text">
            <span className="logo-main">San Viceroy</span>
            <span className="logo-subtitle">Intelligence Grid</span>
          </div>
        </Link>

        <div className="navbar-center">
          <SearchBar entities={entities || []} />
        </div>

        <div className="navbar-right">
          <div className="navbar-menu">
            <div
              className="navbar-item dropdown"
              onMouseEnter={() => setShowSectorMenu(true)}
              onMouseLeave={() => setShowSectorMenu(false)}
            >
              <span className="navbar-link">Sectors</span>
              {showSectorMenu && (
                <div className="dropdown-menu">
                  {sectors.map(sector => (
                    <Link
                      key={sector.id}
                      to={`/sector/${sector.id}`}
                      className="dropdown-item"
                    >
                      {sector.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/city-map" className="navbar-link">
              City Map
            </Link>

            <Link to="/leaderboard" className="navbar-link">
              Exposure Board
            </Link>

            <Link to="/how-trust-works" className="navbar-link">
              How Trust Works
            </Link>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

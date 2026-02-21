import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchEntities, debounce, getHighlightParts } from '../utils/search'
import './SearchBar.css'

function HighlightedText({ text, query }) {
  const parts = getHighlightParts(text, query)
  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark key={index} className="search-highlight">{part.text}</mark>
        ) : (
          part.text
        )
      )}
    </>
  )
}

function SearchBar({ entities }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // Debounced search function
  const debouncedSearch = debounce((searchQuery) => {
    if (searchQuery.trim().length === 0) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const searchResults = useSearchEntities(entities, searchQuery)
    setResults(searchResults.slice(0, 5)) // Top 5 results
    setIsLoading(false)
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleResultClick = (entity) => {
    navigate(`/entity/${entity.id}`)
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0])
    }
  }

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search entities, IDs, directors..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="search-dropdown">
          {isLoading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="search-results-header">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((entity) => (
                <div
                  key={entity.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(entity)}
                >
                  <div className="result-name">
                    <HighlightedText text={entity.name || entity.label || entity.id} query={query} />
                  </div>
                  <div className="result-meta">
                    <span className="result-type">{entity.type}</span>
                    {entity.sector && (
                      <span className="result-sector">{entity.sector}</span>
                    )}
                    {(entity.updated_trust_score !== undefined || entity.trustScore !== undefined) && (
                      <span className="result-score">
                        Trust: {(entity.updated_trust_score ?? entity.trustScore ?? 0).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="search-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar

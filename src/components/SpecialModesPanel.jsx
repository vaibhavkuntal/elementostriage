import { useState } from 'react'
import './SpecialModesPanel.css'

function SpecialModesPanel({ taxAmnestyMode, setTaxAmnestyMode, showHiddenPaths, setShowHiddenPaths, adversarialMode, setAdversarialMode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="special-modes-panel">
      <button
        className="special-modes-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▼' : '▶'} Special Modes & AI
      </button>
      {expanded && (
        <div className="special-modes-content">
          <div className="mode-section">
            <h3 className="mode-title">Tax Amnesty Mode</h3>
            <p className="mode-desc">Temporarily relax penalties for entities declaring previously hidden assets. Shows legal companies that may be using illegal tactics.</p>
            <label className="mode-switch">
              <input
                type="checkbox"
                checked={taxAmnestyMode}
                onChange={(e) => setTaxAmnestyMode(e.target.checked)}
              />
              <span className="mode-slider" />
              <span className="mode-label">{taxAmnestyMode ? 'ON' : 'OFF'}</span>
            </label>
          </div>

          <div className="mode-section">
            <h3 className="mode-title">Reputation Laundering Services</h3>
            <p className="mode-desc">Entities that fake good scores or use services to appear legitimate. AI detection of score gaming and adversarial adaptation.</p>
            <p className="mode-flavor">Red dashed border = manipulation detected by AI.</p>
          </div>

          <div className="mode-section">
            <h3 className="mode-title">AI Hidden Money Paths</h3>
            <p className="mode-desc">AI simulates hidden money paths not directly visible in the graph—inferred flows between entities.</p>
            <label className="mode-switch">
              <input
                type="checkbox"
                checked={showHiddenPaths}
                onChange={(e) => setShowHiddenPaths(e.target.checked)}
              />
              <span className="mode-slider" />
              <span className="mode-label">{showHiddenPaths ? 'Show inferred paths' : 'Hide'}</span>
            </label>
          </div>

          <div className="mode-section">
            <h3 className="mode-title">AI Adversarial Mode</h3>
            <p className="mode-desc">Model entities that adapt to evade detection. Highlights adversarial adaptation and score gaming.</p>
            <label className="mode-switch">
              <input
                type="checkbox"
                checked={adversarialMode}
                onChange={(e) => setAdversarialMode(e.target.checked)}
              />
              <span className="mode-slider" />
              <span className="mode-label">{adversarialMode ? 'ON' : 'OFF'}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpecialModesPanel

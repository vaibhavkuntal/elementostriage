import { useState } from 'react'
import { Link } from 'react-router-dom'
import './TrustExplanationPage.css'

function TrustExplanationPage() {
  const [structuralWeight, setStructuralWeight] = useState(0.3)
  const [temporalWeight, setTemporalWeight] = useState(0.25)
  const [networkWeight, setNetworkWeight] = useState(0.25)
  const [complianceWeight, setComplianceWeight] = useState(0.2)
  const [baseScore, setBaseScore] = useState(50)
  const [penaltyFactor, setPenaltyFactor] = useState(0.8)

  // Example scores for demonstration
  const structuralScore = 0.6
  const temporalScore = 0.4
  const networkScore = 0.5
  const complianceScore = 0.3

  const suspicionScore = 
    structuralScore * structuralWeight +
    temporalScore * temporalWeight +
    networkScore * networkWeight +
    complianceScore * complianceWeight

  const finalTrustScore = Math.max(0, Math.min(100, 
    baseScore - (suspicionScore * baseScore * penaltyFactor)
  ))

  return (
    <div className="trust-explanation-page">
      <header className="page-header">
        <div className="header-content">
          <div>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="app-title">
              <span className="title-main">How Trust Scores Work</span>
              <span className="title-subtitle">Transparency & Methodology</span>
            </div>
          </div>
        </div>
      </header>

      <main className="trust-explanation-content">
        <section className="intro-section">
          <h1>Understanding ShadowLedger Trust Scores</h1>
          <p className="intro-text">
            ShadowLedger uses a transparent, deterministic algorithm to calculate trust scores
            for all entities in the San Viceroy Economic Intelligence Grid. Our system is
            designed to detect suspicious patterns without relying on machine learning black boxes.
          </p>
        </section>

        <section className="formula-section">
          <h2>The Trust Score Formula</h2>
          <div className="formula-box">
            <div className="formula-main">
              <span className="formula-label">Trust Score =</span>
              <span className="formula-base">Base Score</span>
              <span className="formula-minus">-</span>
              <span className="formula-penalty">
                (Suspicion Score × Base Score × Penalty Factor)
              </span>
            </div>
            <div className="formula-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Suspicion Score =</span>
                <div className="breakdown-components">
                  <span>(Structural × {structuralWeight})</span>
                  <span>+</span>
                  <span>(Temporal × {temporalWeight})</span>
                  <span>+</span>
                  <span>(Network × {networkWeight})</span>
                  <span>+</span>
                  <span>(Compliance × {complianceWeight})</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="interactive-section">
          <h2>Interactive Score Calculator</h2>
          <p className="section-description">
            Adjust the parameters below to see how they affect the final trust score.
          </p>

          <div className="calculator-container">
            <div className="score-inputs">
              <div className="input-group">
                <label>Base Score</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={baseScore}
                  onChange={(e) => setBaseScore(Number(e.target.value))}
                />
                <span className="input-value">{baseScore}</span>
              </div>

              <div className="input-group">
                <label>Penalty Factor</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={penaltyFactor}
                  onChange={(e) => setPenaltyFactor(Number(e.target.value))}
                />
                <span className="input-value">{penaltyFactor.toFixed(1)}</span>
              </div>
            </div>

            <div className="weight-inputs">
              <h3>Detection Module Weights</h3>
              <div className="input-group">
                <label>Structural Fragmentation: {structuralWeight}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={structuralWeight}
                  onChange={(e) => setStructuralWeight(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Temporal Burst: {temporalWeight}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temporalWeight}
                  onChange={(e) => setTemporalWeight(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Network Proximity: {networkWeight}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={networkWeight}
                  onChange={(e) => setNetworkWeight(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Compliance Irregularity: {complianceWeight}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={complianceWeight}
                  onChange={(e) => setComplianceWeight(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="result-display">
              <div className="result-item">
                <span className="result-label">Suspicion Score:</span>
                <span className="result-value suspicion">{suspicionScore.toFixed(2)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Final Trust Score:</span>
                <span className="result-value trust">{finalTrustScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="modules-section">
          <h2>Detection Modules Explained</h2>
          
          <div className="module-card">
            <h3>1. Structural Fragmentation Detection</h3>
            <p>
              Identifies micro-transaction splitting patterns. Flags entities that:
            </p>
            <ul>
              <li>Have high out-degree (many outgoing transactions)</li>
              <li>Show low average transaction values</li>
              <li>Exhibit very low variance in transaction amounts</li>
              <li>Display burst patterns within short time windows</li>
            </ul>
            <div className="module-example">
              <strong>Example:</strong> An entity making 50 transactions of exactly $999
              within 24 hours would score high on structural fragmentation.
            </div>
          </div>

          <div className="module-card">
            <h3>2. Temporal Burst Detection</h3>
            <p>
              Detects sudden spikes and unnatural acceleration in transaction frequency:
            </p>
            <ul>
              <li>Compares recent activity to historical averages</li>
              <li>Flags 3x+ increases in transaction frequency</li>
              <li>Identifies acceleration patterns over time</li>
            </ul>
            <div className="module-example">
              <strong>Example:</strong> An entity that normally processes 10 transactions
              per week suddenly processing 50 in a single day triggers temporal detection.
            </div>
          </div>

          <div className="module-card">
            <h3>3. Network Proximity Risk</h3>
            <p>
              Uses graph traversal (BFS) to measure distance from high-risk entities:
            </p>
            <ul>
              <li>Identifies entities within 2 hops of known high-risk entities</li>
              <li>Risk increases with proximity</li>
              <li>Considers network topology and connections</li>
            </ul>
            <div className="module-example">
              <strong>Example:</strong> A wallet directly connected to a known shell company
              receives a higher network proximity score.
            </div>
          </div>

          <div className="module-card">
            <h3>4. Compliance Irregularity Detection</h3>
            <p>
              Specifically targets companies showing suspicious startup patterns:
            </p>
            <ul>
              <li>New companies (&lt;90 days old) with large capital inflows</li>
              <li>Low partner entropy (few unique partners relative to transactions)</li>
              <li>Shared directors across multiple new companies</li>
            </ul>
            <div className="module-example">
              <strong>Example:</strong> A company registered 30 days ago receiving
              $500,000 from only 2 sources, with a director who controls 5 other new companies.
            </div>
          </div>
        </section>

        <section className="transparency-section">
          <h2>Our Commitment to Transparency</h2>
          <div className="transparency-grid">
            <div className="transparency-item">
              <h3>🔍 Deterministic Logic</h3>
              <p>
                All scoring is based on clear, auditable rules. No machine learning
                black boxes. Every score can be traced back to specific patterns.
              </p>
            </div>
            <div className="transparency-item">
              <h3>📊 Open Methodology</h3>
              <p>
                Our algorithms are documented and reproducible. We publish our
                detection thresholds and scoring weights.
              </p>
            </div>
            <div className="transparency-item">
              <h3>🔄 Continuous Review</h3>
              <p>
                All reports are manually reviewed. Our team investigates flagged
                entities and adjusts thresholds based on real-world validation.
              </p>
            </div>
            <div className="transparency-item">
              <h3>⚖️ Fair Process</h3>
              <p>
                Entities can appeal scores. We provide explanations for all
                suspicion flags. Trust scores decay gradually, not instantly.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Questions or Concerns?</h2>
          <p>
            If you have questions about how trust scores are calculated, or if you
            believe an entity's score is incorrect, please contact our review team.
          </p>
          <Link to="/" className="cta-button">
            Return to Dashboard
          </Link>
        </section>
      </main>
    </div>
  )
}

export default TrustExplanationPage

import { useState } from 'react'
import { createCorruptionReport } from '../utils/api'
import './CorruptionReportModal.css'

const REPORT_CATEGORIES = [
  { value: 'money_laundering', label: 'Money Laundering' },
  { value: 'fraud', label: 'Fraud & Embezzlement' },
  { value: 'bribery', label: 'Bribery & Corruption' },
  { value: 'tax_evasion', label: 'Tax Evasion' },
  { value: 'shell_company', label: 'Shell Company Activity' },
  { value: 'suspicious_transactions', label: 'Suspicious Transaction Patterns' },
  { value: 'conflict_of_interest', label: 'Conflict of Interest' },
  { value: 'regulatory_violation', label: 'Regulatory Violation' },
  { value: 'political_influence', label: 'Undue Political Influence' },
  { value: 'other', label: 'Other' }
]

function CorruptionReportModal({ entity, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    category: '',
    description: '',
    evidence: '',
    urgency: 'medium'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const result = await createCorruptionReport({
        entityId: entity?.id || null,
        ...formData
      })
      
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to submit your story. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2>Story received</h2>
          <p>Your story is in our queue. We review every submission — no reports, just stories.</p>
          <p className="review-note">If verified, you may be eligible for a reward. We never expose whistleblowers, anonymous or not.</p>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tell Your Story</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="whistleblower-reward-banner">
          <strong>Anonymous welcome.</strong> Verified stories can earn rewards. We never expose whistleblowers.
        </div>

        {entity && (
          <div className="entity-context">
            <p>This story involves: <strong>{entity.name || entity.label || entity.id}</strong></p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="category">Story type *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {REPORT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency Level</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Low - General concern</option>
              <option value="medium">Medium - Requires attention</option>
              <option value="high">High - Urgent investigation needed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reporterName">Your name (optional — leave blank to stay anonymous)</label>
            <input
              type="text"
              id="reporterName"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              placeholder="Anonymous whistleblowers are protected and still eligible for rewards"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reporterEmail">Contact for rewards (optional)</label>
            <input
              type="email"
              id="reporterEmail"
              name="reporterEmail"
              value={formData.reporterEmail}
              onChange={handleChange}
              placeholder="Only used to notify you if your story is verified and rewarded"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Your story *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell the story: what happened, who was involved, how the legal and shadow sides connect. The more narrative and detail, the better we can investigate — and the more likely a reward if verified."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="evidence">Evidence or paper trail (optional)</label>
            <textarea
              id="evidence"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              placeholder="Links, documents, transaction IDs, dates, amounts — anything that backs the story"
              rows="4"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CorruptionReportModal

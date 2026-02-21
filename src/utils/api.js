const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchEntities() {
  const response = await fetch(`${API_BASE_URL}/entities`)
  if (!response.ok) throw new Error('Failed to fetch entities')
  return response.json()
}

export async function fetchRelationships() {
  const response = await fetch(`${API_BASE_URL}/relationships`)
  if (!response.ok) throw new Error('Failed to fetch relationships')
  return response.json()
}

export async function createCorruptionReport(report) {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
  })
  if (!response.ok) throw new Error('Failed to submit report')
  return response.json()
}

export async function fetchCorruptionReports() {
  const response = await fetch(`${API_BASE_URL}/reports`)
  if (!response.ok) throw new Error('Failed to fetch reports')
  return response.json()
}

export async function analyzeWithAI(data) {
  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to analyze with AI')
  return response.json()
}

# ShadowLedger / San Viceroy — Complete PPT Reference Document

*Every concept, feature, and term explained for your presentation*

---

## 1. PROJECT OVERVIEW

### 1.1 What is ShadowLedger?
**ShadowLedger** is a reputation and trust intelligence platform that maps hidden financial relationships and detects corruption patterns. It visualizes connections between entities (companies, people, wallets) and calculates trust scores based on transparent, rule-based algorithms. No machine learning is used; all logic is deterministic and auditable.

### 1.2 What is San Viceroy?
**San Viceroy** is the fictional city/universe where the platform operates. The full branding is **"San Viceroy Financial Intelligence Bureau"** — the government agency that uses this system to monitor economic activity. Think of it as an economic intelligence grid for a metropolis.

### 1.3 Tagline
**"See the money that doesn't want to be seen."** — Emphasizes uncovering hidden financial flows and corruption.

### 1.4 Mission
Replace traditional audits with **adaptive trust intelligence** — continuously calculating how trustworthy entities are based on their behavior and network position.

---

## 2. ENTITY TYPES (Explained)

### 2.1 Shell Company
- A company often used to hide ownership, move money, or avoid taxes
- Typically: low transparency, minimal audit history, high suspicious activity
- Often registered in offshore jurisdictions with nominee directors
- In the app: 200 entities, red color (#ff6b6b)

### 2.2 Director
- Person who controls companies and wallets
- Can serve on multiple company boards (red flag if 20+)
- May be linked to politically exposed persons (PEPs)
- In the app: 150 entities, teal color (#4ecdc4)

### 2.3 Digital Wallet
- Cryptocurrency or digital payment wallet
- Can have high-frequency transactions, mixing services, darknet links
- In the app: 300 entities, blue color (#45b7d1)

### 2.4 Vendor
- Service provider (consulting, procurement, etc.)
- May overcharge, receive payments with no deliverables, or have kickback schemes
- In the app: 150 entities, yellow color (#f9ca24)

### 2.5 Politician
- Public figure with potential influence over companies
- Risk: campaign funds, undisclosed payments, family in connected entities
- In the app: 100 entities, red color (#eb4d4b)

### 2.6 Influencer
- Social media personality promoting wallets or projects
- Risk: pump-and-dump, undisclosed promotions, unregistered securities
- In the app: 100 entities, purple color (#a55eea)

---

## 3. SECTORS (Grouping)

Entities are grouped into **4 sectors**:

| Sector      | Contains                           | Purpose                           |
|------------|-------------------------------------|-----------------------------------|
| Government | Politicians                         | Public office, political influence|
| Corporate  | Shell Companies, Vendors, Directors | Business and ownership            |
| Financial  | Digital Wallets                     | Payment and crypto                |
| Media      | Influencers                         | Promotion and publicity           |

---

## 4. RELATIONSHIP TYPES (Network Edges)

| Relationship | Meaning                          | Example                    |
|-------------|-----------------------------------|----------------------------|
| controls    | Director controls a company       | Director A → Shell Co 1    |
| owns        | Entity owns a wallet              | Director → Wallet          |
| pays        | Wallet pays a vendor              | Wallet → Vendor            |
| contracts   | Company contracts with vendor     | Shell Co → Vendor          |
| influences  | Politician influences company     | Politician → Shell Co      |
| promotes    | Influencer promotes wallet        | Influencer → Wallet        |
| linked      | Suspicious cross-connection       | Any → Any                  |
| connected   | General connection                | Any → Any                  |

---

## 5. DETECTION ENGINE (Adversarial Laundering Detection)

### 5.1 Overview
The system uses **4 detection modules** — no ML, only deterministic rules. Each returns a score 0–1. These are combined into a **suspicion score**, which then reduces the **trust score**.

### 5.2 Module 1: Structural Fragmentation Detection
**What it catches:** Micro-transaction splitting (smurfing) — breaking large sums into many small transactions to avoid detection.

**Signals:**
- **Out-degree** > 50 (too many unique recipients)
- **Average transaction value** < $1,000 (suspiciously low)
- **Variance of amounts** < 100 (amounts too similar)
- **Burst:** ≥10 transactions within 24 hours

**Weight in final score:** 30%

### 5.3 Module 2: Temporal Burst Detection
**What it catches:** Sudden spikes or unnatural acceleration in activity.

**Signals:**
- **Spike:** Recent activity ≥ 3× historical average
- **Acceleration:** Second half of last 7 days has ≥ 2× the frequency of first half
- **New entity:** High daily activity rate (>10/day) with little history

**Weight in final score:** 25%

### 5.4 Module 3: Network Proximity Risk
**What it catches:** Being close to high-risk entities in the graph.

**Method:** BFS (Breadth-First Search) up to 2 hops. If an entity is within 2 steps of a high-risk node (trust <30 or suspicion >0.7), it gets a proximity risk score.

**Weight in final score:** 25%

### 5.5 Module 4: Fake Startup / Compliance Irregularity Detection
**What it catches:** Shell companies masquerading as legitimate new businesses.

**Signals (companies only, <90 days old):**
- **Large capital inflow** > $100,000
- **Low partner entropy** (unique partners / transactions < 0.3)
- **Shared director** across ≥3 new companies

**Weight in final score:** 20%

### 5.6 Composite Suspicion Formula
```
suspicion_score = 
  (structural × 0.30) + 
  (temporal × 0.25) + 
  (network × 0.25) + 
  (compliance × 0.20)
```
Range: 0–1.

### 5.7 Trust Score Reduction
```
updated_trust_score = base_score − (base_score × suspicion_score × 0.8)
```
- **Penalty factor:** 0.8
- Trust is reduced gradually, not “frozen”
- No account freezing — dynamic trust adjustment only

### 5.8 Narrative Explanation Engine
Generates human-readable explanations, e.g.:
- *"Phoenix Ventures shows rapid capital influx from 3 low-trust wallets within 24 hours. Transaction fragmentation pattern detected."*
- Uses rule-based templates, no AI APIs.

---

## 6. BASE TRUST SCORE (Original Model)

Before detection, entities get a **base trust score** from:
- **Transparency** (0–1)
- **Audit history** (0–1)
- **Network distance** from corrupt nodes
- **Suspicious activity** (0–1)
- **Manipulation score** (entities trying to fake good scores)

**Cascading risk:** Politicians linked to shell companies increase suspicion of connected wallets.

---

## 7. RISK LEVELS

| Level  | Trust Score  | Suspicion Score | Badge Color |
|--------|---------------|-----------------|-------------|
| Low    | ≥60           | ≤0.3            | Green       |
| Medium | 30–60         | 0.3–0.7         | Orange      |
| High   | <30           | >0.7            | Red         |

---

## 8. SAN VICEROY DISTRICTS

Entities are assigned to **12 districts** in the city:
- Downtown Financial
- Portside Industrial
- Uptown Elite
- Midtown Commerce
- Riverside Residential
- Airport District
- Tech Corridor
- Old Quarter
- Marina Bay
- Harbor View
- Sunset Heights
- Eastside

---

## 9. CITY MAP ZONES (Heat Map)

| Zone             | Maps to District        | Purpose                   |
|------------------|-------------------------|---------------------------|
| Downtown         | Downtown Financial      | Core business area        |
| Port District    | Portside Industrial     | Trade and logistics       |
| Financial Quarter| Downtown Financial       | Banking, finance          |
| Old Town         | Old Quarter             | Historic area             |
| Marina Heights   | Marina Bay              | Waterfront, luxury        |

**Corruption Index:** Inverse of trust (0–100). Red = high corruption, green = low.

---

## 10. CORRUPTION REPORTING

### 10.1 Report Categories
1. Money Laundering  
2. Fraud & Embezzlement  
3. Bribery & Corruption  
4. Tax Evasion  
5. Shell Company Activity  
6. Suspicious Transaction Patterns  
7. Conflict of Interest  
8. Regulatory Violation  
9. Undue Political Influence  
10. Other  

### 10.2 Urgency Levels
- **Low:** General concern  
- **Medium:** Requires attention  
- **High:** Urgent investigation needed  

### 10.3 Fields
- Category (required)
- Urgency
- Name (optional)
- Email (optional)
- Description (required)
- Evidence (optional)

### 10.4 Process
- All reports are **manually reviewed**
- No automatic account freezing
- Anonymous reporting allowed

---

## 11. PAGES & ROUTES

| Route              | Page              | Purpose                                       |
|--------------------|-------------------|-----------------------------------------------|
| /                  | HomePage          | Intro, metrics, sector overview, reporting CTA|
| /sector/:id        | SectorPage        | Filtered graph and leaderboard by sector       |
| /leaderboard       | LeaderboardPage   | Global rankings (trust, suspicion)             |
| /entity/:id        | EntityDetailPage  | Single entity details and explanations         |
| /network           | NetworkViewPage   | Full network graph with controls               |
| /city-map          | CityMapPage       | Zone heat map of corruption                    |
| /how-trust-works   | TrustExplanationPage | Trust formula and interactive calculator   |

---

## 12. NAVBAR ELEMENTS

- **Logo:** San Viceroy Intelligence Grid  
- **Search bar:** Global entity search (debounced, top 5 results)  
- **Sectors dropdown:** Government, Corporate, Financial, Media  
- **City Map:** Link to heat map  
- **Leaderboard:** Link to rankings  
- **How Trust Works:** Link to transparency page  
- **Theme toggle:** Dark (Neon Noir) / Light (Modern Civic)  

---

## 13. SEARCH

- **Search by:** Name, ID, director name, sector  
- **Case-insensitive, partial matches**  
- **Debounced** (300 ms)  
- **Top 5 results** in dropdown  
- **Highlight** matching text  
- Click result → navigate to entity page  

---

## 14. THEME SYSTEM

### Dark (Neon Noir)
- Cyan/magenta accents
- Dark backgrounds
- Urban luxury look

### Light (Modern Civic)
- Blue/purple accents
- Light backgrounds
- Clean, civic aesthetic

Theme is saved in `localStorage`.

---

## 15. TECHNOLOGIES

| Tech              | Purpose                          |
|-------------------|----------------------------------|
| React 18          | UI framework                     |
| React Router 6    | Client-side routing              |
| D3.js 7           | Force-directed network graph     |
| Vite 5            | Build and dev server             |
| CSS Variables     | Theming (dark/light)             |

---

## 16. KEY METRICS DISPLAYED

- **Total Entities** (≈1000)
- **Average Trust Score**
- **Suspicious Entities** (suspicion > 0.5)
- **High Risk Count**
- **Corruption Heat Index** (city-level)
- **Sector Health:** avg trust, suspicion, risk counts, trend (improving/stable/declining)

---

## 17. NETWORK GRAPH FEATURES

- **Force-directed layout** with D3  
- **Zoom and pan**  
- **Node colors** by trust (green → orange → red)  
- **Collision avoidance** to reduce overlap  
- **Cooldown** after 100 ticks for stability  
- **Drag** to move nodes  
- **Click** node for details  
- **Legend** for entity types  

---

## 18. LEADERBOARD

- **Sort:** Highest trust, Lowest trust, Most suspicious, Most connected  
- **Filter:** All, High risk, Medium risk, Low risk  
- **Pagination:** 20 items per page  
- **Columns:** Rank, Name, Type, Trust Score, Suspicion Score, Risk Badge  

---

## 19. DATA STRUCTURE

### Entity
```javascript
{
  id, name, label, type, sector,
  baseTrustScore, updatedTrustScore, trustScore,
  suspicionScore, transparency, auditHistory, suspiciousActivity,
  district, directorName, createdAt, color,
  explanation[], manipulationDetected
}
```

### Transaction
```javascript
{
  id, from, to, amount, timestamp
}
```

### Relationship
```javascript
{
  source, target, type  // type: controls|owns|pays|contracts|influences|promotes|linked|connected
}
```

---

## 20. PERFORMANCE

- **Memoization** for filtered datasets  
- **Debounced search** (300 ms)  
- **Pagination** on leaderboard (20/page)  
- **Lazy loading** of sector pages  
- **Optimized** for 1000+ entities  

---

## 21. GLOSSARY (Quick Reference)

| Term           | Meaning                                                    |
|----------------|------------------------------------------------------------|
| Trust Score    | 0–100; higher = more trusted                              |
| Suspicion Score| 0–1; higher = more suspicious                             |
| Out-degree     | Number of unique recipients for an entity                 |
| Entropy        | Diversity of partners (low = few unique partners)          |
| BFS            | Breadth-First Search for graph traversal                  |
| Structural     | Transaction fragmentation / smurfing pattern              |
| Temporal       | Time-based burst or spike                                 |
| Compliance     | Fake startup / shell company indicators                   |
| Cascading Risk | Risk spreading through the network (e.g. politician→shell→wallet) |

---

## 22. SUGGESTED PPT SLIDE STRUCTURE

1. **Title** — ShadowLedger / San Viceroy  
2. **Problem** — Hidden corruption, money laundering, shell companies  
3. **Solution** — Trust intelligence + graph analysis  
4. **Entity Types** — 6 types, 4 sectors  
5. **Detection Engine** — 4 modules (structural, temporal, network, compliance)  
6. **Trust Formula** — Base score − (suspicion × penalty)  
7. **Trust Explanation Page** — Transparency and credibility  
8. **City Map** — Heat zones and corruption index  
9. **Reporting** — Manual review, categories, urgency  
10. **Tech Stack** — React, D3, Vite  
11. **Demo / Screenshots** — Homepage, graph, leaderboard  
12. **Conclusion** — Deterministic, transparent, scalable  

---

*End of document — use this as reference for every slide and talking point.*

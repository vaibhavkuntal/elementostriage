# ShadowLedger - Reputation Economy

A visual AI system that maps hidden relationships between shell companies, directors, digital wallets, vendors, politicians, and influencers. Instead of detecting single bad transactions, it detects suspicious networks.

## Features

### ShadowLedger Network Visualization
- Interactive network graph showing relationships between entities
- Color-coded entity types (Shell Companies, Directors, Wallets, Vendors, Politicians, Influencers)
- Click on nodes to view detailed information
- Drag nodes to rearrange the network
- Filter by entity type and minimum trust score
- **GTA 6-inspired neon pink theme** with comfortable, eye-pleasing design

### Reputation Economy
Each entity earns a **Trust Score** calculated as:
```
Trust Score = Transparency + Audit History + Network Distance from Corrupt Nodes - Suspicious Activity
```

**Access Levels:**
- **High Trust (≥70)**: Fast Approvals
- **Medium Trust (40-69)**: Standard Review  
- **Low Trust (<40)**: Restricted Access

### AI-Powered Analysis
- AI analysis of corruption reports
- Pattern detection in network relationships
- Automated suspicious activity flagging

### Corruption Reporting
- Report corruption related to specific entities
- Anonymous reporting option
- AI-powered analysis of reports
- Evidence submission support

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:

**PowerShell:**
```powershell
cd server; npm install; cd ..
```

**Command Prompt/Bash:**
```bash
cd server && npm install && cd ..
```

3. Start both frontend and backend:
```bash
npm run dev:all
```

Or start them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

4. Open your browser to:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

### Build for Production

```bash
npm run build
cd server
npm start
```

## Project Structure

```
shadowledger-reputation/
├── src/
│   ├── components/
│   │   ├── NetworkGraph.jsx          # D3.js network visualization
│   │   ├── TrustScorePanel.jsx       # Trust score overview
│   │   ├── EntityDetails.jsx         # Detailed entity information
│   │   ├── ControlPanel.jsx          # Filters and controls
│   │   └── CorruptionReportModal.jsx # Corruption reporting form
│   ├── utils/
│   │   ├── dataGenerator.js          # Sample data generator
│   │   └── api.js                    # API client functions
│   ├── App.jsx                       # Main application component
│   ├── App.css                       # Main styles
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Entry point
├── server/
│   ├── index.js                      # Express server
│   ├── database.js                   # Database operations
│   └── package.json                  # Backend dependencies
├── package.json
├── vite.config.js
└── index.html
```

## Technologies Used

- **React** - UI framework
- **D3.js** - Network graph visualization
- **Vite** - Build tool and dev server
- **Express** - Backend server
- **SQLite (better-sqlite3)** - Database
- **AI Integration** - Pattern detection and analysis
- **CSS3** - GTA 6-inspired styling with neon pink accents

## API Endpoints

- `GET /api/entities` - Get all entities
- `GET /api/relationships` - Get all relationships
- `POST /api/reports` - Submit corruption report
- `GET /api/reports` - Get all corruption reports
- `POST /api/ai/analyze` - AI analysis endpoint

## Key Concepts

### Entity Types
- **Shell Companies**: Often low transparency, high suspicious activity
- **Directors**: Control shell companies and wallets
- **Digital Wallets**: Cryptocurrency wallets with varying transparency
- **Vendors**: Service providers with business relationships
- **Politicians**: Public figures with potential influence
- **Influencers**: Social media personalities promoting wallets/projects

### Network Relationships
- `controls`: Director controls a company
- `owns`: Entity owns a wallet
- `pays`: Wallet pays a vendor
- `contracts`: Company contracts with vendor
- `influences`: Politician influences company
- `promotes`: Influencer promotes wallet
- `linked`: Suspicious cross-connections
- `connected`: General connections

### Trust Score Calculation
The trust score algorithm:
1. Identifies corrupt nodes (suspicious activity ≥ 70%)
2. Calculates minimum network distance from corrupt nodes
3. Combines transparency, audit history, network distance, and suspicious activity
4. Normalizes to 0-100 scale

## Future Enhancements

- Real-time data integration
- Advanced filtering and search
- Export network graphs
- Historical trust score tracking
- Enhanced AI pattern detection
- Multi-layer network views
- Relationship strength indicators
- Integration with blockchain data sources

## License

MIT

# Quick Start Guide

## Installation & Running

1. **Navigate to the project directory:**
   ```bash
   cd shadowledger-reputation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will be available at `http://localhost:5173`

## Using the Application

### Network Visualization
- **Click** on any node to view detailed entity information
- **Drag** nodes to rearrange the network layout
- **Hover** over nodes to see them highlighted
- Use the **legend** in the top-right corner to understand entity types

### Filters
- **Entity Type Filter**: Select a specific entity type from the dropdown to filter the network
- **Trust Score Slider**: Adjust the minimum trust score to show only entities above that threshold

### Trust Score Panel
- View overall statistics including average trust score
- See breakdown by trust level (High/Medium/Low)
- Check average trust scores by entity type

### Entity Details
- When you select an entity, view:
  - Complete trust score breakdown
  - Score components (Transparency, Audit History, Network Distance, Suspicious Activity)
  - Access level based on trust score
  - All network connections (incoming and outgoing)

## Understanding Trust Scores

**Trust Score Formula:**
```
Trust Score = (Transparency × 30) + (Audit History × 30) + (Network Distance × 30) - (Suspicious Activity × 40)
```

**Access Levels:**
- **≥70**: High Trust → Fast Approvals (Green)
- **40-69**: Medium Trust → Standard Review (Yellow)
- **<40**: Low Trust → Restricted Access (Red)

## Tips

- Entities closer to corrupt nodes (high suspicious activity) have lower trust scores
- Shell companies typically have lower transparency and higher suspicious activity
- The network visualization helps identify suspicious clusters and relationships
- Use filters to focus on specific entity types or trust ranges

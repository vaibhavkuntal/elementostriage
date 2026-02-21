import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './NetworkGraph.css'

function NetworkGraph({ entities, relationships, onEntitySelect, selectedEntity }) {
  const svgRef = useRef()
  const containerRef = useRef()
  const simulationRef = useRef(null)
  const selectedIdRef = useRef(null)

  selectedIdRef.current = selectedEntity?.id ?? null

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || entities.length === 0) return

    const width = containerRef.current.clientWidth || 800
    const height = containerRef.current.clientHeight || 600

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g').attr('class', 'graph-wrapper')

    // Create node and link copies - CRITICAL: links must reference node objects, not just IDs
    const nodes = entities.map(e => ({ ...e }))
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    
    // Convert link IDs to node references
    const links = relationships
      .map(r => {
        const source = nodeMap.get(r.source)
        const target = nodeMap.get(r.target)
        if (source && target) {
          return { source, target, type: r.type }
        }
        return null
      })
      .filter(Boolean)

    // Improved force simulation with stabilization
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(80).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => {
        const baseRadius = 8
        const scoreMultiplier = ((d.updated_trust_score ?? d.trustScore ?? 50) / 100)
        return (baseRadius + scoreMultiplier * 4) + 5
      }))
      .alphaDecay(0.02) // Slower decay for smoother animation
      .velocityDecay(0.4) // More damping for stability

    simulationRef.current = simulation

    const defs = g.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ff00ff')

    defs.append('filter').attr('id', 'glow')
      .append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur')
    defs.select('#glow').append('feMerge')
      .selectAll('feMergeNode')
      .data(['coloredBlur', 'SourceGraphic'])
      .join('feMergeNode')
      .attr('in', d => d)

    const link = g.append('g').attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        const colors = {
          controls: '#ff00ff', owns: '#ff1493', pays: '#ff0066',
          contracts: '#ff00ff', influences: '#ff1493', promotes: '#ff0066',
          linked: '#ff00ff', connected: '#ff1493'
        }
        return colors[d.type] || '#ff00ff'
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)')

    const node = g.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'grab')

    node.append('circle')
      .attr('r', d => {
        const baseRadius = 8
        const scoreMultiplier = (d.trustScore || 0) / 100
        return baseRadius + scoreMultiplier * 4
      })
      .attr('fill', d => {
        // Color by trust score gradient (green to red)
        const trustScore = d.updated_trust_score ?? d.trustScore ?? 50
        if (trustScore >= 70) return 'rgba(56, 161, 105, 0.8)' // Green
        if (trustScore >= 40) return 'rgba(221, 107, 32, 0.8)' // Orange
        return 'rgba(229, 62, 62, 0.8)' // Red
        
        // Fallback to sector colors if needed
        // const sectorColors = {
        //   'government': 'rgba(235, 77, 75, 0.8)',
        //   'corporate': 'rgba(255, 107, 107, 0.8)',
        //   'financial': 'rgba(69, 183, 209, 0.8)',
        //   'media': 'rgba(165, 94, 234, 0.8)'
        // }
        // return sectorColors[d.sector] || 'rgba(255, 0, 255, 0.8)'
      })
      .attr('stroke', d => {
        if (d.manipulationDetected) return '#ff0000'
        return d.id === selectedIdRef.current ? '#ff1493' : '#ff00ff'
      })
      .attr('stroke-width', d => {
        if (d.manipulationDetected) return 3
        return d.id === selectedIdRef.current ? 3 : 2
      })
      .attr('stroke-dasharray', d => d.manipulationDetected ? '4,2' : 'none')
      .attr('pointer-events', 'all')
      .on('click', (event, d) => {
        event.stopPropagation()
        onEntitySelect(entities.find(e => e.id === d.id) || d)
      })

    node.append('text')
      .attr('dx', 12)
      .attr('dy', 3)
      .attr('fill', '#ff1493')
      .attr('font-family', 'Orbitron, monospace')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')
      .text(d => {
        const label = d.label || d.id
        return label.length > 12 ? label.substring(0, 12) + '...' : label
      })

    node.append('text')
      .attr('dx', 0)
      .attr('dy', 3)
      .attr('fill', d => {
        const s = d.trustScore ?? 50
        if (s >= 70) return '#00ff88'
        if (s >= 40) return '#ffaa00'
        return '#ff0066'
      })
      .attr('font-family', 'Orbitron, monospace')
      .attr('font-size', '8px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')
      .text(d => Math.round(d.trustScore ?? 0))

    // Stabilization: reduce alpha after initial iterations
    let tickCount = 0
    simulation.on('tick', () => {
      tickCount++
      
      // Cooldown: reduce alpha after 100 iterations for stability
      if (tickCount === 100) {
        simulation.alpha(0.3)
      }
      
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      
      node.attr('transform', d => `translate(${d.x},${d.y})`)
      
      node.select('circle')
        .attr('stroke', d => {
          if (d.manipulationDetected) return '#ff0000'
          return d.id === selectedIdRef.current ? '#00d4ff' : 'rgba(255, 255, 255, 0.3)'
        })
        .attr('stroke-width', d => {
          if (d.manipulationDetected) return 3
          return d.id === selectedIdRef.current ? 3 : 1.5
        })
    })
    
    // Restart simulation with lower alpha for stability
    simulation.alpha(1).restart()

    const zoom = d3.zoom()
      .scaleExtent([0.1, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom).on('dblclick.zoom', null)

    svg.on('click', (event) => {
      if (event.target === svgRef.current || event.target.tagName === 'line') {
        onEntitySelect(null)
      }
    })

    node.call(d3.drag()
      .on('start', function(event, d) {
        event.sourceEvent.stopPropagation()
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d3.select(this).style('cursor', 'grabbing')
        const t = d3.zoomTransform(svg.node())
        const p = t.invert([event.x, event.y])
        d.fx = p[0]
        d.fy = p[1]
      })
      .on('drag', (event, d) => {
        const t = d3.zoomTransform(svg.node())
        const p = t.invert([event.x, event.y])
        d.fx = p[0]
        d.fy = p[1]
      })
      .on('end', function(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d3.select(this).style('cursor', 'grab')
        d.fx = null
        d.fy = null
      }))

    const handleResize = () => {
      const w = containerRef.current?.clientWidth || 800
      const h = containerRef.current?.clientHeight || 600
      svg.attr('width', w).attr('height', h)
      simulation.force('center', d3.forceCenter(w / 2, h / 2))
      simulation.alpha(0.2).restart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (simulationRef.current) simulationRef.current.stop()
    }
  }, [entities, relationships, onEntitySelect])

  return (
    <div ref={containerRef} className="network-graph-container">
      <svg ref={svgRef} className="network-graph" />
      <div className="graph-legend">
        <div className="legend-title">Network Legend</div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff6b6b' }} />
          <span>Shell Company</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4ecdc4' }} />
          <span>Director</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#45b7d1' }} />
          <span>Digital Wallet</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#f9ca24' }} />
          <span>Vendor</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#eb4d4b' }} />
          <span>Politician</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#a55eea' }} />
          <span>Influencer</span>
        </div>
        <div className="legend-item" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,0,255,0.3)' }}>
          <span className="legend-color" style={{ background: '#ff0000', border: '2px dashed #fff' }} />
          <span>Manipulation Detected</span>
        </div>
        <p className="legend-hint">Drag nodes • Pan background • Scroll to zoom</p>
      </div>
    </div>
  )
}

export default NetworkGraph

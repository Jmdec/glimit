"use client"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

interface ConstellationNode {
  id: number
  image: FilmStripImage
  x: number
  y: number
  size: number
  connections: number[] // IDs of connected nodes
  cluster: number
}

interface Connection {
  from: number
  to: number
  distance: number
}

export function ConstellationMapGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [nodes, setNodes] = useState<ConstellationNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/film-strip?perPage=1000', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }

        const json = await response.json()
        const filmStripImages = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
        setGalleryImages(filmStripImages)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Create constellation layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    const baseSize = isMobile ? 80 : 100
    const totalPhotos = galleryImages.length

    // Create clusters (groups of photos)
    const clustersCount = Math.ceil(totalPhotos / 12) // ~12 photos per cluster
    
    const constellationNodes: ConstellationNode[] = galleryImages.map((image, index) => {
      const cluster = Math.floor(index / 12)
      const positionInCluster = index % 12
      
      // Distribute clusters across the canvas
      const clustersPerRow = Math.ceil(Math.sqrt(clustersCount))
      const clusterRow = Math.floor(cluster / clustersPerRow)
      const clusterCol = cluster % clustersPerRow
      
      // Base position for cluster
      const clusterWidth = isMobile ? 300 : 400
      const clusterHeight = isMobile ? 300 : 400
      const clusterX = (clusterCol + 0.5) * clusterWidth
      const clusterY = (clusterRow + 0.5) * clusterHeight
      
      // Position within cluster (circular arrangement)
      const angleInCluster = (positionInCluster / 12) * Math.PI * 2
      const radiusInCluster = isMobile ? 80 : 120
      const offsetX = Math.cos(angleInCluster) * radiusInCluster
      const offsetY = Math.sin(angleInCluster) * radiusInCluster
      
      // Add some organic randomness
      const randomOffsetX = ((index * 17) % 40 - 20)
      const randomOffsetY = ((index * 23) % 40 - 20)
      
      const x = clusterX + offsetX + randomOffsetX
      const y = clusterY + offsetY + randomOffsetY
      
      // Size variation based on position in cluster (center nodes bigger)
      const distanceFromCenter = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
      const sizeVariation = Math.max(0, 1 - distanceFromCenter / radiusInCluster) * 30
      const size = baseSize + sizeVariation

      return {
        id: image.id,
        image,
        x,
        y,
        size,
        connections: [],
        cluster,
      }
    })

    // Create connections between nearby nodes
    const connectionsList: Connection[] = []
    const maxConnectionDistance = isMobile ? 200 : 250

    constellationNodes.forEach((node, index) => {
      // Connect to 2-4 nearest neighbors
      const distances = constellationNodes
        .map((otherNode, otherIndex) => {
          if (otherIndex === index) return { index: otherIndex, distance: Infinity }
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          return { index: otherIndex, distance }
        })
        .sort((a, b) => a.distance - b.distance)

      // Connect to 2-3 closest nodes within same or adjacent clusters
      const connectionsToMake = 2 + (index % 2) // 2 or 3 connections
      let connectionsMade = 0

      for (let i = 0; i < distances.length && connectionsMade < connectionsToMake; i++) {
        const target = distances[i]
        const targetNode = constellationNodes[target.index]
        
        // Only connect if within distance and in same/adjacent cluster
        const clusterDiff = Math.abs(node.cluster - targetNode.cluster)
        if (target.distance < maxConnectionDistance && clusterDiff <= 1) {
          // Avoid duplicate connections
          const existingConnection = connectionsList.find(
            conn => 
              (conn.from === index && conn.to === target.index) ||
              (conn.from === target.index && conn.to === index)
          )
          
          if (!existingConnection) {
            connectionsList.push({
              from: index,
              to: target.index,
              distance: target.distance,
            })
            node.connections.push(target.index)
            connectionsMade++
          }
        }
      }
    })

    setNodes(constellationNodes)
    setConnections(connectionsList)
  }, [galleryImages, isMobile])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  if (!isMounted || loading) {
    return (
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-400 text-lg">
          {loading ? 'Mapping constellations...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-400 text-lg">No images available</div>
      </section>
    )
  }

  // Calculate canvas size
  const maxX = Math.max(...nodes.map(n => n.x)) + 200
  const maxY = Math.max(...nodes.map(n => n.y)) + 200

  return (
    <section 
      ref={containerRef}
      className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-auto min-h-screen"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Canvas container */}
      <div 
        className="relative"
        style={{ 
          width: `${maxX}px`, 
          height: `${maxY}px`,
          minHeight: '100vh',
        }}
      >
        {/* SVG for connection lines */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#475569', stopOpacity: 0.1 }} />
              <stop offset="50%" style={{ stopColor: '#64748b', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>

          {connections.map((conn, index) => {
            const fromNode = nodes[conn.from]
            const toNode = nodes[conn.to]
            
            if (!fromNode || !toNode) return null

            // Highlight connections when node is selected or hovered
            const isHighlighted = 
              selectedNode === conn.from || 
              selectedNode === conn.to ||
              hoveredNode === conn.from ||
              hoveredNode === conn.to

            return (
              <motion.line
                key={`conn-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#connectionGradient)"
                strokeWidth={isHighlighted ? 2 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isHighlighted ? 0.8 : 0.3,
                  strokeWidth: isHighlighted ? 2 : 1,
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: index * 0.001,
                  opacity: { duration: 0.3 },
                  strokeWidth: { duration: 0.3 },
                }}
              />
            )
          })}
        </svg>

        {/* Photo nodes */}
        {nodes.map((node, index) => {
          const isSelected = selectedNode === node.id
          const isHovered = hoveredNode === node.id
          const isConnected = 
            connections.some(conn => 
              (conn.from === index && (selectedNode === nodes[conn.to]?.id || hoveredNode === nodes[conn.to]?.id)) ||
              (conn.to === index && (selectedNode === nodes[conn.from]?.id || hoveredNode === nodes[conn.from]?.id))
            )

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{
                left: node.x,
                top: node.y,
                width: node.size,
                height: node.size,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isSelected ? 1.3 : isHovered ? 1.2 : isConnected ? 1.1 : 1,
                opacity: 1,
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.01,
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
            >
              {/* Glow ring for selected/hovered */}
              {(isSelected || isHovered || isConnected) && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(100, 116, 139, 0.4) 0%, transparent 70%)',
                    width: '150%',
                    height: '150%',
                    left: '-25%',
                    top: '-25%',
                    zIndex: -1,
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Photo container */}
              <div 
                className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-700 shadow-2xl"
                style={{
                  borderColor: isSelected ? '#94a3b8' : isHovered ? '#cbd5e1' : '#475569',
                  boxShadow: isSelected || isHovered
                    ? '0 0 30px rgba(148, 163, 184, 0.5), 0 10px 40px rgba(0,0,0,0.5)'
                    : '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src={getImageUrl(node.image.image_path) || "/placeholder.svg"}
                  alt={node.image.alt_text || `Node ${node.id}`}
                  fill
                  sizes="(max-width: 768px) 100px, 120px"
                  className="object-cover"
                  loading="eager"
                />
                
                {/* Overlay for non-selected/hovered */}
                {!isSelected && !isHovered && !isConnected && (
                  <div className="absolute inset-0 bg-slate-900/20"></div>
                )}

                {/* Star point indicator */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ opacity: isSelected || isHovered ? 0 : 0.5 }}
                >
                  <div className="w-1 h-1 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>

              {/* Node label on hover */}
              {(isSelected || isHovered) && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700">
                    <p className="text-slate-300 text-xs font-medium">
                      {node.image.alt_text || `Image ${index + 1}`}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {/* Cluster labels */}
        {Array.from(new Set(nodes.map(n => n.cluster))).map(clusterIndex => {
          const clusterNodes = nodes.filter(n => n.cluster === clusterIndex)
          const avgX = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length
          const avgY = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length

          return (
            <motion.div
              key={`cluster-${clusterIndex}`}
              className="absolute pointer-events-none"
              style={{
                left: avgX,
                top: avgY - 150,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
            >
              <div className="text-slate-600 text-sm font-light tracking-widest">
                CLUSTER {String.fromCharCode(65 + clusterIndex)}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Info panel */}
      <div className="fixed top-8 left-8 bg-slate-900/90 backdrop-blur-sm px-6 py-4 rounded-xl border border-slate-700 shadow-2xl z-50">
        <h3 className="text-slate-300 text-sm font-light tracking-wider mb-3">CONSTELLATION MAP</h3>
        <div className="space-y-2 text-xs text-slate-400">
          <p>{nodes.length} nodes mapped</p>
          <p>{connections.length} connections</p>
          <p className="text-slate-500 mt-3">Hover to explore • Click to focus</p>
        </div>
      </div>

      {/* Legend */}
      <div className="fixed bottom-8 right-8 bg-slate-900/90 backdrop-blur-sm px-6 py-4 rounded-xl border border-slate-700 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-slate-600 border border-slate-500"></div>
          <span className="text-xs text-slate-400">Photo Node</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
          <span className="text-xs text-slate-400">Connection</span>
        </div>
      </div>
    </section>
  )
}
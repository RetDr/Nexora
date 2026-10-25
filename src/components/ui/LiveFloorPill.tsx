import React, { useState, useEffect } from 'react'
import { AnimatedCounter } from './AnimatedCounter'

interface LiveFloorPillProps {
  onNavigate?: (path: string) => void
  time?: string
  count?: number
  onTrack?: number
  behind?: number
  progressPct?: number
  className?: string
}

export const LiveFloorPill: React.FC<LiveFloorPillProps> = ({
  onNavigate,
  count = 4,
  onTrack = 4,
  behind = 0,
  progressPct = 85,
  className = '',
}) => {
  // Reloj en tiempo real dinámico con segundos
  const [liveTime, setLiveTime] = useState(() => {
    return new Date().toLocaleTimeString('es-CO', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString('es-CO', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`cadra-floor-pill ${className}`}
      title="Estado en vivo de sillones y clínica"
      onClick={() => onNavigate && onNavigate('/agenda')}
    >
      <div className="floor-time">
        <span className="green-live-dot" />
        <span className="time-text font-mono font-medium">{liveTime}</span>
      </div>
      <div className="floor-metrics">
        <div className="floor-title-line">
          <span className="floor-count">
            <AnimatedCounter value={count} /> boxes en atención
          </span>
        </div>
        <span className="floor-subtext">
          <AnimatedCounter value={onTrack} /> a tiempo · <AnimatedCounter value={behind} /> demoras
        </span>
      </div>
      <div className="floor-progress-container">
        <div className="floor-progress-fill" style={{ width: `${progressPct}%`, backgroundColor: '#A94384' }} />
      </div>
    </div>
  )
}


import React from 'react'
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
  time = '4:08 PM',
  count = 5,
  onTrack = 4,
  behind = 1,
  progressPct = 80,
  className = '',
}) => {
  return (
    <div
      className={`cadra-floor-pill ${className}`}
      title="Floor operations status"
      onClick={() => onNavigate && onNavigate('/manufacturing/scheduling')}
    >
      <div className="floor-time">
        <span className="green-live-dot" />
        <span className="time-text">{time}</span>
      </div>
      <div className="floor-metrics">
        <div className="floor-title-line">
          <span className="floor-count">
            <AnimatedCounter value={count} /> on the floor
          </span>
        </div>
        <span className="floor-subtext">
          <AnimatedCounter value={onTrack} /> on track · <AnimatedCounter value={behind} /> behind
        </span>
      </div>
      <div className="floor-progress-container">
        <div className="floor-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  )
}


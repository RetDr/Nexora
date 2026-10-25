import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  ChevronDown,
  Factory,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react'
import { ganttOrdersData, liveFloorData } from '../../data/cadraData'

interface SchedulingPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const SchedulingPage: React.FC<SchedulingPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [rangeMode, setRangeMode] = useState<'Week' | 'Month' | 'Quarter'>('Week')
  const [groupMode, setGroupMode] = useState<'Orders' | 'Work centers'>('Orders')
  const [viewMode, setViewMode] = useState<'Timeline' | 'Agenda'>('Timeline')
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({ 'BOX-1': true, 'BOX-2': true, 'BOX-3': true, 'BOX-4': true })
  const [selectedOrder, setSelectedOrder] = useState('BOX-1')

  const toggleExpand = (code: string) => {
    setExpandedOrders((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  const days = [
    { label: 'SUN', num: 8, isWeekend: true },
    { label: 'MON', num: 9, isWeekend: false },
    { label: 'TUE', num: 10, isWeekend: false },
    { label: 'WED', num: 11, isToday: true, isWeekend: false },
    { label: 'THU', num: 12, isWeekend: false },
    { label: 'FRI', num: 13, isWeekend: false },
    { label: 'SAT', num: 14, isWeekend: true },
  ]

  const capacities = ['3/8', '5/8', '4/8', '5/8', '5/8', '5/8', '3/8']

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Agenda</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Sillones Odontológicos</span>
      </div>

      {/* Page Title & Top Actions — Proportioned Like Real.png */}
      <div className="cadra-page-header">
        <div className="page-header-left-col">
          <h1 className="cadra-page-title">Agenda</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/agenda')}>
              Turnos Sillones
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/manufacturing/orders')}>
              Citas & Procedimientos
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill time="12:02 PM" onNavigate={onNavigate} />

          <div className="page-header-actions-row">
            <button className="cadra-btn-secondary" onClick={() => alert('Exportando agenda clínica a Excel/PDF...')}>
              <Download size={14} />
              <span>Exportar</span>
            </button>

            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <Plus size={15} />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Bar & Segmented Toggles */}
      <div className="cadra-control-bar">
        {/* Left: Date controls */}
        <div className="control-date-cluster">
          <button className="circle-arrow-btn" aria-label="Previous week">
            <ChevronLeft size={16} />
          </button>
          <span className="current-date-text">Nov 8 – Nov 14, 2026</span>
          <button className="circle-arrow-btn" aria-label="Next week">
            <ChevronRight size={16} />
          </button>
          <button className="today-badge-btn">
            <Calendar size={14} />
            <span>Today</span>
          </button>
        </div>

        {/* Right: Segmented switches */}
        <div className="control-switches-cluster">
          <div className="cadra-pill-group">
            {(['Week', 'Month', 'Quarter'] as const).map((r) => (
              <button
                key={r}
                className={`pill-switch-btn ${rangeMode === r ? 'active' : ''}`}
                onClick={() => setRangeMode(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="cadra-pill-group">
            {(['Orders', 'Work centers'] as const).map((g) => (
              <button
                key={g}
                className={`pill-switch-btn ${groupMode === g ? 'active' : ''}`}
                onClick={() => setGroupMode(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="cadra-pill-group">
            {(['Timeline', 'Agenda'] as const).map((v) => (
              <button
                key={v}
                className={`pill-switch-btn ${viewMode === v ? 'active' : ''}`}
                onClick={() => setViewMode(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operations Alert Banner */}
      <div className="cadra-alert-banner">
        <span className="green-live-dot" />
        <p className="alert-banner-text">
          <strong><AnimatedCounter value={5} /> operations running</strong> across 5 work centers · <strong><AnimatedCounter value={7} /></strong> start in the next two days ·{' '}
          <span className="text-warning-red font-semibold">WO-2043</span> is behind plan
        </p>
      </div>

      {/* Main Scheduling Layout (Gantt on left, On the floor on right) */}
      <div className="scheduling-split-layout">
        {/* Left: Gantt Card */}
        <div className="cadra-card gantt-main-card">
          {/* Gantt Header Columns */}
          <div className="gantt-header-row">
            <div className="gantt-col-order-title">WORK ORDER</div>
            <div className="gantt-days-grid-header">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`gantt-day-head-cell ${day.isWeekend ? 'is-weekend' : ''} ${day.isToday ? 'is-today' : ''}`}
                >
                  <span className="day-name">{day.label}</span>
                  <span className="day-num">{day.num}</span>
                  {day.isToday && <span className="today-dot" />}
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Row */}
          <div className="gantt-capacity-row">
            <div className="gantt-col-order-title capacity-title">CAPACITY</div>
            <div className="gantt-days-grid-header">
              {capacities.map((cap, idx) => {
                const isHeavy = cap === '5/8'
                return (
                  <div key={idx} className="gantt-capacity-cell">
                    <span className={`capacity-bar ${isHeavy ? 'bar-heavy' : 'bar-normal'}`} />
                    <span className="capacity-text">{cap}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Gantt Rows & Timeline Track */}
          <div className="gantt-body-container">
            {/* Red Line for 12:02 PM on Wednesday (4th col = index 3, ~50% into Wed) */}
            <div className="gantt-now-indicator-line" style={{ left: 'calc(240px + (100% - 240px) * (3.5 / 7))' }}>
              <div className="now-badge-flag">12:02 PM</div>
            </div>

            {/* Background day columns */}
            <div className="gantt-bg-grid">
              <div className="gantt-bg-left-spacer" />
              <div className="gantt-bg-days">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className={`gantt-bg-day-col ${day.isWeekend ? 'striped-weekend' : ''} ${day.isToday ? 'today-bg-col' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Gantt Rows Content */}
            <div className="gantt-rows-layer">
              {ganttOrdersData.map((order) => {
                const isExpanded = expandedOrders[order.code]
                return (
                  <div key={order.id} className="gantt-order-group">
                    {/* Parent Work Order Row */}
                    <div
                      className={`gantt-order-row ${selectedOrder === order.code ? 'selected' : ''}`}
                      onClick={() => setSelectedOrder(order.code)}
                    >
                      <div className="gantt-order-meta">
                        <button
                          className="expand-caret-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpand(order.code)
                          }}
                        >
                          <ChevronDown size={14} className={isExpanded ? 'rotated-caret' : ''} />
                        </button>
                        <div className="pie-progress-icon" style={{ borderColor: order.color }} />
                        <div className="order-names">
                          <span className="order-code-bold">{order.code}</span>
                          <span className="order-sub-name">{order.name}</span>
                        </div>
                      </div>

                      <div className="gantt-order-track">
                        {/* Overall bar for the whole work order */}
                        <div
                          className="gantt-overall-bar"
                          style={{
                            left: `${(order.code === 'BOX-1' ? 0.3 : order.code === 'BOX-2' ? 0.1 : 1.2) * (100 / 7)}%`,
                            width: `${(order.code === 'BOX-1' ? 5.8 : order.code === 'BOX-2' ? 4.8 : 3.6) * (100 / 7)}%`,
                            backgroundColor: order.color || '#A94384',
                          }}
                        />
                      </div>
                    </div>

                    {/* Sub operations (when expanded) */}
                    {isExpanded &&
                      order.operations.map((op) => (
                        <div key={op.id} className="gantt-sub-op-row">
                          <div className="gantt-sub-op-meta">
                            <span className="worker-initial-pill">{op.workerInitials}</span>
                            <div className="sub-op-texts">
                              <span className="sub-op-title">{op.name}</span>
                              <span className="sub-op-dates">{op.dates}</span>
                            </div>
                          </div>

                          <div className="gantt-sub-op-track">
                            {/* Connected smooth Gantt operation pill */}
                            <div
                              className={`gantt-op-pill ${op.status === 'done' ? 'pill-done' : op.status === 'behind' ? 'pill-behind' : 'pill-active'}`}
                              style={{
                                left: `${op.startDay * (100 / 7)}%`,
                                width: `${op.durationDays * (100 / 7)}%`,
                              }}
                            >
                              <span className="op-pill-name">{op.name}</span>
                              <span className="op-pill-pct">
                                <AnimatedCounter value={`${op.progress}%`} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: On the floor now */}
        <aside className="cadra-card floor-sidebar-card">
          <div className="floor-sidebar-head">
            <div className="floor-head-left">
              <Factory size={16} className="text-secondary" />
              <h3>On the floor now</h3>
            </div>
          </div>

          <div className="floor-items-scroll">
            {liveFloorData.map((item) => (
              <div key={item.id} className="live-floor-card">
                <div className="floor-card-top">
                  <div className="floor-card-worker">
                    <span className="worker-avatar-circle">{item.workerInitials}</span>
                    <div className="floor-card-op-info">
                      <span className="floor-op-name">{item.operation}</span>
                      <span className="floor-op-product">{item.product}</span>
                    </div>
                  </div>
                  <span className="floor-wo-tag">{item.workOrder}</span>
                </div>

                <div className="floor-card-progress-row">
                  <div className="floor-card-bar">
                    <div
                      className={`floor-card-bar-fill ${item.status === 'behind' ? 'fill-behind' : 'fill-ontrack'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className={`floor-card-pct-label ${item.status === 'behind' ? 'text-danger' : ''}`}>
                    <AnimatedCounter value={`${item.progress}%`} />{item.status === 'behind' ? ' · behind' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}


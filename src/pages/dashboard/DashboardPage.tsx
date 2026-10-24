import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Factory,
  Bike,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Truck,
  Users,
  Zap,
  ShoppingCart
} from 'lucide-react'

interface DashboardPageProps {
  onNavigate: (path: string) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [chartMode, setChartMode] = useState<'revenue' | 'bikes'>('revenue')

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Dashboard</span>
      </div>

      <h1 className="cadra-page-title mb-4">Dashboard</h1>

      {/* Top Banner Grid: Greeting + Cash On Hand */}
      <div className="dashboard-top-hero-grid">
        {/* Morning Greeting & Time Scrubber */}
        <div className="cadra-card dashboard-welcome-card">
          <div className="welcome-date-header">WEDNESDAY, NOVEMBER 11</div>
          <h2 className="welcome-greeting-title">Good morning, Noor.</h2>
          <p className="welcome-summary-text">
            <strong><AnimatedCounter value={5} /> operations</strong> on the floor,{' '}
            <strong><AnimatedCounter value={2} /> shipments</strong> on the road and{' '}
            <strong><AnimatedCounter value={2} /> showroom sales</strong> so far.{' '}
            <span className="text-warning-red font-semibold cursor-pointer" onClick={() => onNavigate('/manufacturing/orders')}>
              <AnimatedCounter value={1} /> work order needs a look.
            </span>
          </p>

          <div className="welcome-action-buttons">
            <button className="cadra-btn-primary" onClick={() => onNavigate('/manufacturing/scheduling')}>
              <Factory size={14} />
              <span>Open schedule</span>
            </button>
            <button className="cadra-btn-secondary" onClick={() => onNavigate('/sales/pipeline')}>
              <Tag size={14} />
              <span>Pipeline</span>
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="time-scrubber-widget">
            <div className="scrubber-line-container">
              <div className="scrubber-track-line" />
              {/* Operation dots */}
              <span className="scrubber-dot dot-green" style={{ left: '16%' }} title="Tube cutting" />
              <span className="scrubber-dot dot-blue" style={{ left: '21%' }} title="TIG welding" />
              <span className="scrubber-dot dot-terracotta" style={{ left: '26%' }} title="Sales order confirmed" />
              <span className="scrubber-dot dot-brown" style={{ left: '31%' }} title="Parts restocked" />
              <span className="scrubber-dot dot-dark" style={{ left: '36%' }} title="Shift switch" />
              <span className="scrubber-dot dot-hollow-blue" style={{ left: '56%' }} title="Showroom pickup" />
              <span className="scrubber-dot dot-hollow-brown" style={{ left: '72%' }} title="Powder coat cure" />
              <span className="scrubber-dot dot-hollow-brown" style={{ left: '78%' }} title="Packing check" />

              {/* Red Now Marker Flag at 11:57 AM */}
              <div className="scrubber-now-indicator" style={{ left: '44%' }}>
                <span className="now-flag-badge">11:57 AM</span>
                <span className="now-vertical-pin" />
              </div>
            </div>

            <div className="scrubber-time-labels">
              <span>7a</span>
              <span>9a</span>
              <span>11a</span>
              <span>1p</span>
              <span>3p</span>
              <span>5p</span>
            </div>
          </div>
        </div>

        {/* Cash On Hand Card */}
        <div className="cadra-card dashboard-cash-card">
          <div className="cash-card-header">
            <div className="cash-head-left">
              <Building2 size={16} className="text-secondary" />
              <span className="cash-label">Cash on hand</span>
            </div>
            <button className="cadra-link-btn" onClick={() => onNavigate('/accounting/payments')}>
              <span>Payments</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="cash-amount-row">
            <span className="cash-big-num">
              <AnimatedCounter value="$221,553" duration={750} delay={100} />
            </span>
            <span className="cadra-tag-pill tag-green">
              <AnimatedCounter value="+$49,438" duration={650} delay={150} /> in 14 days
            </span>
          </div>

          {/* Money in / Money out bars */}
          <div className="cash-mini-bars-graphic">
            {[
              { in: 30, out: 0 },
              { in: 42, out: 0 },
              { in: 0, out: 28 },
              { in: 55, out: 0 },
              { in: 40, out: 0 },
              { in: 0, out: 35 },
              { in: 50, out: 0 },
              { in: 85, out: 0 },
              { in: 100, out: 0 },
            ].map((bar, i) => (
              <div key={i} className="cash-bar-col">
                {bar.in > 0 ? (
                  <div className="cash-bar-in" style={{ height: `${bar.in}%` }} />
                ) : (
                  <div className="cash-bar-out" style={{ height: `${bar.out}%` }} />
                )}
              </div>
            ))}
          </div>

          <div className="cash-legend-row">
            <span className="legend-item">
              <i className="legend-dot dot-green" /> Money in
            </span>
            <span className="legend-item">
              <i className="legend-dot dot-terracotta" /> Money out
            </span>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="cadra-kpi-grid-4 mt-4">
        {/* Card 1: Revenue this month */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <span className="kpi-icon-pill-circle">$</span>
            <span className="kpi-label">Revenue this month</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$93,474" duration={750} delay={100} />
          </div>
          <div className="kpi-sub-spark-row">
            <span className="kpi-subtext">
              <TrendingUp size={13} className="inline mr-1" /> 11 days in · on pace for $256k
            </span>
            <svg className="mini-sparkline" viewBox="0 0 60 20">
              <path d="M 0 16 Q 15 18, 30 8 T 60 12" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 2: Bikes built (14 days) */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Bike size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Bikes built (14 days)</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="57" duration={650} delay={150} />
          </div>
          <div className="kpi-sub-spark-row">
            <span className="kpi-subtext">
              <TrendingUp size={13} className="inline mr-1" /> 3 so far today
            </span>
            <svg className="mini-sparkline" viewBox="0 0 60 20">
              <path d="M 0 14 L 10 18 L 20 8 L 30 16 L 40 6 L 50 12 L 60 8" fill="none" stroke="#25476a" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 3: Open order book */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Tag size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Open order book</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$131,360" duration={750} delay={200} />
          </div>
          <div className="kpi-sub-spark-row">
            <span className="kpi-subtext text-emerald-700">
              <TrendingUp size={13} className="inline mr-1" /> 9 orders confirmed or building
            </span>
            <svg className="mini-sparkline" viewBox="0 0 60 20">
              <path d="M 0 18 Q 30 16, 45 10 T 60 4" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 4: On-time delivery */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CheckCircle2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">On-time delivery</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="91%" duration={650} delay={250} />
          </div>
          <div className="kpi-sub-spark-row">
            <span className="kpi-subtext text-warning-red">
              <TrendingDown size={13} className="inline mr-1" /> down 2 pts from October
            </span>
            <svg className="mini-sparkline" viewBox="0 0 60 20">
              <path d="M 0 6 Q 20 18, 35 10 T 60 8" fill="none" stroke="#92400e" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: Year at a glance + Sales Funnel */}
      <div className="dashboard-charts-grid mt-4">
        {/* Year at a glance */}
        <div className="cadra-card chart-container-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <span className="chart-title-icon">📊</span>
              <h3>Year at a glance</h3>
            </div>
            <div className="cadra-pill-group">
              <button
                className={`pill-switch-btn ${chartMode === 'revenue' ? 'active' : ''}`}
                onClick={() => setChartMode('revenue')}
              >
                Revenue & cost
              </button>
              <button
                className={`pill-switch-btn ${chartMode === 'bikes' ? 'active' : ''}`}
                onClick={() => setChartMode('bikes')}
              >
                Bikes built
              </button>
            </div>
          </div>

          {/* SVG Smooth Curve Chart */}
          <div className="year-chart-wrapper">
            <div className="chart-y-axis">
              <span>$250k</span>
              <span>$125k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Revenue Blue Line */}
                <path
                  d="M 0 120 C 50 110, 80 80, 150 90 C 220 100, 270 50, 360 40 C 440 30, 500 50, 600 70"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 120 C 50 110, 80 80, 150 90 C 220 100, 270 50, 360 40 C 440 30, 500 50, 600 70 L 600 160 L 0 160 Z"
                  fill="url(#revenueFill)"
                />
                {/* Cost Terracotta Dashed Line */}
                <path
                  d="M 0 140 C 50 135, 90 120, 150 125 C 220 130, 280 90, 360 85 C 440 80, 500 95, 600 105"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="chart-x-axis">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          <div className="chart-legend-footer">
            <span className="legend-item">
              <i className="legend-dot dot-blue" /> Revenue
            </span>
            <span className="legend-item">
              <i className="legend-dot dot-terracotta" /> Costs
            </span>
            <span className="legend-note">· November is month-to-date</span>
          </div>
        </div>

        {/* Sales Funnel Card */}
        <div className="cadra-card sales-funnel-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <Tag size={16} className="text-secondary" />
              <h3>Sales funnel</h3>
            </div>
            <button className="cadra-link-btn" onClick={() => onNavigate('/sales/pipeline')}>
              <span>Board</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="funnel-stages-list">
            {[
              { stage: 'Quote', count: 4, value: '$35,805', width: '25%', color: '#94a3b8' },
              { stage: 'Confirmed', count: 2, value: '$15,064', width: '15%', color: '#3b82f6' },
              { stage: 'In production', count: 6, value: '$108,676', width: '75%', color: '#2563eb' },
              { stage: 'Ready to ship', count: 1, value: '$7,620', width: '10%', color: '#d97706' },
              { stage: 'Shipped', count: 1, value: '$10,146', width: '12%', color: '#78350f' },
            ].map((f) => (
              <div key={f.stage} className="funnel-stage-row">
                <div className="funnel-stage-meta">
                  <span className="stage-name">{f.stage}</span>
                  <span className="stage-count">
                    <AnimatedCounter value={f.count} /> order{f.count > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="funnel-bar-track">
                  <div className="funnel-bar-fill" style={{ width: f.width, backgroundColor: f.color }} />
                </div>
                <span className="stage-val-text">
                  <AnimatedCounter value={f.value} />
                </span>
              </div>
            ))}
          </div>

          <div className="funnel-insight-note">
            <Sparkles size={14} className="text-terracotta" />
            <span>
              Quotes convert at <strong><AnimatedCounter value="62%" /></strong> this quarter — Rosewood and Harbor & Hill close fastest.
            </span>
          </div>
        </div>
      </div>

      {/* Lower Row: On the floor today + Running low */}
      <div className="dashboard-charts-grid mt-4">
        {/* On the floor today */}
        <div className="cadra-card floor-today-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <Factory size={16} className="text-secondary" />
              <h3>On the floor today</h3>
            </div>
            <button className="cadra-link-btn" onClick={() => onNavigate('/manufacturing/scheduling')}>
              <span>Schedule</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="floor-today-list">
            {[
              { op: 'Tube cutting', wo: 'WO-2043 · Commuter Seven ×20', initials: 'FW', pct: 30, status: 'behind' },
              { op: 'TIG welding', wo: 'WO-2042 · Tempo Road ×8', initials: 'AT', pct: 55, status: 'ontrack' },
              { op: 'Quality check', wo: 'WO-2045 · Halcyon Tourer ×10', initials: 'HK', pct: 60, status: 'ontrack' },
              { op: 'Powder coat', wo: 'WO-2041 · Ridgeline Gravel ×12', initials: 'JB', pct: 45, status: 'ontrack' },
              { op: 'Wheel build', wo: 'WO-2044 · Juniper Trail ×6', initials: 'BA', pct: 50, status: 'ontrack' },
            ].map((item, idx) => (
              <div key={idx} className="floor-today-row">
                <div className="floor-indicator-bar" style={{ backgroundColor: item.status === 'behind' ? '#ef4444' : '#3b82f6' }} />
                <div className="floor-item-texts">
                  <span className="floor-item-op">{item.op}</span>
                  <span className="floor-item-wo">{item.wo}</span>
                </div>
                <span className="worker-circle-avatar">{item.initials}</span>
                <div className="floor-item-progress">
                  <div className="floor-progress-bg">
                    <div
                      className={`floor-progress-fill ${item.status === 'behind' ? 'fill-red' : 'fill-blue'}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className={`floor-pct-num ${item.status === 'behind' ? 'text-danger' : ''}`}>
                    <AnimatedCounter value={`${item.pct}%`} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Running low inventory items */}
        <div className="cadra-card running-low-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <Tag size={16} className="text-secondary" />
              <h3>Running low</h3>
            </div>
            <button className="cadra-btn-secondary small" onClick={() => onNavigate('/purchasing/orders')}>
              <ShoppingCart size={13} />
              <span>Reorder</span>
            </button>
          </div>

          <div className="running-low-list">
            {[
              { name: 'Juniper frameset', code: 'LS-JNP-F · reorder at 3', qty: 1, bar: 20, isRed: true },
              { name: 'Powder coat — Signal orange', code: 'BC-SIG · reorder at 10 · 25 on order', qty: 6, bar: 45 },
              { name: 'Cinder hydraulic brakes (set)', code: 'CB-HYD · reorder at 14 · 30 on order', qty: 9, bar: 55 },
              { name: 'Juniper Trail', code: 'LS-JNP · reorder at 4', qty: 3, bar: 40 },
              { name: 'Heat-treated tubeset (HD)', code: 'KT-HD · reorder at 10 · 20 on order', qty: 8, bar: 50 },
              { name: 'Aster carbon fork', code: 'AS-CF45 · reorder at 12 · 24 on order', qty: 11, bar: 65 },
            ].map((item, idx) => (
              <div key={idx} className="running-low-row">
                <div className="low-item-info">
                  <span className="low-item-name">{item.name}</span>
                  <span className="low-item-code">{item.code}</span>
                </div>
                <div className="low-item-bar-box">
                  <div className="low-bar-bg">
                    <div
                      className="low-bar-fill"
                      style={{ width: `${item.bar}%`, backgroundColor: item.isRed ? '#ef4444' : '#b45309' }}
                    />
                  </div>
                </div>
                <span className={`low-item-qty ${item.isRed ? 'text-danger' : ''}`}>
                  <AnimatedCounter value={item.qty} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Quick Status Cards: On the road + Team today + Activity */}
      <div className="dashboard-trio-grid mt-4">
        {/* On the road */}
        <div className="cadra-card trio-card">
          <div className="trio-head">
            <div className="flex items-center gap-2">
              <Truck size={16} />
              <strong>On the road</strong>
            </div>
            <button className="cadra-link-btn" onClick={() => onNavigate('/logistics/shipments')}>
              All <ChevronRight size={13} />
            </button>
          </div>
          <p className="trio-desc">2 parcels in transit to Seattle and Toronto</p>
        </div>

        {/* Team today */}
        <div className="cadra-card trio-card">
          <div className="trio-head">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <strong>Team today</strong>
            </div>
            <button className="cadra-link-btn" onClick={() => onNavigate('/hr/directory')}>
              Attendance <ChevronRight size={13} />
            </button>
          </div>
          <p className="trio-desc">14 builders present on floor · All shifts staffed</p>
        </div>

        {/* Activity */}
        <div className="cadra-card trio-card">
          <div className="trio-head">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <strong>Activity</strong>
            </div>
          </div>
          <p className="trio-desc">Last event: PO-3307 billed by Tallow Wheel Works</p>
        </div>
      </div>
    </div>
  )
}


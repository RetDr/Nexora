import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Download,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Bike,
  Percent,
  CheckCircle2,
  Store
} from 'lucide-react'

interface ReportBuilderPageProps {
  onNavigate: (path: string) => void
}

export const ReportBuilderPage: React.FC<ReportBuilderPageProps> = ({ onNavigate }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [groupBy, setGroupBy] = useState<'month' | 'dealer' | 'product'>('month')

  const metrics = [
    {
      id: 'revenue',
      title: 'Revenue',
      desc: 'Dealer orders and showroom, after discounts',
      icon: TrendingUp,
      total: '$1,839,774',
      highest: '$220,000 Jun 2026',
      lowest: '$81,000 Jan 2026',
    },
    {
      id: 'units',
      title: 'Units',
      desc: 'Bikes shipped, or units on orders',
      icon: Bike,
      total: '916 units',
      highest: '112 Jun 2026',
      lowest: '48 Jan 2026',
    },
    {
      id: 'margin',
      title: 'Gross margin',
      desc: 'Revenue left after cost of goods',
      icon: Percent,
      total: '51.8%',
      highest: '56.2% Aug 2026',
      lowest: '46.1% Feb 2026',
    },
    {
      id: 'ontime',
      title: 'On-time %',
      desc: 'Orders delivered by their ship-by date',
      icon: CheckCircle2,
      total: '92.4%',
      highest: '98% May 2026',
      lowest: '88% Sep 2026',
    },
    {
      id: 'showroom',
      title: 'Showroom sales',
      desc: 'Division St till, card and cash',
      icon: Store,
      total: '$218,440',
      highest: '$28,400 Jul 2026',
      lowest: '$9,200 Jan 2026',
    },
  ]

  const currentMetric = metrics.find((m) => m.id === selectedMetric) || metrics[0]

  const monthRows = [
    { num: 1, month: 'June 2026', rev: '$220,000', pct: 100 },
    { num: 2, month: 'July 2026', rev: '$208,400', pct: 94 },
    { num: 3, month: 'May 2026', rev: '$198,120', pct: 90 },
    { num: 4, month: 'August 2026', rev: '$189,650', pct: 86 },
    { num: 5, month: 'September 2026', rev: '$174,300', pct: 79 },
    { num: 6, month: 'October 2026', rev: '$162,480', pct: 74 },
  ]

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Informes</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Generador de Reportes</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Generador de Reportes</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/informes')}>
              Rendimiento Clínico
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/reporting/builder')}>
              Generador de Reportes
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
        </div>
      </div>

      {/* Split Layout: Builder sidebar (Left) vs Report output (Right) */}
      <div className="builder-split-layout mt-4">
        {/* Left: Build a report controls */}
        <aside className="cadra-card builder-sidebar-card">
          <div className="side-card-title-row">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📑</span>
              <h3>Build a report</h3>
            </div>
          </div>

          <div className="builder-section-label">METRIC</div>

          <div className="builder-metrics-stack">
            {metrics.map((m) => {
              const Icon = m.icon
              const isSelected = selectedMetric === m.id
              return (
                <div
                  key={m.id}
                  className={`metric-choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMetric(m.id)}
                >
                  <div className="metric-choice-icon">
                    <Icon size={16} />
                  </div>
                  <div className="metric-choice-texts">
                    <strong>{m.title}</strong>
                    <p>{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="builder-section-label mt-4">GROUP BY</div>

          <div className="cadra-pill-group w-full justify-between">
            {(['month', 'dealer', 'product'] as const).map((g) => (
              <button
                key={g}
                className={`pill-switch-btn flex-1 capitalize ${groupBy === g ? 'active' : ''}`}
                onClick={() => setGroupBy(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </aside>

        {/* Right: Interactive Report Display */}
        <div className="cadra-card builder-output-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📊</span>
              <h3>
                {currentMetric.title} by {groupBy}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Dec 2025 – Nov 2026</span>
              <button className="icon-btn-plain">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Top 3 Metric Summary Boxes */}
          <div className="builder-stats-trio">
            <div className="stat-trio-box">
              <span className="stat-trio-label">Total</span>
              <span className="stat-trio-val">{currentMetric.total}</span>
            </div>
            <div className="stat-trio-box">
              <span className="stat-trio-label">Highest</span>
              <span className="stat-trio-val">{currentMetric.highest}</span>
            </div>
            <div className="stat-trio-box">
              <span className="stat-trio-label">Lowest</span>
              <span className="stat-trio-val">{currentMetric.lowest}</span>
            </div>
          </div>

          {/* Smooth Chart Area */}
          <div className="year-chart-wrapper mt-3">
            <div className="chart-y-axis">
              <span>$250k</span>
              <span>$125k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="builderCurveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 115 C 60 135, 120 120, 180 90 C 250 50, 320 20, 380 30 C 440 40, 520 60, 600 110"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 115 C 60 135, 120 120, 180 90 C 250 50, 320 20, 380 30 C 440 40, 520 60, 600 110 L 600 160 L 0 160 Z"
                  fill="url(#builderCurveFill)"
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
              </div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="cadra-table-responsive mt-4">
            <table className="cadra-data-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>#</th>
                  <th style={{ width: '32%' }}>MONTH</th>
                  <th style={{ width: '30%' }}>REVENUE</th>
                  <th style={{ width: '30%' }}>RELATIVE</th>
                </tr>
              </thead>
              <tbody>
                {monthRows.map((r) => (
                  <tr key={r.num} className="table-row-hoverable">
                    <td>{r.num}</td>
                    <td><strong>{r.month}</strong></td>
                    <td>{r.rev}</td>
                    <td>
                      <div className="relative-bar-track">
                        <div className="relative-bar-fill" style={{ width: `${r.pct}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


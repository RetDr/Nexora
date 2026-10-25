import React from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Download,
  Plus,
  TrendingUp,
  Bike,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react'

interface ReportingOverviewPageProps {
  onNavigate: (path: string) => void
}

export const ReportingOverviewPage: React.FC<ReportingOverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Informes</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Rendimiento Clínico</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Informes</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/informes')}>
              Rendimiento Clínico
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/reporting/builder')}>
              Generador de Reportes
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            <button className="cadra-btn-secondary" onClick={() => alert('Exporting summary PDF...')}>
              <Download size={14} />
              <span>Export summary</span>
            </button>

            <button className="cadra-btn-primary" onClick={() => onNavigate('/reporting/builder')}>
              <Layers size={15} />
              <span>Build a report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <TrendingUp size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Revenue, year to date</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$1,721,974" duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            Best: Jun <AnimatedCounter value="$220k" />
          </span>
        </div>

        {/* Card 2: Bikes shipped */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Bike size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Bikes shipped</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="916" duration={650} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={88} /> a month
          </span>
        </div>

        {/* Card 3: Gross margin */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Percent size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Gross margin</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="51.8%" duration={700} delay={200} />
          </div>
        </div>

        {/* Card 4: On time in November */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CheckCircle2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">On time in November</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="91%" duration={650} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-pink">
              <AnimatedCounter value="-2" /> pts vs Oct
            </span>
          </div>
        </div>
      </div>

      {/* Split: Revenue vs Cost (Left) + Speedometer (Right) */}
      <div className="reporting-split-layout mt-4">
        {/* Left: Revenue chart */}
        <div className="cadra-card report-revenue-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-secondary" />
              <h3>Revenue</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <i className="legend-dot dot-blue" /> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="legend-dot dot-gray" /> Cost of goods
                </span>
              </div>
              <button className="icon-btn-plain">
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          <div className="year-chart-wrapper">
            <div className="chart-y-axis">
              <span>$250k</span>
              <span>$125k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 135" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="revRepFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Subtle horizontal grid lines */}
                <line x1="0" y1="10" x2="600" y2="10" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="67" x2="600" y2="67" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="currentColor" strokeOpacity="0.08" />

                {/* Revenue curve */}
                <path
                  d="M 0 85 C 60 105, 120 90, 180 60 C 250 30, 320 15, 380 20 C 440 25, 520 50, 600 95"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 85 C 60 105, 120 90, 180 60 C 250 30, 320 15, 380 20 C 440 25, 520 50, 600 95 L 600 135 L 0 135 Z"
                  fill="url(#revRepFill)"
                />
                {/* Cost of goods dashed curve */}
                <path
                  d="M 0 115 C 70 120, 140 110, 200 95 C 280 80, 350 78, 420 82 C 500 88, 550 102, 600 115"
                  fill="none"
                  stroke="#64748b"
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
        </div>

        {/* Right: Radial Speedometer */}
        <aside className="cadra-card speedometer-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">🎯</span>
              <h3>On-time delivery</h3>
            </div>
          </div>

          <div className="speedometer-graphic-container">
            <svg viewBox="0 0 200 165" className="speedometer-svg">
              {/* Subtle background track */}
              <path
                d="M 48 130 A 66 66 0 1 1 152 130"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="15"
                strokeLinecap="round"
              />
              {/* Colored Arch Track (Olive green #4d7c0f) */}
              <path
                d="M 48 130 A 66 66 0 1 1 152 130"
                fill="none"
                stroke="#4d7c0f"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="310"
                strokeDashoffset="28"
              />

              {/* Radial Ticks */}
              <line x1="55" y1="123" x2="62" y2="117" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="42" y1="84" x2="51" y2="84" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="62" y1="46" x2="68" y2="53" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="100" y1="28" x2="100" y2="38" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="138" y1="46" x2="132" y2="53" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="158" y1="84" x2="149" y2="84" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
              <line x1="145" y1="123" x2="138" y2="117" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

              {/* Needle pointing to 91% (pointing right/slightly down from center (100, 84)) */}
              <line
                x1="100"
                y1="84"
                x2="142"
                y2="93"
                stroke="#17181a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Center Pivot Pin with outer ring */}
              <circle cx="100" cy="84" r="6.5" fill="#17181a" />
              <circle cx="100" cy="84" r="2.5" fill="#ffffff" />
            </svg>

            {/* Readout positioned safely below the center pivot in the open arch throat */}
            <div className="speedo-center-readout">
              <span className="speedo-big-pct">
                <AnimatedCounter value="91%" />
              </span>
              <span className="speedo-sub-label">November so far</span>
            </div>
          </div>

          <div className="speedo-footer-note">
            Target 92% · 12-month average 93%
          </div>
        </aside>
      </div>
    </div>
  )
}


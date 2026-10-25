import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Download,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Calendar
} from 'lucide-react'
import { paymentTransactionsData, billsToPayData } from '../../data/cadraData'
import { PaymentTransaction } from '../../types'

interface PaymentsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
  onToast: (msg: string) => void
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, onOpenCreate, onToast }) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(paymentTransactionsData)
  const [bills, setBills] = useState(billsToPayData)
  const [filterType, setFilterType] = useState<'All' | 'Money in' | 'Money out'>('All')
  const [flowView, setFlowView] = useState<'running' | 'daily'>('running')
  const [query, setQuery] = useState('')

  const handlePayBill = (billId: string, vendor: string, amt: number) => {
    setBills((prev) => prev.filter((b) => b.id !== billId))
    onToast(`Payment of $${amt.toLocaleString()} to ${vendor} scheduled!`)
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      filterType === 'All' ? true : filterType === 'Money in' ? t.type === 'in' : t.type === 'out'
    const matchesQuery =
      t.party.toLowerCase().includes(query.toLowerCase()) ||
      t.docRef.toLowerCase().includes(query.toLowerCase()) ||
      t.method.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  // Group by relativeDate
  const grouped: Record<string, PaymentTransaction[]> = {}
  filteredTransactions.forEach((t) => {
    if (!grouped[t.relativeDate]) grouped[t.relativeDate] = []
    grouped[t.relativeDate].push(t)
  })

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Facturación & Cobros</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Pagos & Honorarios Médicos</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Pagos</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/ledger')}>
              Libro Mayor
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/invoices')}>
              Facturas Tratamientos
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/pagos')}>
              Cobros & Honorarios
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/ledger')}>
              Extractos
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <CreditCard size={15} />
              <span>Registrar Pago</span>
            </button>

            <button className="cadra-btn-secondary" onClick={() => alert('Exportando registro de pagos...')}>
              <Download size={14} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Money in */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <ArrowDownLeft size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Money in · 30 days</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$96,717" duration={750} delay={100} />
          </div>
        </div>

        {/* Card 2: Money out */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <ArrowUpRight size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Money out · 30 days</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$16,366" duration={750} delay={150} />
          </div>
        </div>

        {/* Card 3: Net cash flow */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <TrendingUp size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Net cash flow</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="$80,350" duration={750} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-green">Positive</span>
          </div>
        </div>

        {/* Card 4: Cash on hand */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Building2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Cash on hand</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$221,553" duration={750} delay={250} />
          </div>
        </div>
      </div>

      {/* Row 2: Cash Flow Chart (Left) + How money moved (Right) */}
      <div className="payments-split-layout mt-4">
        {/* Cash Flow Chart */}
        <div className="cadra-card cash-flow-chart-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-secondary" />
              <h3>Cash flow</h3>
            </div>

            <div className="cadra-pill-group">
              <button
                className={`pill-switch-btn ${flowView === 'running' ? 'active' : ''}`}
                onClick={() => setFlowView('running')}
              >
                Running total
              </button>
              <button
                className={`pill-switch-btn ${flowView === 'daily' ? 'active' : ''}`}
                onClick={() => setFlowView('daily')}
              >
                Daily
              </button>
            </div>
          </div>

          <div className="cash-flow-legend">
            <span className="legend-item">
              <i className="legend-dot dot-green" /> Money in
            </span>
            <span className="legend-item">
              <i className="legend-dot dot-terracotta" /> Money out
            </span>
            <span className="text-muted text-xs">Oct 13 – Nov 11</span>
          </div>

          {/* SVG Smooth Cash Flow Curve */}
          <div className="year-chart-wrapper">
            <div className="chart-y-axis">
              <span>$200k</span>
              <span>$100k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 135" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="moneyInFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="10" x2="600" y2="10" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="67" x2="600" y2="67" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="currentColor" strokeOpacity="0.08" />

                {/* Money In Green Line */}
                <path
                  d="M 0 128 L 50 125 L 100 122 L 160 110 L 230 108 L 320 105 L 400 100 L 500 95 L 540 65 L 600 60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 128 L 50 125 L 100 122 L 160 110 L 230 108 L 320 105 L 400 100 L 500 95 L 540 65 L 600 60 L 600 135 L 0 135 Z"
                  fill="url(#moneyInFill)"
                />
                {/* Money Out Terracotta Dashed Line */}
                <path
                  d="M 0 130 L 100 126 L 200 122 L 300 120 L 400 116 L 500 114 L 600 110"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="chart-x-axis">
                <span>Oct 13</span>
                <span>Oct 16</span>
                <span>Oct 19</span>
                <span>Oct 22</span>
                <span>Oct 25</span>
                <span>Oct 28</span>
                <span>Oct 31</span>
                <span>Nov 3</span>
                <span>Nov 6</span>
                <span>Nov 11</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: How money moved */}
        <div className="cadra-card money-moved-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-secondary" />
              <h3>How money moved</h3>
            </div>
            <span className="text-xs text-muted">30 days</span>
          </div>

          <div className="money-moved-methods">
            <div className="moved-method-row">
              <div className="method-left">
                <Building2 size={16} className="text-secondary" />
                <div>
                  <strong>ACH transfer</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={6} /> payments
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$72,209" /></strong>
                <span className="text-xs text-muted">
                  <AnimatedCounter value="64%" />
                </span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '64%', backgroundColor: '#2563eb' }} />
            </div>

            <div className="moved-method-row mt-2">
              <div className="method-left">
                <CreditCard size={16} className="text-secondary" />
                <div>
                  <strong>Card</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={12} /> payments
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$24,650" /></strong>
                <span className="text-xs text-muted">
                  <AnimatedCounter value="22%" />
                </span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '22%', backgroundColor: '#b45309' }} />
            </div>

            <div className="moved-method-row mt-2">
              <div className="method-left">
                <CreditCard size={16} className="text-secondary" />
                <div>
                  <strong>Wire</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={1} /> payment
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$14,600" /></strong>
                <span className="text-xs text-muted">
                  <AnimatedCounter value="14%" />
                </span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '14%', backgroundColor: '#2563eb' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Payments Transactions List (Left) + Bills to pay (Right) */}
      <div className="payments-split-layout mt-4">
        {/* Left: Payments List */}
        <div className="cadra-card transactions-card">
          <div className="table-header-toolbar">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📋</span>
              <h3>Payments</h3>
            </div>

            <div className="cadra-pill-group">
              {(['All', 'Money in', 'Money out'] as const).map((t) => (
                <button
                  key={t}
                  className={`pill-switch-btn ${filterType === t ? 'active' : ''}`}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pos-search-input-box mb-3">
            <Search size={14} className="text-secondary" />
            <input
              type="text"
              placeholder="Party, memo, method or document"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Grouped Day Lists */}
          <div className="transactions-grouped-stack">
            {Object.keys(grouped).map((groupTitle) => (
              <div key={groupTitle} className="trans-group-block">
                <div className="trans-group-header">
                  <span>{groupTitle}</span>
                </div>

                <div className="trans-items-list">
                  {grouped[groupTitle].map((t) => (
                    <div key={t.id} className="trans-row-item">
                      <div className="trans-icon-indicator in">
                        <ArrowDownLeft size={14} />
                      </div>

                      <span className="customer-initials-circle">{t.initials}</span>

                      <div className="trans-party-details">
                        <strong>{t.party}</strong>
                        <div className="text-xs text-muted">{t.docRef}</div>
                      </div>

                      <div className="trans-method-box">
                        <span className="text-xs text-secondary">
                          {t.method === 'ACH transfer' ? '🏛️ ' : '💳 '}
                          {t.method}
                        </span>
                      </div>

                      <div className="trans-doc-box">
                        <span className="text-xs text-blue-600 underline cursor-pointer">
                          {t.docRef.startsWith('INV') ? t.docRef : '—'}
                        </span>
                      </div>

                      <div className="trans-amount-box">
                        <span className="font-semibold text-emerald-700">
                          +${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bills to pay */}
        <aside className="cadra-card bills-to-pay-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">🛒</span>
              <h3>Bills to pay</h3>
            </div>
            <strong>
              <AnimatedCounter value="$33,380" />
            </strong>
          </div>
          <div className="text-xs text-muted mb-3">
            <AnimatedCounter value={bills.length} /> open · due over next 29 days
          </div>

          <div className="bills-to-pay-list">
            {bills.map((b) => (
              <div key={b.id} className="bill-row-item">
                <span className="customer-initials-circle">{b.initials}</span>
                <div className="bill-info">
                  <span className="bill-vendor-name">{b.vendor}</span>
                  <span className="bill-ref-desc">{b.desc}</span>
                  <span className="text-xs text-secondary mt-1">{b.due}</span>
                </div>
                <div className="bill-amount-actions">
                  <span className="bill-amount-text">${b.amount.toLocaleString()}</span>
                  <button
                    className="bill-pay-btn"
                    onClick={() => handlePayBill(b.id, b.vendor, b.amount)}
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}


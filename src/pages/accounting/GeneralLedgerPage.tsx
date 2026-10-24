import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Download,
  Plus,
  Building2,
  FileText,
  CreditCard,
  CheckCircle2,
  Search,
  ChevronDown
} from 'lucide-react'
import { ledgerEntriesData } from '../../data/cadraData'
import { LedgerEntry } from '../../types'

interface GeneralLedgerPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const GeneralLedgerPage: React.FC<GeneralLedgerPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [entries] = useState<LedgerEntry[]>(ledgerEntriesData)
  const [sourceFilter, setSourceFilter] = useState('All')
  const [query, setQuery] = useState('')

  const sources = [
    { label: 'All', count: 37 },
    { label: 'Sales', count: 9 },
    { label: 'Bank', count: 20 },
    { label: 'Purchases', count: 5 },
    { label: 'Payroll', count: 1 },
    { label: 'Manual', count: 2 },
  ]

  const filtered = entries.filter((e) => {
    const matchesSource = sourceFilter === 'All' ? true : e.source === sourceFilter
    const matchesQuery =
      e.entry.toLowerCase().includes(query.toLowerCase()) ||
      e.ref.toLowerCase().includes(query.toLowerCase())
    return matchesSource && matchesQuery
  })

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span>Accounting</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">General ledger</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">General ledger</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/accounting/ledger')}>
              General ledger
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/invoices')}>
              Invoices
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/payments')}>
              Payments
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/ledger')}>
              Statements
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            <button className="cadra-btn-secondary" onClick={() => alert('Exporting journal to CSV...')}>
              <Download size={14} />
              <span>Export journal</span>
            </button>

            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <Plus size={15} />
              <span>New journal entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <Building2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Cash — operating</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$221,553" duration={750} delay={100} />
          </div>
        </div>

        {/* Card 2: Accounts receivable */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <FileText size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Accounts receivable</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$105,069" duration={750} delay={150} />
          </div>
        </div>

        {/* Card 3: Accounts payable */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CreditCard size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Accounts payable</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$71,830" duration={750} delay={200} />
          </div>
        </div>

        {/* Card 4: Entries in November */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <FileText size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Entries in November</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="23" duration={650} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-green">Books balance</span>
          </div>
        </div>
      </div>

      {/* Split: Chart of accounts (Left) vs Journal (Right) */}
      <div className="ledger-split-layout mt-4">
        {/* Left: Chart of accounts */}
        <div className="cadra-card chart-accounts-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📚</span>
              <h3>Chart of accounts</h3>
            </div>
          </div>

          <div className="accounts-group-header">
            <span className="flex items-center gap-2">
              <i className="legend-dot dot-green" />
              <strong>ASSETS</strong>
            </span>
            <strong>
              <AnimatedCounter value="$743,421" />
            </strong>
          </div>

          <div className="accounts-list">
            {[
              { code: '1000', name: 'Cash — operating', val: '$221,553', barPct: 65 },
              { code: '1100', name: 'Accounts receivable', val: '$105,069', barPct: 35 },
              { code: '1200', name: 'Inventory — materials', val: '$84,830' },
              { code: '1210', name: 'Inventory — finished goods', val: '$97,930' },
              { code: '1500', name: 'Shop equipment', val: '$234,040' },
            ].map((acc) => (
              <div key={acc.code} className="account-item-row">
                <span className="acc-code">{acc.code}</span>
                <div className="acc-name-wrap">
                  <span className="acc-name">{acc.name}</span>
                  {acc.barPct ? (
                    <div className="acc-weight-bar" style={{ width: `${acc.barPct}%` }} />
                  ) : null}
                </div>
                <span className="acc-val">
                  <AnimatedCounter value={acc.val} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Journal entries */}
        <div className="cadra-card journal-entries-card">
          <div className="table-header-toolbar">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-secondary" />
              <h3>Journal</h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">Newest first</span>
              <div className="pos-search-input-box" style={{ width: '220px' }}>
                <Search size={14} className="text-secondary" />
                <input
                  type="text"
                  placeholder="Memo or JE number"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="table-filter-pills-bar">
            {sources.map((s) => (
              <button
                key={s.label}
                className={`filter-pill-item ${sourceFilter === s.label ? 'active' : ''}`}
                onClick={() => setSourceFilter(s.label)}
              >
                <span>{s.label}</span>
                <span className="filter-count-badge">{s.count}</span>
              </button>
            ))}
          </div>

          {/* Journal Table */}
          <div className="cadra-table-responsive">
            <table className="cadra-data-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>DATE</th>
                  <th style={{ width: '45%' }}>ENTRY</th>
                  <th style={{ width: '20%' }}>SOURCE</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="table-row-hoverable">
                    <td>
                      <div>
                        <strong>{entry.date}</strong>
                        <div className="text-xs text-muted">{entry.relativeDate}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong className="text-main">{entry.entry}</strong>
                        <div className="text-xs text-secondary">{entry.ref}</div>
                      </div>
                    </td>
                    <td>
                      <span className="cadra-kind-pill">{entry.source}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-semibold text-main">
                        {entry.isDebit ? '-' : '+'}
                        ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
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


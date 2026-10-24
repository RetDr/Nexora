import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  FileText,
  AlertTriangle,
  CreditCard,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { invoicesData } from '../../data/cadraData'
import { InvoiceItem } from '../../types'

interface InvoicesPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [invoices] = useState<InvoiceItem[]>(invoicesData)

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span>Accounting</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Invoices</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Invoices</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/ledger')}>
              General ledger
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/accounting/invoices')}>
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
            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <CreditCard size={15} />
              <span>Record payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Outstanding */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <FileText size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Outstanding</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$43,229" duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={5} /> open
          </span>
        </div>

        {/* Card 2: Overdue */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <AlertTriangle size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Overdue</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$5,854" duration={750} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={1} /> invoice
          </span>
        </div>

        {/* Card 3: Collected · 30 days */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CreditCard size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Collected · 30 days</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$73,353" duration={750} delay={200} />
          </div>
        </div>

        {/* Card 4: Drafts to send */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Send size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Drafts to send</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="1" duration={600} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-neutral">Waiting</span>
          </div>
        </div>
      </div>

      {/* Split: Aging Receivables (Left) vs Who owes the most (Right) */}
      <div className="invoices-split-layout mt-4">
        {/* Left: Aging */}
        <div className="cadra-card aging-receivables-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">⌛</span>
              <h3>Aging</h3>
            </div>
            <span className="text-xs text-muted">As of Nov 11, 2026</span>
          </div>

          <div className="aging-overview-box">
            <span className="text-xs text-muted font-semibold">Receivables by age</span>
            <div className="aging-total-row">
              <span className="aging-big-total">
                <AnimatedCounter value="$43,229" />
              </span>
              <span className="aging-alert-pill">
                ⚠️ INV-24179 · Copper Canyon Cycles is 18 days late
              </span>
            </div>

            {/* Segmented Aging Bar */}
            <div className="aging-segmented-track">
              <div className="seg-fill seg-aging-current" style={{ width: '86%' }} title="Not yet due: $37,375 (86%)" />
              <div className="seg-fill seg-aging-late" style={{ width: '14%' }} title="1-30 days late: $5,854 (14%)" />
            </div>

            {/* Aging Bracket Mini Cards */}
            <div className="aging-bracket-grid">
              <div className="bracket-card">
                <span className="bracket-label">
                  <i className="legend-dot dot-green" /> Not yet due
                </span>
                <span className="bracket-amount">
                  <AnimatedCounter value="$37,375" />
                </span>
                <span className="bracket-sub">
                  <AnimatedCounter value={4} /> invoices · <AnimatedCounter value="86%" />
                </span>
              </div>

              <div className="bracket-card highlight-late">
                <span className="bracket-label">
                  <i className="legend-dot dot-terracotta" /> 1–30 days late
                </span>
                <span className="bracket-amount text-danger">
                  <AnimatedCounter value="$5,854" />
                </span>
                <span className="bracket-sub">
                  <AnimatedCounter value={1} /> invoice · <AnimatedCounter value="14%" />
                </span>
              </div>

              <div className="bracket-card">
                <span className="bracket-label">
                  <i className="legend-dot dot-gray" /> 31–60 days late
                </span>
                <span className="bracket-amount">$0</span>
                <span className="bracket-sub">0 invoices · 0%</span>
              </div>

              <div className="bracket-card">
                <span className="bracket-label">
                  <i className="legend-dot dot-gray" /> 60+ days late
                </span>
                <span className="bracket-amount">$0</span>
                <span className="bracket-sub">0 invoices · 0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Who owes the most */}
        <aside className="cadra-card debtors-side-card">
          <div className="side-card-title-row">
            <span className="text-xs font-bold text-muted tracking-wider">WHO OWES THE MOST</span>
          </div>

          <div className="debtors-list">
            {[
              { num: 1, name: 'Harbor & Hill Bikes', loc: 'San Diego, CA · net 30', amt: '$14,364', initials: 'H&' },
              { num: 2, name: 'Saltmarsh Bicycle Co.', loc: 'Charleston, SC · net 30', amt: '$10,146', initials: 'SB' },
              { num: 3, name: 'Two Rivers Cycle', loc: 'Pittsburgh, PA · net 30', amt: '$7,620', initials: 'TR' },
              { num: 4, name: 'Copper Canyon Cycles', loc: 'Tucson, AZ · net 30', amt: '$5,854', initials: 'CC', isLate: true },
            ].map((d) => (
              <div key={d.num} className="debtor-row-item">
                <span className="debtor-index">{d.num}</span>
                <span className="customer-initials-circle">{d.initials}</span>
                <div className="debtor-info">
                  <span className="debtor-name">{d.name}</span>
                  <span className="debtor-loc">{d.loc}</span>
                </div>
                <span className={`debtor-amount ${d.isLate ? 'text-danger font-bold' : ''}`}>{d.amt}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}


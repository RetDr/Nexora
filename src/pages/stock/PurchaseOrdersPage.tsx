import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Boxes,
  Truck,
  Plus,
  RefreshCw,
  ShoppingBag,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt
} from 'lucide-react'
import { purchaseOrdersData } from '../../data/cadraData'
import { PurchaseOrderItem } from '../../types'

interface PurchaseOrdersPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const PurchaseOrdersPage: React.FC<PurchaseOrdersPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [orders] = useState<PurchaseOrderItem[]>(purchaseOrdersData)
  const [activeTab, setActiveTab] = useState('Purchase orders')
  const [statusFilter, setStatusFilter] = useState('All')

  const filterTabs = [
    { label: 'All', count: 10 },
    { label: 'Draft', count: 2 },
    { label: 'Sent', count: 2 },
    { label: 'Confirmed', count: 2 },
    { label: 'Received', count: 2 },
    { label: 'Billed', count: 2 },
  ]

  const filtered = orders.filter((o) => {
    if (statusFilter === 'All') return true
    return o.status === statusFilter
  })

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Compras & Depósitos</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Pedidos a Proveedores</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Pedidos Insumos</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill" onClick={() => onNavigate('/stock')}>
              <span>Materiales</span>
              <span className="cadra-badge badge-orange">1</span>
            </button>
            <button className="submodule-pill active" onClick={() => onNavigate('/purchasing/orders')}>
              <Boxes size={13} />
              <span>Pedidos Depósito</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/logistics/shipments')}>
              <Truck size={13} />
              <span>Laboratorio Dental</span>
            </button>
          </div>
        </div>

        <div className="cadra-header-actions">
          <div className="cadra-sub-tabs">
            {['Purchase orders', 'Vendors', 'Requests for quote'].map((t) => (
              <button
                key={t}
                className={`cadra-sub-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="cadra-btn-secondary" onClick={() => alert('Analyzing reorder thresholds...')}>
            <RefreshCw size={13} />
            <span>Reorder low stock</span>
          </button>

          <button className="cadra-btn-primary" onClick={onOpenCreate}>
            <Plus size={15} />
            <span>New purchase order</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <ShoppingBag size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Open spend</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$20,310" duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={6} /> open POs
          </span>
        </div>

        {/* Card 2: Soft Blue Card */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Truck size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Arriving this week</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="2" duration={600} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={190} /> units
          </span>
        </div>

        {/* Card 3: Late */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <AlertTriangle size={16} className="kpi-icon-warning" />
            <span className="kpi-label">Late</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="0" duration={500} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-green">All on time</span>
          </div>
        </div>

        {/* Card 4: Received, not billed */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Receipt size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Received, not billed</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="2" duration={600} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-neutral">
              <AnimatedCounter value="$12,240" />
            </span>
          </div>
        </div>
      </div>

      {/* Split: PO Table (Left) + Where the money is (Right) */}
      <div className="po-split-layout mt-4">
        {/* Left: Table Card */}
        <div className="cadra-card po-table-card">
          <div className="table-header-toolbar">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-secondary" />
              <h3>Purchase orders</h3>
            </div>
            <button className="icon-btn-plain" onClick={() => alert('Download PO summary')}>
              <Download size={14} />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="table-filter-pills-bar">
            {filterTabs.map((f) => (
              <button
                key={f.label}
                className={`filter-pill-item ${statusFilter === f.label ? 'active' : ''}`}
                onClick={() => setStatusFilter(f.label)}
              >
                <span>{f.label}</span>
                <span className="filter-count-badge">{f.count}</span>
              </button>
            ))}
          </div>

          <div className="cadra-table-responsive">
            <table className="cadra-data-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>ORDER</th>
                  <th style={{ width: '25%' }}>VENDOR</th>
                  <th style={{ width: '22%' }}>STATUS</th>
                  <th style={{ width: '13%' }}>DUE</th>
                  <th style={{ width: '10%' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((po) => (
                  <tr key={po.id} className="table-row-hoverable">
                    {/* Order */}
                    <td>
                      <div className="po-order-col">
                        <span className="font-semibold text-main">{po.code}</span>
                        <span className="order-title-sub">{po.title}</span>
                      </div>
                    </td>

                    {/* Vendor */}
                    <td>
                      <div className="customer-cell-block">
                        <span className="customer-initials-circle">{po.vendorInitials}</span>
                        <div>
                          <span className="customer-name-text">{po.vendor}</span>
                          <span className="order-title-sub">{po.vendorCategory}</span>
                        </div>
                      </div>
                    </td>

                    {/* Stepper Status Pill with 5 dots */}
                    <td>
                      <div className="po-status-stepper-box">
                        <span className="po-status-chip">
                          ● {po.status}
                        </span>
                        {/* 5-dot sequence track */}
                        <div className="po-5-dots-track">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <span
                              key={step}
                              className={`po-dot-node ${step <= po.statusStep ? 'dot-completed' : 'dot-future'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Due */}
                    <td>
                      <div className="finishes-cell-block">
                        <span className="finishes-date-bold">{po.due}</span>
                        {po.isPlanned && <span className="text-muted text-xs">planned</span>}
                      </div>
                    </td>

                    {/* Total */}
                    <td>
                      <span className="font-semibold text-main">
                        ${po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Where the money is */}
        <aside className="cadra-card po-summary-side-card">
          <div className="side-card-title-row">
            <Boxes size={16} className="text-secondary" />
            <h3>Where the money is</h3>
          </div>

          <div className="money-status-breakdown-list">
            {[
              { status: 'Draft', count: '2 POs', amount: '$2,850', pct: 15, color: '#94a3b8' },
              { status: 'Sent', count: '2 POs', amount: '$10,620', pct: 52, color: '#2563eb' },
              { status: 'Confirmed', count: '2 POs', amount: '$6,840', pct: 33, color: '#3b82f6' },
              { status: 'Received', count: '2 POs', amount: '$4,120', pct: 20, color: '#10b981' },
            ].map((m, idx) => (
              <div key={idx} className="money-breakdown-row">
                <div className="money-row-head">
                  <span className="po-breakdown-label">
                    <span className="status-chip-dot" style={{ backgroundColor: m.color }} />
                    <strong>{m.status}</strong>
                    <small className="text-muted">{m.count}</small>
                  </span>
                  <span className="money-row-val">{m.amount}</span>
                </div>
                <div className="money-bar-bg">
                  <div className="money-bar-fill" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}


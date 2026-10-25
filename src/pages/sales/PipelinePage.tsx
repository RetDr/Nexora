import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Download,
  Plus,
  Layers,
  Clock,
  Factory,
  Truck,
  MoreHorizontal,
  Calendar,
  Sparkles,
  ShoppingBag,
  Users
} from 'lucide-react'
import { salesDealsData } from '../../data/cadraData'
import { SaleDeal } from '../../types'

interface PipelinePageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const PipelinePage: React.FC<PipelinePageProps> = ({ onNavigate, onOpenCreate }) => {
  const [deals, setDeals] = useState<SaleDeal[]>(salesDealsData)
  const [ownerFilter, setOwnerFilter] = useState('Everyone')
  const [activeTab, setActiveTab] = useState('Pipeline')

  const filteredDeals = deals.filter((d) => {
    if (ownerFilter === 'Everyone') return true
    if (ownerFilter === 'Mine') return d.owner === 'Omar' // Current user context
    return d.owner === ownerFilter
  })

  const columns = [
    { key: 'quote', title: 'Valoración', count: 1, val: '$3.200.000', dotColor: '#94a3b8' },
    { key: 'confirmed', title: 'Aprobado', count: 2, val: '$7.500.000', dotColor: '#3b82f6' },
    { key: 'production', title: 'En tratamiento', count: 1, val: '$1.800.000', dotColor: '#A94384' },
    { key: 'ready', title: 'Finalizado', count: 1, val: '$850.000', dotColor: '#10b981' },
    { key: 'shipped', title: 'Alta clínica', count: 1, val: '$1.000.000', dotColor: '#059669' },
  ] as const

  const moveDeal = (dealId: string, nextStage: SaleDeal['stage']) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
    )
  }

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Tratamientos</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Presupuestos</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Presupuestos</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill active" onClick={() => onNavigate('/presupuestos')}>
              <span>Presupuestos</span>
              <span className="cadra-badge badge-orange">6</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/precios')}>
              <ShoppingBag size={13} />
              <span>Precios & Caja</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/pacientes')}>
              <Users size={13} />
              <span>Pacientes</span>
            </button>
          </div>
        </div>

        <div className="cadra-header-actions">
          {/* Secondary sub-tabs */}
          <div className="cadra-sub-tabs">
            {['Pipeline', 'Planes de Tratamiento', 'Valoraciones', 'Pacientes'].map((t) => (
              <button
                key={t}
                className={`cadra-sub-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="cadra-btn-secondary" onClick={() => alert('Exportando presupuestos...')}>
            <Download size={14} />
            <span>Exportar</span>
          </button>

          <button className="cadra-btn-primary" onClick={onOpenCreate}>
            <Plus size={15} />
            <span>Nuevo Presupuesto</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <Layers size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Open pipeline</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$167,164" duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={13} /> orders
          </span>
        </div>

        {/* Card 2: Soft Blue Card */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Clock size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Out on quote</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$35,805" duration={750} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={4} /> waiting
          </span>
        </div>

        {/* Card 3: In Production */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Factory size={16} className="kpi-icon-dim" />
            <span className="kpi-label">On the floor</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$108,676" duration={750} delay={200} />
          </div>
          <span className="kpi-sub-pill-tag tag-pink">
            <AnimatedCounter value={1} /> behind plan
          </span>
        </div>

        {/* Card 4: Ship within 7 days */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Truck size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Ship within 7 days</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="1" duration={600} delay={250} />
            </span>
            <span className="kpi-unit-label">order</span>
          </div>
          <span className="kpi-sub-pill-tag tag-green">none late</span>
        </div>
      </div>

      {/* Kanban Order Board */}
      <div className="cadra-card kanban-board-card mt-4">
        <div className="kanban-header-bar">
          <div className="kanban-board-title">
            <Layers size={16} className="text-secondary" />
            <span>Order board</span>
          </div>

          <div className="kanban-filter-cluster">
            <span className="kanban-drag-hint">Drag a card to move it — long-press on touch</span>
            <div className="cadra-pill-group">
              {['Everyone', 'Omar', 'Elif', 'Mine'].map((person) => (
                <button
                  key={person}
                  className={`pill-switch-btn ${ownerFilter === person ? 'active' : ''}`}
                  onClick={() => setOwnerFilter(person)}
                >
                  {person}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column Stage Bars */}
        <div className="kanban-columns-grid">
          {columns.map((col) => {
            const colDeals = filteredDeals.filter((d) => d.stage === col.key)
            return (
              <div key={col.key} className="kanban-stage-col">
                {/* Column Head */}
                <div className="kanban-col-head">
                  <div className="col-title-badge">
                    <span className="stage-dot" style={{ backgroundColor: col.dotColor }} />
                    <span className="col-name">{col.title}</span>
                    <span className="col-count-pill">
                      <AnimatedCounter value={colDeals.length} />
                    </span>
                  </div>
                  <span className="col-value-text">
                    <AnimatedCounter value={col.val} />
                  </span>
                </div>

                {/* Cards Container */}
                <div className="kanban-cards-stack">
                  {colDeals.map((deal) => (
                    <div key={deal.id} className="kanban-card">
                      <div className="k-card-top">
                        <div className="k-card-customer">
                          <span className="customer-initials-circle">{deal.customerInitials}</span>
                          <div>
                            <span className="k-customer-name">{deal.customer}</span>
                            <span className="k-so-code">{deal.code}</span>
                          </div>
                        </div>
                        <button className="icon-more-btn" title="Options">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      <div className="k-card-details">{deal.details}</div>

                      {deal.extraBadge && (
                        <div className="k-card-extra-badge">
                          {deal.extraBadge.includes('No work order') ? '📋 ' : '🚚 '}
                          {deal.extraBadge}
                        </div>
                      )}

                      {deal.progress !== undefined && (
                        <div className="k-card-progress-box">
                          <span className="k-progress-wo">{deal.workOrder}</span>
                          <div className="k-progress-bar">
                            <div className="k-progress-fill" style={{ width: `${deal.progress}%` }} />
                          </div>
                          <span className="k-progress-pct">{deal.progress}%</span>
                        </div>
                      )}

                      {deal.daysLeft && (
                        <div className="k-card-timer-row">
                          <Clock size={12} className="text-secondary" />
                          <span>{deal.daysLeft}</span>
                        </div>
                      )}

                      <div className="k-card-footer">
                        <span className="k-card-value">
                          <AnimatedCounter value={`$${deal.value.toLocaleString()}`} />
                        </span>
                        <div className="k-card-owner-meta">
                          {deal.date && (
                            <span className="k-date-badge">
                              <Calendar size={11} className="inline mr-1" />
                              {deal.date}
                            </span>
                          )}
                          <span className="k-owner-pill">{deal.owner === 'Omar' ? 'OF' : 'ED'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


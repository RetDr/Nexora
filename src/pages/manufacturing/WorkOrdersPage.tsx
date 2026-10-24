import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Download,
  Plus,
  Factory,
  Calendar,
  AlertTriangle,
  Bike,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'
import { workOrdersData } from '../../data/cadraData'
import { WorkOrderItem } from '../../types'

interface WorkOrdersPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const WorkOrdersPage: React.FC<WorkOrdersPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [filter, setFilter] = useState<string>('All')

  const filteredOrders = workOrdersData.filter((wo) => {
    if (filter === 'All') return true
    return wo.status === filter
  })

  const counts = {
    All: workOrdersData.length,
    'In progress': workOrdersData.filter((w) => w.status === 'In progress').length,
    Released: workOrdersData.filter((w) => w.status === 'Released').length,
    Planned: workOrdersData.filter((w) => w.status === 'Planned').length,
    'On hold': workOrdersData.filter((w) => w.status === 'On hold').length,
    'Behind plan': workOrdersData.filter((w) => w.status === 'Behind plan').length,
    Done: workOrdersData.filter((w) => w.status === 'Done').length,
  }

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span>Manufacturing</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Work orders</span>
      </div>

      {/* Header — Proportioned Like Real.png */}
      <div className="cadra-page-header">
        <div className="page-header-left-col">
          <h1 className="cadra-page-title">Work orders</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/manufacturing/scheduling')}>
              Scheduling
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/manufacturing/orders')}>
              Work orders
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill time="12:02 PM" onNavigate={onNavigate} />

          <div className="page-header-actions-row">
            <button className="cadra-btn-secondary" onClick={() => alert('Exporting work orders...')}>
              <Download size={14} />
              <span>Export</span>
            </button>

            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <Plus size={15} />
              <span>New work order</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Dark Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <Factory size={16} className="kpi-icon-dim" />
            <span className="kpi-label">In production</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="5" duration={650} delay={100} />
          </div>
        </div>

        {/* Card 2: Soft Blue Pastel Card */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Calendar size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Finishing this week</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="4" duration={650} delay={150} />
          </div>
        </div>

        {/* Card 3: Alert Card */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <AlertTriangle size={16} className="kpi-icon-warning" />
            <span className="kpi-label">Behind plan</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="1" duration={600} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-pink">needs a look</span>
          </div>
        </div>

        {/* Card 4: Bikes built */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Bike size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Bikes built in November</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="49" duration={700} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-neutral">
              <AnimatedCounter value={86} /> in October
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="cadra-card cadra-table-card">
        {/* Filter Pills */}
        <div className="table-filter-pills-bar">
          {(['All', 'In progress', 'Released', 'Planned', 'On hold', 'Behind plan', 'Done'] as const).map((key) => (
            <button
              key={key}
              className={`filter-pill-item ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span>{key}</span>
              <span className="filter-count-badge">
                <AnimatedCounter value={counts[key]} />
              </span>
            </button>
          ))}
        </div>

        {/* High-density Data Table */}
        <div className="cadra-table-responsive">
          <table className="cadra-data-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>ORDER</th>
                <th style={{ width: '22%' }}>CUSTOMER</th>
                <th style={{ width: '24%' }}>ROUTE</th>
                <th style={{ width: '12%' }}>PROGRESS</th>
                <th style={{ width: '14%' }}>FINISHES</th>
                <th style={{ width: '14%' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((wo) => (
                <tr key={wo.id} className="table-row-hoverable">
                  {/* Order */}
                  <td>
                    <div className="order-cell-block">
                      <div className="order-item-icon-circle">
                        <Bike size={15} />
                      </div>
                      <div className="order-item-details">
                        <div className="order-code-badge-line">
                          <span className="order-code-text">{wo.code}</span>
                          {wo.rush && <span className="rush-label-badge">RUSH</span>}
                        </div>
                        <span className="order-title-sub">{wo.title}</span>
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="customer-cell-block">
                      <span className="customer-initials-circle">{wo.customerInitials}</span>
                      <span className="customer-name-text">{wo.customer}</span>
                    </div>
                  </td>

                  {/* Route Stepper Dots */}
                  <td>
                    <div className="route-stepper-container">
                      {wo.route.map((step, idx) => (
                        <div key={idx} className="route-step-node">
                          {idx > 0 && <span className="route-step-connector-line" />}
                          <div className="step-dot-wrapper">
                            <span
                              className={`route-dot ${
                                step.status === 'done'
                                  ? 'dot-done'
                                  : step.status === 'active'
                                  ? 'dot-active'
                                  : 'dot-pending'
                              }`}
                            />
                            <span className="route-step-label">{step.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td>
                    <div className="progress-cell-flex">
                      <div className="table-progress-bar-bg">
                        <div
                          className="table-progress-bar-fill"
                          style={{
                            width: `${wo.progress}%`,
                            backgroundColor: wo.status === 'Behind plan' ? '#ef4444' : '#295282',
                          }}
                        />
                      </div>
                      <span className="table-pct-text">{wo.progress}%</span>
                    </div>
                  </td>

                  {/* Finishes */}
                  <td>
                    <div className="finishes-cell-block">
                      <span className="finishes-date-bold">{wo.finishes}</span>
                      <span
                        className={`finishes-sub-days ${
                          wo.finishesDays === 'behind' ? 'text-danger' : 'text-muted'
                        }`}
                      >
                        {wo.finishesDays}
                      </span>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td>
                    <span
                      className={`status-chip ${
                        wo.status === 'In progress'
                          ? 'chip-inprogress'
                          : wo.status === 'Done'
                          ? 'chip-done'
                          : wo.status === 'Behind plan'
                          ? 'chip-behind'
                          : 'chip-neutral'
                      }`}
                    >
                      <span className="status-chip-dot" />
                      <span>{wo.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


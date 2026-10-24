import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Boxes,
  Truck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Search,
  Download,
  MapPin,
  Route
} from 'lucide-react'
import { shipmentsData } from '../../data/cadraData'
import { ShipmentItem } from '../../types'

interface ShipmentsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const ShipmentsPage: React.FC<ShipmentsPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [shipments] = useState<ShipmentItem[]>(shipmentsData)
  const [activeTab, setActiveTab] = useState('Shipments')
  const [statusFilter, setStatusFilter] = useState('All')
  const [query, setQuery] = useState('')

  const filters = [
    { label: 'All', count: 7 },
    { label: 'Active', count: 5 },
    { label: 'Exceptions', count: 1 },
    { label: 'Delivered', count: 2 },
  ]

  const filtered = shipments.filter((s) => {
    const matchesFilter =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Active'
        ? s.status !== 'Delivered'
        : statusFilter === 'Exceptions'
        ? s.isException
        : s.status === 'Delivered'

    const matchesQuery =
      s.code.toLowerCase().includes(query.toLowerCase()) ||
      s.customer.toLowerCase().includes(query.toLowerCase()) ||
      s.carrier.toLowerCase().includes(query.toLowerCase()) ||
      s.tracking.toLowerCase().includes(query.toLowerCase())

    return matchesFilter && matchesQuery
  })

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span>Logistics</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Shipments</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Shipments</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill" onClick={() => onNavigate('/inventory/stock')}>
              <span>Inventory</span>
              <span className="cadra-badge badge-orange">6</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/purchasing/orders')}>
              <Boxes size={13} />
              <span>Purchasing</span>
            </button>
            <button className="submodule-pill active" onClick={() => onNavigate('/logistics/shipments')}>
              <Truck size={13} />
              <span>Logistics</span>
            </button>
          </div>
        </div>

        <div className="cadra-header-actions">
          <div className="cadra-sub-tabs">
            {['Shipments', 'Delivery routes'].map((t) => (
              <button
                key={t}
                className={`cadra-sub-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="cadra-btn-secondary" onClick={() => alert('Viewing customs hold documentation...')}>
            <AlertTriangle size={14} className="text-warning-red" />
            <span>Customs hold</span>
          </button>

          <button className="cadra-btn-primary" onClick={() => alert("Loading today's van route...")}>
            <Route size={15} />
            <span>Today's van route</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <Truck size={16} className="kpi-icon-dim" />
            <span className="kpi-label">On the road</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="2" duration={600} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={10} /> parcels
          </span>
        </div>

        {/* Card 2: Soft Blue Card */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Calendar size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Arriving this week</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="5" duration={650} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={1} /> today
          </span>
        </div>

        {/* Card 3: Exceptions */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <AlertTriangle size={16} className="kpi-icon-warning" />
            <span className="kpi-label">Exceptions</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="1" duration={600} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-pink">SHP-7711</span>
          </div>
        </div>

        {/* Card 4: Delivered, 30 days */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CheckCircle2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Delivered, 30 days</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="2" duration={600} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-green">
              <AnimatedCounter value="91%" /> on time
            </span>
          </div>
        </div>
      </div>

      {/* Split: Shipments Table (Left) + On the road tracking (Right) */}
      <div className="shipments-split-layout mt-4">
        {/* Left: Shipments List Card */}
        <div className="cadra-card shipments-table-card">
          <div className="table-header-toolbar">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-secondary" />
              <h3>Shipments</h3>
            </div>

            <div className="pos-search-input-box">
              <Search size={14} className="text-secondary" />
              <input
                type="text"
                placeholder="Number, customer, tracking..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="table-filter-pills-bar">
            {filters.map((f) => (
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

          <div className="shipments-list-stack">
            {filtered.map((shp) => (
              <div
                key={shp.id}
                className={`shipment-item-card ${shp.isException ? 'shipment-exception-highlight' : ''}`}
              >
                <div className="shipment-card-left">
                  <div className={`shipment-icon-box ${shp.isException ? 'icon-danger-bg' : ''}`}>
                    {shp.isException ? <AlertTriangle size={17} className="text-danger" /> : <Truck size={17} />}
                  </div>
                  <div className="shipment-code-cust">
                    <div className="flex items-center gap-2">
                      <span className="shipment-code">{shp.code}</span>
                      <strong className="shipment-customer">{shp.customer}</strong>
                    </div>
                    <span className="shipment-carrier-track">
                      {shp.carrier} · {shp.tracking}
                    </span>
                  </div>
                </div>

                <div className="shipment-card-mid">
                  <span
                    className={`status-chip ${
                      shp.isException
                        ? 'chip-danger'
                        : shp.status === 'Out for delivery'
                        ? 'chip-blue'
                        : shp.status === 'Delivered'
                        ? 'chip-done'
                        : 'chip-inprogress'
                    }`}
                  >
                    ● {shp.status}
                  </span>
                  {/* Stepper bar */}
                  <div className="shipment-dash-bar">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <span
                        key={step}
                        className={`dash-seg ${
                          step <= shp.statusStep
                            ? shp.isException && step === shp.statusStep
                              ? 'seg-danger'
                              : 'seg-active'
                            : 'seg-empty'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="shipment-card-eta">
                  <span className="eta-date-bold">{shp.eta}</span>
                  <span className={`eta-note ${shp.isException ? 'text-danger' : 'text-muted'}`}>
                    {shp.etaNote}
                  </span>
                </div>

                <div className="shipment-card-parcels">
                  <span className="parcel-count-bold">{shp.parcels} parcels</span>
                  <span className="parcel-dest-sub">
                    {shp.weight} · {shp.destination}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: On the road tracking */}
        <aside className="cadra-card on-road-side-card">
          <div className="side-card-title-row">
            <div className="flex items-center gap-2">
              <Route size={16} className="text-secondary" />
              <h3>On the road</h3>
            </div>
            <span className="text-xs text-muted">Portland → door</span>
          </div>

          <div className="on-road-live-stack">
            {/* SHP-7714 */}
            <div className="on-road-tracker-item">
              <div className="tracker-top">
                <strong>SHP-7714 PDX → Seattle</strong>
                <span className="tracker-time-badge tag-green">Today</span>
              </div>
              <div className="tracker-route-line">
                <div className="tracker-fill-line" style={{ width: '85%', backgroundColor: '#2563eb' }} />
                <span className="tracker-live-pin" style={{ left: '85%' }} />
              </div>
              <p className="tracker-location-text">Centralia, WA · Passed Centralia</p>
            </div>

            {/* SHP-7711 */}
            <div className="on-road-tracker-item">
              <div className="tracker-top">
                <strong>SHP-7711 PDX → Toronto</strong>
                <span className="tracker-time-badge tag-pink">Held</span>
              </div>
              <div className="tracker-route-line">
                <div className="tracker-fill-line" style={{ width: '65%', backgroundColor: '#ef4444' }} />
                <span className="tracker-live-pin pin-danger" style={{ left: '65%' }} />
              </div>
              <p className="tracker-location-text text-danger">
                Blaine, WA · Held at customs — commercial invoice missing tariff code
              </p>
            </div>

            {/* SHP-7712 */}
            <div className="on-road-tracker-item">
              <div className="tracker-top">
                <strong>SHP-7712 PDX → Charleston</strong>
                <span className="tracker-time-badge tag-neutral">in 2 days</span>
              </div>
              <div className="tracker-route-line">
                <div className="tracker-fill-line" style={{ width: '45%', backgroundColor: '#2563eb' }} />
                <span className="tracker-live-pin" style={{ left: '45%' }} />
              </div>
              <p className="tracker-location-text">Denver, CO · In transit on I-70</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Download,
  ArrowRightLeft,
  Boxes,
  Layers,
  AlertTriangle,
  Truck,
  Search,
  ArrowUpDown,
  Bike,
  ShoppingCart
} from 'lucide-react'
import { stockItemsData } from '../../data/cadraData'
import { StockItem } from '../../types'

interface StockPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const StockPage: React.FC<StockPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [items, setItems] = useState<StockItem[]>(stockItemsData)
  const [activeTab, setActiveTab] = useState('Stock')
  const [kindFilter, setKindFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortLowFirst, setSortLowFirst] = useState(false)

  const kinds = [
    { label: 'All', count: 30 },
    { label: 'Bikes', count: 6 },
    { label: 'Framesets', count: 3 },
    { label: 'Components', count: 6 },
    { label: 'Materials', count: 7 },
    { label: 'Accessories', count: 8 },
  ]

  const filteredItems = items
    .filter((item) => {
      const matchesKind =
        kindFilter === 'All'
          ? true
          : kindFilter === 'Bikes'
          ? item.kind === 'Complete bike'
          : kindFilter === 'Framesets'
          ? item.kind === 'Frameset'
          : item.kind === kindFilter

      const matchesQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesKind && matchesQuery
    })
    .sort((a, b) => {
      if (sortLowFirst) {
        return a.onHand / a.reorderAt - b.onHand / b.reorderAt
      }
      return 0
    })

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Inventario</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Materiales & Consumibles Críticos</span>
      </div>

      {/* Header with Submodule Pills — Structured Exactly Like Real.png */}
      <div className="cadra-page-header">
        <div className="page-header-left-col">
          <div className="title-with-submodules">
            <h1 className="cadra-page-title">Stock</h1>
            <div className="cadra-submodule-pills">
              <button className="submodule-pill active" onClick={() => onNavigate('/stock')}>
                <Boxes size={14} />
                <span>Materiales</span>
                <span className="cadra-badge badge-orange">1</span>
              </button>
              <button className="submodule-pill" onClick={() => onNavigate('/purchasing/orders')}>
                <ShoppingCart size={13} />
                <span>Pedidos Depósito</span>
              </button>
              <button className="submodule-pill" onClick={() => onNavigate('/logistics/shipments')}>
                <Truck size={13} />
                <span>Laboratorio Dental</span>
              </button>
            </div>
          </div>

          <div className="cadra-sub-tabs">
            {['Stock Crítico', 'Almacén Central', 'Movimientos de Entrada'].map((t) => (
              <button
                key={t}
                className={`cadra-sub-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="page-header-right-cluster">
          {/* Top row: Floor Status Pill as positioned in Real.png */}
          <LiveFloorPill time="4:08 PM" onNavigate={onNavigate} />

          {/* Bottom row: Action Buttons */}
          <div className="page-header-actions-row">
            <button className="cadra-btn-secondary" onClick={() => alert('Exportando inventario de insumos a Excel...')}>
              <Download size={14} />
              <span>Exportar</span>
            </button>

            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <ArrowRightLeft size={15} />
              <span>Transfer stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Black Card */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <span className="kpi-icon-pill-circle">$</span>
            <span className="kpi-label">Stock value at cost</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$163,642" duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={30} /> SKUs
          </span>
        </div>

        {/* Card 2: Soft Blue Card */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Boxes size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Units on hand</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="1,043" duration={750} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            <AnimatedCounter value={3} /> sites
          </span>
        </div>

        {/* Card 3: Below Reorder */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <AlertTriangle size={16} className="kpi-icon-warning" />
            <span className="kpi-label">At or below reorder</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="6" duration={600} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-pink">
              <AnimatedCounter value={2} /> not on order
            </span>
          </div>
        </div>

        {/* Card 4: Units on order */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Truck size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Units on order</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="324" duration={700} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-neutral">
              <AnimatedCounter value={4} /> POs out
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Where the money sits + Below reorder point */}
      <div className="dashboard-charts-grid mt-4">
        {/* Where the money sits */}
        <div className="cadra-card money-sits-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">⏱️</span>
              <h3>Where the money sits</h3>
            </div>
            <span className="text-sm font-semibold text-secondary">$163,642 at cost</span>
          </div>

          {/* Segmented Colored Bar */}
          <div className="segmented-cost-bar">
            <div className="seg-fill seg-bikes" style={{ width: '67%' }} title="Bikes 67%" />
            <div className="seg-fill seg-framesets" style={{ width: '6%' }} title="Framesets 6%" />
            <div className="seg-fill seg-components" style={{ width: '18%' }} title="Components 18%" />
            <div className="seg-fill seg-materials" style={{ width: '5%' }} title="Materials 5%" />
            <div className="seg-fill seg-accessories" style={{ width: '4%' }} title="Accessories 4%" />
          </div>

          {/* Breakdown Legend Table */}
          <div className="cost-breakdown-legend-grid">
            <div className="cost-legend-col">
              <div className="cost-item-row">
                <span className="flex items-center gap-2">
                  <i className="legend-dot dot-blue" />
                  <span>Bikes</span>
                </span>
                <span className="cost-val"><AnimatedCounter value="$108,960" /></span>
                <span className="cost-pct"><AnimatedCounter value="67%" /></span>
              </div>
              <div className="cost-item-row">
                <span className="flex items-center gap-2">
                  <i className="legend-dot dot-components" />
                  <span>Components</span>
                </span>
                <span className="cost-val"><AnimatedCounter value="$30,270" /></span>
                <span className="cost-pct"><AnimatedCounter value="18%" /></span>
              </div>
              <div className="cost-item-row">
                <span className="flex items-center gap-2">
                  <i className="legend-dot dot-accessories" />
                  <span>Accessories</span>
                </span>
                <span className="cost-val"><AnimatedCounter value="$6,609" /></span>
                <span className="cost-pct"><AnimatedCounter value="4%" /></span>
              </div>
            </div>

            <div className="cost-legend-col">
              <div className="cost-item-row">
                <span className="flex items-center gap-2">
                  <i className="legend-dot dot-terracotta" />
                  <span>Framesets</span>
                </span>
                <span className="cost-val"><AnimatedCounter value="$9,910" /></span>
                <span className="cost-pct"><AnimatedCounter value="6%" /></span>
              </div>
              <div className="cost-item-row">
                <span className="flex items-center gap-2">
                  <i className="legend-dot dot-materials" />
                  <span>Materials</span>
                </span>
                <span className="cost-val"><AnimatedCounter value="$7,893" /></span>
                <span className="cost-pct"><AnimatedCounter value="5%" /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Below reorder point Action List */}
        <div className="cadra-card below-reorder-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning-red" />
              <h3>Below reorder point</h3>
            </div>
            <span className="cadra-tag-pill tag-pink">● 6 items</span>
          </div>

          <div className="below-reorder-list">
            {[
              { name: 'Juniper frameset', note: '1 left · reorder at 3', action: 'Build 6', icon: '🚲' },
              { name: 'Powder coat — Signal orange', note: '6 left · reorder at 10', action: 'On PO-3312', icon: '🎨', onPO: true },
              { name: 'Cinder hydraulic brakes (set)', note: '9 left · reorder at 14', action: 'On PO-3309', icon: '⚙️', onPO: true },
              { name: 'Juniper Trail', note: '3 left · reorder at 4', action: 'Build 6', icon: '🚲' },
              { name: 'Heat-treated tubeset (HD)', note: '8 left · reorder at 10', action: 'Build 10', icon: '🔩' },
            ].map((re, idx) => (
              <div key={idx} className="below-reorder-row">
                <span className="reorder-icon-box">{re.icon}</span>
                <div className="reorder-info">
                  <span className="reorder-name">{re.name}</span>
                  <span className="reorder-sub text-danger">{re.note}</span>
                </div>
                <button
                  className={`cadra-btn-secondary small ${re.onPO ? 'btn-po-linked' : ''}`}
                  onClick={() => onNavigate(re.onPO ? '/purchasing/orders' : '/manufacturing/orders')}
                >
                  {re.onPO ? '🚚 ' : '🔨 '}
                  {re.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock on Hand Table Card */}
      <div className="cadra-card cadra-table-card mt-4">
        <div className="table-header-toolbar">
          <div className="flex items-center gap-2">
            <Boxes size={16} className="text-secondary" />
            <h3>Stock on hand</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="pos-search-input-box">
              <Search size={14} className="text-secondary" />
              <input
                type="text"
                placeholder="Name, SKU or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className={`cadra-btn-secondary small ${sortLowFirst ? 'active' : ''}`}
              onClick={() => setSortLowFirst(!sortLowFirst)}
            >
              <ArrowUpDown size={13} />
              <span>Low first</span>
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="table-filter-pills-bar">
          {kinds.map((k) => (
            <button
              key={k.label}
              className={`filter-pill-item ${kindFilter === k.label ? 'active' : ''}`}
              onClick={() => setKindFilter(k.label)}
            >
              <span>{k.label}</span>
              <span className="filter-count-badge">{k.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="cadra-table-responsive">
          <table className="cadra-data-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>ITEM</th>
                <th style={{ width: '15%' }}>KIND</th>
                <th style={{ width: '22%' }}>LEVEL</th>
                <th style={{ width: '18%' }}>BY SITE</th>
                <th style={{ width: '10%' }}>ON ORDER</th>
                <th style={{ width: '10%' }}>VALUE</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="table-row-hoverable">
                  {/* Item */}
                  <td>
                    <div className="order-cell-block">
                      <div className="order-item-icon-circle">
                        <Bike size={14} />
                      </div>
                      <div className="order-item-details">
                        <span className="font-semibold text-main">{item.name}</span>
                        <span className="order-title-sub">
                          {item.sku} · {item.subCategory}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kind */}
                  <td>
                    <span className="cadra-kind-pill">{item.kind}</span>
                  </td>

                  {/* Level with Threshold Marker */}
                  <td>
                    <div className="level-track-wrapper">
                      <div className="level-bar-bg">
                        <div
                          className={`level-bar-fill ${item.warning ? 'fill-warning-red' : 'fill-good-green'}`}
                          style={{ width: `${Math.min(100, (item.onHand / (item.reorderAt * 2.5)) * 100)}%` }}
                        />
                        {/* Vertical threshold pin */}
                        <div className="level-reorder-pin" style={{ left: '40%' }} title="Reorder threshold" />
                      </div>
                      <span className={`level-subtext ${item.warning ? 'text-danger font-semibold' : ''}`}>
                        {item.onHand} on hand · reorder at {item.reorderAt}
                      </span>
                    </div>
                  </td>

                  {/* By Site: SEW, DIV, PHL */}
                  <td>
                    <div className="by-site-cluster">
                      <div className="site-mini-segmented-bar">
                        <span className="seg-site-sew" style={{ flex: item.sites.sew || 1 }} />
                        <span className="seg-site-div" style={{ flex: item.sites.div || 1 }} />
                        <span className="seg-site-phl" style={{ flex: item.sites.phl || 1 }} />
                      </div>
                      <span className="site-label-text">
                        SEW <b>{item.sites.sew}</b> DIV <b>{item.sites.div}</b> PHL <b>{item.sites.phl}</b>
                      </span>
                    </div>
                  </td>

                  {/* On Order */}
                  <td>
                    <span className="text-secondary">{item.onOrder > 0 ? `${item.onOrder} units` : '—'}</span>
                  </td>

                  {/* Value */}
                  <td>
                    <span className="font-semibold text-main">${item.value.toLocaleString()}</span>
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


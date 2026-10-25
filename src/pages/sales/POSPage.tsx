import React, { useState } from 'react'
import {
  Store,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
  Users,
  X
} from 'lucide-react'
import { posProductsData } from '../../data/cadraData'
import { POSProduct, CartItem } from '../../types'

interface POSPageProps {
  onNavigate: (path: string) => void
  onToast: (msg: string) => void
}

export const POSPage: React.FC<POSPageProps> = ({ onNavigate, onToast }) => {
  const [products] = useState<POSProduct[]>(posProductsData)
  const [selectedCategory, setSelectedCategory] = useState<string>('Everything')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [discountPct, setDiscountPct] = useState<number>(0)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [lastOrder, setLastOrder] = useState<any>(null)

  const categories = [
    { name: 'Everything', count: 19 },
    { name: 'Bikes', count: 6 },
    { name: 'Framesets', count: 3 },
    { name: 'Parts', count: 2 },
    { name: 'Accessories', count: 6 },
    { name: 'Apparel', count: 2 },
  ]

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'Everything' ? true : p.category === selectedCategory
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesQuery
  })

  const addToCart = (product: POSProduct) => {
    if (product.onFloor <= 0) {
      onToast(`${product.name} is sold out on the floor.`)
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => {
    setCart([])
    setCustomerName('')
    setDiscountPct(0)
  }

  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const discountAmount = rawSubtotal * (discountPct / 100)
  const subtotal = rawSubtotal - discountAmount
  const tax = 0 // Oregon has no sales tax as noted in Cadra!
  const total = subtotal + tax

  const handleCharge = () => {
    if (cart.length === 0) return

    const receipt = {
      orderId: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Just now',
      customer: customerName || 'Walk-in customer',
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total,
    }
    setLastOrder(receipt)
    setShowReceiptModal(true)
    clearCart()
    onToast(`Transaction completed: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
  }

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Catálogo de Tarifas & Cobro en Recepción</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Precios & Cobros</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill" onClick={() => onNavigate('/presupuestos')}>
              <span>Presupuestos</span>
              <span className="cadra-badge badge-orange">6</span>
            </button>
            <button className="submodule-pill active" onClick={() => onNavigate('/precios')}>
              <ShoppingBag size={13} />
              <span>Precios & Caja</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/pacientes')}>
              <Users size={13} />
              <span>Pacientes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caja Recepción VitaDent */}
      <div className="showroom-till-banner">
        <div className="till-info-left">
          <div className="till-icon-circle" style={{ backgroundColor: '#fdf2f8', color: '#A94384' }}>
            <Store size={18} />
          </div>
          <div>
            <div className="till-title-line">
              <span className="till-name">Caja Principal — Recepción VitaDent</span>
              <span className="cadra-tag-pill tag-green">● Caja Abierta</span>
            </div>
            <span className="till-subtext">Caja 1 · Recepción y Coordinación · Turno Activo · 0% IVA Salud</span>
          </div>
        </div>

        <button
          className="cadra-btn-secondary"
          onClick={() => {
            if (lastOrder) setShowReceiptModal(true)
            else onToast('No hay recibo reciente en esta sesión.')
          }}
        >
          <Receipt size={14} />
          <span>Último recibo</span>
        </button>
      </div>

      {/* Main Split: Products Grid (Left) vs Cart (Right) */}
      <div className="pos-split-layout">
        {/* Left: Product Catalog */}
        <div className="pos-catalog-panel">
          <div className="cadra-card pos-products-card">
            {/* Catalog Header & Search */}
            <div className="pos-catalog-head">
              <div className="flex items-center gap-2">
                <span className="catalog-head-icon">🚲</span>
                <h3>On the floor</h3>
              </div>
              <div className="pos-search-input-box">
                <Search size={14} className="text-secondary" />
                <input
                  type="text"
                  placeholder="Product or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="pos-categories-pills">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`pos-cat-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.name}</span>
                  <span className="cat-count">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Product Tiles Grid */}
            <div className="pos-tiles-grid">
              {filteredProducts.map((p) => {
                const isSoldOut = p.onFloor === 0
                return (
                  <div
                    key={p.id}
                    className={`pos-product-tile ${isSoldOut ? 'tile-sold-out' : ''}`}
                    onClick={() => addToCart(p)}
                  >
                    <div className="tile-art-box" style={{ backgroundColor: p.bgColor || '#f1f5f9' }}>
                      <span className="tile-initials" style={{ color: p.textColor || '#1e293b' }}>
                        {p.initials}
                      </span>
                      <span className={`tile-floor-badge ${isSoldOut ? 'badge-sold-out' : ''}`}>
                        {isSoldOut ? 'Sold out' : `${p.onFloor} on floor`}
                      </span>
                    </div>

                    <div className="tile-details">
                      <span className="tile-product-name">{p.name}</span>
                      <div className="tile-footer-row">
                        <span className="tile-sku">{p.sku}</span>
                        <span className="tile-price">
                          ${p.price.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's Sales Panel */}
          <div className="cadra-card pos-today-sales-card mt-4">
            <div className="pos-today-head">
              <div className="flex items-center gap-2">
                <span className="text-secondary">📊</span>
                <h3>Today’s sales</h3>
              </div>
              <span className="text-muted text-xs">Wed, Nov 11</span>
            </div>

            <div className="pos-today-content-grid">
              {/* Sales Total & Mini Bars */}
              <div className="pos-today-metrics">
                <span className="pos-metric-label">Running total</span>
                <div className="pos-big-total">$3,439.10</div>
                <span className="pos-avg-note">2 sales · $1,720 average</span>

                {/* Hourly mini bars (9a to 5p) */}
                <div className="pos-hourly-bars">
                  {[
                    { hour: '9a', h: 90 },
                    { hour: '10a', h: 10 },
                    { hour: '11a', h: 0 },
                    { hour: '12p', h: 0 },
                    { hour: '1p', h: 0 },
                    { hour: '2p', h: 0 },
                    { hour: '3p', h: 0 },
                    { hour: '4p', h: 0 },
                    { hour: '5p', h: 0 },
                  ].map((bar, i) => (
                    <div key={i} className="hourly-col">
                      <div className="hourly-bar-track">
                        {bar.h > 0 && <div className="hourly-bar-fill" style={{ height: `${bar.h}%` }} />}
                      </div>
                      <span className="hour-label">{bar.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent sales tickets list */}
              <div className="pos-recent-tickets">
                <div className="ticket-row">
                  <div className="ticket-icon">💳</div>
                  <div className="ticket-info">
                    <span className="ticket-customer">Walk-in</span>
                    <span className="ticket-sub">R-1091 · 10:06 AM · 2 items</span>
                  </div>
                  <span className="ticket-amount">$78.00</span>
                </div>

                <div className="ticket-row">
                  <div className="ticket-icon">💳</div>
                  <div className="ticket-info">
                    <span className="ticket-customer">Jordan Ellis</span>
                    <span className="ticket-sub">R-1090 · 9:24 AM · 2 items · 5% off</span>
                  </div>
                  <span className="ticket-amount">$3,361.10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cart & Checkout Panel */}
        <aside className="cadra-card pos-cart-card">
          {/* Cart Header */}
          <div className="cart-header-row">
            <div className="cart-head-left">
              <ShoppingCart size={17} />
              <h3>Current sale</h3>
            </div>
            <div className="cart-head-actions">
              <span className="cadra-tag-pill tag-neutral">
                {cart.length === 0 ? 'Empty' : `${cart.reduce((a, b) => a + b.quantity, 0)} items`}
              </span>
              {cart.length > 0 && (
                <button className="cart-trash-btn" onClick={clearCart} title="Clear cart">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Customer Input */}
          <div className="cart-customer-input-box">
            <Users size={14} className="text-secondary" />
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Cart Items List */}
          <div className="cart-items-scroll">
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <ShoppingCart size={32} className="cart-empty-icon" />
                <strong>Nothing rung up yet</strong>
                <p>Tap a product to start a sale.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <div className="cart-item-art" style={{ backgroundColor: item.product.bgColor || '#f1f5f9' }}>
                    <span style={{ color: item.product.textColor || '#1e293b' }}>{item.product.initials}</span>
                  </div>
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.product.name}</span>
                    <span className="cart-item-unit-price">${item.product.price.toLocaleString()}</span>
                  </div>
                  <div className="cart-item-qty-ctrl">
                    <button onClick={() => updateQuantity(item.product.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="cart-item-line-total">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Discount Selector */}
          <div className="cart-discount-section">
            <span className="discount-label">Discount</span>
            <div className="cadra-pill-group">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  className={`pill-switch-btn ${discountPct === pct ? 'active' : ''}`}
                  onClick={() => setDiscountPct(pct)}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Lines */}
          <div className="cart-totals-section">
            <div className="totals-line">
              <span>Subtotal</span>
              <span>${rawSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            {discountPct > 0 && (
              <div className="totals-line text-emerald-700">
                <span>Discount ({discountPct}%)</span>
                <span>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="totals-line">
              <span className="tax-label">
                Sales tax <small className="text-secondary">Oregon has none</small>
              </span>
              <span>$0.00</span>
            </div>

            <div className="totals-grand-line">
              <span>Total</span>
              <span className="grand-total-amount">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Charge Button */}
          <button
            className="cadra-charge-btn"
            disabled={cart.length === 0}
            onClick={handleCharge}
          >
            <CreditCard size={18} />
            <span>Charge ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </button>
        </aside>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && lastOrder && (
        <div className="cadra-modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="receipt-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-head">
              <div>
                <strong>VitaDent — Clínica Odontológica</strong>
                <p className="text-xs text-secondary">RUT: 900.582.194-1 · Régimen Exento de IVA Salud</p>
              </div>
              <button className="icon-close-btn" onClick={() => setShowReceiptModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="receipt-meta-box">
              <div>Recibo / Factura: <strong>{lastOrder.orderId}</strong></div>
              <div>Paciente: <strong>{lastOrder.customer}</strong></div>
              <div>Fecha: {lastOrder.time}</div>
            </div>

            <div className="receipt-items-list">
              {lastOrder.items.map((i: CartItem) => (
                <div key={i.product.id} className="receipt-item-line">
                  <span>{i.quantity}× {i.product.name}</span>
                  <span>COP ${(i.product.price * i.quantity).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="receipt-total-box">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Cancelado</span>
                <span>COP ${lastOrder.total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
              </div>
              <p className="text-xs text-muted text-center mt-3">¡Gracias por confiar en VitaDent Clínica Odontológica!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


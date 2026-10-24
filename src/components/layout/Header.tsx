import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { Bell, Bike, Check } from 'lucide-react'
import { AnimatedCounter } from '../ui/AnimatedCounter'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onOpenProfile: () => void
}

type ModuleKey = 'dashboard' | 'sales' | 'manufacturing' | 'inventory' | 'accounting' | 'hr' | 'reporting'

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenProfile }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  // Sliding pill state
  const navBarRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<ModuleKey, HTMLButtonElement | null>>({
    dashboard: null,
    sales: null,
    manufacturing: null,
    inventory: null,
    accounting: null,
    hr: null,
    reporting: null,
  })

  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  })

  const getActiveModuleKey = useCallback((): ModuleKey => {
    if (currentPath === '/dashboard' || currentPath === '' || currentPath === '/') return 'dashboard'
    if (currentPath.startsWith('/sales') || currentPath === '/pos' || currentPath === '/contacts') return 'sales'
    if (currentPath.startsWith('/manufacturing')) return 'manufacturing'
    if (currentPath.startsWith('/inventory') || currentPath.startsWith('/purchasing') || currentPath.startsWith('/logistics')) return 'inventory'
    if (currentPath.startsWith('/accounting')) return 'accounting'
    if (currentPath.startsWith('/hr')) return 'hr'
    if (currentPath.startsWith('/reporting')) return 'reporting'
    return 'dashboard'
  }, [currentPath])

  const isModuleActive = (key: ModuleKey) => getActiveModuleKey() === key

  // Update sliding pill position
  const updatePill = useCallback(() => {
    const activeKey = getActiveModuleKey()
    const activeBtn = itemRefs.current[activeKey]
    const navBar = navBarRef.current

    if (activeBtn && navBar) {
      const navRect = navBar.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      const left = btnRect.left - navRect.left
      const width = btnRect.width

      setPillStyle({
        left,
        width,
        ready: true,
      })
    }
  }, [getActiveModuleKey])

  useLayoutEffect(() => {
    updatePill()

    // Window resize & ResizeObserver for dynamic sync
    window.addEventListener('resize', updatePill)
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && navBarRef.current) {
      ro = new ResizeObserver(() => updatePill())
      ro.observe(navBarRef.current)
    }

    // Run after tiny delay to ensure font metrics are ready
    const t = setTimeout(updatePill, 30)

    return () => {
      window.removeEventListener('resize', updatePill)
      if (ro) ro.disconnect()
      clearTimeout(t)
    }
  }, [updatePill])

  const notifications = [
    { id: 1, title: 'WO-2043 is behind plan', time: '12m ago', urgent: true },
    { id: 2, title: 'SHP-7711 held at customs (Blaine, WA)', time: '35m ago', urgent: true },
    { id: 3, title: 'Payment received: $24,145.92 from Rosewood Bikes', time: '1h ago', urgent: false },
    { id: 4, title: 'Arriving this week: 190 units across 2 POs', time: '2h ago', urgent: false },
  ]

  return (
    <header className="cadra-header">
      {/* Brand */}
      <div className="cadra-brand" onClick={() => onNavigate('/dashboard')}>
        <div className="cadra-brand-icon">
          <Bike size={18} strokeWidth={2.2} />
        </div>
        <div className="cadra-brand-titles">
          <span className="cadra-brand-name">Cadra</span>
          <span className="cadra-brand-sub">Larkspur Cycles</span>
        </div>
      </div>

      {/* Main Nav Pill Bar with Animated Sliding Indicator */}
      <nav className="cadra-nav-pill-bar" ref={navBarRef}>
        {/* Animated Sliding Pill Element */}
        <div
          className={`cadra-nav-sliding-pill ${pillStyle.ready ? 'ready' : ''}`}
          style={{
            transform: `translateX(${pillStyle.left}px)`,
            width: `${pillStyle.width}px`,
          }}
          aria-hidden="true"
        />

        <button
          ref={(el) => { itemRefs.current.dashboard = el }}
          className={`cadra-nav-item ${isModuleActive('dashboard') ? 'active' : ''}`}
          onClick={() => onNavigate('/dashboard')}
        >
          <span>Dashboard</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.sales = el }}
          className={`cadra-nav-item ${isModuleActive('sales') ? 'active' : ''}`}
          onClick={() => onNavigate('/sales/pipeline')}
        >
          <span>Sales</span>
          <span className="cadra-badge badge-orange">4</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.manufacturing = el }}
          className={`cadra-nav-item ${isModuleActive('manufacturing') ? 'active' : ''}`}
          onClick={() => onNavigate('/manufacturing/scheduling')}
        >
          <span>Manufacturing</span>
          <span className="cadra-badge badge-orange">1</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.inventory = el }}
          className={`cadra-nav-item ${isModuleActive('inventory') ? 'active' : ''}`}
          onClick={() => onNavigate('/inventory/stock')}
        >
          <span>Stock</span>
          <span className="cadra-badge badge-orange">6</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.accounting = el }}
          className={`cadra-nav-item ${isModuleActive('accounting') ? 'active' : ''}`}
          onClick={() => onNavigate('/accounting/ledger')}
        >
          <span>Accounting</span>
          <span className="cadra-badge badge-orange">1</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.hr = el }}
          className={`cadra-nav-item ${isModuleActive('hr') ? 'active' : ''}`}
          onClick={() => onNavigate('/hr/directory')}
        >
          <span>HR</span>
          <span className="cadra-badge badge-orange">3</span>
        </button>

        <button
          ref={(el) => { itemRefs.current.reporting = el }}
          className={`cadra-nav-item ${isModuleActive('reporting') ? 'active' : ''}`}
          onClick={() => onNavigate('/reporting/overview')}
        >
          <span>Reporting</span>
        </button>
      </nav>

      {/* Right Header Status & Controls — Matches Real.png */}
      <div className="cadra-header-right">
        {/* Notifications */}
        <div className="notification-dropdown-wrapper">
          <button
            className="cadra-icon-circle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setHasUnread(false)
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {hasUnread && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div className="cadra-dropdown-menu notifications-menu">
              <div className="notifications-header">
                <strong>Activity & Alerts</strong>
                <span className="badge-count">4</span>
              </div>
              <div className="notifications-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notification-item ${n.urgent ? 'urgent' : ''}`}>
                    <div className="notification-icon">
                      {n.urgent ? '⚠️' : <Check size={13} />}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          className="cadra-avatar-btn"
          onClick={onOpenProfile}
          title="Noor Haddad (Operations Lead)"
        >
          NH
        </button>
      </div>
    </header>
  )
}

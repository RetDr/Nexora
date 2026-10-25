import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { Bell, Check } from 'lucide-react'
import { vitadentConfig } from '../../config/clinic.config'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onOpenProfile: () => void
}

type NavKey = 'agenda' | 'pacientes' | 'pagos' | 'inicio' | 'presupuestos' | 'stock' | 'precios' | 'informes'

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenProfile }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  // Sliding pill state
  const navBarRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<NavKey, HTMLButtonElement | null>>({
    agenda: null,
    pacientes: null,
    pagos: null,
    inicio: null,
    presupuestos: null,
    stock: null,
    precios: null,
    informes: null,
  })

  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  })

  const getActiveModuleKey = useCallback((): NavKey => {
    if (currentPath === '/agenda' || currentPath.startsWith('/manufacturing')) return 'agenda'
    if (currentPath === '/pacientes' || currentPath.startsWith('/hr') || currentPath === '/contacts') return 'pacientes'
    if (currentPath === '/pagos' || currentPath.startsWith('/accounting')) return 'pagos'
    if (currentPath === '/inicio' || currentPath === '/dashboard') return 'inicio'
    if (currentPath === '/presupuestos' || currentPath.startsWith('/sales')) return 'presupuestos'
    if (currentPath === '/stock' || currentPath.startsWith('/inventory') || currentPath.startsWith('/purchasing') || currentPath.startsWith('/logistics')) return 'stock'
    if (currentPath === '/precios' || currentPath === '/pos') return 'precios'
    if (currentPath === '/informes' || currentPath.startsWith('/reporting')) return 'informes'
    return 'agenda'
  }, [currentPath])

  const isModuleActive = (key: NavKey) => getActiveModuleKey() === key

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
    { id: 1, title: 'Paciente Carlos García en recepción (Box 1)', time: '5m ago', urgent: true },
    { id: 2, title: 'Stock crítico: Anestesia con vasoconstrictor baja', time: '20m ago', urgent: true },
    { id: 3, title: 'Pago recibido: $2.500.000 Implante (Dra. Valenzuela)', time: '1h ago', urgent: false },
    { id: 4, title: 'Presupuesto ortodoncia aceptado: Laura Gómez', time: '2h ago', urgent: false },
  ]

  return (
    <header className="cadra-header">
      {/* Brand VitaDent con Logo Horizontal */}
      <div className="cadra-brand" onClick={() => onNavigate('/inicio')} style={{ cursor: 'pointer' }} title="Ir a Inicio">
        <img
          src="/Logo_Horizontal.png"
          alt="VitaDent Clínica Odontológica"
          style={{ height: '38px', width: 'auto', maxWidth: '210px', objectFit: 'contain' }}
        />
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

        {vitadentConfig.navigation.map((item) => (
          <button
            key={item.key}
            ref={(el) => { itemRefs.current[item.key as NavKey] = el }}
            className={`cadra-nav-item ${isModuleActive(item.key as NavKey) ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <span>{item.label}</span>
            {item.badge && <span className="cadra-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Right Header Status & Controls */}
      <div className="cadra-header-right">
        {/* Notifications */}
        <div className="notification-dropdown-wrapper">
          <button
            className="cadra-icon-circle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setHasUnread(false)
            }}
            title="Notificaciones clínicas"
          >
            <Bell size={18} />
            {hasUnread && <span className="notification-dot" style={{ backgroundColor: '#A94384' }} />}
          </button>

          {showNotifications && (
            <div className="cadra-dropdown-menu notifications-menu">
              <div className="notifications-header">
                <strong>Alertas Clínicas</strong>
                <span className="badge-count" style={{ backgroundColor: '#A94384' }}>4</span>
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

        {/* User Profile Avatar: Admin Nathalia Leon */}
        <button
          className="cadra-avatar-btn"
          onClick={onOpenProfile}
          title="Nathalia Leon (Administradora General)"
          style={{
            backgroundColor: '#A94384',
            color: '#ffffff',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(169, 67, 132, 0.35)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          NL
        </button>
      </div>
    </header>
  )
}

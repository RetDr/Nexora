import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import { Bell, Check, LogOut, UserCheck, Crown, Stethoscope, ChevronDown } from 'lucide-react'
import { vitadentConfig } from '../../config/clinic.config'
import { useAuth } from '../../context/AuthContext'
import { VITA_USERS } from '../../types/auth'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onOpenProfile: () => void
}

type NavKey = 'inicio' | 'agenda' | 'pacientes' | 'pagos' | 'stock' | 'precios' | 'informes'

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenProfile }) => {
  const { user, logout, loginAs } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const userMenuRef = useRef<HTMLDivElement | null>(null)

  // Sliding pill state
  const navBarRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<NavKey, HTMLButtonElement | null>>({
    inicio: null,
    agenda: null,
    pacientes: null,
    pagos: null,
    stock: null,
    precios: null,
    informes: null,
  })

  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  })

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const getActiveModuleKey = useCallback((): NavKey => {
    if (currentPath === '/inicio' || currentPath === '/dashboard' || currentPath === '/' || currentPath === '') return 'inicio'
    if (currentPath === '/agenda' || currentPath.startsWith('/manufacturing')) return 'agenda'
    if (currentPath === '/pacientes' || currentPath.startsWith('/hr') || currentPath === '/contacts') return 'pacientes'
    if (currentPath === '/pagos' || currentPath.startsWith('/accounting')) return 'pagos'
    if (currentPath === '/stock' || currentPath.startsWith('/inventory') || currentPath.startsWith('/purchasing') || currentPath.startsWith('/logistics')) return 'stock'
    if (currentPath === '/precios' || currentPath === '/pos') return 'precios'
    if (currentPath === '/informes' || currentPath.startsWith('/reporting')) return 'informes'
    return 'inicio'
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

  const userInitial = user?.initials || 'NL'
  const userColor = user?.avatarColor || '#A94384'
  const isDoc = user?.role === 'doctor'

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
              setShowUserMenu(false)
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

        {/* User Profile Avatar & Dropdown */}
        <div className="cadra-user-profile-wrapper" ref={userMenuRef}>
          <button
            className="cadra-avatar-btn flex items-center justify-center gap-1"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            title={`${user?.name || 'Usuario'} (${user?.title || 'Personal Clínico'})`}
            style={{
              backgroundColor: userColor,
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: `0 2px 8px ${userColor}55`,
              border: '2px solid rgba(255, 255, 255, 0.85)',
              position: 'relative',
            }}
          >
            <span>{userInitial}</span>
          </button>

          {/* Menú Desplegable Táctil del Usuario */}
          {showUserMenu && (
            <div className="cadra-user-dropdown-menu">
              {/* Encabezado con datos del usuario activo */}
              <div className="cadra-user-dropdown-header">
                <div
                  className="cadra-user-dropdown-avatar"
                  style={{
                    backgroundColor: userColor,
                    boxShadow: `0 3px 10px ${userColor}40`,
                  }}
                >
                  {userInitial}
                </div>
                <div className="cadra-user-dropdown-details">
                  <span className="cadra-user-dropdown-name">{user?.name}</span>
                  <span className="cadra-user-dropdown-email">{user?.email}</span>
                  <span className="cadra-user-dropdown-badge">
                    {user?.role === 'admin' ? (
                      <>
                        <Crown size={11} />
                        <span>Administración General</span>
                      </>
                    ) : (
                      <>
                        <Stethoscope size={11} />
                        <span>{user?.consultorio || 'Especialista'}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Selector Rápido: Cambiar de Usuario */}
              <div className="cadra-user-switch-section">
                <span className="cadra-user-switch-title">
                  <UserCheck size={12} />
                  <span>Cambiar de Usuario (1 clic)</span>
                </span>

                <div className="cadra-user-switch-list">
                  {VITA_USERS.map((u) => {
                    const isCurrent = u.id === user?.id
                    return (
                      <button
                        key={u.id}
                        type="button"
                        className={`cadra-user-switch-item ${isCurrent ? 'active' : ''}`}
                        onClick={() => {
                          loginAs(u.id)
                          setShowUserMenu(false)
                        }}
                        title={`Cambiar a ${u.name}`}
                      >
                        <div className="cadra-user-switch-left">
                          <span
                            className="cadra-user-switch-avatar"
                            style={{ backgroundColor: u.avatarColor }}
                          >
                            {u.initials}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="cadra-user-switch-name">{u.name}</span>
                            <span className="cadra-user-switch-tag">
                              {u.role === 'admin' ? 'Administradora' : u.consultorio}
                            </span>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} className="text-[#A94384]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Acciones del Usuario */}
              <div className="cadra-user-dropdown-actions">
                <button
                  type="button"
                  className="cadra-user-dropdown-action-btn"
                  onClick={() => {
                    setShowUserMenu(false)
                    onOpenProfile()
                  }}
                >
                  <span>👤 Ver Mi Ficha Clínica</span>
                </button>

                {/* Botón de Cerrar Sesión */}
                <button
                  type="button"
                  className="cadra-user-logout-btn"
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  title="Cerrar la sesión activa y regresar al login"
                >
                  <LogOut size={15} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

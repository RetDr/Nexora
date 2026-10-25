import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import { Bell, Check, LogOut, Crown, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react'
import { vitadentConfig } from '../../config/clinic.config'
import { useAuth } from '../../context/AuthContext'
import { useWorkspace } from '../../context/WorkspaceContext'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onOpenProfile: () => void
}

type NavKey = 'inicio' | 'agenda' | 'pacientes' | 'pagos' | 'stock' | 'precios' | 'informes'

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenProfile }) => {
  const { user, logout } = useAuth()
  const { activeWorkspaceInfo, currentWorkspace } = useWorkspace()
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
    { id: 1, title: 'Paciente Carlos García en recepción (Consultorio 1)', time: '5m ago', urgent: true },
    { id: 2, title: 'Stock crítico: Anestesia con vasoconstrictor baja', time: '20m ago', urgent: true },
    { id: 3, title: 'Pago recibido: $2.500.000 Implante (Dra. Valenzuela)', time: '1h ago', urgent: false },
    { id: 4, title: 'Presupuesto ortodoncia aceptado: Laura Gómez', time: '2h ago', urgent: false },
  ]

  const userInitial = user?.initials || 'NL'
  const userName = user?.name || 'Nathalia Leon'
  const userRoleTitle = 'Asistente y Coordinadora Clínica'
  const userFullRole = user?.title || 'Asistente de Dirección y Coordinadora de Agendas Clínicas'

  return (
    <header className="cadra-header">
      {/* Brand VitaDent + Workspace Switcher 3D */}
      <div className="cadra-header-left">
        <div
          className="cadra-brand"
          onClick={() => onNavigate('/inicio')}
          style={{ cursor: 'pointer' }}
          title="Ir a Inicio"
        >
          <img
            src="/Logo_Horizontal.png"
            alt="VitaDent Clínica Odontológica"
            style={{ height: '36px', width: 'auto', maxWidth: '190px', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Separador vertical sutil */}
        <div className="cadra-header-divider" />

        {/* Selector de Espacio de Trabajo ("Workspace Switcher") */}
        <WorkspaceSwitcher />
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
            ref={(el) => {
              itemRefs.current[item.key as NavKey] = el
            }}
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
                <span className="badge-count" style={{ backgroundColor: '#A94384' }}>
                  4
                </span>
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

        {/* User Profile Avatar & Dropdown: Nathalia Leon · Asistente y Coordinadora Clínica */}
        <div className="cadra-user-profile-wrapper" ref={userMenuRef}>
          <button
            className="cadra-user-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            title="Nathalia Leon · Asistente y Coordinadora Clínica"
          >
            {/* Avatar circular con badge de corona */}
            <div className="cadra-user-avatar-circle">
              <span>{userInitial}</span>
              <span className="cadra-user-crown-badge">👑</span>
            </div>

            {/* Etiqueta visible del usuario: Nathalia Leon · Asistente y Coordinadora Clínica */}
            <div className="cadra-user-text-col">
              <span className="cadra-user-name-text">{userName}</span>
              <span className="cadra-user-role-text">{userRoleTitle}</span>
            </div>

            <ChevronDown
              size={13}
              className="vita-ws-chevron"
              style={{
                transform: showUserMenu ? 'rotate(180deg)' : 'none',
              }}
            />
          </button>

          {/* Menú Desplegable Táctil del Usuario */}
          {showUserMenu && (
            <div className="cadra-user-dropdown-menu">
              {/* Encabezado con datos del usuario activo */}
              <div className="cadra-user-dropdown-header">
                <div
                  className="cadra-user-dropdown-avatar"
                  style={{
                    backgroundColor: '#A94384',
                    boxShadow: '0 3px 10px rgba(169, 67, 132, 0.4)',
                  }}
                >
                  {userInitial}
                </div>
                <div className="cadra-user-dropdown-details">
                  <span className="cadra-user-dropdown-name">{userName}</span>
                  <span className="cadra-user-dropdown-email">{user?.email || 'administracion@vitadent.com.co'}</span>
                  <span className="cadra-user-dropdown-badge">
                    <Crown size={11} />
                    <span>{userRoleTitle}</span>
                  </span>
                </div>
              </div>

              {/* Tarjeta Informativa de Rol & Workspace Actual */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-card-subtle, #f8fafc)',
                borderRadius: '10px',
                border: '1px solid var(--border-light, #e2e8f0)',
                fontSize: '11.5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#8A8A8F',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} style={{ color: '#A94384' }} />
                  <span>Control Institucional Central</span>
                </div>
                <div style={{ color: 'var(--text-secondary, #64748b)', lineHeight: 1.3 }}>
                  {userFullRole}
                </div>
                <div style={{
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px solid var(--border-light, #e2e8f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px'
                }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Espacio activo:</span>
                  <span style={{ fontWeight: 700, color: '#A94384', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{activeWorkspaceInfo.iconEmoji}</span>
                    <span>{currentWorkspace === 'all' ? 'Toda la Clínica' : activeWorkspaceInfo.name}</span>
                  </span>
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
                  <span>👤 Ver Mi Ficha de Coordinación</span>
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

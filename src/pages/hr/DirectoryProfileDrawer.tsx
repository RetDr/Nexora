import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Users,
  Search,
  X,
  Mail,
  Phone,
  Copy,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  Sparkles,
  UserCheck,
  Building
} from 'lucide-react'

interface DirectoryProfileDrawerProps {
  onNavigate: (path: string) => void
  showDrawer: boolean
  onCloseDrawer: () => void
  onToast: (msg: string) => void
}

export const DirectoryProfileDrawer: React.FC<DirectoryProfileDrawerProps> = ({
  onNavigate,
  showDrawer,
  onCloseDrawer,
  onToast,
}) => {
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false)

  const isDrawerActive = showDrawer || internalDrawerOpen

  const handleClose = () => {
    setInternalDrawerOpen(false)
    onCloseDrawer()
  }

  const teamMembers = [
    {
      id: 's-leon',
      name: 'Nathalia Leon',
      initials: 'NL',
      role: 'Administradora General',
      dept: 'Administración & Gestión',
      status: 'En línea · Panel Central',
      fullTime: true,
      email: 'administracion@vitadent.com.co',
      phone: '+57 311 405 2910',
      isMe: true,
    },
    {
      id: 's-valenzuela',
      name: 'Dra. Sofía Valenzuela',
      initials: 'SV',
      role: 'Directora Médica & Odontología General',
      dept: 'Odontología General',
      status: 'En consulta · Box 1',
      fullTime: true,
      email: 'sofia.valenzuela@vitadent.com.co',
      phone: '+57 311 405 2911',
    },
    {
      id: 's-soto',
      name: 'Dr. Alejandro Soto',
      initials: 'AS',
      role: 'Especialista en Ortodoncia',
      dept: 'Ortodoncia',
      status: 'En consulta · Box 2',
      fullTime: true,
      email: 'alejandro.soto@vitadent.com.co',
      phone: '+57 312 904 1120',
    },
    {
      id: 's-rivas',
      name: 'Dra. Claudia Rivas',
      initials: 'CR',
      role: 'Especialista en Endodoncia',
      dept: 'Endodoncia',
      status: 'Disponible · Box 3',
      fullTime: true,
      email: 'claudia.rivas@vitadent.com.co',
      phone: '+57 315 882 1904',
    },
    {
      id: 's-pineda',
      name: 'Dr. Marcos Pineda',
      initials: 'MP',
      role: 'Cirugía Maxilofacial & Implantes',
      dept: 'Cirugía & Implantes',
      status: 'En cirugía · Box 4',
      fullTime: true,
      email: 'marcos.pineda@vitadent.com.co',
      phone: '+57 318 765 4321',
    },
    {
      id: 's-morales',
      name: 'Camila Morales',
      initials: 'CM',
      role: 'Higienista & Auxiliar Dental',
      dept: 'Apoyo Clínico',
      status: 'Esterilización e Instrumental',
      fullTime: true,
      email: 'camila.m@vitadent.com.co',
      phone: '+57 310 998 1234',
    },
    {
      id: 's-pena',
      name: 'Andrea Peña',
      initials: 'AP',
      role: 'Recepción & Coordinación Pacientes',
      dept: 'Recepción & Caja',
      status: 'Atención al Paciente',
      fullTime: true,
      email: 'recepcion@vitadent.com.co',
      phone: '+57 601 744 1234',
    },
  ]

  const departments = ['All', 'Odontología General', 'Ortodoncia', 'Endodoncia', 'Cirugía & Implantes', 'Apoyo Clínico', 'Recepción & Caja']

  const filteredMembers = teamMembers.filter((m) => {
    if (filterDepartment === 'All') return true
    return m.dept === filterDepartment
  })

  return (
    <div className="cadra-page-container relative">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Equipo Médico & Personal</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Directorio Médico</h1>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="cadra-kpi-grid-4 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {/* Card 1: On shift */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <Users size={16} className="kpi-icon-dim" />
            <span className="kpi-label">On shift today</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="6" duration={600} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            All stations staffed
          </span>
        </div>

        {/* Card 2: Attendance */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <UserCheck size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Attendance rate</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="100%" duration={650} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">
            6 of 6 present
          </span>
        </div>

        {/* Card 3: Departments */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Building size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Active departments</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="5" duration={600} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-green">Fully aligned</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="cadra-pill-group mb-4">
        {departments.map((d) => (
          <button
            key={d}
            className={`pill-switch-btn ${filterDepartment === d ? 'active' : ''}`}
            onClick={() => setFilterDepartment(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Team Cards Grid */}
      <div className="directory-cards-grid">
        {filteredMembers.map((m) => (
          <div
            key={m.id}
            className={`cadra-card staff-card ${m.isMe ? 'border-primary' : ''}`}
            onClick={() => {
              if (m.isMe) {
                setInternalDrawerOpen(true)
              } else {
                onToast(`Viewing details for ${m.name}`)
              }
            }}
          >
            <div className="staff-card-top">
              <div className="relative">
                <span className="worker-avatar-circle large">{m.initials}</span>
                <span className="drawer-online-status-dot" style={{ width: '10px', height: '10px', bottom: '0', right: '0' }} />
              </div>
              <div>
                <strong className="staff-name">{m.name}</strong>
                <div className="text-xs text-muted">{m.role}</div>
              </div>
            </div>

            <div className="staff-meta-row">
              <span className="cadra-tag-pill tag-green">● {m.status}</span>
              {m.isMe && <span className="cadra-tag-pill tag-blue">You</span>}
            </div>

            <div className="staff-contact-footer">
              <span className="text-xs text-secondary font-medium">{m.dept}</span>
              <span className="text-xs text-muted">{m.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Slide-Over Drawer for Noor Haddad */}
      {isDrawerActive && (
        <div className="drawer-overlay" onClick={handleClose}>
          <div className="profile-slide-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Close */}
            <button className="drawer-close-btn" onClick={handleClose}>
              <X size={18} />
            </button>

            {/* Profile Header */}
            <div className="drawer-header-block">
              <div className="relative">
                <div className="drawer-avatar-circle" style={{ backgroundColor: '#A94384', color: '#ffffff', fontWeight: 800 }}>NL</div>
                <span className="drawer-online-status-dot" />
              </div>

              <div className="drawer-name-info">
                <h2 className="drawer-user-name">Nathalia Leon</h2>
                <div className="drawer-user-role">Administradora General · Dirección VitaDent</div>
                <div className="drawer-tags-row">
                  <span className="cadra-tag-pill tag-green">● En línea · Activo</span>
                  <span className="cadra-tag-pill tag-neutral">Acceso Total Admin</span>
                  <span className="cadra-tag-pill tag-blue">Tú</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons: Email, Call, Copy email */}
            <div className="drawer-quick-actions">
              <button
                className="drawer-action-btn"
                onClick={() => window.open('mailto:administracion@vitadent.com.co')}
              >
                <Mail size={14} />
                <span>Email</span>
              </button>
              <button
                className="drawer-action-btn"
                onClick={() => window.open('tel:+573114052910')}
              >
                <Phone size={14} />
                <span>Llamar</span>
              </button>
              <button
                className="drawer-action-btn"
                onClick={() => {
                  navigator.clipboard?.writeText('administracion@vitadent.com.co')
                  onToast('Email copiado al portapapeles')
                }}
              >
                <Copy size={14} />
                <span>Copiar email</span>
              </button>
            </div>

            {/* Details Fields */}
            <div className="drawer-details-grid">
              <div className="drawer-field-card">
                <span className="drawer-field-label">Email</span>
                <span className="drawer-field-val">administracion@vitadent.com.co</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Teléfono</span>
                <span className="drawer-field-val">+57 311 405 2910</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Ubicación</span>
                <span className="drawer-field-val">Oficina Administrativa · Sede Principal</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Rol del Sistema</span>
                <span className="drawer-field-val">Administradora General (Propietaria)</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">En VitaDent</span>
                <span className="drawer-field-val">Desde Creación</span>
                <span className="text-xs text-muted">Gestión & Control Clínico</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Permisos</span>
                <span className="drawer-field-val">Control Total (Caja, Agenda, Doctores, Tarifas)</span>
                <span className="text-xs text-muted">Superadmin</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Equipo Clínico</span>
                <span className="drawer-field-val">Cuerpo Médico VitaDent</span>
                <span className="text-xs text-muted">4 doctores + auxiliares y recepción</span>
              </div>
            </div>

            {/* Skills */}
            <div className="drawer-skills-section">
              <span className="drawer-section-heading">SKILLS</span>
              <div className="drawer-skills-chips">
                <span className="skill-chip">Planning</span>
                <span className="skill-chip">Lean</span>
                <span className="skill-chip">Supplier mgmt</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="drawer-footer-actions">
              <button
                className="cadra-btn-primary flex-1"
                onClick={() => onToast('Time off request opened')}
              >
                <Calendar size={15} />
                <span>Request time off</span>
              </button>

              <button
                className="cadra-btn-secondary"
                onClick={() => onToast('Attendance record logged')}
              >
                <Clock size={15} />
                <span>Attendance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


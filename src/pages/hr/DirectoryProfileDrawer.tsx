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
      id: 's-noor',
      name: 'Noor Haddad',
      initials: 'NH',
      role: 'Operations lead',
      dept: 'Operations',
      status: 'Present · in 7:00 AM',
      fullTime: true,
      email: 'noor@larkspurcycles.com',
      phone: '(503) 555-0142',
      isMe: true,
    },
    {
      id: 's-alex',
      name: 'Alex Thorne',
      initials: 'AT',
      role: 'Master TIG Welder',
      dept: 'Fabrication',
      status: 'Present · in 6:45 AM',
      fullTime: true,
      email: 'alex@larkspurcycles.com',
      phone: '(503) 555-0143',
    },
    {
      id: 's-fiona',
      name: 'Fiona Walsh',
      initials: 'FW',
      role: 'Tube Cutting & Mitering',
      dept: 'Fabrication',
      status: 'Present · in 7:00 AM',
      fullTime: true,
      email: 'fiona@larkspurcycles.com',
      phone: '(503) 555-0144',
    },
    {
      id: 's-jack',
      name: 'Jack Bailey',
      initials: 'JB',
      role: 'Finishing & Powder Coat',
      dept: 'Finishing',
      status: 'Present · in 7:15 AM',
      fullTime: true,
      email: 'jack@larkspurcycles.com',
      phone: '(503) 555-0145',
    },
    {
      id: 's-hannah',
      name: 'Hannah Kim',
      initials: 'HK',
      role: 'Quality Assurance & Assembly',
      dept: 'Assembly',
      status: 'Present · in 7:30 AM',
      fullTime: true,
      email: 'hannah.k@larkspurcycles.com',
      phone: '(503) 555-0146',
    },
    {
      id: 's-ines',
      name: 'Inès Moreau',
      initials: 'IM',
      role: 'Showroom Lead',
      dept: 'Sales',
      status: 'Present · in 9:30 AM',
      fullTime: true,
      email: 'ines@larkspurcycles.com',
      phone: '(503) 555-0147',
    },
  ]

  const departments = ['All', 'Operations', 'Fabrication', 'Finishing', 'Assembly', 'Sales']

  const filteredMembers = teamMembers.filter((m) => {
    if (filterDepartment === 'All') return true
    return m.dept === filterDepartment
  })

  return (
    <div className="cadra-page-container relative">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Directory</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Directory</h1>
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
                <div className="drawer-avatar-circle">NH</div>
                <span className="drawer-online-status-dot" />
              </div>

              <div className="drawer-name-info">
                <h2 className="drawer-user-name">Noor Haddad</h2>
                <div className="drawer-user-role">Operations lead · Operations</div>
                <div className="drawer-tags-row">
                  <span className="cadra-tag-pill tag-green">● Present · in 7:00 AM</span>
                  <span className="cadra-tag-pill tag-neutral">Full-time</span>
                  <span className="cadra-tag-pill tag-blue">You</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons: Email, Call, Copy email */}
            <div className="drawer-quick-actions">
              <button
                className="drawer-action-btn"
                onClick={() => window.open('mailto:noor@larkspurcycles.com')}
              >
                <Mail size={14} />
                <span>Email</span>
              </button>
              <button
                className="drawer-action-btn"
                onClick={() => window.open('tel:5035550142')}
              >
                <Phone size={14} />
                <span>Call</span>
              </button>
              <button
                className="drawer-action-btn"
                onClick={() => {
                  navigator.clipboard?.writeText('noor@larkspurcycles.com')
                  onToast('Email copied to clipboard')
                }}
              >
                <Copy size={14} />
                <span>Copy email</span>
              </button>
            </div>

            {/* Details Fields */}
            <div className="drawer-details-grid">
              <div className="drawer-field-card">
                <span className="drawer-field-label">Email</span>
                <span className="drawer-field-val">noor@larkspurcycles.com</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Phone</span>
                <span className="drawer-field-val">(503) 555-0142</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Works from</span>
                <span className="drawer-field-val">Southeast Works</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Reports to</span>
                <span className="drawer-field-val">Owner group</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Started</span>
                <span className="drawer-field-val">Nov 7, 2021</span>
                <span className="text-xs text-muted">5.0 yrs with Larkspur</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Employment</span>
                <span className="drawer-field-val">Full-time</span>
                <span className="text-xs text-muted">$98,000 a year</span>
              </div>

              <div className="drawer-field-card">
                <span className="drawer-field-label">Team</span>
                <span className="drawer-field-val">Operations</span>
                <span className="text-xs text-muted">2 people</span>
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


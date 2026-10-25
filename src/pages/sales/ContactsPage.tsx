import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Star,
  Mail,
  Phone,
  MapPin,
  List,
  LayoutGrid,
  ShoppingBag,
  Users,
  PieChart,
  Calendar,
  Clock,
  Check,
  X,
  CreditCard,
  UserCheck,
  Stethoscope,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { contactsData } from '../../data/cadraData'
import { ContactItem } from '../../types'
import { vitadentConfig } from '../../config/clinic.config'

export interface PatientAppointment {
  id: string
  patientId: string
  patientName: string
  doctor: string
  treatment: string
  date: string
  time: string
  box: string
  price: number
  status: 'Programada' | 'Atendida' | 'Facturada' | 'Pagada'
  notes?: string
}

export const INITIAL_PATIENT_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'apt-1',
    patientId: 'c-1',
    patientName: 'Carlos García Mendoza',
    doctor: 'Dr. Marcos Pineda',
    treatment: 'Implante de titanio + corona',
    date: '11 Nov 2026',
    time: '10:00 AM',
    box: 'Sillón 4 (Cirugía)',
    price: 2500000,
    status: 'Facturada',
    notes: 'Fase 2 de osteointegración y colocación de corona zirconio'
  },
  {
    id: 'apt-2',
    patientId: 'c-1',
    patientName: 'Carlos García Mendoza',
    doctor: 'Dr. Marcos Pineda',
    treatment: 'Control post-quirúrgico implante',
    date: '18 Nov 2026',
    time: '09:30 AM',
    box: 'Sillón 4 (Cirugía)',
    price: 0,
    status: 'Programada',
    notes: 'Revisión de cicatrización y torque'
  },
  {
    id: 'apt-3',
    patientId: 'c-2',
    patientName: 'Laura Gómez Restrepo',
    doctor: 'Dr. Alejandro Soto',
    treatment: 'Ortodoncia (mensualidad)',
    date: '10 Nov 2026',
    time: '04:00 PM',
    box: 'Sillón 2 (Ortodoncia)',
    price: 100000,
    status: 'Pagada',
    notes: 'Cambio de arcos estéticos superior e inferior'
  },
  {
    id: 'apt-4',
    patientId: 'c-2',
    patientName: 'Laura Gómez Restrepo',
    doctor: 'Dr. Alejandro Soto',
    treatment: 'Control mensual brackets zafiro',
    date: '10 Dic 2026',
    time: '04:00 PM',
    box: 'Sillón 2 (Ortodoncia)',
    price: 100000,
    status: 'Programada',
    notes: 'Ajuste de torque anterior'
  },
  {
    id: 'apt-5',
    patientId: 'c-3',
    patientName: 'Mateo Fernández Silva',
    doctor: 'Dr. Marcos Pineda',
    treatment: 'Extracción quirúrgica (cordal)',
    date: '11 Nov 2026',
    time: '11:30 AM',
    box: 'Sillón 4 (Cirugía)',
    price: 250000,
    status: 'Atendida',
    notes: 'Extracción cordal inferior retenida'
  },
  {
    id: 'apt-6',
    patientId: 'c-4',
    patientName: 'Valentina Ríos Castro',
    doctor: 'Dra. Sofía Valenzuela',
    treatment: 'Limpieza dental ultrasonido',
    date: 'Hoy',
    time: '04:00 PM',
    box: 'Sillón 1 (General)',
    price: 90000,
    status: 'Programada',
    notes: 'Profilaxis dental y fluorización tópica'
  },
  {
    id: 'apt-7',
    patientId: 'c-5',
    patientName: 'Andrés Felipe Mendoza',
    doctor: 'Dra. Claudia Rivas',
    treatment: 'Endodoncia unirradicular',
    date: '20 Nov 2026',
    time: '03:00 PM',
    box: 'Sillón 3 (Endodoncia)',
    price: 350000,
    status: 'Programada',
    notes: 'Pieza 26 conductometría rotatoria'
  }
]

interface ContactsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate?: () => void
  onToast?: (msg: string) => void
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onNavigate, onOpenCreate, onToast }) => {
  // Load contacts from localStorage if present
  const [contacts, setContacts] = useState<ContactItem[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_contacts')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return contactsData
  })

  // Load appointments from localStorage if present
  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_appointments')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_PATIENT_APPOINTMENTS
  })

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Favorites' | 'Customers' | 'Vendors' | 'Partners'>('All')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [localToast, setLocalToast] = useState<string | null>(null)

  // Modals state
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<ContactItem | null>(null)

  // Form state for New Patient
  const [newPatientName, setNewPatientName] = useState('')
  const [newPatientDoc, setNewPatientDoc] = useState('')
  const [newPatientPhone, setNewPatientPhone] = useState('')
  const [newPatientEmail, setNewPatientEmail] = useState('')
  const [newPatientCity, setNewPatientCity] = useState('Bogotá')
  const [newPatientCategory, setNewPatientCategory] = useState('Ortodoncia')
  const [newPatientStarred, setNewPatientStarred] = useState(false)

  // Form state for Scheduling Appointment
  const [scheduleDoctor, setScheduleDoctor] = useState(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
  const [scheduleTreatment, setScheduleTreatment] = useState(vitadentConfig.treatments[0]?.name || 'Primera consulta + Diagnóstico')
  const [scheduleDate, setScheduleDate] = useState('12 Nov 2026')
  const [scheduleTime, setScheduleTime] = useState('10:00 AM')
  const [scheduleBox, setScheduleBox] = useState('Sillón 1 (General)')
  const [scheduleNotes, setScheduleNotes] = useState('')

  // Toast handler
  const notify = (msg: string) => {
    if (onToast) onToast(msg)
    setLocalToast(msg)
    setTimeout(() => {
      setLocalToast((curr) => (curr === msg ? null : curr))
    }, 3500)
  }

  // Save contacts whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vitadent_contacts', JSON.stringify(contacts))
    } catch {
      // ignore
    }
  }, [contacts])

  // Save appointments whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vitadent_appointments', JSON.stringify(appointments))
    } catch {
      // ignore
    }
  }, [appointments])

  // Toggle favorite with glowing feedback
  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStarred = !c.starred
          notify(nextStarred ? `⭐ ${c.company} añadido a Favoritos` : `${c.company} removido de Favoritos`)
          return { ...c, starred: nextStarred }
        }
        return c
      })
    )
  }

  // Helper to get initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Open Schedule modal for specific patient
  const handleOpenSchedule = (patient: ContactItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedPatient(patient)
    // Pre-select appropriate doctor based on patient category if matching
    const cat = patient.category.toLowerCase()
    if (cat.includes('orto')) {
      setScheduleDoctor('Dr. Alejandro Soto')
      setScheduleBox('Sillón 2 (Ortodoncia)')
      setScheduleTreatment('Ortodoncia (mensualidad)')
    } else if (cat.includes('implante') || cat.includes('cirug')) {
      setScheduleDoctor('Dr. Marcos Pineda')
      setScheduleBox('Sillón 4 (Cirugía)')
      setScheduleTreatment('Implante de titanio + corona')
    } else if (cat.includes('endo')) {
      setScheduleDoctor('Dra. Claudia Rivas')
      setScheduleBox('Sillón 3 (Endodoncia)')
      setScheduleTreatment('Endodoncia unirradicular')
    } else {
      setScheduleDoctor('Dra. Sofía Valenzuela')
      setScheduleBox('Sillón 1 (General)')
      setScheduleTreatment('Limpieza dental ultrasonido')
    }
    setScheduleNotes('')
    setIsScheduleModalOpen(true)
  }

  // Open History modal for specific patient
  const handleOpenHistory = (patient: ContactItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedPatient(patient)
    setIsHistoryModalOpen(true)
  }

  // Submit New Patient
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPatientName.trim()) return

    const newId = `c-${Date.now()}`
    const initials = getInitials(newPatientName)
    const docClean = newPatientDoc.trim() || `10${Math.floor(10000000 + Math.random() * 90000000)}`

    const newPatient: ContactItem = {
      id: newId,
      company: newPatientName.trim(),
      initials,
      rep: `Paciente · CC ${docClean}`,
      type: 'Customer',
      city: newPatientCity.trim() || 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      category: newPatientCategory,
      email: newPatientEmail.trim() || `${initials.toLowerCase()}@vitadent.com.co`,
      phone: newPatientPhone.trim() || '+57 310 000 0000',
      starred: newPatientStarred
    }

    setContacts((prev) => [newPatient, ...prev])
    notify(`¡Paciente ${newPatient.company} registrado exitosamente!`)

    // Reset form
    setNewPatientName('')
    setNewPatientDoc('')
    setNewPatientPhone('')
    setNewPatientEmail('')
    setNewPatientCity('Bogotá')
    setNewPatientCategory('Ortodoncia')
    setNewPatientStarred(false)
    setIsNewPatientModalOpen(false)
  }

  // Submit Appointment
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) return

    const treatmentObj = vitadentConfig.treatments.find((t) => t.name === scheduleTreatment)
    const price = treatmentObj ? treatmentObj.priceCop : 100000

    const newAppointment: PatientAppointment = {
      id: `apt-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.company,
      doctor: scheduleDoctor,
      treatment: scheduleTreatment,
      date: scheduleDate,
      time: scheduleTime,
      box: scheduleBox,
      price,
      status: 'Programada',
      notes: scheduleNotes
    }

    setAppointments((prev) => [newAppointment, ...prev])
    notify(`Cita agendada para ${selectedPatient.company} con ${scheduleDoctor} (${scheduleDate} - ${scheduleTime})`)
    setIsScheduleModalOpen(false)
  }

  // Alphabet scrubber
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Filtered contacts
  const filtered = contacts.filter((c) => {
    const matchesQuery =
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.rep.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())

    let matchesType = true
    if (typeFilter === 'Favorites') {
      matchesType = !!c.starred
    } else if (typeFilter === 'Customers') {
      matchesType = c.type === 'Customer'
    } else if (typeFilter === 'Vendors') {
      matchesType = c.type === 'Vendor'
    } else if (typeFilter === 'Partners') {
      matchesType = c.type === 'Partner'
    }

    const matchesLetter = activeLetter ? c.company.toUpperCase().startsWith(activeLetter) : true

    return matchesQuery && matchesType && matchesLetter
  })

  // Group by first letter
  const grouped: Record<string, ContactItem[]> = {}
  filtered.forEach((c) => {
    const letter = c.company[0]?.toUpperCase() || '#'
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(c)
  })

  const sortedLetters = Object.keys(grouped).sort()
  const starredContacts = contacts.filter((c) => c.starred)

  // Get appointments for a given patient
  const getPatientAppointments = (patientId: string) => {
    return appointments.filter((a) => a.patientId === patientId)
  }

  return (
    <div className="cadra-page-container">
      {/* Dynamic 3D & Glowing Styles */}
      <style>{`
        /* Glowing Star Animation */
        .star-fav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease;
        }
        .star-fav-btn:hover {
          transform: scale(1.22);
        }
        .star-fav-btn.is-starred {
          filter: drop-shadow(0 0 7px rgba(245, 158, 11, 0.75));
          animation: starPulse 1.8s infinite alternate ease-in-out;
        }
        @keyframes starPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.6)); }
          100% { transform: scale(1.16); filter: drop-shadow(0 0 11px rgba(245, 158, 11, 0.95)); }
        }

        /* 3D Tactile Buttons */
        .btn-3d-magenta {
          background: linear-gradient(180deg, #b84b90 0%, #A94384 60%, #8e356e 100%);
          color: #ffffff;
          border: 1px solid #7c2d5f;
          border-radius: 9px;
          padding: 7px 14px;
          font-weight: 700;
          font-size: 12.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(169, 67, 132, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition: all 0.15s ease;
        }
        .btn-3d-magenta:hover {
          background: linear-gradient(180deg, #c4559b 0%, #b3478c 60%, #993a77 100%);
          box-shadow: 0 4px 10px rgba(169, 67, 132, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .btn-3d-magenta:active {
          transform: translateY(1px);
          box-shadow: 0 1px 2px rgba(169, 67, 132, 0.3);
        }

        .btn-schedule-quick {
          background: #fdf2f8;
          color: #A94384;
          border: 1px solid #fbcfe8;
          border-radius: 7px;
          padding: 5px 10px;
          font-size: 11.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.16s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .btn-schedule-quick:hover {
          background: #A94384;
          color: #ffffff;
          border-color: #A94384;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(169, 67, 132, 0.25);
        }

        /* History Badge */
        .history-badge-btn {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .history-badge-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .history-badge-btn.has-appointments {
          background: #f0fdf4;
          color: #166534;
          border-color: #bbf7d0;
        }

        /* Grid View Layout */
        .patients-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
          padding: 16px;
        }
        .patient-card-3d {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-light, #e6e6e2);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          position: relative;
        }
        .patient-card-3d:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        /* Modal Overlay & Styling */
        .vitadent-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: fadeIn 0.15s ease-out;
        }
        .vitadent-modal-box {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(14px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

        .modal-vitadent-head {
          padding: 18px 22px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        }
        .modal-vitadent-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 75vh;
          overflow-y: auto;
        }
        .modal-vitadent-footer {
          padding: 14px 22px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          background: #f8fafc;
        }
        .vitadent-field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .vitadent-field-group label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .vitadent-field-group input,
        .vitadent-field-group select,
        .vitadent-field-group textarea {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #0f172a;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .vitadent-field-group input:focus,
        .vitadent-field-group select:focus,
        .vitadent-field-group textarea:focus {
          outline: none;
          border-color: #A94384;
          box-shadow: 0 0 0 3px rgba(169, 67, 132, 0.15);
        }
      `}</style>

      {/* Local Toast Banner */}
      {localToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            borderLeft: '4px solid #A94384'
          }}
        >
          <Sparkles size={16} color="#f59e0b" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Directorio de Pacientes & Convenios</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Pacientes</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill" onClick={() => onNavigate('/presupuestos')}>
              <span>Presupuestos</span>
              <span className="cadra-badge badge-orange">6</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/precios')}>
              <ShoppingBag size={13} />
              <span>Precios & Caja</span>
            </button>
            <button className="submodule-pill active" onClick={() => onNavigate('/pacientes')}>
              <Users size={13} />
              <span>Pacientes ({contacts.length})</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/agenda')}>
              <Calendar size={13} />
              <span>Agenda Sillones</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/pagos')}>
              <CreditCard size={13} />
              <span>Cobros</span>
            </button>
          </div>
        </div>

        <div className="cadra-header-actions">
          <button className="btn-3d-magenta" onClick={() => setIsNewPatientModalOpen(true)}>
            <Plus size={16} />
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search + Filter Tabs + View Mode */}
      <div className="contacts-control-bar">
        <div className="contacts-search-box">
          <Search size={15} className="text-secondary" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula CC, ciudad, especialidad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Pestañas de Filtro Rápido con Favoritos Destacado */}
        <div className="cadra-pill-group">
          <button
            className={`pill-switch-btn ${typeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setTypeFilter('All')}
          >
            Todos ({contacts.length})
          </button>

          <button
            className={`pill-switch-btn ${typeFilter === 'Favorites' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Favorites')}
            style={
              typeFilter === 'Favorites'
                ? { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontWeight: 700 }
                : { color: '#b45309' }
            }
          >
            <span style={{ marginRight: '4px' }}>⭐</span>
            Favoritos ({starredContacts.length})
          </button>

          <button
            className={`pill-switch-btn ${typeFilter === 'Customers' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Customers')}
          >
            Pacientes
          </button>

          <button
            className={`pill-switch-btn ${typeFilter === 'Partners' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Partners')}
          >
            Convenios / EPS
          </button>

          <button
            className={`pill-switch-btn ${typeFilter === 'Vendors' ? 'active' : ''}`}
            onClick={() => setTypeFilter('Vendors')}
          >
            Proveedores
          </button>
        </div>

        <div className="view-toggle-buttons">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="Vista de Lista"
            title="Vista de Lista"
          >
            <List size={16} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Vista de Cuadrícula"
            title="Vista de Cuadrícula"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Split: Directory (left) vs Starred & Stats (right) */}
      <div className="contacts-split-layout">
        {/* Left: Address book card */}
        <div className="cadra-card address-book-card">
          <div className="address-book-head">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-secondary" />
              <h3>Directorio Clínico VitaDent</h3>
            </div>
            <span className="total-companies-badge">
              {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
              {typeFilter === 'Favorites' && ' destacados'}
            </span>
          </div>

          {/* Alphabet Scrubber */}
          <div className="alphabet-scrubber">
            <button
              className={`alpha-char-btn ${activeLetter === null ? 'active' : ''}`}
              onClick={() => setActiveLetter(null)}
            >
              Todos
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                className={`alpha-char-btn ${activeLetter === char ? 'active' : ''}`}
                onClick={() => setActiveLetter(activeLetter === char ? null : char)}
              >
                {char}
              </button>
            ))}
          </div>

          {/* View Mode: List or Grid */}
          {viewMode === 'list' ? (
            <div className="contacts-groups-list">
              {sortedLetters.length === 0 ? (
                <div className="empty-contacts-state" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  <AlertCircle size={24} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                  <strong>No se encontraron registros coincidentes.</strong>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    {typeFilter === 'Favorites'
                      ? 'No tienes pacientes marcados como favoritos. Haz clic en la estrella de cualquier paciente para destacarlo.'
                      : 'Prueba ajustando el texto de búsqueda o el filtro seleccionado.'}
                  </p>
                </div>
              ) : (
                sortedLetters.map((letter) => (
                  <div key={letter} className="contact-letter-section">
                    <div className="letter-header">
                      <span className="letter-char">{letter}</span>
                      <span className="letter-count">{grouped[letter].length}</span>
                    </div>

                    <div className="letter-contacts-list">
                      {grouped[letter].map((c) => {
                        const patientApts = getPatientAppointments(c.id)
                        const latestApt = patientApts[0]

                        return (
                          <div key={c.id} className="contact-row-item">
                            {/* Estrella de Favorito con brillo táctil */}
                            <button
                              className={`star-fav-btn ${c.starred ? 'is-starred' : ''}`}
                              onClick={(e) => toggleStar(c.id, e)}
                              title={c.starred ? 'Remover de Favoritos' : 'Destacar como Paciente Favorito'}
                            >
                              <Star
                                size={17}
                                fill={c.starred ? '#f59e0b' : 'none'}
                                stroke={c.starred ? '#d97706' : '#94a3b8'}
                                strokeWidth={2}
                              />
                            </button>

                            {/* Avatar */}
                            <div className="contact-avatar-circle" style={{ backgroundColor: c.starred ? '#fef3c7' : undefined, color: c.starred ? '#b45309' : undefined }}>
                              {c.initials}
                            </div>

                            {/* Info Principal */}
                            <div className="contact-main-info">
                              <div className="flex items-center gap-2">
                                <span className="contact-company-name">{c.company}</span>
                                {c.starred && (
                                  <span style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    FAVORITO
                                  </span>
                                )}
                              </div>
                              <span className="contact-rep-title">{c.rep}</span>
                            </div>

                            {/* Tipo de Registro */}
                            <span
                              className={`contact-type-tag ${
                                c.type === 'Vendor' ? 'tag-vendor' : c.type === 'Customer' ? 'tag-customer' : 'tag-partner'
                              }`}
                            >
                              ● {c.type === 'Customer' ? 'Paciente' : c.type === 'Partner' ? 'Convenio' : 'Proveedor'}
                            </span>

                            {/* Ubicación */}
                            <div className="contact-location-info">
                              <MapPin size={13} className="text-secondary" />
                              <span>{c.city}</span>
                            </div>

                            {/* Especialidad Clínica */}
                            <span className="contact-category-info">{c.category}</span>

                            {/* Badge del Historial de Citas y Tratamientos */}
                            <button
                              className={`history-badge-btn ${patientApts.length > 0 ? 'has-appointments' : ''}`}
                              onClick={(e) => handleOpenHistory(c, e)}
                              title="Ver historial clínico de citas y tratamientos"
                            >
                              <Calendar size={12} />
                              <span>
                                {patientApts.length > 0
                                  ? `${patientApts.length} Cita${patientApts.length > 1 ? 's' : ''}`
                                  : 'Sin Citas'}
                              </span>
                              {latestApt && (
                                <span style={{ opacity: 0.8, fontSize: '9.5px', marginLeft: '2px' }}>
                                  ({latestApt.date.includes('Hoy') ? 'Hoy' : latestApt.date.split(' ')[0]})
                                </span>
                              )}
                            </button>

                            {/* Botón Acción Rápida: Agendar Cita */}
                            {c.type === 'Customer' && (
                              <button
                                className="btn-schedule-quick"
                                onClick={(e) => handleOpenSchedule(c, e)}
                                title={`Agendar nueva cita para ${c.company}`}
                              >
                                <Calendar size={13} />
                                <span>Agendar Cita</span>
                              </button>
                            )}

                            {/* Contact Action Buttons */}
                            <div className="contact-action-buttons">
                              <a href={`mailto:${c.email}`} className="contact-action-btn" title={c.email}>
                                <Mail size={14} />
                              </a>
                              <a href={`tel:${c.phone}`} className="contact-action-btn" title={c.phone}>
                                <Phone size={14} />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="patients-grid-container">
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  No hay pacientes en esta vista.
                </div>
              ) : (
                filtered.map((c) => {
                  const patientApts = getPatientAppointments(c.id)
                  const latestApt = patientApts[0]

                  return (
                    <div key={c.id} className="patient-card-3d">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="contact-avatar-circle" style={{ backgroundColor: c.starred ? '#fef3c7' : undefined, color: c.starred ? '#b45309' : undefined }}>
                            {c.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>{c.company}</h4>
                              {c.starred && <span title="Paciente Favorito">⭐</span>}
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>{c.rep}</span>
                          </div>
                        </div>

                        <button
                          className={`star-fav-btn ${c.starred ? 'is-starred' : ''}`}
                          onClick={(e) => toggleStar(c.id, e)}
                          title={c.starred ? 'Remover de Favoritos' : 'Destacar como Favorito'}
                        >
                          <Star
                            size={16}
                            fill={c.starred ? '#f59e0b' : 'none'}
                            stroke={c.starred ? '#d97706' : '#94a3b8'}
                          />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
                        <MapPin size={12} color="#8A8A8F" />
                        <span>{c.city}</span>
                        <span>•</span>
                        <span style={{ color: '#A94384', fontWeight: 600 }}>{c.category}</span>
                      </div>

                      {/* Historial Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <button
                          className={`history-badge-btn ${patientApts.length > 0 ? 'has-appointments' : ''}`}
                          onClick={(e) => handleOpenHistory(c, e)}
                        >
                          <Calendar size={12} />
                          <span>{patientApts.length > 0 ? `${patientApts.length} Cita(s)` : 'Sin Citas'}</span>
                          {latestApt && <span style={{ opacity: 0.8, fontSize: '9px' }}>• {latestApt.treatment.substring(0, 18)}...</span>}
                        </button>

                        <div className="flex items-center gap-1">
                          <a href={`mailto:${c.email}`} className="contact-action-btn" title={c.email}>
                            <Mail size={13} />
                          </a>
                          <a href={`tel:${c.phone}`} className="contact-action-btn" title={c.phone}>
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>

                      {/* Botón Directo: Agendar Cita */}
                      {c.type === 'Customer' && (
                        <button
                          className="btn-schedule-quick"
                          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                          onClick={(e) => handleOpenSchedule(c, e)}
                        >
                          <Calendar size={13} />
                          <span>Agendar Cita en Sillón</span>
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Starred + Who's in the book */}
        <aside className="contacts-sidebar-panel">
          {/* Starred Card */}
          <div className="cadra-card contacts-side-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <div className="side-card-title-row">
              <div className="flex items-center gap-2">
                <Star size={16} fill="#f59e0b" color="#d97706" />
                <h3 style={{ margin: 0, fontWeight: 700 }}>Favoritos ({starredContacts.length})</h3>
              </div>
              {starredContacts.length > 0 && (
                <button
                  style={{ background: 'none', border: 'none', fontSize: '11px', color: '#A94384', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setTypeFilter('Favorites')}
                >
                  Ver todos
                </button>
              )}
            </div>

            {starredContacts.length === 0 ? (
              <div className="starred-empty-box">
                <Star size={24} className="text-secondary mb-1" style={{ opacity: 0.4 }} />
                <strong>Ningún paciente destacado aún</strong>
                <p>Haz clic en la estrella de los pacientes que atiendes recurrentemente para tenerlos siempre a mano.</p>
              </div>
            ) : (
              <div className="starred-contacts-list">
                {starredContacts.map((sc) => (
                  <div
                    key={sc.id}
                    className="starred-mini-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenSchedule(sc)}
                    title="Click para agendar cita rápida"
                  >
                    <span className="contact-avatar-circle small" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                      {sc.initials}
                    </span>
                    <div className="starred-mini-texts" style={{ flex: 1 }}>
                      <span className="starred-mini-company">{sc.company}</span>
                      <span className="starred-mini-rep">{sc.category}</span>
                    </div>
                    <Calendar size={13} color="#A94384" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Distribución del Directorio */}
          <div className="cadra-card contacts-side-card mt-4">
            <div className="side-card-title-row">
              <PieChart size={16} className="text-secondary" />
              <h3>Composición del Directorio</h3>
            </div>

            <div className="donut-chart-container">
              <div className="donut-graphic-wrapper">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  {/* Pacientes: ~70% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#A94384"
                    strokeWidth="12"
                    strokeDasharray="166 238"
                    strokeDashoffset="0"
                  />
                  {/* Proveedores: ~20% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="12"
                    strokeDasharray="48 238"
                    strokeDashoffset="-166"
                  />
                  {/* Convenios: ~10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="24 238"
                    strokeDashoffset="-214"
                  />
                </svg>
                <div className="donut-center-label">
                  <span className="donut-big-num">{contacts.length}</span>
                  <span className="donut-sub">registros</span>
                </div>
              </div>

              <div className="donut-legend-stack">
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot" style={{ backgroundColor: '#A94384' }} />
                    <span>Pacientes</span>
                  </span>
                  <strong>{contacts.filter((c) => c.type === 'Customer').length}</strong>
                </div>
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot dot-terracotta" />
                    <span>Proveedores</span>
                  </span>
                  <strong>{contacts.filter((c) => c.type === 'Vendor').length}</strong>
                </div>
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot dot-green" />
                    <span>Convenios</span>
                  </span>
                  <strong>{contacts.filter((c) => c.type === 'Partner').length}</strong>
                </div>
              </div>
            </div>

            <div className="book-geo-footer">
              <span>🦷 Clínica Odontológica VitaDent · Sede Bogotá & Sabana</span>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          MODAL: REGISTRAR NUEVO PACIENTE
          ========================================================================= */}
      {isNewPatientModalOpen && (
        <div className="vitadent-modal-overlay" onClick={() => setIsNewPatientModalOpen(false)}>
          <div className="vitadent-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-vitadent-head">
              <div className="flex items-center gap-2">
                <UserCheck size={20} color="#A94384" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Registrar Nuevo Paciente</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Ficha médica y de contacto para VitaDent</span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsNewPatientModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePatient}>
              <div className="modal-vitadent-body">
                <div className="vitadent-field-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Camila Andrea Restrepo Duarte"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="vitadent-field-group">
                    <label>Documento de Identidad / CC *</label>
                    <input
                      type="text"
                      placeholder="Ej. 1024589201"
                      value={newPatientDoc}
                      onChange={(e) => setNewPatientDoc(e.target.value)}
                    />
                  </div>

                  <div className="vitadent-field-group">
                    <label>Teléfono / Móvil *</label>
                    <input
                      type="tel"
                      placeholder="Ej. +57 311 405 2910"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="vitadent-field-group">
                    <label>Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="camila.restrepo@gmail.com"
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                    />
                  </div>

                  <div className="vitadent-field-group">
                    <label>Ciudad</label>
                    <select value={newPatientCity} onChange={(e) => setNewPatientCity(e.target.value)}>
                      <option value="Bogotá">Bogotá</option>
                      <option value="Chía">Chía</option>
                      <option value="Cajicá">Cajicá</option>
                      <option value="Soacha">Soacha</option>
                      <option value="Medellín">Medellín</option>
                    </select>
                  </div>
                </div>

                <div className="vitadent-field-group">
                  <label>Categoría / Tratamiento de Interés *</label>
                  <select value={newPatientCategory} onChange={(e) => setNewPatientCategory(e.target.value)}>
                    <option value="Ortodoncia">Ortodoncia (Brackets / Alineadores)</option>
                    <option value="Implantes & Cirugía">Implantes de Titanio & Cirugía Oral</option>
                    <option value="Odontología General & Diagnóstico">Odontología General & Diagnóstico</option>
                    <option value="Endodoncia">Endodoncia (Tratamiento de Conducto)</option>
                    <option value="Estética Dental & Carillas">Estética Dental & Diseño de Sonrisa</option>
                    <option value="Higiene & Prevención">Higiene & Limpieza Ultrasonido</option>
                  </select>
                </div>

                {/* Marcar como Favorito */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fde68a',
                    cursor: 'pointer'
                  }}
                  onClick={() => setNewPatientStarred(!newPatientStarred)}
                >
                  <Star
                    size={18}
                    fill={newPatientStarred ? '#f59e0b' : 'none'}
                    stroke={newPatientStarred ? '#d97706' : '#94a3b8'}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#92400e' }}>
                      Marcar como Paciente Favorito
                    </div>
                    <div style={{ fontSize: '11px', color: '#b45309' }}>
                      Aparecerá en el panel de acceso rápido y en la pestaña de Favoritos
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={newPatientStarred}
                    onChange={(e) => setNewPatientStarred(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="modal-vitadent-footer">
                <button
                  type="button"
                  className="cadra-btn-secondary"
                  onClick={() => setIsNewPatientModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-3d-magenta">
                  <Check size={16} />
                  <span>Guardar Paciente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AGENDAR CITA PARA PACIENTE
          ========================================================================= */}
      {isScheduleModalOpen && selectedPatient && (
        <div className="vitadent-modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="vitadent-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-vitadent-head">
              <div className="flex items-center gap-2">
                <Calendar size={20} color="#A94384" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Agendar Cita en Sillón</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Paciente: <strong>{selectedPatient.company}</strong> ({selectedPatient.rep})
                  </span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsScheduleModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment}>
              <div className="modal-vitadent-body">
                {/* Patient Summary Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div className="contact-avatar-circle small">{selectedPatient.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{selectedPatient.company}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {selectedPatient.rep} • {selectedPatient.phone}
                    </div>
                  </div>
                  <span className="cadra-tag-pill tag-blue">{selectedPatient.category}</span>
                </div>

                {/* Doctor Selection */}
                <div className="vitadent-field-group">
                  <label>Especialista / Odontólogo Tratante *</label>
                  <select
                    value={scheduleDoctor}
                    onChange={(e) => {
                      const docName = e.target.value
                      setScheduleDoctor(docName)
                      if (docName.includes('Sofía')) setScheduleBox('Sillón 1 (General)')
                      else if (docName.includes('Alejandro')) setScheduleBox('Sillón 2 (Ortodoncia)')
                      else if (docName.includes('Claudia')) setScheduleBox('Sillón 3 (Endodoncia)')
                      else if (docName.includes('Marcos')) setScheduleBox('Sillón 4 (Cirugía)')
                    }}
                  >
                    {vitadentConfig.doctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} — {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Treatment Selection */}
                <div className="vitadent-field-group">
                  <label>Tratamiento / Procedimiento Clínico *</label>
                  <select
                    value={scheduleTreatment}
                    onChange={(e) => setScheduleTreatment(e.target.value)}
                  >
                    {vitadentConfig.treatments.map((t) => (
                      <option key={t.code} value={t.name}>
                        {t.name} ({t.durationMin} min) — ${t.priceCop.toLocaleString('es-CO')} COP
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="vitadent-field-group">
                    <label>Fecha de la Cita *</label>
                    <select value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}>
                      <option value="Hoy">Hoy (Inmediato)</option>
                      <option value="Mañana, 12 Nov 2026">Mañana (12 Nov)</option>
                      <option value="13 Nov 2026">Jueves, 13 Nov 2026</option>
                      <option value="14 Nov 2026">Viernes, 14 Nov 2026</option>
                      <option value="17 Nov 2026">Lunes, 17 Nov 2026</option>
                      <option value="20 Nov 2026">Jueves, 20 Nov 2026</option>
                    </select>
                  </div>

                  <div className="vitadent-field-group">
                    <label>Hora *</label>
                    <select value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Box / Sillón */}
                <div className="vitadent-field-group">
                  <label>Sillón Odontológico (Box) *</label>
                  <select value={scheduleBox} onChange={(e) => setScheduleBox(e.target.value)}>
                    <option value="Sillón 1 (General)">Sillón 1 — Dra. Sofía Valenzuela (General & Estética)</option>
                    <option value="Sillón 2 (Ortodoncia)">Sillón 2 — Dr. Alejandro Soto (Ortodoncia)</option>
                    <option value="Sillón 3 (Endodoncia)">Sillón 3 — Dra. Claudia Rivas (Endodoncia Rotatoria)</option>
                    <option value="Sillón 4 (Cirugía)">Sillón 4 — Dr. Marcos Pineda (Cirugía & Implantes)</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="vitadent-field-group">
                  <label>Observaciones Previas</label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Paciente refiere molestia al frío en cuadrante superior derecho..."
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-vitadent-footer">
                <button
                  type="button"
                  className="cadra-btn-secondary"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-3d-magenta">
                  <Calendar size={15} />
                  <span>Confirmar y Agendar Cita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: HISTORIAL CLÍNICO DE CITAS Y TRATAMIENTOS
          ========================================================================= */}
      {isHistoryModalOpen && selectedPatient && (
        <div className="vitadent-modal-overlay" onClick={() => setIsHistoryModalOpen(false)}>
          <div className="vitadent-modal-box" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-vitadent-head">
              <div className="flex items-center gap-2">
                <Stethoscope size={20} color="#A94384" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Historial de Citas y Tratamientos</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {selectedPatient.company} • {selectedPatient.rep}
                  </span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsHistoryModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-vitadent-body">
              {getPatientAppointments(selectedPatient.id).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b' }}>
                  <Calendar size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                  <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>Sin historial de citas</h4>
                  <p style={{ fontSize: '12px', margin: 0 }}>
                    Este paciente aún no registra citas agendadas o atendidas en el sistema.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {getPatientAppointments(selectedPatient.id).map((apt) => (
                    <div
                      key={apt.id}
                      style={{
                        padding: '12px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{apt.treatment}</strong>
                        <span
                          className={`cadra-tag-pill ${
                            apt.status === 'Pagada'
                              ? 'tag-green'
                              : apt.status === 'Facturada'
                              ? 'tag-blue'
                              : apt.status === 'Atendida'
                              ? 'tag-orange'
                              : 'tag-purple'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#64748b' }}>
                        <span>👨‍⚕️ {apt.doctor}</span>
                        <span>•</span>
                        <span>📅 {apt.date} ({apt.time})</span>
                        <span>•</span>
                        <span>🪑 {apt.box}</span>
                      </div>

                      {apt.notes && (
                        <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic', background: '#ffffff', padding: '4px 8px', borderRadius: '4px' }}>
                          Nota: {apt.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-between" style={{ marginTop: '2px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#A94384' }}>
                          ${apt.price.toLocaleString('es-CO')} COP
                        </span>

                        {apt.status !== 'Pagada' && (
                          <button
                            className="btn-schedule-quick"
                            style={{ fontSize: '10.5px', padding: '3px 8px' }}
                            onClick={() => {
                              setIsHistoryModalOpen(false)
                              onNavigate('/pagos')
                            }}
                          >
                            <CreditCard size={11} />
                            <span>Registrar Cobro</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-vitadent-footer">
              <button
                type="button"
                className="btn-schedule-quick"
                onClick={() => {
                  setIsHistoryModalOpen(false)
                  handleOpenSchedule(selectedPatient)
                }}
              >
                <Calendar size={13} />
                <span>Agendar Otra Cita</span>
              </button>

              <button
                type="button"
                className="cadra-btn-secondary"
                onClick={() => setIsHistoryModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import {
  Download,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Check,
  AlertCircle,
  Sparkles,
  UserCheck,
  Stethoscope,
  Clock,
  DollarSign
} from 'lucide-react'
import { paymentTransactionsData, billsToPayData, contactsData } from '../../data/cadraData'
import { PaymentTransaction, ContactItem } from '../../types'
import { vitadentConfig } from '../../config/clinic.config'
import { PatientAppointment, INITIAL_PATIENT_APPOINTMENTS } from '../sales/ContactsPage'

interface PaymentsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
  onToast: (msg: string) => void
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, onOpenCreate, onToast }) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(paymentTransactionsData)
  const [bills, setBills] = useState(billsToPayData)
  const [filterType, setFilterType] = useState<'All' | 'Money in' | 'Money out'>('All')
  const [flowView, setFlowView] = useState<'running' | 'daily'>('running')
  const [query, setQuery] = useState('')

  // Load patients from storage or cadraData
  const [contacts] = useState<ContactItem[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_contacts')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return contactsData
  })

  // Load appointments from storage or initial appointments
  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_appointments')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_PATIENT_APPOINTMENTS
  })

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'ACH transfer' | 'Wire'>('Card')
  const [paymentMethodLabel, setPaymentMethodLabel] = useState<string>('Tarjeta Débito / Crédito')
  const [paymentNotes, setPaymentNotes] = useState<string>('')
  const [paymentReceiptRef, setPaymentReceiptRef] = useState<string>('')

  // Inline Quick Schedule State (when a patient has no appointment)
  const [isQuickScheduling, setIsQuickScheduling] = useState(false)
  const [quickDoc, setQuickDoc] = useState(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
  const [quickTreatment, setQuickTreatment] = useState(vitadentConfig.treatments[0]?.name || 'Primera consulta + Diagnóstico')
  const [quickDate, setQuickDate] = useState('Hoy')

  // Save appointments whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vitadent_appointments', JSON.stringify(appointments))
    } catch {
      // ignore
    }
  }, [appointments])

  // Selected patient object
  const selectedPatient = contacts.find((c) => c.id === selectedPatientId)

  // Appointments of selected patient
  const patientAppointments = appointments.filter((a) => a.patientId === selectedPatientId)

  // Selected appointment object
  const selectedAppointment = appointments.find((a) => a.id === selectedAppointmentId)

  // When patient selection changes, auto-select first appointment or reset
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId)
    setIsQuickScheduling(false)
    const apts = appointments.filter((a) => a.patientId === patientId)
    if (apts.length > 0) {
      const firstApt = apts[0]
      setSelectedAppointmentId(firstApt.id)
      setPaymentAmount(firstApt.price)
      setPaymentReceiptRef(`REC-${Math.floor(4100 + transactions.length + 1)} · ${firstApt.treatment}`)
    } else {
      setSelectedAppointmentId('')
      setPaymentAmount(0)
      setPaymentReceiptRef('')
    }
  }

  // When appointment selection changes, auto-fill price and receipt
  const handleSelectAppointment = (aptId: string) => {
    setSelectedAppointmentId(aptId)
    const apt = appointments.find((a) => a.id === aptId)
    if (apt) {
      setPaymentAmount(apt.price)
      setPaymentReceiptRef(`REC-${Math.floor(4100 + transactions.length + 1)} · ${apt.treatment}`)
    }
  }

  // Quick schedule for patient with no appointment
  const handleQuickCreateAppointment = () => {
    if (!selectedPatient) return

    const treat = vitadentConfig.treatments.find((t) => t.name === quickTreatment)
    const price = treat ? treat.priceCop : 100000

    const newApt: PatientAppointment = {
      id: `apt-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.company,
      doctor: quickDoc,
      treatment: quickTreatment,
      date: quickDate,
      time: '11:00 AM',
      box: 'Sillón 1 (General)',
      price,
      status: 'Programada',
      notes: 'Cita generada para registro de pago directo'
    }

    const updated = [newApt, ...appointments]
    setAppointments(updated)
    setSelectedAppointmentId(newApt.id)
    setPaymentAmount(price)
    setPaymentReceiptRef(`REC-${Math.floor(4100 + transactions.length + 1)} · ${quickTreatment}`)
    setIsQuickScheduling(false)
    onToast(`Cita creada para ${selectedPatient.company} (${quickTreatment})`)
  }

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()

    // Regla estricta: para que haya pago debe haber cita y paciente
    if (!selectedPatient) {
      alert('Debe seleccionar un paciente para registrar el pago.')
      return
    }
    if (!selectedAppointment) {
      alert('Regla Clínica VitaDent: Debe asociar una cita previa o agendar una para registrar el cobro.')
      return
    }
    if (paymentAmount <= 0) {
      alert('El monto del pago debe ser mayor a cero.')
      return
    }

    const newTx: PaymentTransaction = {
      id: `pt-${Date.now()}`,
      party: selectedPatient.company,
      initials: selectedPatient.initials,
      docRef: paymentReceiptRef || `FAC-${Math.floor(4100 + transactions.length + 1)} · ${selectedAppointment.treatment}`,
      method: paymentMethod,
      date: '11 Nov 2026',
      relativeDate: 'Hoy, hace un momento',
      amount: paymentAmount,
      type: 'in'
    }

    // Prepend to transactions
    setTransactions((prev) => [newTx, ...prev])

    // Update appointment status to 'Pagada'
    setAppointments((prev) =>
      prev.map((a) => (a.id === selectedAppointment.id ? { ...a, status: 'Pagada' } : a))
    )

    onToast(
      `¡Pago de $${paymentAmount.toLocaleString('es-CO')} COP registrado para ${selectedPatient.company} (${selectedAppointment.treatment})!`
    )

    // Reset & close
    setIsPaymentModalOpen(false)
    setSelectedPatientId('')
    setSelectedAppointmentId('')
    setPaymentAmount(0)
    setPaymentNotes('')
  }

  const handlePayBill = (billId: string, vendor: string, amt: number) => {
    setBills((prev) => prev.filter((b) => b.id !== billId))
    onToast(`Pago de $${amt.toLocaleString('es-CO')} COP a ${vendor} programado exitosamente.`)
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      filterType === 'All' ? true : filterType === 'Money in' ? t.type === 'in' : t.type === 'out'
    const matchesQuery =
      t.party.toLowerCase().includes(query.toLowerCase()) ||
      t.docRef.toLowerCase().includes(query.toLowerCase()) ||
      t.method.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  // Group by relativeDate
  const grouped: Record<string, PaymentTransaction[]> = {}
  filteredTransactions.forEach((t) => {
    if (!grouped[t.relativeDate]) grouped[t.relativeDate] = []
    grouped[t.relativeDate].push(t)
  })

  // Calculate totals
  const totalMoneyIn = transactions.filter((t) => t.type === 'in').reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="cadra-page-container">
      {/* 3D Tactile & Modal CSS */}
      <style>{`
        .btn-3d-magenta {
          background: linear-gradient(180deg, #b84b90 0%, #A94384 60%, #8e356e 100%);
          color: #ffffff;
          border: 1px solid #7c2d5f;
          border-radius: 9px;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(169, 67, 132, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition: all 0.15s ease;
        }
        .btn-3d-magenta:hover {
          background: linear-gradient(180deg, #c4559b 0%, #b3478c 60%, #993a77 100%);
          box-shadow: 0 4px 12px rgba(169, 67, 132, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .btn-3d-magenta:active {
          transform: translateY(1px);
          box-shadow: 0 1px 2px rgba(169, 67, 132, 0.3);
        }

        .payment-rule-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #fdf2f8;
          border: 1px solid #fbcfe8;
          border-radius: 8px;
          color: #831843;
          font-size: 11.5px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .appointment-selection-card {
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.16s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .appointment-selection-card:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .appointment-selection-card.selected {
          border-color: #A94384;
          background: #fdf2f8;
          box-shadow: 0 0 0 1px #A94384;
        }

        .method-choice-pill {
          flex: 1;
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
        }
        .method-choice-pill.active {
          background: #A94384;
          color: #ffffff;
          border-color: #A94384;
          box-shadow: 0 2px 6px rgba(169, 67, 132, 0.3);
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Facturación & Cobros</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Pagos & Honorarios Médicos</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Pagos & Cobros</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/ledger')}>
              Libro Mayor
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/accounting/invoices')}>
              Facturas Tratamientos
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/pagos')}>
              Cobros & Honorarios
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/agenda')}>
              Agenda Sillones
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/pacientes')}>
              Pacientes
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            {/* Botón principal Registrar Pago abre el modal integrado */}
            <button className="btn-3d-magenta" onClick={() => setIsPaymentModalOpen(true)}>
              <CreditCard size={16} />
              <span>Registrar Pago</span>
            </button>

            <button
              className="cadra-btn-secondary"
              onClick={() => onToast('Exportando reporte contable de recaudos en Excel...')}
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Money in */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <ArrowDownLeft size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Ingresos · 30 días</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={`$${(totalMoneyIn / 1000).toFixed(0)}k`} duration={750} delay={100} />
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Recaudos de pacientes & convenios</span>
        </div>

        {/* Card 2: Money out */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <ArrowUpRight size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Egresos · Honorarios & Lab</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$16,366" duration={750} delay={150} />
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Liquidaciones a doctores y compras</span>
        </div>

        {/* Card 3: Net cash flow */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <TrendingUp size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Flujo de Caja Neto</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="$80,350" duration={750} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-green">Superávit</span>
          </div>
        </div>

        {/* Card 4: Cash on hand */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Building2 size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Disponible en Bancos & Caja</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$221,553" duration={750} delay={250} />
          </div>
        </div>
      </div>

      {/* Row 2: Cash Flow Chart (Left) + How money moved (Right) */}
      <div className="payments-split-layout mt-4">
        {/* Cash Flow Chart */}
        <div className="cadra-card cash-flow-chart-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-secondary" />
              <h3>Flujo de Caja de la Clínica</h3>
            </div>

            <div className="cadra-pill-group">
              <button
                className={`pill-switch-btn ${flowView === 'running' ? 'active' : ''}`}
                onClick={() => setFlowView('running')}
              >
                Acumulado
              </button>
              <button
                className={`pill-switch-btn ${flowView === 'daily' ? 'active' : ''}`}
                onClick={() => setFlowView('daily')}
              >
                Diario
              </button>
            </div>
          </div>

          <div className="cash-flow-legend">
            <span className="legend-item">
              <i className="legend-dot dot-green" /> Ingresos Pacientes
            </span>
            <span className="legend-item">
              <i className="legend-dot dot-terracotta" /> Honorarios & Compras
            </span>
            <span className="text-muted text-xs">Periodo Actual (Oct 13 – Nov 11)</span>
          </div>

          {/* SVG Smooth Cash Flow Curve */}
          <div className="year-chart-wrapper">
            <div className="chart-y-axis">
              <span>$200k</span>
              <span>$100k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 135" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="moneyInFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="10" x2="600" y2="10" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="67" x2="600" y2="67" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="currentColor" strokeOpacity="0.08" />

                <path
                  d="M 0 128 L 50 125 L 100 122 L 160 110 L 230 108 L 320 105 L 400 100 L 500 95 L 540 65 L 600 60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 128 L 50 125 L 100 122 L 160 110 L 230 108 L 320 105 L 400 100 L 500 95 L 540 65 L 600 60 L 600 135 L 0 135 Z"
                  fill="url(#moneyInFill)"
                />
                <path
                  d="M 0 130 L 100 126 L 200 122 L 300 120 L 400 116 L 500 114 L 600 110"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="chart-x-axis">
                <span>13 Oct</span>
                <span>19 Oct</span>
                <span>25 Oct</span>
                <span>31 Oct</span>
                <span>06 Nov</span>
                <span>11 Nov</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Canales de Pago */}
        <div className="cadra-card money-moved-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-secondary" />
              <h3>Canales de Pago Recibidos</h3>
            </div>
            <span className="text-xs text-muted">Últimos 30 días</span>
          </div>

          <div className="money-moved-methods">
            <div className="moved-method-row">
              <div className="method-left">
                <Building2 size={16} className="text-secondary" />
                <div>
                  <strong>Transferencias (Nequi / Bancolombia)</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={8} /> recaudos
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$72,209" /></strong>
                <span className="text-xs text-muted">64%</span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '64%', backgroundColor: '#A94384' }} />
            </div>

            <div className="moved-method-row mt-2">
              <div className="method-left">
                <CreditCard size={16} className="text-secondary" />
                <div>
                  <strong>Datáfono (Tarjetas Débito / Crédito)</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={14} /> pagos
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$24,650" /></strong>
                <span className="text-xs text-muted">22%</span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '22%', backgroundColor: '#0284c7' }} />
            </div>

            <div className="moved-method-row mt-2">
              <div className="method-left">
                <DollarSign size={16} className="text-secondary" />
                <div>
                  <strong>Efectivo (Caja General Recepción)</strong>
                  <div className="text-xs text-muted">
                    <AnimatedCounter value={6} /> recibos
                  </div>
                </div>
              </div>
              <div className="method-right">
                <strong><AnimatedCounter value="$14,600" /></strong>
                <span className="text-xs text-muted">14%</span>
              </div>
            </div>
            <div className="method-bar-bg">
              <div className="method-bar-fill" style={{ width: '14%', backgroundColor: '#10b981' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Payments Transactions List (Left) + Bills to pay (Right) */}
      <div className="payments-split-layout mt-4">
        {/* Left: Payments List */}
        <div className="cadra-card transactions-card">
          <div className="table-header-toolbar">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📋</span>
              <h3>Registro de Transacciones & Cobros</h3>
            </div>

            <div className="cadra-pill-group">
              <button
                className={`pill-switch-btn ${filterType === 'All' ? 'active' : ''}`}
                onClick={() => setFilterType('All')}
              >
                Todos
              </button>
              <button
                className={`pill-switch-btn ${filterType === 'Money in' ? 'active' : ''}`}
                onClick={() => setFilterType('Money in')}
              >
                Ingresos (+)
              </button>
              <button
                className={`pill-switch-btn ${filterType === 'Money out' ? 'active' : ''}`}
                onClick={() => setFilterType('Money out')}
              >
                Egresos (-)
              </button>
            </div>
          </div>

          <div className="pos-search-input-box mb-3">
            <Search size={14} className="text-secondary" />
            <input
              type="text"
              placeholder="Buscar por paciente, documento, tratamiento o método..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Grouped Day Lists */}
          <div className="transactions-grouped-stack">
            {Object.keys(grouped).length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                No se encontraron transacciones con los filtros actuales.
              </div>
            ) : (
              Object.keys(grouped).map((groupTitle) => (
                <div key={groupTitle} className="trans-group-block">
                  <div className="trans-group-header">
                    <span>{groupTitle}</span>
                  </div>

                  <div className="trans-items-list">
                    {grouped[groupTitle].map((t) => (
                      <div key={t.id} className="trans-row-item">
                        <div className={`trans-icon-indicator ${t.type === 'in' ? 'in' : 'out'}`}>
                          {t.type === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>

                        <span
                          className="customer-initials-circle"
                          style={{
                            backgroundColor: t.type === 'in' ? '#fdf2f8' : '#f1f5f9',
                            color: t.type === 'in' ? '#A94384' : '#475569'
                          }}
                        >
                          {t.initials}
                        </span>

                        <div className="trans-party-details">
                          <strong>{t.party}</strong>
                          <div className="text-xs text-muted">{t.docRef}</div>
                        </div>

                        <div className="trans-method-box">
                          <span className="text-xs text-secondary">
                            {t.method === 'ACH transfer' ? '🏛️ Transferencia' : t.method === 'Wire' ? '🏦 Giro' : '💳 Tarjeta/Caja'}
                          </span>
                        </div>

                        <div className="trans-doc-box">
                          <span className="text-xs text-blue-600 underline cursor-pointer">
                            {t.docRef.split('·')[0].trim()}
                          </span>
                        </div>

                        <div className="trans-amount-box">
                          <span
                            className="font-semibold"
                            style={{ color: t.type === 'in' ? '#047857' : '#b91c1c' }}
                          >
                            {t.type === 'in' ? '+' : '-'}${t.amount.toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Bills to pay */}
        <aside className="cadra-card bills-to-pay-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">🛒</span>
              <h3>Cuentas por Pagar (Proveedores)</h3>
            </div>
            <strong>
              <AnimatedCounter value="$33,380" />
            </strong>
          </div>
          <div className="text-xs text-muted mb-3">
            <AnimatedCounter value={bills.length} /> facturas pendientes de pago a depósitos dentales
          </div>

          <div className="bills-to-pay-list">
            {bills.map((b) => (
              <div key={b.id} className="bill-row-item">
                <span className="customer-initials-circle">{b.initials}</span>
                <div className="bill-info">
                  <span className="bill-vendor-name">{b.vendor}</span>
                  <span className="bill-ref-desc">{b.desc}</span>
                  <span className="text-xs text-secondary mt-1">{b.due}</span>
                </div>
                <div className="bill-amount-actions">
                  <span className="bill-amount-text">${b.amount.toLocaleString('es-CO')}</span>
                  <button
                    className="bill-pay-btn"
                    onClick={() => handlePayBill(b.id, b.vendor, b.amount)}
                  >
                    Pagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* =========================================================================
          MODAL: REGISTRAR PAGO CLÍNICO
          Cumple la regla: "Para que haya cita debe haber paciente, y si hay pago debe haber cita y paciente"
          ========================================================================= */}
      {isPaymentModalOpen && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setIsPaymentModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            className="cadra-action-modal"
            style={{ maxWidth: '560px', width: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
              }}
            >
              <div className="flex items-center gap-2">
                <CreditCard size={20} color="#A94384" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Registrar Pago Clínico</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Cobro en recepción y caja de VitaDent</span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsPaymentModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment}>
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '75vh', overflowY: 'auto' }}>
                {/* Regla Clínica Destacada */}
                <div className="payment-rule-badge">
                  <Stethoscope size={16} color="#A94384" />
                  <span>
                    <strong>Flujo Clínico VitaDent:</strong> 1. Paciente ➔ 2. Cita/Tratamiento ➔ 3. Recibo de Pago
                  </span>
                </div>

                {/* PASO 1: SELECCIONAR PACIENTE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    1. Paciente Existente *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => handleSelectPatient(e.target.value)}
                    required
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a'
                    }}
                  >
                    <option value="">-- Selecciona un paciente de la lista --</option>
                    {contacts
                      .filter((c) => c.type === 'Customer')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.company} ({p.rep}) — {p.category}
                        </option>
                      ))}
                  </select>
                </div>

                {/* PASO 2: ASOCIAR CITA / TRATAMIENTO DEL PACIENTE */}
                {selectedPatient && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div className="flex items-center justify-between">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        2. Cita & Tratamiento Asociado *
                      </label>
                      <span style={{ fontSize: '11px', color: '#A94384', fontWeight: 600 }}>
                        {patientAppointments.length} cita(s) registrada(s)
                      </span>
                    </div>

                    {patientAppointments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {patientAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`appointment-selection-card ${selectedAppointmentId === apt.id ? 'selected' : ''}`}
                            onClick={() => handleSelectAppointment(apt.id)}
                          >
                            <div className="flex items-center justify-between">
                              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{apt.treatment}</strong>
                              <span
                                className={`cadra-tag-pill ${
                                  apt.status === 'Pagada'
                                    ? 'tag-green'
                                    : apt.status === 'Facturada'
                                    ? 'tag-blue'
                                    : 'tag-orange'
                                }`}
                                style={{ fontSize: '10px' }}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', gap: '10px' }}>
                              <span>👨‍⚕️ {apt.doctor}</span>
                              <span>•</span>
                              <span>📅 {apt.date}</span>
                              <span>•</span>
                              <strong style={{ color: '#A94384' }}>${apt.price.toLocaleString('es-CO')} COP</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Alerta de regla clínica: Sin cita no hay pago */
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '10px',
                          backgroundColor: '#fffbeb',
                          border: '1px solid #fef3c7',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle size={18} color="#d97706" style={{ marginTop: '2px' }} />
                          <div style={{ fontSize: '12px', color: '#92400e' }}>
                            <strong>Paciente sin citas registradas:</strong> La regla de la clínica exige que para
                            registrar un pago debe existir una cita y tratamiento asociado.
                          </div>
                        </div>

                        {!isQuickScheduling ? (
                          <button
                            type="button"
                            className="btn-3d-magenta"
                            style={{ alignSelf: 'flex-start', fontSize: '11.5px', padding: '5px 12px' }}
                            onClick={() => setIsQuickScheduling(true)}
                          >
                            <Calendar size={13} />
                            <span>Agendar Cita Rápida para este Paciente</span>
                          </button>
                        ) : (
                          /* Formulario inline de agendamiento rápido */
                          <div
                            style={{
                              marginTop: '6px',
                              padding: '10px',
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              border: '1px solid #fde68a',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400e' }}>
                              Agendar cita y asociar inmediatamente:
                            </span>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <select
                                value={quickDoc}
                                onChange={(e) => setQuickDoc(e.target.value)}
                                style={{ fontSize: '12px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              >
                                {vitadentConfig.doctors.map((d) => (
                                  <option key={d.id} value={d.name}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={quickTreatment}
                                onChange={(e) => setQuickTreatment(e.target.value)}
                                style={{ fontSize: '12px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              >
                                {vitadentConfig.treatments.map((t) => (
                                  <option key={t.code} value={t.name}>
                                    {t.name} (${t.priceCop.toLocaleString()} COP)
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              className="btn-3d-magenta"
                              style={{ alignSelf: 'flex-start', fontSize: '11.5px', padding: '5px 12px' }}
                              onClick={handleQuickCreateAppointment}
                            >
                              <Check size={13} />
                              <span>Crear Cita y Continuar al Cobro</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 3: DETALLES DEL PAGO */}
                {selectedAppointment && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          Monto a Cobrar (COP) *
                        </label>
                        <input
                          type="number"
                          required
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#047857'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          Comprobante / Recibo
                        </label>
                        <input
                          type="text"
                          value={paymentReceiptRef}
                          onChange={(e) => setPaymentReceiptRef(e.target.value)}
                          placeholder="REC-4106"
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick percentage abono buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPaymentAmount(selectedAppointment.price)}
                      >
                        Pago Total 100% (${selectedAppointment.price.toLocaleString('es-CO')})
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPaymentAmount(Math.round(selectedAppointment.price * 0.5))}
                      >
                        Abono 50% (${Math.round(selectedAppointment.price * 0.5).toLocaleString('es-CO')})
                      </button>
                    </div>

                    {/* Método de pago */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Método de Pago *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className={`method-choice-pill ${paymentMethod === 'Card' ? 'active' : ''}`}
                          onClick={() => {
                            setPaymentMethod('Card')
                            setPaymentMethodLabel('Datáfono (Tarjeta)')
                          }}
                        >
                          <CreditCard size={14} />
                          <span>Tarjeta / Datáfono</span>
                        </button>

                        <button
                          type="button"
                          className={`method-choice-pill ${paymentMethod === 'ACH transfer' ? 'active' : ''}`}
                          onClick={() => {
                            setPaymentMethod('ACH transfer')
                            setPaymentMethodLabel('Transferencia Bancaria')
                          }}
                        >
                          <Building2 size={14} />
                          <span>Nequi / Bancolombia</span>
                        </button>

                        <button
                          type="button"
                          className={`method-choice-pill ${paymentMethod === 'Wire' ? 'active' : ''}`}
                          onClick={() => {
                            setPaymentMethod('Wire')
                            setPaymentMethodLabel('Efectivo (Caja)')
                          }}
                        >
                          <DollarSign size={14} />
                          <span>Efectivo</span>
                        </button>
                      </div>
                    </div>

                    {/* Notas */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Notas de Cobro / Observaciones
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Cancelación completa de cuota de ortodoncia o abono inicial de implante"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '14px 22px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  background: '#f8fafc'
                }}
              >
                <button
                  type="button"
                  className="cadra-btn-secondary"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-3d-magenta"
                  disabled={!selectedPatient || !selectedAppointment || paymentAmount <= 0}
                  style={{
                    opacity: !selectedPatient || !selectedAppointment || paymentAmount <= 0 ? 0.5 : 1,
                    cursor: !selectedPatient || !selectedAppointment || paymentAmount <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Check size={16} />
                  <span>Confirmar y Registrar Pago</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

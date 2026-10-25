import React, { useState, useEffect, useMemo } from 'react'
import {
  CreditCard,
  Building2,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Check,
  AlertCircle,
  Stethoscope,
  Clock,
  DollarSign,
  Printer,
  Download,
  Eye,
  Edit3,
  Trash2,
  Filter,
  FileText,
  User,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Info
} from 'lucide-react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { contactsData } from '../../data/cadraData'
import { ContactItem } from '../../types'
import { vitadentConfig } from '../../config/clinic.config'
import { PatientAppointment, INITIAL_PATIENT_APPOINTMENTS } from '../sales/ContactsPage'

export interface ClinicalPayment {
  id: string
  receiptNumber: string
  patientId: string
  patientName: string
  patientDoc: string
  patientInitials: string
  patientPhone: string
  patientEmail: string
  treatment: string
  doctor: string
  amount: number
  method: 'Card' | 'Transfer' | 'Cash'
  methodLabel: string
  date: string
  time: string
  period: 'Hoy' | 'Esta Semana' | 'Este Mes'
  status: 'Completado' | 'Anulado'
  notes?: string
  cancellationReason?: string
  appointmentId?: string
}

const INITIAL_PAYMENTS: ClinicalPayment[] = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-4101',
    patientId: 'c-1',
    patientName: 'Carlos García Mendoza',
    patientDoc: 'CC 1.020.485.912',
    patientInitials: 'CG',
    patientPhone: '+57 310 445 8812',
    patientEmail: 'carlos.garcia@gmail.com',
    treatment: 'Implante de titanio + corona',
    doctor: 'Dr. Marcos Pineda',
    amount: 2500000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '11 Nov 2026',
    time: '10:15 AM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Abono fase quirúrgica e integración de corona en zirconio',
    appointmentId: 'apt-1'
  },
  {
    id: 'pay-2',
    receiptNumber: 'REC-4102',
    patientId: 'c-5',
    patientName: 'Mariana Torres Peña',
    patientDoc: 'CC 1.028.914.520',
    patientInitials: 'MT',
    patientPhone: '+57 314 220 9011',
    patientEmail: 'mariana.torres@hotmail.com',
    treatment: 'Primera consulta + Diagnóstico',
    doctor: 'Dra. Sofía Valenzuela',
    amount: 50000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '11 Nov 2026',
    time: '11:45 AM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Valoración inicial y plan de tratamiento estético'
  },
  {
    id: 'pay-3',
    receiptNumber: 'REC-4103',
    patientId: 'c-2',
    patientName: 'Laura Gómez Restrepo',
    patientDoc: 'CC 1.032.490.118',
    patientInitials: 'LG',
    patientPhone: '+57 301 556 7182',
    patientEmail: 'laura.gomez@yahoo.es',
    treatment: 'Ortodoncia (mensualidad)',
    doctor: 'Dr. Alejandro Soto',
    amount: 100000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '10 Nov 2026',
    time: '04:20 PM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Control mensual y cambio de arcos y elásticos ortodónticos'
  },
  {
    id: 'pay-4',
    receiptNumber: 'REC-4104',
    patientId: 'c-3',
    patientName: 'Andrés Felipe Mendoza',
    patientDoc: 'CC 1.015.632.880',
    patientInitials: 'AM',
    patientPhone: '+57 312 908 4433',
    patientEmail: 'andres.mendoza@outlook.com',
    treatment: 'Endodoncia unirradicular',
    doctor: 'Dra. Claudia Rivas',
    amount: 350000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '09 Nov 2026',
    time: '02:30 PM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Conductometría y obturación pieza 26 con localizador de ápice'
  },
  {
    id: 'pay-5',
    receiptNumber: 'REC-4105',
    patientId: 'c-6',
    patientName: 'Valentina Ríos Gómez',
    patientDoc: 'CC 1.018.742.319',
    patientInitials: 'VR',
    patientPhone: '+57 318 671 2049',
    patientEmail: 'valentina.rios@gmail.com',
    treatment: 'Limpieza dental ultrasonido',
    doctor: 'Dra. Sofía Valenzuela',
    amount: 90000,
    method: 'Cash',
    methodLabel: 'Efectivo',
    date: '08 Nov 2026',
    time: '09:15 AM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Profilaxis dental profunda y aplicación tópica de flúor'
  },
  {
    id: 'pay-6',
    receiptNumber: 'REC-4106',
    patientId: 'c-4',
    patientName: 'Mateo Fernández Silva',
    patientDoc: 'CC 1.026.331.094',
    patientInitials: 'MF',
    patientPhone: '+57 316 332 5091',
    patientEmail: 'mateo.fernandez@gmail.com',
    treatment: 'Extracción quirúrgica (cordal)',
    doctor: 'Dr. Marcos Pineda',
    amount: 250000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '05 Nov 2026',
    time: '03:10 PM',
    period: 'Este Mes',
    status: 'Completado',
    notes: 'Cirugía de cordal inferior derecho con sutura no absorbible'
  },
  {
    id: 'pay-7',
    receiptNumber: 'REC-4107',
    patientId: 'c-7',
    patientName: 'Daniela Roldán Vélez',
    patientDoc: 'CC 1.037.665.412',
    patientInitials: 'DR',
    patientPhone: '+57 311 884 1902',
    patientEmail: 'daniela.roldan@gmail.com',
    treatment: 'Blanqueamiento dental LED',
    doctor: 'Dra. Sofía Valenzuela',
    amount: 300000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '03 Nov 2026',
    time: '11:00 AM',
    period: 'Este Mes',
    status: 'Completado',
    notes: 'Sesión clínica de blanqueamiento con lámpara LED fotoactivada'
  },
  {
    id: 'pay-8',
    receiptNumber: 'REC-4100',
    patientId: 'c-8',
    patientName: 'Roberto Salazar Duque',
    patientDoc: 'CC 1.014.228.905',
    patientInitials: 'RS',
    patientPhone: '+57 300 412 8871',
    patientEmail: 'roberto.salazar@empresa.com',
    treatment: 'Empaste / Obturación composite',
    doctor: 'Dra. Sofía Valenzuela',
    amount: 120000,
    method: 'Cash',
    methodLabel: 'Efectivo',
    date: '01 Nov 2026',
    time: '10:00 AM',
    period: 'Este Mes',
    status: 'Anulado',
    notes: 'Cobro duplicado por error en digitación de caja',
    cancellationReason: 'Error de digitación en caja: el paciente canceló por datáfono en recibo separado'
  }
]

interface PaymentsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
  onToast: (msg: string) => void
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, onToast }) => {
  // Load payments from localStorage or fallback
  const [payments, setPayments] = useState<ClinicalPayment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_clinical_payments')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_PAYMENTS
  })

  // Save payments whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('vitadent_clinical_payments', JSON.stringify(payments))
    } catch {
      // ignore
    }
  }, [payments])

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

  // Filters state
  const [query, setQuery] = useState('')
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'Card' | 'Transfer' | 'Cash'>('ALL')
  const [filterDate, setFilterDate] = useState<'ALL' | 'Hoy' | 'Esta Semana' | 'Este Mes'>('ALL')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Completado' | 'Anulado'>('ALL')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [receiptToView, setReceiptToView] = useState<ClinicalPayment | null>(null)
  const [paymentToEdit, setPaymentToEdit] = useState<ClinicalPayment | null>(null)
  const [paymentToCancel, setPaymentToCancel] = useState<ClinicalPayment | null>(null)
  const [cancellationReasonText, setCancellationReasonText] = useState('')

  // Create Modal Steps & Fields (Paso 1, 2, 3)
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('')
  const [customTreatment, setCustomTreatment] = useState(vitadentConfig.treatments[0]?.name || 'Primera consulta + Diagnóstico')
  const [customDoctor, setCustomDoctor] = useState(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
  const [paymentAmount, setPaymentAmount] = useState<number>(50000)
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Transfer' | 'Cash'>('Card')
  const [receiptNumberInput, setReceiptNumberInput] = useState<string>('')
  const [paymentNotes, setPaymentNotes] = useState<string>('')

  // Selected Patient Details
  const selectedPatient = useMemo(
    () => contacts.find((c) => c.id === selectedPatientId),
    [contacts, selectedPatientId]
  )

  // Appointments of selected patient
  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === selectedPatientId),
    [appointments, selectedPatientId]
  )

  // When patient changes in Create modal
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId)
    const patientApts = appointments.filter((a) => a.patientId === patientId)
    if (patientApts.length > 0) {
      const first = patientApts[0]
      setSelectedAppointmentId(first.id)
      setCustomTreatment(first.treatment)
      setCustomDoctor(first.doctor)
      setPaymentAmount(first.price)
    } else {
      setSelectedAppointmentId('')
      const defaultTreat = vitadentConfig.treatments[0]
      setCustomTreatment(defaultTreat ? defaultTreat.name : 'Primera consulta + Diagnóstico')
      setCustomDoctor(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
      setPaymentAmount(defaultTreat ? defaultTreat.priceCop : 50000)
    }
    const nextNum = 4100 + payments.length + 1
    setReceiptNumberInput(`REC-${nextNum}`)
  }

  // When appointment changes in Create modal
  const handleSelectAppointment = (aptId: string) => {
    setSelectedAppointmentId(aptId)
    const apt = appointments.find((a) => a.id === aptId)
    if (apt) {
      setCustomTreatment(apt.treatment)
      setCustomDoctor(apt.doctor)
      setPaymentAmount(apt.price)
    }
  }

  // Open Create Modal & initialize defaults
  const handleOpenCreateModal = () => {
    const firstPatient = contacts.find((c) => c.type === 'Customer') || contacts[0]
    if (firstPatient) {
      handleSelectPatient(firstPatient.id)
    }
    setPaymentMethod('Card')
    setPaymentNotes('')
    const nextNum = 4100 + payments.length + 1
    setReceiptNumberInput(`REC-${nextNum}`)
    setIsCreateModalOpen(true)
  }

  // Submit Create Payment
  const handleConfirmCreatePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      onToast('Seleccione un paciente para procesar el cobro.')
      return
    }
    if (paymentAmount <= 0) {
      onToast('El valor a cobrar debe ser mayor a cero.')
      return
    }

    const methodLabelMap = {
      Card: 'Tarjeta / Datáfono',
      Transfer: 'Nequi / Bancolombia',
      Cash: 'Efectivo'
    }

    const newPayment: ClinicalPayment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNumberInput.trim() || `REC-${4100 + payments.length + 1}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.company,
      patientDoc: `CC 1.0${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}`,
      patientInitials: selectedPatient.initials,
      patientPhone: selectedPatient.phone || '+57 310 000 0000',
      patientEmail: selectedPatient.email || 'paciente@vitadent.com.co',
      treatment: customTreatment,
      doctor: customDoctor,
      amount: paymentAmount,
      method: paymentMethod,
      methodLabel: methodLabelMap[paymentMethod],
      date: '11 Nov 2026',
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      period: 'Hoy',
      status: 'Completado',
      notes: paymentNotes.trim() || 'Cobro clínico registrado en recepción',
      appointmentId: selectedAppointmentId || undefined
    }

    // Add payment
    setPayments((prev) => [newPayment, ...prev])

    // Update appointment status to 'Pagada' if linked
    if (selectedAppointmentId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedAppointmentId ? { ...a, status: 'Pagada' } : a))
      )
    }

    setIsCreateModalOpen(false)
    onToast(`¡Cobro ${newPayment.receiptNumber} por $${newPayment.amount.toLocaleString('es-CO')} COP registrado con éxito!`)
    // Optionally open the digital receipt
    setReceiptToView(newPayment)
  }

  // Handle Edit Payment Save
  const handleSaveEditPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentToEdit) return

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentToEdit.id ? paymentToEdit : p))
    )
    onToast(`Recibo ${paymentToEdit.receiptNumber} actualizado correctamente.`)
    setPaymentToEdit(null)
  }

  // Handle Cancel Payment
  const handleConfirmCancellation = () => {
    if (!paymentToCancel) return
    if (!cancellationReasonText.trim()) {
      onToast('Debe ingresar el motivo de la anulación para mantener trazabilidad contable.')
      return
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentToCancel.id
          ? {
              ...p,
              status: 'Anulado',
              cancellationReason: cancellationReasonText.trim()
            }
          : p
      )
    )
    onToast(`Cobro ${paymentToCancel.receiptNumber} marcado como Anulado.`)
    setPaymentToCancel(null)
    setCancellationReasonText('')
  }

  // Handle Permanent Delete
  const handleDeletePermanent = (id: string, ref: string) => {
    if (window.confirm(`¿Desea eliminar definitivamente el registro ${ref}? Esta acción no se puede deshacer.`)) {
      setPayments((prev) => prev.filter((p) => p.id !== id))
      setPaymentToCancel(null)
      onToast(`Registro ${ref} eliminado definitivamente del sistema.`)
    }
  }

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Query filter
      const matchesQuery =
        !query ||
        p.patientName.toLowerCase().includes(query.toLowerCase()) ||
        p.receiptNumber.toLowerCase().includes(query.toLowerCase()) ||
        p.patientDoc.toLowerCase().includes(query.toLowerCase()) ||
        p.treatment.toLowerCase().includes(query.toLowerCase()) ||
        p.doctor.toLowerCase().includes(query.toLowerCase())

      // Method filter
      const matchesMethod = filterMethod === 'ALL' || p.method === filterMethod

      // Date filter
      const matchesDate = filterDate === 'ALL' || p.period === filterDate

      // Status filter
      const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus

      return matchesQuery && matchesMethod && matchesDate && matchesStatus
    })
  }, [payments, query, filterMethod, filterDate, filterStatus])

  // KPI Calculations
  const todayCompletedPayments = payments.filter((p) => p.period === 'Hoy' && p.status === 'Completado')
  const totalCobradoHoy = todayCompletedPayments.reduce((acc, p) => acc + p.amount, 0)
  const countCobradoHoy = todayCompletedPayments.length

  return (
    <div className="cadra-page-container">
      {/* 3D Tactile Styling & Component Scoped CSS */}
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

        .btn-3d-metallic {
          background: linear-gradient(180deg, #9ca3af 0%, #8A8A8F 60%, #6b7280 100%);
          color: #ffffff;
          border: 1px solid #4b5563;
          border-radius: 8px;
          padding: 7px 14px;
          font-weight: 600;
          font-size: 12.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.15s ease;
        }
        .btn-3d-metallic:hover {
          background: linear-gradient(180deg, #a8afba 0%, #94949a 60%, #767d8c 100%);
          transform: translateY(-1px);
        }

        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.15s ease;
        }
        .action-icon-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
        }
        .action-icon-btn.view:hover {
          color: #A94384;
          border-color: #fbcfe8;
          background: #fdf2f8;
        }
        .action-icon-btn.edit:hover {
          color: #0284c7;
          border-color: #bae6fd;
          background: #f0f9ff;
        }
        .action-icon-btn.cancel:hover {
          color: #dc2626;
          border-color: #fecaca;
          background: #fef2f2;
        }

        .clean-filter-tab {
          padding: 6px 13px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .clean-filter-tab:hover {
          background: #f8fafc;
          color: #1e293b;
        }
        .clean-filter-tab.active {
          background: #A94384;
          color: #ffffff;
          border-color: #A94384;
          box-shadow: 0 2px 6px rgba(169, 67, 132, 0.28);
        }

        .method-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .method-badge.card {
          background: #fdf2f8;
          color: #9d174d;
          border: 1px solid #fbcfe8;
        }
        .method-badge.transfer {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .method-badge.cash {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .status-pill-clean {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
        }
        .status-pill-clean.success {
          background: #dcfce7;
          color: #15803d;
        }
        .status-pill-clean.void {
          background: #fee2e2;
          color: #b91c1c;
          text-decoration: line-through;
        }

        .step-pill-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          background: #f1f5f9;
          color: #64748b;
        }
        .step-pill-indicator.active {
          background: #fdf2f8;
          color: #A94384;
          border: 1px solid #fbcfe8;
        }

        .receipt-watermark-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
        }
        .receipt-watermark-card::before {
          content: 'VITADENT';
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 82px;
          font-weight: 900;
          color: rgba(169, 67, 132, 0.035);
          pointer-events: none;
          letter-spacing: 12px;
        }

        .patient-card-quick {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .patient-card-quick:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .patient-card-quick.selected {
          border-color: #A94384;
          background: #fdf2f8;
          box-shadow: 0 0 0 1px #A94384;
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Facturación & Cobros</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Pagos & Facturación Clínica</span>
      </div>

      {/* Header Principal sin submenús repetidos */}
      <div className="cadra-page-header" style={{ marginBottom: '18px' }}>
        <div className="page-header-left">
          <div className="flex items-center gap-2">
            <h1 className="cadra-page-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              Pagos & Facturación Clínica
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '6px',
                backgroundColor: '#fdf2f8',
                color: '#A94384',
                border: '1px solid #fbcfe8'
              }}
            >
              Recepción & Caja
            </span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
            Registro de cobros, emisión de recibos clínicos digitales y control de pagos de tratamientos.
          </p>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            {/* Botón Principal: + Registrar Cobro / Pago */}
            <button className="btn-3d-magenta" onClick={handleOpenCreateModal}>
              <CreditCard size={16} />
              <span>+ Registrar Cobro / Pago</span>
            </button>

            <button
              className="btn-3d-metallic"
              onClick={() => onToast('Generando reporte contable en Excel de cobros clínicos...')}
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas KPI Ordenadas en la Parte Superior */}
      <div className="cadra-kpi-grid-4" style={{ marginBottom: '22px' }}>
        {/* KPI 1: Total Cobrado Hoy */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <DollarSign size={16} style={{ color: '#10b981' }} />
            <span className="kpi-label">Total Cobrado Hoy</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={`$${(totalCobradoHoy || 2550000).toLocaleString('es-CO')}`} duration={750} delay={100} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              ● {countCobradoHoy || 2} cobros hoy
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Ingresados a caja</span>
          </div>
        </div>

        {/* KPI 2: Facturación del Mes */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <TrendingUp size={16} style={{ color: '#A94384' }} />
            <span className="kpi-label">Facturación del Mes</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value="$48.500.000" duration={750} delay={150} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#A94384',
                background: 'rgba(169, 67, 132, 0.12)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              +12.4% vs mes anterior
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Meta: $50M COP</span>
          </div>
        </div>

        {/* KPI 3: Saldos Pendientes de Cobro */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Clock size={16} style={{ color: '#d97706' }} />
            <span className="kpi-label">Saldos Pendientes de Cobro</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value="$4.820.000" duration={750} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-orange" style={{ fontSize: '10.5px' }}>
              En Gestión
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Convenios EPS Sura y tratamientos en curso
          </span>
        </div>

        {/* KPI 4: Método de Pago Predilecto */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CreditCard size={16} style={{ color: '#0284c7' }} />
            <span className="kpi-label">Método de Pago Predilecto</span>
          </div>
          <div style={{ marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontSize: '16px', color: '#0f172a' }}>Tarjetas / Datáfono</strong>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#A94384' }}>48%</span>
            </div>
            {/* Progress breakdown */}
            <div
              style={{
                height: '7px',
                borderRadius: '999px',
                display: 'flex',
                overflow: 'hidden',
                marginTop: '8px',
                backgroundColor: '#e2e8f0'
              }}
            >
              <div style={{ width: '48%', backgroundColor: '#A94384' }} title="Datáfono 48%" />
              <div style={{ width: '32%', backgroundColor: '#0284c7' }} title="Nequi/Bancolombia 32%" />
              <div style={{ width: '20%', backgroundColor: '#10b981' }} title="Efectivo 20%" />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10.5px',
                color: '#64748b',
                marginTop: '5px'
              }}
            >
              <span>Nequi (32%)</span>
              <span>Efectivo (20%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Tabla y Controles de Pagos */}
      <div className="cadra-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff' }}>
        {/* Barra Superior de Herramientas & Filtros Claros */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          {/* Barra de Búsqueda Interactiva */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 280px',
              maxWidth: '380px'
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '11px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8A8A8F'
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por paciente, recibo, cédula o tratamiento..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                fontSize: '12.5px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: '9px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtros de Método de Pago y Rango de Fecha */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* Filtro Rango de Fecha */}
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '9px' }}>
              <button
                className={`clean-filter-tab ${filterDate === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterDate('ALL')}
                style={{ padding: '4px 10px', fontSize: '11.5px', border: 'none' }}
              >
                Todos
              </button>
              <button
                className={`clean-filter-tab ${filterDate === 'Hoy' ? 'active' : ''}`}
                onClick={() => setFilterDate('Hoy')}
                style={{ padding: '4px 10px', fontSize: '11.5px', border: 'none' }}
              >
                Hoy
              </button>
              <button
                className={`clean-filter-tab ${filterDate === 'Esta Semana' ? 'active' : ''}`}
                onClick={() => setFilterDate('Esta Semana')}
                style={{ padding: '4px 10px', fontSize: '11.5px', border: 'none' }}
              >
                Esta Semana
              </button>
              <button
                className={`clean-filter-tab ${filterDate === 'Este Mes' ? 'active' : ''}`}
                onClick={() => setFilterDate('Este Mes')}
                style={{ padding: '4px 10px', fontSize: '11.5px', border: 'none' }}
              >
                Este Mes
              </button>
            </div>

            {/* Filtro Método de Pago */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as any)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="ALL">💳 Todos los Métodos</option>
              <option value="Card">💳 Tarjetas / Datáfono</option>
              <option value="Transfer">🏛️ Nequi / Bancolombia</option>
              <option value="Cash">💵 Efectivo (Caja)</option>
            </select>

            {/* Filtro Estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="ALL">📋 Todos los Estados</option>
              <option value="Completado">✓ Completados</option>
              <option value="Anulado">✕ Anulados</option>
            </select>
          </div>
        </div>

        {/* Tabla Moderna y Pulcra de Pagos */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}># Recibo / Ref</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Paciente</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Tratamiento Dental</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Método de Pago</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Fecha & Hora</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Monto (COP)</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={28} color="#94a3b8" />
                      <span style={{ fontSize: '13.5px', fontWeight: 600 }}>No se encontraron cobros registrados</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Ajuste los filtros o registre un nuevo cobro con el botón superior.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isVoid = p.status === 'Anulado'
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.12s ease',
                        backgroundColor: isVoid ? '#fafafa' : '#ffffff',
                        opacity: isVoid ? 0.75 : 1
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isVoid ? '#f4f4f5' : '#fdf8fa'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isVoid ? '#fafafa' : '#ffffff'
                      }}
                    >
                      {/* Recibo # */}
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => setReceiptToView(p)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            color: '#A94384',
                            textDecoration: 'underline'
                          }}
                          title="Haga clic para ver el recibo digital"
                        >
                          <FileText size={13} />
                          <span>{p.receiptNumber}</span>
                        </button>
                      </td>

                      {/* Paciente */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#fdf2f8',
                              color: '#A94384',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                              flexShrink: 0
                            }}
                          >
                            {p.patientInitials}
                          </span>
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block', fontSize: '12.5px' }}>
                              {p.patientName}
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>{p.patientDoc}</span>
                          </div>
                        </div>
                      </td>

                      {/* Tratamiento Dental */}
                      <td style={{ padding: '12px' }}>
                        <div>
                          <span style={{ fontWeight: 600, color: '#1e293b', display: 'block' }}>
                            {p.treatment}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8A8A8F' }}>
                            {p.doctor}
                          </span>
                        </div>
                      </td>

                      {/* Método de Pago */}
                      <td style={{ padding: '12px' }}>
                        {p.method === 'Card' && (
                          <span className="method-badge card">
                            <CreditCard size={12} />
                            <span>Tarjeta / Datáfono</span>
                          </span>
                        )}
                        {p.method === 'Transfer' && (
                          <span className="method-badge transfer">
                            <Building2 size={12} />
                            <span>Nequi / Bancolombia</span>
                          </span>
                        )}
                        {p.method === 'Cash' && (
                          <span className="method-badge cash">
                            <DollarSign size={12} />
                            <span>Efectivo (Caja)</span>
                          </span>
                        )}
                      </td>

                      {/* Fecha y Hora */}
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>{p.date}</div>
                        <div style={{ fontSize: '11px', color: '#8A8A8F' }}>{p.time}</div>
                      </td>

                      {/* Monto COP */}
                      <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: isVoid ? '#94a3b8' : '#047857',
                            textDecoration: isVoid ? 'line-through' : 'none'
                          }}
                        >
                          $ {p.amount.toLocaleString('es-CO')}
                        </span>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>COP</div>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {p.status === 'Completado' ? (
                          <span className="status-pill-clean success">
                            <CheckCircle2 size={11} />
                            <span>Completado</span>
                          </span>
                        ) : (
                          <span className="status-pill-clean void" title={p.cancellationReason || 'Anulado'}>
                            <X size={11} />
                            <span>Anulado</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <button
                            className="action-icon-btn view"
                            onClick={() => setReceiptToView(p)}
                            title="Ver Recibo Digital"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            className="action-icon-btn edit"
                            onClick={() => setPaymentToEdit({ ...p })}
                            title="Editar Pago"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            className="action-icon-btn cancel"
                            onClick={() => {
                              setPaymentToCancel(p)
                              setCancellationReasonText('')
                            }}
                            title="Anular o Cancelar Cobro"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info de la tabla */}
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#64748b'
          }}
        >
          <span>
            Mostrando <strong>{filteredPayments.length}</strong> de <strong>{payments.length}</strong> transacciones clínicas
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#A94384" />
            Recibos avalados para fines contables y tributarios (RUT Régimen Especial Salud)
          </span>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CREATE (REGISTRAR COBRO / PAGO)
          3 Pasos Claros:
          1. Seleccionar Paciente
          2. Seleccionar Cita / Tratamiento
          3. Datos del Pago (Monto con atajos 100% y 50%, método, recibo, notas)
          ========================================================================= */}
      {isCreateModalOpen && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setIsCreateModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
            style={{
              maxWidth: '580px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
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
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    Registrar Cobro / Pago Clínico
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Cobro en recepción VitaDent — Procedimiento en 3 pasos
                  </span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper Header Visual */}
            <div
              style={{
                padding: '10px 24px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                gap: '8px'
              }}
            >
              <div className={`step-pill-indicator ${selectedPatientId ? 'active' : ''}`}>
                <span>1. Paciente</span>
                {selectedPatientId && <Check size={12} />}
              </div>
              <div className={`step-pill-indicator ${customTreatment ? 'active' : ''}`}>
                <span>2. Tratamiento</span>
                {customTreatment && <Check size={12} />}
              </div>
              <div className={`step-pill-indicator ${paymentAmount > 0 ? 'active' : ''}`}>
                <span>3. Datos Pago</span>
              </div>
            </div>

            <form onSubmit={handleConfirmCreatePayment}>
              <div
                style={{
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '72vh',
                  overflowY: 'auto'
                }}
              >
                {/* PASO 1: SELECCIONAR PACIENTE */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                    1. Paciente Clínico *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => handleSelectPatient(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  >
                    <option value="">-- Seleccionar paciente registrado --</option>
                    {contacts
                      .filter((c) => c.type === 'Customer')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.company} ({p.rep}) — {p.category}
                        </option>
                      ))}
                  </select>
                </div>

                {/* PASO 2: TRATAMIENTO ASOCIADO O CITA PREVIA */}
                {selectedPatient && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        2. Cita o Tratamiento a Cobrar *
                      </label>
                      <span style={{ fontSize: '11px', color: '#A94384', fontWeight: 600 }}>
                        {patientAppointments.length} cita(s) registrada(s)
                      </span>
                    </div>

                    {/* Si tiene citas pendientes, mostramos para asociar */}
                    {patientAppointments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {patientAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`patient-card-quick ${selectedAppointmentId === apt.id ? 'selected' : ''}`}
                            onClick={() => handleSelectAppointment(apt.id)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{apt.treatment}</strong>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  color: apt.status === 'Pagada' ? '#15803d' : '#A94384',
                                  background: apt.status === 'Pagada' ? '#dcfce7' : '#fdf2f8',
                                  padding: '2px 8px',
                                  borderRadius: '999px'
                                }}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px', display: 'flex', gap: '8px' }}>
                              <span>👨‍⚕️ {apt.doctor}</span>
                              <span>•</span>
                              <span>📅 {apt.date}</span>
                              <span>•</span>
                              <strong style={{ color: '#047857' }}>${apt.price.toLocaleString('es-CO')} COP</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Cita rápida de mostrador si no tiene citas programadas */
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                          Cobro directo de mostrador (Cita / Tratamiento en consulta):
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <select
                            value={customTreatment}
                            onChange={(e) => {
                              const treatName = e.target.value
                              setCustomTreatment(treatName)
                              const tObj = vitadentConfig.treatments.find((t) => t.name === treatName)
                              if (tObj) setPaymentAmount(tObj.priceCop)
                            }}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '6px',
                              fontSize: '12px',
                              color: '#0f172a'
                            }}
                          >
                            {vitadentConfig.treatments.map((t) => (
                              <option key={t.code} value={t.name}>
                                {t.name} (${t.priceCop.toLocaleString('es-CO')})
                              </option>
                            ))}
                          </select>

                          <select
                            value={customDoctor}
                            onChange={(e) => setCustomDoctor(e.target.value)}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '6px',
                              fontSize: '12px',
                              color: '#0f172a'
                            }}
                          >
                            {vitadentConfig.doctors.map((d) => (
                              <option key={d.id} value={d.name}>
                                {d.name} ({d.specialty})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 3: DATOS DEL PAGO */}
                {selectedPatient && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                      {/* Monto */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          3. Monto a Cobrar (COP) *
                        </label>
                        <input
                          type="number"
                          required
                          min={1000}
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          style={{
                            width: '100%',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '15px',
                            fontWeight: 800,
                            color: '#047857',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* # Recibo / Ref */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          # Recibo Clínico
                        </label>
                        <input
                          type="text"
                          value={receiptNumberInput}
                          onChange={(e) => setReceiptNumberInput(e.target.value)}
                          placeholder="REC-4109"
                          style={{
                            width: '100%',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Atajos de Monto: 100% y 50% */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const apt = appointments.find((a) => a.id === selectedAppointmentId)
                          const base = apt ? apt.price : 100000
                          setPaymentAmount(base)
                        }}
                        style={{
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        Pago Total 100%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const apt = appointments.find((a) => a.id === selectedAppointmentId)
                          const base = apt ? apt.price : 100000
                          setPaymentAmount(Math.round(base * 0.5))
                        }}
                        style={{
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        Abono 50%
                      </button>
                    </div>

                    {/* Método de Pago */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Método de Pago *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <button
                          type="button"
                          className={`clean-filter-tab ${paymentMethod === 'Card' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('Card')}
                          style={{ justifyContent: 'center', padding: '8px 4px' }}
                        >
                          <CreditCard size={14} />
                          <span>Tarjeta / Datáfono</span>
                        </button>

                        <button
                          type="button"
                          className={`clean-filter-tab ${paymentMethod === 'Transfer' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('Transfer')}
                          style={{ justifyContent: 'center', padding: '8px 4px' }}
                        >
                          <Building2 size={14} />
                          <span>Nequi / Bancolombia</span>
                        </button>

                        <button
                          type="button"
                          className={`clean-filter-tab ${paymentMethod === 'Cash' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('Cash')}
                          style={{ justifyContent: 'center', padding: '8px 4px' }}
                        >
                          <DollarSign size={14} />
                          <span>Efectivo (Caja)</span>
                        </button>
                      </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Observaciones / Notas Clínicas
                      </label>
                      <input
                        type="text"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Ej. Cancelación completa de cuota de ortodoncia o abono inicial de implante"
                        style={{
                          width: '100%',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12.5px',
                          color: '#334155',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '14px 24px',
                  borderTop: '1px solid #f1f5f9',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >
                <button
                  type="button"
                  className="btn-3d-metallic"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-3d-magenta"
                  disabled={!selectedPatient || paymentAmount <= 0}
                  style={{
                    opacity: !selectedPatient || paymentAmount <= 0 ? 0.5 : 1,
                    cursor: !selectedPatient || paymentAmount <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Check size={16} />
                  <span>Confirmar y Emitir Cobro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: READ (RECIBO CLÍNICO DIGITAL DE VITADENT)
          Modal elegante con datos del paciente, NIT/RUT de VitaDent, desglose,
          botón Imprimir / Descargar Recibo y botón Cerrar.
          ========================================================================= */}
      {receiptToView && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setReceiptToView(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            className="cadra-action-modal receipt-watermark-card"
            style={{ maxWidth: '620px', width: '100%', padding: '0', background: '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Recibo */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '2px dashed #e2e8f0',
                background: 'linear-gradient(180deg, #fdf8fa 0%, #ffffff 100%)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #A94384 0%, #8E356E 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '18px'
                      }}
                    >
                      V
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                        VitaDent Clínica Odontológica
                      </h2>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        NIT: 901.482.391-4 · RUT Régimen Especial Salud
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8A8A8F', marginTop: '6px' }}>
                    Cra. 15 # 93-47, Cons. 502, Bogotá D.C. · Tel: +57 (601) 745-2020
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      color: receiptToView.status === 'Completado' ? '#15803d' : '#b91c1c',
                      background: receiptToView.status === 'Completado' ? '#dcfce7' : '#fee2e2'
                    }}
                  >
                    {receiptToView.status.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#A94384', marginTop: '4px' }}>
                    {receiptToView.receiptNumber}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{receiptToView.date} · {receiptToView.time}</div>
                </div>
              </div>
            </div>

            {/* Cuerpo del Recibo */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Información del Paciente */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#8A8A8F', display: 'block' }}>Paciente:</span>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{receiptToView.patientName}</strong>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{receiptToView.patientDoc}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#8A8A8F', display: 'block' }}>Contacto:</span>
                  <div style={{ fontSize: '11.5px', color: '#334155' }}>📞 {receiptToView.patientPhone}</div>
                  <div style={{ fontSize: '11.5px', color: '#334155' }}>✉️ {receiptToView.patientEmail}</div>
                </div>
              </div>

              {/* Detalle del Tratamiento */}
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Desglose de Servicios Odontológicos
                </span>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', fontSize: '11px' }}>
                      <th style={{ padding: '6px 0', textAlign: 'left' }}>Descripción</th>
                      <th style={{ padding: '6px 0', textAlign: 'left' }}>Profesional</th>
                      <th style={{ padding: '6px 0', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600, color: '#0f172a' }}>
                        {receiptToView.treatment}
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                          {receiptToView.notes || 'Procedimiento clínico en consultorio'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 0', color: '#475569' }}>
                        {receiptToView.doctor}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ${receiptToView.amount.toLocaleString('es-CO')} COP
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cuadro de Totales & Método de Pago */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: '#fdf2f8',
                  border: '1px solid #fbcfe8'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#831843', display: 'block' }}>Canal de Pago:</span>
                  <strong style={{ fontSize: '13px', color: '#A94384', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {receiptToView.method === 'Card' && <CreditCard size={15} />}
                    {receiptToView.method === 'Transfer' && <Building2 size={15} />}
                    {receiptToView.method === 'Cash' && <DollarSign size={15} />}
                    <span>{receiptToView.methodLabel}</span>
                  </strong>
                  <span style={{ fontSize: '10.5px', color: '#9d174d' }}>IVA Exento Salud (Art. 476 E.T.)</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#831843', display: 'block' }}>Total Cancelado:</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#A94384' }}>
                    ${receiptToView.amount.toLocaleString('es-CO')}
                  </span>
                  <span style={{ fontSize: '11px', color: '#831843', display: 'block' }}>COP</span>
                </div>
              </div>

              {/* Razón de anulación si aplica */}
              {receiptToView.status === 'Anulado' && receiptToView.cancellationReason && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    fontSize: '11.5px',
                    color: '#991b1b'
                  }}
                >
                  <strong>Motivo de anulación:</strong> {receiptToView.cancellationReason}
                </div>
              )}

              {/* Firma y Sello Digital */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  paddingTop: '10px',
                  fontSize: '10.5px',
                  color: '#8A8A8F'
                }}
              >
                <div>
                  <div>Recepción & Facturación: Nathalia León</div>
                  <div>Software Odontológico VitaDent v2.4</div>
                </div>
                <div style={{ textAlign: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '4px', width: '160px' }}>
                  Firma Autorizada Caja
                </div>
              </div>
            </div>

            {/* Acciones del Recibo */}
            <div
              style={{
                padding: '14px 28px',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <button
                className="btn-3d-metallic"
                onClick={() => setReceiptToView(null)}
              >
                Cerrar
              </button>

              <button
                className="btn-3d-magenta"
                onClick={() => {
                  window.print()
                  onToast(`Comprobante ${receiptToView.receiptNumber} enviado a la impresora / PDF.`)
                }}
              >
                <Printer size={15} />
                <span>Imprimir / Descargar Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: UPDATE (EDITAR PAGO)
          Permite actualizar método, referencia, notas u observaciones clínicas.
          ========================================================================= */}
      {paymentToEdit && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setPaymentToEdit(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
            style={{ maxWidth: '520px', width: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}
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
                <Edit3 size={18} color="#0284c7" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                    Editar Cobro Clínico — {paymentToEdit.receiptNumber}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Paciente: {paymentToEdit.patientName}
                  </span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setPaymentToEdit(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditPayment}>
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Referencia de Recibo */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    # Recibo / Referencia
                  </label>
                  <input
                    type="text"
                    value={paymentToEdit.receiptNumber}
                    onChange={(e) => setPaymentToEdit({ ...paymentToEdit, receiptNumber: e.target.value })}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Monto */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Monto (COP)
                  </label>
                  <input
                    type="number"
                    value={paymentToEdit.amount}
                    onChange={(e) => setPaymentToEdit({ ...paymentToEdit, amount: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#047857',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Método de Pago */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Método de Pago
                  </label>
                  <select
                    value={paymentToEdit.method}
                    onChange={(e) => {
                      const m = e.target.value as 'Card' | 'Transfer' | 'Cash'
                      const labelMap = {
                        Card: 'Tarjeta / Datáfono',
                        Transfer: 'Nequi / Bancolombia',
                        Cash: 'Efectivo'
                      }
                      setPaymentToEdit({
                        ...paymentToEdit,
                        method: m,
                        methodLabel: labelMap[m]
                      })
                    }}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Card">💳 Tarjeta / Datáfono</option>
                    <option value="Transfer">🏛️ Nequi / Bancolombia</option>
                    <option value="Cash">💵 Efectivo (Caja)</option>
                  </select>
                </div>

                {/* Observaciones */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Observaciones / Notas Clínicas
                  </label>
                  <textarea
                    rows={3}
                    value={paymentToEdit.notes || ''}
                    onChange={(e) => setPaymentToEdit({ ...paymentToEdit, notes: e.target.value })}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '14px 22px',
                  borderTop: '1px solid #f1f5f9',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >
                <button
                  type="button"
                  className="btn-3d-metallic"
                  onClick={() => setPaymentToEdit(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-3d-magenta"
                >
                  <Check size={15} />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: DELETE (ANULAR COBRO CLÍNICO)
          Confirmación con motivo obligatorio y actualización a estado Anulado.
          ========================================================================= */}
      {paymentToCancel && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setPaymentToCancel(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
            style={{ maxWidth: '480px', width: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid #fecaca',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={20} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#991b1b' }}>
                  Anular Cobro — {paymentToCancel.receiptNumber}
                </h3>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
                onClick={() => setPaymentToCancel(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                ¿Está seguro de anular el cobro de{' '}
                <strong style={{ color: '#0f172a' }}>${paymentToCancel.amount.toLocaleString('es-CO')} COP</strong>{' '}
                asociado a <strong style={{ color: '#0f172a' }}>{paymentToCancel.patientName}</strong>?
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Motivo de Anulación (Requerido) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Error de digitación en caja, solicitud de devolución al paciente o cobro duplicado..."
                  value={cancellationReasonText}
                  onChange={(e) => setCancellationReasonText(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Info size={14} color="#64748b" />
                <span>El recibo quedará con sello "Anulado" preservando la numeración contable.</span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <button
                type="button"
                onClick={() => handleDeletePermanent(paymentToCancel.id, paymentToCancel.receiptNumber)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Eliminar definitivamente
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-3d-metallic"
                  onClick={() => setPaymentToCancel(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancellation}
                  disabled={!cancellationReasonText.trim()}
                  style={{
                    background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: '1px solid #b91c1c',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: cancellationReasonText.trim() ? 'pointer' : 'not-allowed',
                    opacity: cancellationReasonText.trim() ? 1 : 0.6
                  }}
                >
                  Confirmar Anulación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

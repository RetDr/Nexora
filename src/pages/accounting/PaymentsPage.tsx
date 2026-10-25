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
import { useWorkspace, WorkspaceId } from '../../context/WorkspaceContext'

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
  doctorId: 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'
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

export interface DoctorMetaInfo {
  id: 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'
  name: string
  specialty: string
  shortLabel: string
  chipLabel: string
  color: string
  bg: string
  borderColor: string
  iconEmoji: string
  consultorio: string
  projectedMonthly: number
  pendingDebt: number
}

export const DOCTORS_METADATA: DoctorMetaInfo[] = [
  {
    id: 'doc-1',
    name: 'Dra. Sofía Valenzuela',
    specialty: 'Odontología General',
    shortLabel: 'Dra. Sofía Valenzuela',
    chipLabel: 'Dra. Sofía Valenzuela · General',
    color: '#A94384',
    bg: '#fdf2f8',
    borderColor: '#fbcfe8',
    iconEmoji: '🦷',
    consultorio: 'Consultorio 1',
    projectedMonthly: 14200000,
    pendingDebt: 1250000,
  },
  {
    id: 'doc-2',
    name: 'Dr. Alejandro Soto',
    specialty: 'Ortodoncia 1',
    shortLabel: 'Dr. Alejandro Soto',
    chipLabel: 'Dr. Alejandro Soto · Ortodoncia 1',
    color: '#0284c7',
    bg: '#eff6ff',
    borderColor: '#bfdbfe',
    iconEmoji: '🦷',
    consultorio: 'Consultorio 2',
    projectedMonthly: 13800000,
    pendingDebt: 1420000,
  },
  {
    id: 'doc-3',
    name: 'Dra. Claudia Rivas',
    specialty: 'Ortodoncia 2',
    shortLabel: 'Dra. Claudia Rivas',
    chipLabel: 'Dra. Claudia Rivas · Ortodoncia 2',
    color: '#0d9488',
    bg: '#f0fdfa',
    borderColor: '#99f6e4',
    iconEmoji: '🦷',
    consultorio: 'Consultorio 3',
    projectedMonthly: 9100000,
    pendingDebt: 850000,
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcos Pineda',
    specialty: 'Diseño de Sonrisa',
    shortLabel: 'Dr. Marcos Pineda',
    chipLabel: 'Dr. Marcos Pineda · Diseño de Sonrisa',
    color: '#c2410c',
    bg: '#fff7ed',
    borderColor: '#fed7aa',
    iconEmoji: '✨',
    consultorio: 'Consultorio 4',
    projectedMonthly: 11400000,
    pendingDebt: 1300000,
  },
]

export const resolveDoctorId = (doctorName?: string, existingId?: string): 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4' => {
  if (existingId === 'doc-1' || existingId === 'doc-2' || existingId === 'doc-3' || existingId === 'doc-4') {
    return existingId
  }
  const name = (doctorName || '').toLowerCase()
  if (name.includes('soto') || name.includes('alejandro') || name.includes('ortodoncia 1')) return 'doc-2'
  if (name.includes('rivas') || name.includes('claudia') || name.includes('ortodoncia 2')) return 'doc-3'
  if (name.includes('pineda') || name.includes('marcos') || name.includes('diseño') || name.includes('sonrisa') || name.includes('cirug')) return 'doc-4'
  return 'doc-1'
}

export const getDoctorMeta = (doctorId?: string): DoctorMetaInfo => {
  const found = DOCTORS_METADATA.find((d) => d.id === doctorId)
  if (found) return found
  return DOCTORS_METADATA[0]
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
    treatment: 'Diseño de Sonrisa (Carillas Cerámicas)',
    doctor: 'Dr. Marcos Pineda',
    doctorId: 'doc-4',
    amount: 2500000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '11 Nov 2026',
    time: '10:15 AM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Abono fase 1 carillas de alta estética dental e integración',
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
    doctorId: 'doc-1',
    amount: 50000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '11 Nov 2026',
    time: '11:45 AM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Valoración inicial y plan de tratamiento odontología integral'
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
    treatment: 'Ortodoncia 1 (mensualidad brackets)',
    doctor: 'Dr. Alejandro Soto',
    doctorId: 'doc-2',
    amount: 100000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '10 Nov 2026',
    time: '04:20 PM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Control mensual ortodoncia 1 y cambio de arcos'
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
    treatment: 'Ortodoncia 2 (alineadores invisibles)',
    doctor: 'Dra. Claudia Rivas',
    doctorId: 'doc-3',
    amount: 350000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '09 Nov 2026',
    time: '02:30 PM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Entrega set de alineadores serie 2 y control ortodoncia 2'
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
    doctorId: 'doc-1',
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
    treatment: 'Diseño de Sonrisa (Mockup Digital)',
    doctor: 'Dr. Marcos Pineda',
    doctorId: 'doc-4',
    amount: 1800000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '05 Nov 2026',
    time: '03:10 PM',
    period: 'Este Mes',
    status: 'Completado',
    notes: 'Fase de planificación estética y confección de carillas provisionales'
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
    doctorId: 'doc-1',
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
    doctorId: 'doc-1',
    amount: 120000,
    method: 'Cash',
    methodLabel: 'Efectivo',
    date: '01 Nov 2026',
    time: '10:00 AM',
    period: 'Este Mes',
    status: 'Anulado',
    notes: 'Cobro duplicado por error en digitación de caja',
    cancellationReason: 'Error de digitación en caja: el paciente canceló por datáfono en recibo separado'
  },
  {
    id: 'pay-9',
    receiptNumber: 'REC-4108',
    patientId: 'c-9',
    patientName: 'Esteban Morales Castro',
    patientDoc: 'CC 1.022.341.879',
    patientInitials: 'EM',
    patientPhone: '+57 315 889 0012',
    patientEmail: 'esteban.morales@gmail.com',
    treatment: 'Ortodoncia 2 (placas activas y retenedores)',
    doctor: 'Dra. Claudia Rivas',
    doctorId: 'doc-3',
    amount: 280000,
    method: 'Transfer',
    methodLabel: 'Nequi / Bancolombia',
    date: '11 Nov 2026',
    time: '01:15 PM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Abono control ortodoncia 2 y ajuste de aparatos ortopédicos'
  },
  {
    id: 'pay-10',
    receiptNumber: 'REC-4109',
    patientId: 'c-10',
    patientName: 'Camila Andrea Varela',
    patientDoc: 'CC 1.033.987.123',
    patientInitials: 'CV',
    patientPhone: '+57 317 445 6789',
    patientEmail: 'camila.varela@outlook.com',
    treatment: 'Ortodoncia 1 (control y cambio arcos)',
    doctor: 'Dr. Alejandro Soto',
    doctorId: 'doc-2',
    amount: 120000,
    method: 'Cash',
    methodLabel: 'Efectivo',
    date: '11 Nov 2026',
    time: '11:10 AM',
    period: 'Hoy',
    status: 'Completado',
    notes: 'Control ortodoncia 1 con colocación de ligaduras estéticas'
  },
  {
    id: 'pay-11',
    receiptNumber: 'REC-4110',
    patientId: 'c-11',
    patientName: 'Sebastián Herrera Ruiz',
    patientDoc: 'CC 1.019.876.543',
    patientInitials: 'SH',
    patientPhone: '+57 313 771 2290',
    patientEmail: 'sebastian.herrera@hotmail.com',
    treatment: 'Diseño de Sonrisa (Carillas Cerámicas)',
    doctor: 'Dr. Marcos Pineda',
    doctorId: 'doc-4',
    amount: 2200000,
    method: 'Card',
    methodLabel: 'Tarjeta / Datáfono',
    date: '07 Nov 2026',
    time: '04:45 PM',
    period: 'Esta Semana',
    status: 'Completado',
    notes: 'Abono inicial diseño de sonrisa 6 carillas anteriores en disilicato'
  }
]

interface PaymentsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
  onToast: (msg: string) => void
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, onToast }) => {
  // Sync with Workspace Context (Multi-Doctor filter)
  const workspaceContext = useWorkspace()
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<WorkspaceId>(() => {
    return workspaceContext?.currentWorkspace || 'all'
  })

  // Synchronize when workspace changes externally
  useEffect(() => {
    if (workspaceContext?.currentWorkspace) {
      setSelectedDoctorFilter(workspaceContext.currentWorkspace)
    }
  }, [workspaceContext?.currentWorkspace])

  const handleSelectDoctorFilter = (id: WorkspaceId) => {
    setSelectedDoctorFilter(id)
    if (workspaceContext?.setWorkspace) {
      workspaceContext.setWorkspace(id)
    }
  }

  // Load payments from localStorage or fallback (ensure doctorId is backfilled on legacy records)
  const [payments, setPayments] = useState<ClinicalPayment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_clinical_payments')
      if (saved) {
        const parsed: any[] = JSON.parse(saved)
        return parsed.map((p) => ({
          ...p,
          doctorId: resolveDoctorId(p.doctor, p.doctorId)
        }))
      }
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

  // Liquidation Modal State
  const [isLiquidationModalOpen, setIsLiquidationModalOpen] = useState(false)
  const [liquidationDoctorScope, setLiquidationDoctorScope] = useState<WorkspaceId>('all')
  const [liquidationPeriod, setLiquidationPeriod] = useState<'ALL' | 'Hoy' | 'Esta Semana' | 'Este Mes'>('ALL')

  // Create Modal Steps & Fields (Paso 1, 2, 3)
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('')
  const [customTreatment, setCustomTreatment] = useState(vitadentConfig.treatments[0]?.name || 'Primera consulta + Diagnóstico')
  const [customDoctor, setCustomDoctor] = useState(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
  const [selectedDoctorIdForCreate, setSelectedDoctorIdForCreate] = useState<'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'>('doc-1')
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
      setSelectedDoctorIdForCreate(resolveDoctorId(first.doctor))
      setPaymentAmount(first.price)
    } else {
      setSelectedAppointmentId('')
      const defaultTreat = vitadentConfig.treatments[0]
      setCustomTreatment(defaultTreat ? defaultTreat.name : 'Primera consulta + Diagnóstico')
      // If current filter is a specific doctor, pre-select them
      if (selectedDoctorFilter !== 'all') {
        const dMeta = DOCTORS_METADATA.find((d) => d.id === selectedDoctorFilter)
        if (dMeta) {
          setCustomDoctor(dMeta.name)
          setSelectedDoctorIdForCreate(dMeta.id)
        }
      } else {
        setCustomDoctor(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
        setSelectedDoctorIdForCreate('doc-1')
      }
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
      setSelectedDoctorIdForCreate(resolveDoctorId(apt.doctor))
      setPaymentAmount(apt.price)
    }
  }

  // Open Create Modal & initialize defaults
  const handleOpenCreateModal = () => {
    const firstPatient = contacts.find((c) => c.type === 'Customer') || contacts[0]
    if (firstPatient) {
      handleSelectPatient(firstPatient.id)
    }
    if (selectedDoctorFilter !== 'all') {
      const dMeta = DOCTORS_METADATA.find((d) => d.id === selectedDoctorFilter)
      if (dMeta) {
        setCustomDoctor(dMeta.name)
        setSelectedDoctorIdForCreate(dMeta.id)
      }
    } else {
      setSelectedDoctorIdForCreate('doc-1')
      setCustomDoctor(DOCTORS_METADATA[0].name)
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

    const assignedDoctorMeta = DOCTORS_METADATA.find((d) => d.id === selectedDoctorIdForCreate) || DOCTORS_METADATA[0]

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
      doctor: assignedDoctorMeta.name,
      doctorId: assignedDoctorMeta.id,
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
    onToast(`¡Cobro ${newPayment.receiptNumber} (${assignedDoctorMeta.name}) por $${newPayment.amount.toLocaleString('es-CO')} COP registrado con éxito!`)
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

  // Filtered Payments (Doctor Scope + Query + Method + Date + Status)
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Doctor filter
      if (selectedDoctorFilter !== 'all' && p.doctorId !== selectedDoctorFilter) {
        return false
      }

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
  }, [payments, selectedDoctorFilter, query, filterMethod, filterDate, filterStatus])

  // RECALCULATED REAL-TIME METRICS BASED ON SELECTED DOCTOR OR TOTAL CLINIC
  const doctorScopedPayments = useMemo(() => {
    if (selectedDoctorFilter === 'all') {
      return payments
    }
    return payments.filter((p) => p.doctorId === selectedDoctorFilter)
  }, [payments, selectedDoctorFilter])

  const completedInScope = useMemo(() => {
    return doctorScopedPayments.filter((p) => p.status === 'Completado')
  }, [doctorScopedPayments])

  const completedTodayInScope = useMemo(() => {
    return completedInScope.filter((p) => p.period === 'Hoy')
  }, [completedInScope])

  const activeDoctorMeta = useMemo(() => {
    if (selectedDoctorFilter === 'all') return null
    return DOCTORS_METADATA.find((d) => d.id === selectedDoctorFilter) || null
  }, [selectedDoctorFilter])

  // Real-time metric 1: Total Cobrado
  const totalCobradoDoctor = completedInScope.reduce((acc, p) => acc + p.amount, 0)
  const totalCobradoHoyDoctor = completedTodayInScope.reduce((acc, p) => acc + p.amount, 0)
  const countCobrosHoy = completedTodayInScope.length
  const countCobrosTotal = completedInScope.length

  // Real-time metric 2: Facturación Proyectada
  const facturacionProyectada = activeDoctorMeta ? activeDoctorMeta.projectedMonthly : 48500000

  // Real-time metric 3: Saldos Pendientes / Cartera
  const saldosPendientes = activeDoctorMeta ? activeDoctorMeta.pendingDebt : 4820000

  // Real-time metric 4: Medios de Pago y Transacciones
  const methodStats = useMemo(() => {
    const card = completedInScope.filter((p) => p.method === 'Card').reduce((acc, p) => acc + p.amount, 0)
    const transfer = completedInScope.filter((p) => p.method === 'Transfer').reduce((acc, p) => acc + p.amount, 0)
    const cash = completedInScope.filter((p) => p.method === 'Cash').reduce((acc, p) => acc + p.amount, 0)
    const total = card + transfer + cash || 1

    const cardPct = Math.round((card / total) * 100)
    const transferPct = Math.round((transfer / total) * 100)
    const cashPct = Math.max(0, 100 - cardPct - transferPct)

    return {
      card,
      transfer,
      cash,
      cardPct,
      transferPct,
      cashPct,
      countCard: completedInScope.filter((p) => p.method === 'Card').length,
      countTransfer: completedInScope.filter((p) => p.method === 'Transfer').length,
      countCash: completedInScope.filter((p) => p.method === 'Cash').length
    }
  }, [completedInScope])

  // CSV Export for Liquidation Report
  const handleExportLiquidationCSV = () => {
    const targetScope = liquidationDoctorScope
    const targetDoc = DOCTORS_METADATA.find((d) => d.id === targetScope)
    const scopeName = targetScope === 'all' ? 'Total_Clinica' : targetDoc?.shortLabel.replace(/\s+/g, '_') || 'Doctor'
    const filename = `VitaDent_Liquidacion_${scopeName}_${liquidationPeriod}_${Date.now()}.csv`

    const liqList = payments.filter((p) => {
      if (targetScope !== 'all' && p.doctorId !== targetScope) return false
      if (liquidationPeriod !== 'ALL' && p.period !== liquidationPeriod) return false
      return true
    })

    const liqCompleted = liqList.filter((p) => p.status === 'Completado')
    const totalRecaudado = liqCompleted.reduce((acc, p) => acc + p.amount, 0)
    const totalCash = liqCompleted.filter((p) => p.method === 'Cash').reduce((acc, p) => acc + p.amount, 0)
    const totalCard = liqCompleted.filter((p) => p.method === 'Card').reduce((acc, p) => acc + p.amount, 0)
    const totalTransfer = liqCompleted.filter((p) => p.method === 'Transfer').reduce((acc, p) => acc + p.amount, 0)

    const rows: (string | number)[][] = [
      ['VitaDent Clínica Odontológica - Reporte de Liquidación de Caja y Cobros'],
      ['Ámbito:', targetScope === 'all' ? 'Consolidado Total Clínica (4 Doctores)' : `${targetDoc?.name} (${targetDoc?.specialty})`],
      ['Consultorio:', targetScope === 'all' ? 'Consultorios 1, 2, 3 y 4' : targetDoc?.consultorio || ''],
      ['Período:', liquidationPeriod],
      ['Generado por:', 'Nathalia Leon (Asistente de Dirección y Coordinadora de Agendas)'],
      ['Fecha de Emisión:', new Date().toLocaleString('es-CO')],
      [''],
      ['RESUMEN FINANCIERO DE RECAUDOS'],
      ['Concepto', 'Total COP', 'Transacciones'],
      ['Efectivo en Caja', `$${totalCash.toLocaleString('es-CO')} COP`, liqCompleted.filter((p) => p.method === 'Cash').length],
      ['Datáfono / Tarjetas', `$${totalCard.toLocaleString('es-CO')} COP`, liqCompleted.filter((p) => p.method === 'Card').length],
      ['Transferencias (Nequi / Bancolombia)', `$${totalTransfer.toLocaleString('es-CO')} COP`, liqCompleted.filter((p) => p.method === 'Transfer').length],
      ['TOTAL RECAUDADO', `$${totalRecaudado.toLocaleString('es-CO')} COP`, liqCompleted.length],
      [''],
      ['DETALLE DE TRANSACCIONES Y RECIBOS'],
      ['No. Recibo', 'Fecha', 'Hora', 'Paciente', 'Cédula', 'Tratamiento', 'Doctor Responsable', 'Método', 'Monto COP', 'Estado', 'Notas']
    ]

    liqList.forEach((p) => {
      const d = DOCTORS_METADATA.find((m) => m.id === p.doctorId)
      rows.push([
        p.receiptNumber,
        p.date,
        p.time,
        p.patientName,
        p.patientDoc,
        p.treatment,
        `${p.doctor} (${d?.specialty || ''})`,
        p.methodLabel,
        p.amount,
        p.status,
        p.notes || ''
      ])
    })

    const csvContent =
      '\uFEFF' +
      rows
        .map((r) =>
          r
            .map((c) => {
              const s = String(c).replace(/"/g, '""')
              return `"${s}"`
            })
            .join(';')
        )
        .join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    onToast(`Liquidación descargada: ${filename}`)
  }

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

            {/* Botón Liquidación / Reporte de Cobros */}
            <button
              className="btn-3d-metallic"
              onClick={() => {
                setLiquidationDoctorScope(selectedDoctorFilter)
                setIsLiquidationModalOpen(true)
              }}
              style={{
                background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                borderColor: '#075985',
                color: '#ffffff',
                fontWeight: 700
              }}
              title="Sacar liquidación y reporte de cobros por doctor o consolidado clínica"
            >
              <FileText size={15} />
              <span>Liquidación / Reporte</span>
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

      {/* =========================================================================
          BARRA DE FILTRO POR DOCTOR / TOTALES (Coordinación de Agendas & Cobros)
          Permite a Nathalia Leon conmutar libremente entre la vista global o cada uno de los 4 doctores
          ========================================================================= */}
      <div
        style={{
          marginBottom: '18px',
          padding: '14px 18px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                backgroundColor: '#fdf2f8',
                color: '#A94384',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fbcfe8'
              }}
            >
              <Filter size={15} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                  Filtrar Cobros por Doctor / Totales Clínica
                </strong>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }}
                >
                  Nathalia Leon · Coordinación
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Seleccione un doctor para recalcular métricas y liquidar sus cobros, o consulte el consolidado institucional.
              </span>
            </div>
          </div>

          {/* Acceso rápido a Liquidación de este scope */}
          <button
            onClick={() => {
              setLiquidationDoctorScope(selectedDoctorFilter)
              setIsLiquidationModalOpen(true)
            }}
            style={{
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            <Printer size={13} style={{ color: '#A94384' }} />
            <span>
              {selectedDoctorFilter === 'all'
                ? 'Sacar Pagos Totales de la Clínica'
                : `Sacar Pagos de ${activeDoctorMeta?.name || 'Doctor'}`}
            </span>
          </button>
        </div>

        {/* Botones de Filtro Requeridos */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {/* [🏢 Todos los Pagos (Total Clínica)] */}
          <button
            onClick={() => handleSelectDoctorFilter('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: selectedDoctorFilter === 'all' ? '2px solid #0f172a' : '1px solid #cbd5e1',
              backgroundColor: selectedDoctorFilter === 'all' ? '#0f172a' : '#ffffff',
              color: selectedDoctorFilter === 'all' ? '#ffffff' : '#334155',
              boxShadow: selectedDoctorFilter === 'all' ? '0 4px 10px rgba(15, 23, 42, 0.25)' : 'none'
            }}
          >
            <span style={{ fontSize: '14px' }}>🏢</span>
            <span>Todos los Pagos (Total Clínica)</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: selectedDoctorFilter === 'all' ? '#A94384' : '#f1f5f9',
                color: selectedDoctorFilter === 'all' ? '#ffffff' : '#475569',
                fontWeight: 800
              }}
            >
              {payments.length}
            </span>
          </button>

          {/* [🦷 Dra. Sofía Valenzuela · General] */}
          {/* [🦷 Dr. Alejandro Soto · Ortodoncia 1] */}
          {/* [🦷 Dra. Claudia Rivas · Ortodoncia 2] */}
          {/* [✨ Dr. Marcos Pineda · Diseño de Sonrisa] */}
          {DOCTORS_METADATA.map((doc) => {
            const isSelected = selectedDoctorFilter === doc.id
            const docPaymentsCount = payments.filter((p) => p.doctorId === doc.id).length
            return (
              <button
                key={doc.id}
                onClick={() => handleSelectDoctorFilter(doc.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: isSelected ? `2px solid ${doc.color}` : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? doc.bg : '#ffffff',
                  color: isSelected ? doc.color : '#334155',
                  boxShadow: isSelected ? `0 4px 12px ${doc.color}33` : 'none',
                  transform: isSelected ? 'translateY(-1px)' : 'none'
                }}
              >
                <span style={{ fontSize: '14px' }}>{doc.iconEmoji}</span>
                <span>{doc.chipLabel}</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    backgroundColor: isSelected ? doc.color : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontWeight: 800
                  }}
                >
                  {docPaymentsCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4 Tarjetas KPI Ordenadas en la Parte Superior - Recalculadas en tiempo real */}
      <div className="cadra-kpi-grid-4" style={{ marginBottom: '22px' }}>
        {/* KPI 1: Total Cobrado del Doctor o Total Clínica */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <DollarSign size={16} style={{ color: '#10b981' }} />
            <span className="kpi-label">
              {selectedDoctorFilter === 'all'
                ? 'Total Cobrado Hoy (Clínica)'
                : `Total Cobrado · ${activeDoctorMeta?.shortLabel || 'Doctor'}`}
            </span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter
              value={`$${(selectedDoctorFilter === 'all' ? (totalCobradoHoyDoctor || 2550000) : totalCobradoDoctor).toLocaleString('es-CO')}`}
              duration={750}
              delay={100}
            />
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
              {selectedDoctorFilter === 'all'
                ? `● ${countCobrosHoy || 2} cobros hoy ingresados`
                : `● ${countCobrosTotal} cobros completados (${countCobrosHoy} hoy)`}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {selectedDoctorFilter === 'all'
                ? `Acumulado: $${totalCobradoDoctor.toLocaleString('es-CO')}`
                : `${activeDoctorMeta?.consultorio || ''} · ${activeDoctorMeta?.specialty}`}
            </span>
          </div>
        </div>

        {/* KPI 2: Facturación Proyectada del Doctor o Clínica */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <TrendingUp size={16} style={{ color: '#A94384' }} />
            <span className="kpi-label">
              {selectedDoctorFilter === 'all'
                ? 'Facturación del Mes (Clínica)'
                : `Facturación Proyectada · ${activeDoctorMeta?.shortLabel || 'Doctor'}`}
            </span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter
              value={`$${facturacionProyectada.toLocaleString('es-CO')}`}
              duration={750}
              delay={150}
            />
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
              {selectedDoctorFilter === 'all' ? '+12.4% vs mes anterior' : 'Proyección mensual'}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {selectedDoctorFilter === 'all'
                ? 'Meta: $50M COP'
                : `Meta consultorio: $${(facturacionProyectada * 1.05).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`}
            </span>
          </div>
        </div>

        {/* KPI 3: Saldos Pendientes / Cartera del Doctor o Clínica */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Clock size={16} style={{ color: '#d97706' }} />
            <span className="kpi-label">
              {selectedDoctorFilter === 'all'
                ? 'Saldos Pendientes de Cobro'
                : `Cartera Pendiente · ${activeDoctorMeta?.shortLabel || 'Doctor'}`}
            </span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value={`$${saldosPendientes.toLocaleString('es-CO')}`} duration={750} delay={200} />
            </span>
            <span className="cadra-tag-pill tag-orange" style={{ fontSize: '10.5px' }}>
              En Gestión
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {selectedDoctorFilter === 'all'
              ? 'Convenios EPS Sura y tratamientos en curso'
              : `Planes activos de ${activeDoctorMeta?.name || 'Doctor'}`}
          </span>
        </div>

        {/* KPI 4: Total Transacciones del Doctor o Clínica & Métodos */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CreditCard size={16} style={{ color: '#0284c7' }} />
            <span className="kpi-label">
              {selectedDoctorFilter === 'all'
                ? 'Transacciones Totales (Clínica)'
                : `Transacciones · ${activeDoctorMeta?.shortLabel || 'Doctor'}`}
            </span>
          </div>
          <div style={{ marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                {doctorScopedPayments.length} transacciones
              </strong>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#A94384' }}>
                ({completedInScope.length} cobradas)
              </span>
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
              <div style={{ width: `${methodStats.cardPct}%`, backgroundColor: '#A94384' }} title={`Datáfono ${methodStats.cardPct}%`} />
              <div style={{ width: `${methodStats.transferPct}%`, backgroundColor: '#0284c7' }} title={`Nequi/Bancolombia ${methodStats.transferPct}%`} />
              <div style={{ width: `${methodStats.cashPct}%`, backgroundColor: '#10b981' }} title={`Efectivo ${methodStats.cashPct}%`} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#64748b',
                marginTop: '5px'
              }}
            >
              <span>Tarjetas ({methodStats.cardPct}%)</span>
              <span>Nequi ({methodStats.transferPct}%)</span>
              <span>Efectivo ({methodStats.cashPct}%)</span>
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
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Doctor(a) Responsable</th>
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
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={28} color="#94a3b8" />
                      <span style={{ fontSize: '13.5px', fontWeight: 600 }}>No se encontraron cobros registrados</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {selectedDoctorFilter !== 'all'
                          ? `No hay cobros para el especialista seleccionado con los filtros actuales.`
                          : 'Ajuste los filtros o registre un nuevo cobro con el botón superior.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isVoid = p.status === 'Anulado'
                  const docMeta = getDoctorMeta(p.doctorId)
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
                        </div>
                      </td>

                      {/* Doctor(a) Responsable con Badge */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: docMeta.bg,
                              color: docMeta.color,
                              border: `1px solid ${docMeta.borderColor}`,
                              width: 'fit-content'
                            }}
                          >
                            <span>{docMeta.iconEmoji}</span>
                            <span>{p.doctor}</span>
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                            {docMeta.specialty} · {docMeta.consultorio}
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
                            value={selectedDoctorIdForCreate}
                            onChange={(e) => {
                              const docId = e.target.value as 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'
                              setSelectedDoctorIdForCreate(docId)
                              const d = DOCTORS_METADATA.find((m) => m.id === docId)
                              if (d) setCustomDoctor(d.name)
                            }}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '6px',
                              fontSize: '12px',
                              color: '#0f172a'
                            }}
                          >
                            {DOCTORS_METADATA.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.iconEmoji} {d.name} ({d.specialty})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* SELECTOR OBLIGATORIO DEL DOCTOR RESPONSABLE CON TARJETAS VISUALES */}
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Stethoscope size={14} style={{ color: '#A94384' }} />
                        <span>Doctor(a) Responsable del Procedimiento *</span>
                        <span style={{ fontSize: '10.5px', color: '#A94384', fontWeight: 700 }}>(Obligatorio para liquidación)</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {DOCTORS_METADATA.map((doc) => {
                          const isSelected = selectedDoctorIdForCreate === doc.id
                          return (
                            <div
                              key={doc.id}
                              onClick={() => {
                                setSelectedDoctorIdForCreate(doc.id)
                                setCustomDoctor(doc.name)
                              }}
                              style={{
                                padding: '9px 11px',
                                borderRadius: '10px',
                                border: isSelected ? `2px solid ${doc.color}` : '1px solid #cbd5e1',
                                backgroundColor: isSelected ? doc.bg : '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? `0 2px 8px ${doc.color}25` : 'none'
                              }}
                            >
                              <span style={{ fontSize: '18px' }}>{doc.iconEmoji}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <strong style={{ fontSize: '12px', display: 'block', color: isSelected ? doc.color : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {doc.name}
                                </strong>
                                <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>
                                  {doc.specialty} · {doc.consultorio}
                                </span>
                              </div>
                              {isSelected && (
                                <div
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: doc.color,
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  <Check size={11} />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
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
                        {(() => {
                          const d = getDoctorMeta(receiptToView.doctorId)
                          return (
                            <div>
                              <strong style={{ display: 'block', color: d.color }}>{d.iconEmoji} {receiptToView.doctor}</strong>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>{d.specialty} · {d.consultorio}</span>
                            </div>
                          )
                        })()}
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

                {/* Doctor(a) Responsable */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Doctor(a) Responsable *
                  </label>
                  <select
                    value={paymentToEdit.doctorId}
                    onChange={(e) => {
                      const docId = e.target.value as 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'
                      const meta = DOCTORS_METADATA.find((d) => d.id === docId)
                      setPaymentToEdit({
                        ...paymentToEdit,
                        doctorId: docId,
                        doctor: meta ? meta.name : paymentToEdit.doctor
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
                    {DOCTORS_METADATA.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.iconEmoji} {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
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

      {/* =========================================================================
          MODAL 5: LIQUIDACIÓN / REPORTE OFICIAL DE COBROS
          Permite sacar pagos por Doctor o Totales Consolidados de la Clínica
          Con opciones de Impresión oficial y Descarga CSV para contabilidad
          ========================================================================= */}
      {isLiquidationModalOpen && (
        <div
          className="cadra-modal-overlay"
          onClick={() => setIsLiquidationModalOpen(false)}
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
            style={{
              maxWidth: '820px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #fdf8fa 0%, #ffffff 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #A94384 0%, #8e356e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(169, 67, 132, 0.3)'
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    Liquidación & Reporte Oficial de Cobros
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    VitaDent Clínica Odontológica · NIT 901.482.910-4 · Recepción & Coordinación de Agendas
                  </span>
                </div>
              </div>

              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setIsLiquidationModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Selectores de Ámbito (Doctor o Totales) y Período */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    1. ¿Qué pagos desea sacar en este reporte / liquidación? *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setLiquidationDoctorScope('all')}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: liquidationDoctorScope === 'all' ? '2px solid #0f172a' : '1px solid #cbd5e1',
                        backgroundColor: liquidationDoctorScope === 'all' ? '#0f172a' : '#ffffff',
                        color: liquidationDoctorScope === 'all' ? '#ffffff' : '#334155'
                      }}
                    >
                      🏢 Sacar Pagos Totales de la Clínica
                    </button>
                    {DOCTORS_METADATA.map((doc) => {
                      const isSel = liquidationDoctorScope === doc.id
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setLiquidationDoctorScope(doc.id)}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isSel ? `2px solid ${doc.color}` : '1px solid #cbd5e1',
                            backgroundColor: isSel ? doc.bg : '#ffffff',
                            color: isSel ? doc.color : '#334155'
                          }}
                        >
                          {doc.iconEmoji} Sacar Pagos de {doc.shortLabel}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Período de Liquidación */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: '#A94384' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Período de Arqueo y Cobro:
                    </span>
                  </div>
                  <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '2px', borderRadius: '8px' }}>
                    {(['ALL', 'Hoy', 'Esta Semana', 'Este Mes'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setLiquidationPeriod(period)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: liquidationPeriod === period ? '#ffffff' : 'transparent',
                          color: liquidationPeriod === period ? '#0f172a' : '#64748b',
                          boxShadow: liquidationPeriod === period ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        {period === 'ALL' ? 'Todo el Histórico' : period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tarjetas de Resumen Financiero de la Liquidación */}
              {(() => {
                const liqItems = payments.filter((p) => {
                  if (liquidationDoctorScope !== 'all' && p.doctorId !== liquidationDoctorScope) return false
                  if (liquidationPeriod !== 'ALL' && p.period !== liquidationPeriod) return false
                  return true
                })
                const liqCompleted = liqItems.filter((p) => p.status === 'Completado')
                const totalMonto = liqCompleted.reduce((acc, p) => acc + p.amount, 0)
                const cardMonto = liqCompleted.filter((p) => p.method === 'Card').reduce((acc, p) => acc + p.amount, 0)
                const transMonto = liqCompleted.filter((p) => p.method === 'Transfer').reduce((acc, p) => acc + p.amount, 0)
                const cashMonto = liqCompleted.filter((p) => p.method === 'Cash').reduce((acc, p) => acc + p.amount, 0)
                const targetDoc = DOCTORS_METADATA.find((d) => d.id === liquidationDoctorScope)

                return (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '10px'
                      }}
                    >
                      <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', color: '#ffffff' }}>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Total Liquidado
                        </span>
                        <div style={{ fontSize: '17px', fontWeight: 900, color: '#10b981', marginTop: '3px' }}>
                          ${totalMonto.toLocaleString('es-CO')}
                        </div>
                        <span style={{ fontSize: '10px', color: '#cbd5e1' }}>
                          {liqCompleted.length} recibos completados
                        </span>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8' }}>
                        <span style={{ fontSize: '10.5px', color: '#A94384', textTransform: 'uppercase', fontWeight: 700 }}>
                          Datáfono / Tarjetas
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                          ${cardMonto.toLocaleString('es-CO')}
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                          {liqCompleted.filter((p) => p.method === 'Card').length} transacciones
                        </span>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                        <span style={{ fontSize: '10.5px', color: '#0284c7', textTransform: 'uppercase', fontWeight: 700 }}>
                          Transferencias (Nequi)
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                          ${transMonto.toLocaleString('es-CO')}
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                          {liqCompleted.filter((p) => p.method === 'Transfer').length} transacciones
                        </span>
                      </div>

                      <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <span style={{ fontSize: '10.5px', color: '#15803d', textTransform: 'uppercase', fontWeight: 700 }}>
                          Efectivo en Caja
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                          ${cashMonto.toLocaleString('es-CO')}
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                          {liqCompleted.filter((p) => p.method === 'Cash').length} pagos en caja
                        </span>
                      </div>
                    </div>

                    {/* Previsualización de Recibos Incluidos */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          Desglose de Recibos Incluidos ({liqItems.length} transacciones):
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {liquidationDoctorScope === 'all'
                            ? '🏢 Consolidado 4 Consultorios'
                            : `${targetDoc?.name} · ${targetDoc?.specialty}`}
                        </span>
                      </div>

                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
                          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '10.5px' }}>
                            <tr>
                              <th style={{ padding: '6px 10px' }}>Recibo</th>
                              <th style={{ padding: '6px 10px' }}>Paciente</th>
                              <th style={{ padding: '6px 10px' }}>Tratamiento</th>
                              <th style={{ padding: '6px 10px' }}>Doctor Responsable</th>
                              <th style={{ padding: '6px 10px' }}>Método</th>
                              <th style={{ padding: '6px 10px', textAlign: 'right' }}>Monto (COP)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {liqItems.length === 0 ? (
                              <tr>
                                <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                                  No hay cobros para el ámbito y período seleccionado.
                                </td>
                              </tr>
                            ) : (
                              liqItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '6px 10px', fontWeight: 700, color: '#A94384' }}>
                                    {item.receiptNumber}
                                  </td>
                                  <td style={{ padding: '6px 10px' }}>{item.patientName}</td>
                                  <td style={{ padding: '6px 10px', color: '#475569' }}>{item.treatment}</td>
                                  <td style={{ padding: '6px 10px', fontWeight: 600 }}>{item.doctor}</td>
                                  <td style={{ padding: '6px 10px' }}>{item.methodLabel}</td>
                                  <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 800, color: item.status === 'Anulado' ? '#94a3b8' : '#047857' }}>
                                    {item.status === 'Anulado' ? '(Anulado) ' : ''}${item.amount.toLocaleString('es-CO')}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Bloque de Certificación & Firmas */}
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                        color: '#64748b'
                      }}
                    >
                      <div>
                        <strong>Elaborado por:</strong> Nathalia Leon · Asistente de Dirección y Coordinadora de Agendas
                        <div style={{ marginTop: '2px', fontSize: '10px', color: '#94a3b8' }}>
                          Arqueo certificado para liquidación de honorarios y conciliación bancaria VitaDent.
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong>Revisión:</strong> {liquidationDoctorScope === 'all' ? 'Dirección General' : targetDoc?.name}
                        <div style={{ marginTop: '2px', fontSize: '10px', color: '#94a3b8' }}>
                          {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Footer con Acciones */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <button
                type="button"
                className="btn-3d-metallic"
                onClick={() => setIsLiquidationModalOpen(false)}
              >
                Cerrar
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-3d-metallic"
                  onClick={handleExportLiquidationCSV}
                  title="Descargar liquidación en archivo Excel / CSV"
                >
                  <Download size={14} />
                  <span>Descargar CSV (Excel)</span>
                </button>

                <button
                  type="button"
                  className="btn-3d-magenta"
                  onClick={() => {
                    window.print()
                  }}
                  title="Imprimir liquidación oficial de caja"
                >
                  <Printer size={15} />
                  <span>Imprimir Liquidación Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

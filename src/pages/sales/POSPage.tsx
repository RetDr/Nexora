import React, { useState, useEffect, useMemo } from 'react'
import {
  Store,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  CheckCircle2,
  Clock,
  Tag,
  Filter,
  ArrowRight,
  X,
  DollarSign,
  AlertCircle,
  Sparkles,
  UserCheck,
  Printer,
  Edit2,
  LayoutGrid,
  List,
  Users,
  Check,
  RotateCcw,
  Stethoscope,
  Info
} from 'lucide-react'
import { contactsData } from '../../data/cadraData'
import { ContactItem } from '../../types'
import { vitadentConfig } from '../../config/clinic.config'

export type DentalCategory =
  | 'Diagnóstico'
  | 'Higiene'
  | 'Conservadora'
  | 'Endodoncia'
  | 'Implantología'
  | 'Ortodoncia'
  | 'Estética'
  | 'Cirugía'

export interface DentalTreatment {
  id: string
  code: string
  name: string
  category: DentalCategory
  durationMin: number
  priceCop: number
  description: string
  status?: 'active' | 'archived'
}

export interface CartItem {
  treatment: DentalTreatment
  quantity: number
}

export interface ReceiptRecord {
  orderId: string
  date: string
  time: string
  patientName: string
  patientDoc: string
  doctor: string
  paymentMethod: string
  items: CartItem[]
  subtotal: number
  discountPct: number
  discountAmount: number
  total: number
  notes?: string
}

const INITIAL_TREATMENTS: DentalTreatment[] = [
  {
    id: 'trt-01',
    code: 'T-01',
    name: 'Primera consulta + Diagnóstico clínico y plan digital',
    category: 'Diagnóstico',
    durationMin: 30,
    priceCop: 50000,
    description: 'Valoración integral con cámara intraoral, periodontograma básico y plan de tratamiento digitalizado.',
    status: 'active'
  },
  {
    id: 'trt-02',
    code: 'T-02',
    name: 'Limpieza dental con ultrasonido + Profijet',
    category: 'Higiene',
    durationMin: 45,
    priceCop: 90000,
    description: 'Profilaxis profunda con ultrasonido cavitrón, aeropulidor de bicarbonato y fluorización tópica.',
    status: 'active'
  },
  {
    id: 'trt-03',
    code: 'T-03',
    name: 'Empaste / Obturación composite estético 3M',
    category: 'Conservadora',
    durationMin: 45,
    priceCop: 120000,
    description: 'Resina microhíbrida fotocurada de alta fidelidad estética con aislamiento dental absoluto.',
    status: 'active'
  },
  {
    id: 'trt-04',
    code: 'T-04',
    name: 'Endodoncia unirradicular mecanizada rotatoria',
    category: 'Endodoncia',
    durationMin: 60,
    priceCop: 350000,
    description: 'Tratamiento de conducto para incisivos o caninos con instrumentación rotatoria NiTi y sellado apical.',
    status: 'active'
  },
  {
    id: 'trt-05',
    code: 'T-05',
    name: 'Endodoncia multirradicular (molares)',
    category: 'Endodoncia',
    durationMin: 90,
    priceCop: 480000,
    description: 'Tratamiento de conductos en piezas complejas con localizador electrónico de ápice y magnificación.',
    status: 'active'
  },
  {
    id: 'trt-06',
    code: 'T-06',
    name: 'Implante titanio Straumann + Corona definitiva',
    category: 'Implantología',
    durationMin: 90,
    priceCop: 2500000,
    description: 'Fase quirúrgica con implante de titanio biocompatible Straumann más rehabilitación sobre implante.',
    status: 'active'
  },
  {
    id: 'trt-07',
    code: 'T-07',
    name: 'Ortodoncia — Control mensual y cambio de arcos',
    category: 'Ortodoncia',
    durationMin: 30,
    priceCop: 100000,
    description: 'Revisión de biomecánica oclusal, cambio de ligaduras elásticas y activación de arcos.',
    status: 'active'
  },
  {
    id: 'trt-08',
    code: 'T-08',
    name: 'Blanqueamiento dental LED en consultorio',
    category: 'Estética',
    durationMin: 60,
    priceCop: 300000,
    description: 'Aplicación de peróxido de hidrógeno fotoactivado por lámpara LED clínica en 3 ciclos continuos.',
    status: 'active'
  },
  {
    id: 'trt-09',
    code: 'T-09',
    name: 'Extracción quirúrgica de cordal / tercer molar',
    category: 'Cirugía',
    durationMin: 45,
    priceCop: 250000,
    description: 'Cirugía oral menor con ostectomía y odontosección bajo anestesia local troncular y sutura.',
    status: 'active'
  },
  {
    id: 'trt-10',
    code: 'T-10',
    name: 'Gingivoplastia estética con electrobisturí',
    category: 'Cirugía',
    durationMin: 45,
    priceCop: 220000,
    description: 'Remodelado de margen gingival para armonización de sonrisa y alargamiento coronal.',
    status: 'active'
  },
  {
    id: 'trt-11',
    code: 'T-11',
    name: 'Carilla dental en cerámica / disilicato de litio',
    category: 'Estética',
    durationMin: 60,
    priceCop: 850000,
    description: 'Lámina cerámica de alta translucidez confeccionada en laboratorio para diseño de sonrisa.',
    status: 'active'
  },
  {
    id: 'trt-12',
    code: 'T-12',
    name: 'Corona libre de metal en zirconio anatómico',
    category: 'Conservadora',
    durationMin: 60,
    priceCop: 750000,
    description: 'Restauración protésica fija fresada en CAD/CAM de máxima dureza, biocompatibilidad y estética.',
    status: 'active'
  }
]

const CATEGORY_STYLES: Record<DentalCategory, { bg: string; text: string; border: string; icon: string }> = {
  'Diagnóstico': { bg: '#fdf2f8', text: '#A94384', border: '#fbcfe8', icon: '🔍' },
  'Higiene': { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd', icon: '✨' },
  'Conservadora': { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', icon: '🦷' },
  'Endodoncia': { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4', icon: '⚡' },
  'Implantología': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', icon: '🔩' },
  'Ortodoncia': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', icon: '😁' },
  'Estética': { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff', icon: '💎' },
  'Cirugía': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', icon: '🩺' }
}

const ALL_CATEGORIES: DentalCategory[] = [
  'Diagnóstico',
  'Higiene',
  'Conservadora',
  'Endodoncia',
  'Implantología',
  'Ortodoncia',
  'Estética',
  'Cirugía'
]

interface POSPageProps {
  onNavigate: (path: string) => void
  onToast: (msg: string) => void
}

export const POSPage: React.FC<POSPageProps> = ({ onNavigate, onToast }) => {
  // 1. Treatments State with LocalStorage persistence
  const [treatments, setTreatments] = useState<DentalTreatment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_treatments_catalog')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_TREATMENTS
  })

  useEffect(() => {
    try {
      localStorage.setItem('vitadent_treatments_catalog', JSON.stringify(treatments))
    } catch {
      // ignore
    }
  }, [treatments])

  // 2. Patients list
  const [contacts] = useState<ContactItem[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_contacts')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return contactsData
  })

  const patientsList = useMemo(() => {
    return contacts.filter((c) => c.type === 'Customer' || !c.type)
  }, [contacts])

  // 3. UI and Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isCartVisible, setIsCartVisible] = useState(true)

  // 4. Cart / Billing State
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>('walk-in')
  const [customPatientName, setCustomPatientName] = useState<string>('')
  const [customPatientDoc, setCustomPatientDoc] = useState<string>('')
  const [selectedDoctor, setSelectedDoctor] = useState<string>(
    vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela'
  )
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Transfer' | 'Cash'>('Card')
  const [discountPct, setDiscountPct] = useState<number>(0)
  const [billingNotes, setBillingNotes] = useState<string>('')

  // 5. Modals State
  // CRUD Modal (Create / Edit)
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<DentalTreatment | null>(null)
  const [formCode, setFormCode] = useState('')
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<DentalCategory>('Diagnóstico')
  const [formDuration, setFormDuration] = useState<number>(30)
  const [formPrice, setFormPrice] = useState<number>(50000)
  const [formDescription, setFormDescription] = useState('')

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [treatmentToDelete, setTreatmentToDelete] = useState<DentalTreatment | null>(null)

  // Direct Charge Modal (Charge procedure directly to patient)
  const [isDirectChargeOpen, setIsDirectChargeOpen] = useState(false)
  const [directTreatment, setDirectTreatment] = useState<DentalTreatment | null>(null)
  const [directPatientId, setDirectPatientId] = useState<string>('walk-in')
  const [directCustomName, setDirectCustomName] = useState<string>('')
  const [directCustomDoc, setDirectCustomDoc] = useState<string>('')
  const [directDoctor, setDirectDoctor] = useState<string>(
    vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela'
  )
  const [directMethod, setDirectMethod] = useState<'Card' | 'Transfer' | 'Cash'>('Card')
  const [directDiscount, setDirectDiscount] = useState<number>(0)

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<ReceiptRecord | null>(null)

  // Filtered Treatments
  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCat = selectedCategory === 'Todas' ? true : t.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      return matchesCat && matchesQuery
    })
  }, [treatments, selectedCategory, searchQuery])

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: treatments.length }
    ALL_CATEGORIES.forEach((cat) => {
      counts[cat] = treatments.filter((t) => t.category === cat).length
    })
    return counts
  }, [treatments])

  // Cart Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.treatment.priceCop * item.quantity, 0)
  const discountAmount = Math.round(rawSubtotal * (discountPct / 100))
  const finalTotal = rawSubtotal - discountAmount

  // Cart Handlers
  const addToCart = (treatment: DentalTreatment) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.treatment.id === treatment.id)
      if (existing) {
        return prev.map((item) =>
          item.treatment.id === treatment.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { treatment, quantity: 1 }]
    })
    setIsCartVisible(true)
    onToast(`"${treatment.name}" añadido al cobro en recepción.`)
  }

  const updateCartQuantity = (treatmentId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.treatment.id === treatmentId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (treatmentId: string) => {
    setCart((prev) => prev.filter((item) => item.treatment.id !== treatmentId))
  }

  const clearCart = () => {
    setCart([])
    setDiscountPct(0)
    setBillingNotes('')
  }

  // Helper to resolve patient name & doc
  const resolvePatientInfo = (id: string, customName: string, customDoc: string) => {
    if (id === 'walk-in') {
      return {
        name: customName.trim() || 'Paciente Particular / Ambulatorio',
        doc: customDoc.trim() || 'Documento no registrado'
      }
    }
    const pat = patientsList.find((p) => p.id === id)
    return {
      name: pat ? pat.company : 'Paciente no registrado',
      doc: pat ? pat.rep || pat.city || 'CC registrada' : 'CC registrada'
    }
  }

  // Helper to persist payment to vitadent_clinical_payments
  const recordClinicalPayment = (receipt: ReceiptRecord) => {
    try {
      const existingRaw = localStorage.getItem('vitadent_clinical_payments')
      const existing = existingRaw ? JSON.parse(existingRaw) : []

      const methodLabelMap = {
        Card: 'Tarjeta / Datáfono',
        Transfer: 'Nequi / Bancolombia',
        Cash: 'Efectivo'
      }

      const newTx = {
        id: `pay-${Date.now()}`,
        receiptNumber: receipt.orderId,
        patientId: selectedPatientId !== 'walk-in' ? selectedPatientId : `c-${Date.now()}`,
        patientName: receipt.patientName,
        patientDoc: receipt.patientDoc,
        patientInitials: receipt.patientName
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        patientPhone: '+57 300 000 0000',
        patientEmail: 'paciente@vitadent.com.co',
        treatment: receipt.items.map((i) => `${i.quantity}x ${i.treatment.name}`).join(' + '),
        doctor: receipt.doctor,
        amount: receipt.total,
        method: receipt.paymentMethod as 'Card' | 'Transfer' | 'Cash',
        methodLabel: methodLabelMap[receipt.paymentMethod as keyof typeof methodLabelMap] || 'Tarjeta / Datáfono',
        date: receipt.date,
        time: receipt.time,
        period: 'Hoy' as const,
        status: 'Completado' as const,
        notes: receipt.notes || `Cobro en Caja Recepción · Facturado en terminal POS`
      }

      const updated = [newTx, ...existing]
      localStorage.setItem('vitadent_clinical_payments', JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  // Process Checkout from Cart
  const handleProcessCheckout = () => {
    if (cart.length === 0) {
      onToast('El carrito de cobro está vacío. Agregue procedimientos para cobrar.')
      return
    }

    const { name, doc } = resolvePatientInfo(selectedPatientId, customPatientName, customPatientDoc)
    const now = new Date()
    const orderNumber = `REC-${Math.floor(4200 + Math.random() * 800)}`

    const receipt: ReceiptRecord = {
      orderId: orderNumber,
      date: now.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      patientName: name,
      patientDoc: doc,
      doctor: selectedDoctor,
      paymentMethod,
      items: [...cart],
      subtotal: rawSubtotal,
      discountPct,
      discountAmount,
      total: finalTotal,
      notes: billingNotes
    }

    recordClinicalPayment(receipt)
    setLastReceipt(receipt)
    setShowReceiptModal(true)
    clearCart()
    onToast(`¡Cobro registrado con éxito! Recibo ${orderNumber} generado.`)
  }

  // Open Direct Charge Modal for a single procedure
  const handleOpenDirectCharge = (treatment: DentalTreatment) => {
    setDirectTreatment(treatment)
    setDirectPatientId('walk-in')
    setDirectCustomName('')
    setDirectCustomDoc('')
    setDirectDoctor(vitadentConfig.doctors[0]?.name || 'Dra. Sofía Valenzuela')
    setDirectMethod('Card')
    setDirectDiscount(0)
    setIsDirectChargeOpen(true)
  }

  // Process Direct Charge
  const handleConfirmDirectCharge = () => {
    if (!directTreatment) return

    const { name, doc } = resolvePatientInfo(directPatientId, directCustomName, directCustomDoc)
    const now = new Date()
    const orderNumber = `REC-${Math.floor(4200 + Math.random() * 800)}`

    const raw = directTreatment.priceCop
    const discAmt = Math.round(raw * (directDiscount / 100))
    const total = raw - discAmt

    const receipt: ReceiptRecord = {
      orderId: orderNumber,
      date: now.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      patientName: name,
      patientDoc: doc,
      doctor: directDoctor,
      paymentMethod: directMethod,
      items: [{ treatment: directTreatment, quantity: 1 }],
      subtotal: raw,
      discountPct: directDiscount,
      discountAmount: discAmt,
      total,
      notes: `Cobro individual directo de ${directTreatment.code}`
    }

    recordClinicalPayment(receipt)
    setLastReceipt(receipt)
    setIsDirectChargeOpen(false)
    setShowReceiptModal(true)
    onToast(`¡Cobro de ${directTreatment.name} registrado exitosamente!`)
  }

  // Open Create Modal
  const handleOpenCreateModal = () => {
    // Generate next suggested code
    const maxNumber = treatments.reduce((max, t) => {
      const match = t.code.match(/T-(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        return num > max ? num : max
      }
      return max
    }, 0)
    const nextCode = `T-${String(maxNumber + 1).padStart(2, '0')}`

    setEditingTreatment(null)
    setFormCode(nextCode)
    setFormName('')
    setFormCategory('Diagnóstico')
    setFormDuration(30)
    setFormPrice(50000)
    setFormDescription('')
    setIsCrudModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (treatment: DentalTreatment) => {
    setEditingTreatment(treatment)
    setFormCode(treatment.code)
    setFormName(treatment.name)
    setFormCategory(treatment.category)
    setFormDuration(treatment.durationMin)
    setFormPrice(treatment.priceCop)
    setFormDescription(treatment.description || '')
    setIsCrudModalOpen(true)
  }

  // Submit CRUD (Create or Update)
  const handleSubmitCrud = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim()) {
      onToast('Por favor ingrese el nombre del tratamiento o procedimiento.')
      return
    }
    if (!formCode.trim()) {
      onToast('Por favor ingrese el código del procedimiento.')
      return
    }
    if (formPrice < 0) {
      onToast('El valor de la tarifa no puede ser negativo.')
      return
    }

    if (editingTreatment) {
      // Update existing
      setTreatments((prev) =>
        prev.map((t) =>
          t.id === editingTreatment.id
            ? {
                ...t,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                category: formCategory,
                durationMin: Number(formDuration),
                priceCop: Number(formPrice),
                description: formDescription.trim()
              }
            : t
        )
      )
      onToast(`Tarifa "${formName.trim()}" actualizada exitosamente.`)
    } else {
      // Create new
      const newTreatment: DentalTreatment = {
        id: `trt-${Date.now()}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        category: formCategory,
        durationMin: Number(formDuration),
        priceCop: Number(formPrice),
        description: formDescription.trim(),
        status: 'active'
      }
      setTreatments((prev) => [newTreatment, ...prev])
      onToast(`Procedimiento "${newTreatment.name}" agregado al catálogo clínico.`)
    }

    setIsCrudModalOpen(false)
  }

  // Open Delete Modal
  const handleOpenDeleteModal = (treatment: DentalTreatment) => {
    setTreatmentToDelete(treatment)
    setIsDeleteModalOpen(true)
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!treatmentToDelete) return
    setTreatments((prev) => prev.filter((t) => t.id !== treatmentToDelete.id))
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.treatment.id !== treatmentToDelete.id))
    onToast(`Procedimiento ${treatmentToDelete.code} eliminado del catálogo.`)
    setIsDeleteModalOpen(false)
    setTreatmentToDelete(null)
  }

  return (
    <div className="cadra-page-container">
      {/* 3D Tactile VitaDent CSS */}
      <style>{`
        .btn-vitadent-primary {
          background: linear-gradient(180deg, #b84b90 0%, #A94384 65%, #8e356e 100%);
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
          box-shadow: 0 2px 6px rgba(169, 67, 132, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transition: all 0.16s ease;
        }
        .btn-vitadent-primary:hover {
          background: linear-gradient(180deg, #c4559b 0%, #b3478c 65%, #993a77 100%);
          box-shadow: 0 4px 14px rgba(169, 67, 132, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .btn-vitadent-primary:active {
          transform: translateY(1px);
          box-shadow: 0 1px 3px rgba(169, 67, 132, 0.3);
        }

        .btn-vitadent-secondary {
          background: #ffffff;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 8px 14px;
          font-weight: 600;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.16s ease;
        }
        .btn-vitadent-secondary:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .treatment-card-3d {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .treatment-card-3d:hover {
          border-color: #A94384;
          box-shadow: 0 8px 24px rgba(169, 67, 132, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-2px);
        }

        .cat-pill-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .cat-pill-tab:hover {
          border-color: #A94384;
          color: #A94384;
          background: #fdf2f8;
        }
        .cat-pill-tab.active {
          background: #A94384;
          color: #ffffff;
          border-color: #8e356e;
          box-shadow: 0 2px 6px rgba(169, 67, 132, 0.35);
        }
        .cat-pill-tab .badge-count {
          padding: 1px 6px;
          border-radius: 9999px;
          font-size: 11px;
          background: rgba(0, 0, 0, 0.06);
        }
        .cat-pill-tab.active .badge-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .method-radio-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .method-radio-btn.selected {
          border-color: #A94384;
          background: #fdf2f8;
          color: #A94384;
          box-shadow: 0 1px 3px rgba(169, 67, 132, 0.2);
        }

        .receipt-watermark {
          border-top: 2px dashed #cbd5e1;
          border-bottom: 2px dashed #cbd5e1;
          padding: 14px 0;
          margin: 14px 0;
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Precios & Tarifas Clínicas</span>
      </div>

      {/* Clean Header (NO DUPLICATE SUBMODULE PILLS) */}
      <div className="cadra-page-header" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 className="cadra-page-title" style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Precios & Tarifas Clínicas
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Catálogo oficial de aranceles odontológicos y terminal de facturación en recepción.
          </p>
        </div>

        {/* Clean Header Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Search */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9px',
              padding: '0 10px',
              height: '38px',
              minWidth: '220px'
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar procedimiento o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                paddingLeft: '8px',
                fontSize: '12.5px',
                width: '100%',
                background: 'transparent'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid #e2e8f0'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#A94384' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Vista en Cuadrícula"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#A94384' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Vista en Tabla"
            >
              <List size={15} />
            </button>
          </div>

          {/* Action 1: Create New Procedure */}
          <button className="btn-vitadent-primary" onClick={handleOpenCreateModal}>
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Nuevo Procedimiento</span>
          </button>

          {/* Action 2: Open/Toggle Reception Cart */}
          <button
            className="btn-vitadent-secondary"
            onClick={() => setIsCartVisible((prev) => !prev)}
            style={{
              backgroundColor: isCartVisible && cart.length > 0 ? '#fdf2f8' : '#ffffff',
              borderColor: isCartVisible && cart.length > 0 ? '#A94384' : '#cbd5e1',
              color: isCartVisible && cart.length > 0 ? '#A94384' : '#334155'
            }}
          >
            <ShoppingCart size={15} />
            <span>🛒 Cobro en Recepción</span>
            {cart.length > 0 && (
              <span
                style={{
                  background: '#A94384',
                  color: '#ffffff',
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Till Operational Banner */}
      <div className="showroom-till-banner" style={{ marginBottom: '18px' }}>
        <div className="till-info-left">
          <div className="till-icon-circle" style={{ backgroundColor: '#fdf2f8', color: '#A94384' }}>
            <Store size={19} />
          </div>
          <div>
            <div className="till-title-line">
              <span className="till-name">Caja Principal — Recepción VitaDent</span>
              <span className="cadra-tag-pill tag-green">● Caja Abierta y Operativa</span>
            </div>
            <span className="till-subtext">
              RUT: 900.582.194-1 · Régimen Salud Exento de IVA (Art. 476 E.T.) · Terminal 01 Recepción
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="cadra-btn-secondary"
            onClick={() => onNavigate('/pagos')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CreditCard size={14} color="#A94384" />
            <span>Módulo de Pagos & Auditoría</span>
          </button>

          <button
            className="cadra-btn-secondary"
            onClick={() => {
              if (lastReceipt) setShowReceiptModal(true)
              else onToast('No hay recibo reciente en esta sesión.')
            }}
          >
            <Receipt size={14} />
            <span>Último recibo</span>
          </button>
        </div>
      </div>

      {/* Real Dental Category Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '16px'
        }}
      >
        <button
          className={`cat-pill-tab ${selectedCategory === 'Todas' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Todas')}
        >
          <span>🦷 Todas las Especialidades</span>
          <span className="badge-count">{categoryCounts['Todas']}</span>
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const style = CATEGORY_STYLES[cat]
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              className={`cat-pill-tab ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{style.icon} {cat}</span>
              <span className="badge-count">{categoryCounts[cat] || 0}</span>
            </button>
          )
        })}
      </div>

      {/* Main Split Layout: Catalog (Left) + Cart & Billing (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCartVisible ? '1fr 370px' : '1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Procedures Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Results Summary Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '12.5px',
              color: '#64748b'
            }}
          >
            <span>
              Mostrando <strong style={{ color: '#0f172a' }}>{filteredTreatments.length}</strong> procedimientos en{' '}
              <strong style={{ color: '#A94384' }}>{selectedCategory}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Moneda oficial: <strong>COP ($)</strong></span>
            </div>
          </div>

          {/* Empty State */}
          {filteredTreatments.length === 0 && (
            <div
              style={{
                background: '#ffffff',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center'
              }}
            >
              <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: '#1e293b' }}>
                No se encontraron procedimientos
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                No hay tarifas que coincidan con la búsqueda "{searchQuery}" en la categoría {selectedCategory}.
              </p>
              <button className="btn-vitadent-primary" onClick={handleOpenCreateModal}>
                <Plus size={14} />
                <span>Crear nuevo procedimiento</span>
              </button>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && filteredTreatments.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px'
              }}
            >
              {filteredTreatments.map((treatment) => {
                const catStyle = CATEGORY_STYLES[treatment.category] || {
                  bg: '#f1f5f9',
                  text: '#475569',
                  border: '#cbd5e1',
                  icon: '🦷'
                }
                const inCart = cart.find((i) => i.treatment.id === treatment.id)

                return (
                  <div key={treatment.id} className="treatment-card-3d">
                    {/* Top Badges */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}
                    >
                      <span
                        style={{
                          background: catStyle.bg,
                          color: catStyle.text,
                          border: `1px solid ${catStyle.border}`,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{catStyle.icon}</span>
                        <span>{treatment.category}</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            background: '#f8fafc',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: 700
                          }}
                        >
                          {treatment.code}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            color: '#64748b'
                          }}
                        >
                          <Clock size={11} />
                          {treatment.durationMin}m
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div style={{ marginBottom: '14px', flex: 1 }}>
                      <h4
                        style={{
                          margin: '0 0 6px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#0f172a',
                          lineHeight: '1.3'
                        }}
                      >
                        {treatment.name}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#64748b',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {treatment.description}
                      </p>
                    </div>

                    {/* Price in COP */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderTop: '1px solid #f1f5f9',
                        borderBottom: '1px solid #f1f5f9',
                        marginBottom: '12px'
                      }}
                    >
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
                        Tarifa Base Clínica
                      </span>
                      <span
                        style={{
                          fontSize: '17px',
                          fontWeight: '800',
                          color: '#A94384',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        ${treatment.priceCop.toLocaleString('es-CO')} <span style={{ fontSize: '11px', color: '#8A8A8F' }}>COP</span>
                      </span>
                    </div>

                    {/* Action Buttons Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      {/* Add to Cart button */}
                      <button
                        onClick={() => addToCart(treatment)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: inCart ? '#fdf2f8' : '#f8fafc',
                          color: inCart ? '#A94384' : '#334155',
                          border: inCart ? '1px solid #A94384' : '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <ShoppingCart size={13} />
                        <span>{inCart ? `En caja (${inCart.quantity})` : '+ Carrito'}</span>
                      </button>

                      {/* Direct Charge button */}
                      <button
                        onClick={() => handleOpenDirectCharge(treatment)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: '#A94384',
                          color: '#ffffff',
                          border: '1px solid #8e356e',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title="Cobrar este procedimiento de inmediato"
                      >
                        <CreditCard size={13} />
                        <span>Cobrar</span>
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => handleOpenEditModal(treatment)}
                        style={{
                          padding: '7px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          color: '#64748b',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Editar tarifa y detalles"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleOpenDeleteModal(treatment)}
                        style={{
                          padding: '7px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Eliminar procedimiento del catálogo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && filteredTreatments.length > 0 && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Código</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Procedimiento Clínico</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Categoría</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Duración</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tarifa (COP)</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTreatments.map((treatment) => {
                    const catStyle = CATEGORY_STYLES[treatment.category] || {
                      bg: '#f1f5f9',
                      text: '#475569',
                      border: '#cbd5e1',
                      icon: '🦷'
                    }
                    const inCart = cart.find((i) => i.treatment.id === treatment.id)

                    return (
                      <tr
                        key={treatment.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdf2f840')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                          {treatment.code}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{treatment.name}</strong>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>{treatment.description}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              background: catStyle.bg,
                              color: catStyle.text,
                              border: `1px solid ${catStyle.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{catStyle.icon}</span>
                            <span>{treatment.category}</span>
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#64748b" />
                            {treatment.durationMin} min
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#A94384' }}>
                          ${treatment.priceCop.toLocaleString('es-CO')} COP
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => addToCart(treatment)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: inCart ? '#fdf2f8' : '#f1f5f9',
                                color: inCart ? '#A94384' : '#334155',
                                border: inCart ? '1px solid #A94384' : '1px solid #cbd5e1',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {inCart ? `+ En Caja (${inCart.quantity})` : '+ Carrito'}
                            </button>
                            <button
                              onClick={() => handleOpenDirectCharge(treatment)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: '#A94384',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Cobrar
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(treatment)}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                cursor: 'pointer'
                              }}
                              title="Editar"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(treatment)}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                cursor: 'pointer'
                              }}
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Reception Cart & Direct Patient Billing */}
        {isCartVisible && (
          <aside
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '18px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Cart Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    background: '#fdf2f8',
                    color: '#A94384',
                    padding: '6px',
                    borderRadius: '8px'
                  }}
                >
                  <ShoppingCart size={17} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    Cobro en Recepción
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Terminal de Facturación POS
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Vaciar carrito"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <span
                  style={{
                    background: cart.length > 0 ? '#fdf2f8' : '#f1f5f9',
                    color: cart.length > 0 ? '#A94384' : '#64748b',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {cart.length} {cart.length === 1 ? 'procedimiento' : 'procedimientos'}
                </span>
              </div>
            </div>

            {/* Patient Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={13} color="#A94384" />
                <span>Paciente a Facturar</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  background: '#f8fafc',
                  outline: 'none'
                }}
              >
                <option value="walk-in">👤 Paciente Particular / Ambulatorio</option>
                <optgroup label="Pacientes Registrados en VitaDent">
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.company} ({p.rep || p.city || 'CC Registrada'})
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* If Walk-in, allow manual name & doc */}
              {selectedPatientId === 'walk-in' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px', marginTop: '4px' }}>
                  <input
                    type="text"
                    placeholder="Nombre completo del paciente"
                    value={customPatientName}
                    onChange={(e) => setCustomPatientName(e.target.value)}
                    style={{
                      padding: '7px 9px',
                      borderRadius: '7px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cédula / Documento"
                    value={customPatientDoc}
                    onChange={(e) => setCustomPatientDoc(e.target.value)}
                    style={{
                      padding: '7px 9px',
                      borderRadius: '7px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Professional / Doctor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Stethoscope size={13} color="#A94384" />
                <span>Odontólogo Tratante</span>
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  background: '#f8fafc',
                  outline: 'none'
                }}
              >
                {vitadentConfig.doctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} · {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items Scroll */}
            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '4px'
              }}
            >
              {cart.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px dashed #cbd5e1'
                  }}
                >
                  <ShoppingCart size={24} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <strong style={{ display: 'block', fontSize: '13px', color: '#475569' }}>
                    La caja está vacía
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    Haga clic en "+ Carrito" en cualquier tratamiento para agregarlo.
                  </span>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.treatment.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.treatment.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        ${item.treatment.priceCop.toLocaleString('es-CO')} COP c/u
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          padding: '1px'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.treatment.id, -1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '3px 6px',
                            cursor: 'pointer',
                            color: '#64748b'
                          }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.treatment.id, 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '3px 6px',
                            cursor: 'pointer',
                            color: '#64748b'
                          }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.treatment.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '3px'
                        }}
                        title="Quitar"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount Selection */}
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Descuento Odontológico
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPct(pct)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: discountPct === pct ? '1.5px solid #A94384' : '1px solid #cbd5e1',
                      background: discountPct === pct ? '#fdf2f8' : '#ffffff',
                      color: discountPct === pct ? '#A94384' : '#475569'
                    }}
                  >
                    {pct === 0 ? 'Sin desc.' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Método de Pago
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`method-radio-btn ${paymentMethod === 'Card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <CreditCard size={12} />
                  <span>Datáfono</span>
                </button>
                <button
                  type="button"
                  className={`method-radio-btn ${paymentMethod === 'Transfer' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('Transfer')}
                >
                  <DollarSign size={12} />
                  <span>Nequi / Bancol.</span>
                </button>
                <button
                  type="button"
                  className={`method-radio-btn ${paymentMethod === 'Cash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('Cash')}
                >
                  <Store size={12} />
                  <span>Efectivo</span>
                </button>
              </div>
            </div>

            {/* Financial Totals */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12.5px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal Tarifas</span>
                <span>${rawSubtotal.toLocaleString('es-CO')} COP</span>
              </div>

              {discountPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                  <span>Descuento aplicado ({discountPct}%)</span>
                  <span>-${discountAmount.toLocaleString('es-CO')} COP</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11.5px' }}>
                <span>IVA Salud (Art. 476 E.T.)</span>
                <span>Exento $0 COP</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1.5px solid #cbd5e1',
                  paddingTop: '8px',
                  marginTop: '4px'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  Total a Cancelar
                </span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#A94384' }}>
                  ${finalTotal.toLocaleString('es-CO')} <span style={{ fontSize: '12px' }}>COP</span>
                </span>
              </div>
            </div>

            {/* Action Buttons: Checkout & Direct to Payments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn-vitadent-primary"
                disabled={cart.length === 0}
                onClick={handleProcessCheckout}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '14px',
                  opacity: cart.length === 0 ? 0.6 : 1,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Cobrar ${finalTotal.toLocaleString('es-CO')} & Generar Recibo</span>
              </button>

              <button
                className="btn-vitadent-secondary"
                onClick={() => onNavigate('/pagos')}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '12.5px'
                }}
              >
                <CreditCard size={14} color="#A94384" />
                <span>Ver Historial en Módulo de Pagos</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* MODAL 1: CRUD PROCEDIMIENTO (Crear / Editar) */}
      {isCrudModalOpen && (
        <div className="cadra-modal-overlay" onClick={() => setIsCrudModalOpen(false)}>
          <div
            className="cadra-modal-box"
            style={{ maxWidth: '540px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="cadra-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    background: '#fdf2f8',
                    color: '#A94384',
                    padding: '6px',
                    borderRadius: '8px'
                  }}
                >
                  <Tag size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {editingTreatment ? `Editar Tarifa — ${editingTreatment.code}` : 'Nuevo Procedimiento Clínico'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    VitaDent Clínica Odontológica · Catálogo de Aranceles
                  </span>
                </div>
              </div>
              <button
                className="icon-close-btn"
                onClick={() => setIsCrudModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitCrud} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: Code and Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="T-13"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Categoría Odontológica *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as DentalCategory)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Nombre del Tratamiento / Procedimiento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Gingivoplastia estética con electrobisturí"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Row 3: Duration and Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Duración Estimada *
                  </label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos (Estándar)</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos (1.5 horas)</option>
                    <option value={120}>120 minutos (2 horas)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Tarifa Base en COP ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#A94384',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    ${Number(formPrice || 0).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Row 4: Description / Clinical notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Descripción y Alcance Clínico
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre materiales empleados, técnica o indicaciones para el paciente..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <button
                  type="button"
                  className="btn-vitadent-secondary"
                  onClick={() => setIsCrudModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-vitadent-primary">
                  <Check size={14} />
                  <span>{editingTreatment ? 'Guardar Cambios' : 'Crear Procedimiento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAR ELIMINACIÓN */}
      {isDeleteModalOpen && treatmentToDelete && (
        <div className="cadra-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div
            className="cadra-modal-box"
            style={{ maxWidth: '440px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cadra-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                <AlertCircle size={20} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  Eliminar Procedimiento
                </h3>
              </div>
              <button
                className="icon-close-btn"
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                ¿Está seguro de que desea eliminar la tarifa de{' '}
                <strong style={{ color: '#0f172a' }}>{treatmentToDelete.name}</strong> ({treatmentToDelete.code})?
              </p>
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#991b1b',
                  marginBottom: '16px'
                }}
              >
                Esta acción removerá el procedimiento del catálogo y de cualquier carrito de cobro pendiente.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-vitadent-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: '1px solid #b91c1c',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: COBRO RÁPIDO DIRECTO A PACIENTE */}
      {isDirectChargeOpen && directTreatment && (
        <div className="cadra-modal-overlay" onClick={() => setIsDirectChargeOpen(false)}>
          <div
            className="cadra-modal-box"
            style={{ maxWidth: '480px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cadra-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#fdf2f8', color: '#A94384', padding: '6px', borderRadius: '8px' }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    Cobro Inmediato — {directTreatment.code}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Facturación directa de procedimiento
                  </span>
                </div>
              </div>
              <button
                className="icon-close-btn"
                onClick={() => setIsDirectChargeOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Procedure summary */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px'
                }}
              >
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                  {directTreatment.name}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                  <span>Especialidad: {directTreatment.category}</span>
                  <span style={{ fontWeight: 800, color: '#A94384', fontSize: '14px' }}>
                    ${directTreatment.priceCop.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Patient */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Paciente
                </label>
                <select
                  value={directPatientId}
                  onChange={(e) => setDirectPatientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    background: '#ffffff'
                  }}
                >
                  <option value="walk-in">👤 Paciente Particular / Ambulatorio</option>
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.company} ({p.rep || p.city})
                    </option>
                  ))}
                </select>

                {directPatientId === 'walk-in' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px', marginTop: '6px' }}>
                    <input
                      type="text"
                      placeholder="Nombre del paciente"
                      value={directCustomName}
                      onChange={(e) => setDirectCustomName(e.target.value)}
                      style={{ padding: '7px 9px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Cédula"
                      value={directCustomDoc}
                      onChange={(e) => setDirectCustomDoc(e.target.value)}
                      style={{ padding: '7px 9px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                )}
              </div>

              {/* Doctor */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Odontólogo
                </label>
                <select
                  value={directDoctor}
                  onChange={(e) => setDirectDoctor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px'
                  }}
                >
                  {vitadentConfig.doctors.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Método de Pago
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`method-radio-btn ${directMethod === 'Card' ? 'selected' : ''}`}
                    onClick={() => setDirectMethod('Card')}
                  >
                    <CreditCard size={12} />
                    <span>Datáfono</span>
                  </button>
                  <button
                    type="button"
                    className={`method-radio-btn ${directMethod === 'Transfer' ? 'selected' : ''}`}
                    onClick={() => setDirectMethod('Transfer')}
                  >
                    <DollarSign size={12} />
                    <span>Nequi / Bancol.</span>
                  </button>
                  <button
                    type="button"
                    className={`method-radio-btn ${directMethod === 'Cash' ? 'selected' : ''}`}
                    onClick={() => setDirectMethod('Cash')}
                  >
                    <Store size={12} />
                    <span>Efectivo</span>
                  </button>
                </div>
              </div>

              {/* Discount pills */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Descuento
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDirectDiscount(pct)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: directDiscount === pct ? '1.5px solid #A94384' : '1px solid #cbd5e1',
                        background: directDiscount === pct ? '#fdf2f8' : '#ffffff',
                        color: directDiscount === pct ? '#A94384' : '#475569'
                      }}
                    >
                      {pct === 0 ? 'Sin desc.' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Total a Cobrar:
                </span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#A94384' }}>
                  $
                  {(
                    directTreatment.priceCop -
                    Math.round(directTreatment.priceCop * (directDiscount / 100))
                  ).toLocaleString('es-CO')}{' '}
                  COP
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-vitadent-secondary"
                  onClick={() => setIsDirectChargeOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-vitadent-primary"
                  onClick={handleConfirmDirectCharge}
                >
                  <CheckCircle2 size={15} />
                  <span>Confirmar Cobro</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RECIBO CLÍNICO OFICIAL DE COBRO */}
      {showReceiptModal && lastReceipt && (
        <div className="cadra-modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div
            className="cadra-modal-box"
            style={{ maxWidth: '520px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Printable Receipt */}
            <div style={{ padding: '24px' }}>
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <h2 style={{ margin: '0 0 2px', fontSize: '18px', fontWeight: 900, color: '#A94384' }}>
                  VitaDent
                </h2>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>
                  CLÍNICA ODONTOLÓGICA
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  NIT / RUT: 900.582.194-1 · Régimen Salud Exento de IVA (Art. 476 E.T.)
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Calle 127 # 19A - 44, Consultorio 502 · Bogotá D.C., Colombia
                </div>
              </div>

              {/* Watermark separator */}
              <div className="receipt-watermark">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Comprobante de Caja:</span>
                    <strong style={{ display: 'block', color: '#0f172a', fontFamily: 'monospace', fontSize: '13px' }}>
                      {lastReceipt.orderId}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Fecha & Hora:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>
                      {lastReceipt.date} · {lastReceipt.time}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Paciente:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>
                      {lastReceipt.patientName}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Documento:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>
                      {lastReceipt.patientDoc}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Odontólogo Tratante:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>
                      {lastReceipt.doctor}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Medio de Pago:</span>
                    <strong style={{ display: 'block', color: '#0f172a' }}>
                      {lastReceipt.paymentMethod === 'Card'
                        ? 'Tarjeta Débito / Crédito'
                        : lastReceipt.paymentMethod === 'Cash'
                        ? 'Efectivo en Caja'
                        : 'Transferencia Nequi / Bancolombia'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Detalle de Procedimientos Cobrados
                </span>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {lastReceipt.items.map((item) => (
                    <div
                      key={item.treatment.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12.5px',
                        padding: '6px 0',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <div>
                        <strong>{item.quantity}×</strong> {item.treatment.name}
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                          Código: {item.treatment.code} · {item.treatment.category}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        ${(item.treatment.priceCop * item.quantity).toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '12.5px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal:</span>
                  <span>${lastReceipt.subtotal.toLocaleString('es-CO')} COP</span>
                </div>
                {lastReceipt.discountPct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                    <span>Descuento Clínico ({lastReceipt.discountPct}%):</span>
                    <span>-${lastReceipt.discountAmount.toLocaleString('es-CO')} COP</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11.5px' }}>
                  <span>IVA Salud:</span>
                  <span>Exento Art. 476 E.T.</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#A94384',
                    borderTop: '1px solid #cbd5e1',
                    paddingTop: '6px',
                    marginTop: '4px'
                  }}
                >
                  <span>Total Cancelado:</span>
                  <span>${lastReceipt.total.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Footer text */}
              <p style={{ margin: 0, textAlign: 'center', fontSize: '11.5px', color: '#94a3b8' }}>
                ¡Gracias por confiar en VitaDent Clínica Odontológica! Este recibo acredita el pago realizado.
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: '18px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <button
                  type="button"
                  className="btn-vitadent-secondary"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Imprimir</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-vitadent-secondary"
                    onClick={() => {
                      setShowReceiptModal(false)
                      onNavigate('/pagos')
                    }}
                  >
                    <CreditCard size={14} color="#A94384" />
                    <span>Ver en Módulo de Pagos</span>
                  </button>

                  <button
                    type="button"
                    className="btn-vitadent-primary"
                    onClick={() => setShowReceiptModal(false)}
                  >
                    <span>Cerrar & Nueva Atención</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Download,
  Boxes,
  AlertTriangle,
  Truck,
  Search,
  ArrowUpDown,
  Plus,
  Minus,
  Edit3,
  Layers,
  Sparkles,
  Syringe,
  Smile,
  ShieldCheck,
  Package,
  Activity,
  CheckCircle2,
  X,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  TrendingDown,
  Building2,
  Check,
  AlertCircle
} from 'lucide-react'

// --- Tipos Odontológicos ---
export type DentalCategory =
  | 'Anestésicos & Farmacología'
  | 'Resinas & Biomateriales'
  | 'Ortodoncia'
  | 'Cirugía & Implantes'
  | 'Bioseguridad & Esterilización'
  | 'Endodoncia'

export type LocationKey = 'almacenCentral' | 'gabinete1' | 'gabinete2' | 'quirofano'

export interface DentalStockItem {
  id: string
  name: string
  brand: string
  sku: string
  category: DentalCategory
  presentation: string
  onHand: number
  reorderAt: number
  locations: Record<LocationKey, number>
  unitCost: number
  onOrder: number
  lastUpdated?: string
}

interface StockPageProps {
  onNavigate: (path: string) => void
  onOpenCreate?: () => void
}

const initialDentalStock: DentalStockItem[] = [
  {
    id: 'st-01',
    name: 'Anestesia Scandonest 2% con Vasoconstrictor',
    brand: 'Septodont',
    sku: 'ANE-SCA-02V',
    category: 'Anestésicos & Farmacología',
    presentation: 'Caja x50 carpules 1.8ml',
    onHand: 9,
    reorderAt: 15,
    locations: { almacenCentral: 4, gabinete1: 3, gabinete2: 2, quirofano: 0 },
    unitCost: 185000,
    onOrder: 30,
  },
  {
    id: 'st-02',
    name: 'Mepivacaína 3% sin Vasoconstrictor (Scandicaine)',
    brand: 'Septodont',
    sku: 'ANE-MEP-03S',
    category: 'Anestésicos & Farmacología',
    presentation: 'Caja x50 carpules 1.8ml',
    onHand: 16,
    reorderAt: 10,
    locations: { almacenCentral: 8, gabinete1: 4, gabinete2: 4, quirofano: 0 },
    unitCost: 198000,
    onOrder: 0,
  },
  {
    id: 'st-03',
    name: 'Agujas Dentales Septoject 30G Cortas',
    brand: 'Septodont',
    sku: 'ANE-AGU-30GC',
    category: 'Anestésicos & Farmacología',
    presentation: 'Caja x100 agujas siliconadas',
    onHand: 4,
    reorderAt: 8,
    locations: { almacenCentral: 2, gabinete1: 1, gabinete2: 1, quirofano: 0 },
    unitCost: 65000,
    onOrder: 20,
  },
  {
    id: 'st-04',
    name: 'Composite Nano-híbrido Filtek Z350 XT A2',
    brand: '3M Oral Care',
    sku: 'RES-F350-A2',
    category: 'Resinas & Biomateriales',
    presentation: 'Jeringa 4g fotocurable',
    onHand: 6,
    reorderAt: 8,
    locations: { almacenCentral: 2, gabinete1: 2, gabinete2: 2, quirofano: 0 },
    unitCost: 145000,
    onOrder: 15,
  },
  {
    id: 'st-05',
    name: 'Composite Nano-híbrido Filtek Z350 XT A3',
    brand: '3M Oral Care',
    sku: 'RES-F350-A3',
    category: 'Resinas & Biomateriales',
    presentation: 'Jeringa 4g fotocurable',
    onHand: 14,
    reorderAt: 8,
    locations: { almacenCentral: 8, gabinete1: 3, gabinete2: 3, quirofano: 0 },
    unitCost: 145000,
    onOrder: 0,
  },
  {
    id: 'st-06',
    name: 'Adhesivo Single Bond Universal con Silano',
    brand: '3M Oral Care',
    sku: 'RES-SBU-5ML',
    category: 'Resinas & Biomateriales',
    presentation: 'Frasco 5ml dosificador',
    onHand: 5,
    reorderAt: 4,
    locations: { almacenCentral: 2, gabinete1: 2, gabinete2: 1, quirofano: 0 },
    unitCost: 210000,
    onOrder: 10,
  },
  {
    id: 'st-07',
    name: 'Ácido Grabador Fosfórico Scotchbond 35%',
    brand: '3M Oral Care',
    sku: 'RES-SCO-35P',
    category: 'Resinas & Biomateriales',
    presentation: 'Jeringa dispensadora 3ml + puntas',
    onHand: 15,
    reorderAt: 6,
    locations: { almacenCentral: 7, gabinete1: 4, gabinete2: 4, quirofano: 0 },
    unitCost: 48000,
    onOrder: 0,
  },
  {
    id: 'st-08',
    name: 'Brackets Metálicos MBT 0.022 Kit Completo (5-5)',
    brand: 'Morelli Ortodontia',
    sku: 'ORT-BRK-022',
    category: 'Ortodoncia',
    presentation: 'Kit completo 20 brackets sup/inf',
    onHand: 18,
    reorderAt: 10,
    locations: { almacenCentral: 10, gabinete1: 5, gabinete2: 3, quirofano: 0 },
    unitCost: 120000,
    onOrder: 15,
  },
  {
    id: 'st-09',
    name: 'Arcos NiTi Termoactivados Redondos 0.014 Superelásticos',
    brand: 'Dentsply GAC',
    sku: 'ORT-ARC-014',
    category: 'Ortodoncia',
    presentation: 'Paquete x10 arcos individuales',
    onHand: 5,
    reorderAt: 10,
    locations: { almacenCentral: 2, gabinete1: 2, gabinete2: 1, quirofano: 0 },
    unitCost: 55000,
    onOrder: 25,
  },
  {
    id: 'st-10',
    name: 'Arcos NiTi Rectangulares 0.019 × 0.025',
    brand: 'Morelli Ortodontia',
    sku: 'ORT-ARC-1925',
    category: 'Ortodoncia',
    presentation: 'Paquete x10 arcos individuales',
    onHand: 9,
    reorderAt: 6,
    locations: { almacenCentral: 5, gabinete1: 2, gabinete2: 2, quirofano: 0 },
    unitCost: 68000,
    onOrder: 0,
  },
  {
    id: 'st-11',
    name: 'Elásticos de Tracción Intermaxilar 3/16 Medium (4.5oz)',
    brand: 'American Orthodontics',
    sku: 'ORT-ELA-316',
    category: 'Ortodoncia',
    presentation: 'Bolsa x100 elásticos látex médico',
    onHand: 38,
    reorderAt: 15,
    locations: { almacenCentral: 22, gabinete1: 8, gabinete2: 8, quirofano: 0 },
    unitCost: 28000,
    onOrder: 0,
  },
  {
    id: 'st-12',
    name: 'Implante Dental Straumann BLX Roxolid SLActive Ø4.0 × 10mm',
    brand: 'Straumann',
    sku: 'CIR-STR-4010',
    category: 'Cirugía & Implantes',
    presentation: 'Envase estéril con montura TorcFit',
    onHand: 5,
    reorderAt: 6,
    locations: { almacenCentral: 2, gabinete1: 0, gabinete2: 0, quirofano: 3 },
    unitCost: 850000,
    onOrder: 8,
  },
  {
    id: 'st-13',
    name: 'Hueso Liofilizado Bovino Particulado Bio-Oss 0.5g',
    brand: 'Geistlich Biomaterials',
    sku: 'CIR-BOS-05G',
    category: 'Cirugía & Implantes',
    presentation: 'Vial estéril 0.5g gránulos 0.25-1mm',
    onHand: 3,
    reorderAt: 4,
    locations: { almacenCentral: 1, gabinete1: 0, gabinete2: 0, quirofano: 2 },
    unitCost: 420000,
    onOrder: 6,
  },
  {
    id: 'st-14',
    name: 'Membrana de Colágeno Reabsorbible Bio-Gide 25 × 25mm',
    brand: 'Geistlich Biomaterials',
    sku: 'CIR-BGD-2525',
    category: 'Cirugía & Implantes',
    presentation: 'Sobre estéril bicapa reabsorbible',
    onHand: 6,
    reorderAt: 4,
    locations: { almacenCentral: 2, gabinete1: 0, gabinete2: 0, quirofano: 4 },
    unitCost: 395000,
    onOrder: 4,
  },
  {
    id: 'st-15',
    name: 'Sutura Seda Negra 3-0 con Aguja Curva 1/2 Círculo 20mm',
    brand: 'Ethicon / J&J',
    sku: 'CIR-SUT-30S',
    category: 'Cirugía & Implantes',
    presentation: 'Caja x24 hebras estériles',
    onHand: 16,
    reorderAt: 8,
    locations: { almacenCentral: 8, gabinete1: 2, gabinete2: 2, quirofano: 4 },
    unitCost: 85000,
    onOrder: 0,
  },
  {
    id: 'st-16',
    name: 'Guantes de Nitrilo Cranberry Carbon Talla M (Sin polvo)',
    brand: 'Cranberry',
    sku: 'BIO-GUA-NITM',
    category: 'Bioseguridad & Esterilización',
    presentation: 'Caja dispensadora x100 guantes',
    onHand: 42,
    reorderAt: 20,
    locations: { almacenCentral: 25, gabinete1: 6, gabinete2: 6, quirofano: 5 },
    unitCost: 38000,
    onOrder: 50,
  },
  {
    id: 'st-17',
    name: 'Guantes de Nitrilo Cranberry Carbon Talla S (Sin polvo)',
    brand: 'Cranberry',
    sku: 'BIO-GUA-NITS',
    category: 'Bioseguridad & Esterilización',
    presentation: 'Caja dispensadora x100 guantes',
    onHand: 11,
    reorderAt: 15,
    locations: { almacenCentral: 5, gabinete1: 3, gabinete2: 3, quirofano: 0 },
    unitCost: 38000,
    onOrder: 30,
  },
  {
    id: 'st-18',
    name: 'Mascarillas Quirúrgicas Tricapa Termoselladas ASTM F2100',
    brand: 'Euronda Medical',
    sku: 'BIO-MAS-TRI50',
    category: 'Bioseguridad & Esterilización',
    presentation: 'Caja dispensadora x50 unidades',
    onHand: 28,
    reorderAt: 15,
    locations: { almacenCentral: 16, gabinete1: 4, gabinete2: 4, quirofano: 4 },
    unitCost: 18000,
    onOrder: 25,
  },
  {
    id: 'st-19',
    name: 'Baberos Clínicos Impermeables Absorbentes Monoart',
    brand: 'Euronda Medical',
    sku: 'BIO-BAB-IMP500',
    category: 'Bioseguridad & Esterilización',
    presentation: 'Rollo continuo x500 servicios',
    onHand: 14,
    reorderAt: 10,
    locations: { almacenCentral: 8, gabinete1: 3, gabinete2: 3, quirofano: 0 },
    unitCost: 42000,
    onOrder: 10,
  },
  {
    id: 'st-20',
    name: 'Bolsas Autosellables para Esterilización Autoclave 90 × 260mm',
    brand: 'Euronda Sterilizing',
    sku: 'BIO-BOL-EST90',
    category: 'Bioseguridad & Esterilización',
    presentation: 'Caja x200 bolsas con testigo químico',
    onHand: 8,
    reorderAt: 12,
    locations: { almacenCentral: 4, gabinete1: 1, gabinete2: 1, quirofano: 2 },
    unitCost: 52000,
    onOrder: 25,
  },
  {
    id: 'st-21',
    name: 'Limas Rotatorias NiTi WaveOne Gold Primary 25mm',
    brand: 'Dentsply Sirona',
    sku: 'END-WAV-GLD25',
    category: 'Endodoncia',
    presentation: 'Blister estéril x3 limas reciprocas',
    onHand: 7,
    reorderAt: 8,
    locations: { almacenCentral: 3, gabinete1: 2, gabinete2: 2, quirofano: 0 },
    unitCost: 165000,
    onOrder: 15,
  },
  {
    id: 'st-22',
    name: 'Conos de Gutapercha WaveOne Gold Primary Calibrados',
    brand: 'Dentsply Sirona',
    sku: 'END-GUT-WAVP',
    category: 'Endodoncia',
    presentation: 'Caja con regla graduada x60 conos',
    onHand: 15,
    reorderAt: 8,
    locations: { almacenCentral: 7, gabinete1: 4, gabinete2: 4, quirofano: 0 },
    unitCost: 72000,
    onOrder: 0,
  },
  {
    id: 'st-23',
    name: 'Cemento Sellador Endodóntico TopSeal Resina Epóxica',
    brand: 'Dentsply Sirona',
    sku: 'END-CEM-TOP',
    category: 'Endodoncia',
    presentation: 'Jeringa automix 4ml + 15 puntas intracanal',
    onHand: 3,
    reorderAt: 4,
    locations: { almacenCentral: 1, gabinete1: 1, gabinete2: 1, quirofano: 0 },
    unitCost: 260000,
    onOrder: 6,
  },
]

const categoryMeta: Record<DentalCategory, { color: string; bg: string; border: string }> = {
  'Anestésicos & Farmacología': { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  'Resinas & Biomateriales': { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  'Ortodoncia': { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  'Cirugía & Implantes': { color: '#A94384', bg: '#fdf2f8', border: '#fbcfe8' },
  'Bioseguridad & Esterilización': { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  'Endodoncia': { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
}

const locationLabels: Record<LocationKey, string> = {
  almacenCentral: 'Almacén Central',
  gabinete1: 'Gabinete 1',
  gabinete2: 'Gabinete 2',
  quirofano: 'Quirófano',
}

export const StockPage: React.FC<StockPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<DentalStockItem[]>(initialDentalStock)
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas')
  const [locationFilter, setLocationFilter] = useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyCritical, setOnlyCritical] = useState(false)
  const [sortBy, setSortBy] = useState<'criticalFirst' | 'nameAsc' | 'valueDesc' | 'stockDesc'>('criticalFirst')
  const [viewMode, setViewMode] = useState<'table' | 'grid3d'>('table')

  // Modales
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const [entryModalTab, setEntryModalTab] = useState<'restock' | 'new'>('restock')
  const [selectedRestockItemId, setSelectedRestockItemId] = useState<string>(initialDentalStock[0]?.id || '')
  const [restockQty, setRestockQty] = useState<number>(10)
  const [restockDestLocation, setRestockDestLocation] = useState<LocationKey>('almacenCentral')
  const [restockVendor, setRestockVendor] = useState<string>('Dentales Antioquia S.A.S.')
  const [restockInvoice, setRestockInvoice] = useState<string>('FAC-8921')

  // Nuevo Insumo
  const [newSupplyName, setNewSupplyName] = useState('')
  const [newSupplyBrand, setNewSupplyBrand] = useState('')
  const [newSupplySku, setNewSupplySku] = useState('')
  const [newSupplyCat, setNewSupplyCat] = useState<DentalCategory>('Anestésicos & Farmacología')
  const [newSupplyPres, setNewSupplyPres] = useState('')
  const [newSupplyCost, setNewSupplyCost] = useState<number>(50000)
  const [newSupplyInitialQty, setNewSupplyInitialQty] = useState<number>(10)
  const [newSupplyReorder, setNewSupplyReorder] = useState<number>(5)
  const [newSupplyLoc, setNewSupplyLoc] = useState<LocationKey>('almacenCentral')

  // Modal Editar Reorden
  const [editingReorderItem, setEditingReorderItem] = useState<DentalStockItem | null>(null)
  const [tempReorderVal, setTempReorderVal] = useState<number>(5)

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current))
    }, 3500)
  }

  // Métricas Globales
  const totalItemsCount = items.length
  const totalUnitsOnHand = items.reduce((acc, curr) => acc + curr.onHand, 0)
  const totalStockValue = items.reduce((acc, curr) => acc + curr.onHand * curr.unitCost, 0)
  const criticalItems = items.filter((i) => i.onHand <= i.reorderAt)
  const criticalCount = criticalItems.length
  const totalUnitsOnOrder = items.reduce((acc, curr) => acc + curr.onOrder, 0)

  // Acciones Rápidas
  const handleConsume = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.onHand <= 0) {
            showToast(`⚠️ No hay existencias para consumir de ${item.name}`)
            return item
          }
          // Priorizar descontar de gabinetes o quirófano si existe, sino de almacén central
          const newLoc = { ...item.locations }
          if (newLoc.gabinete1 > 0) newLoc.gabinete1 -= 1
          else if (newLoc.gabinete2 > 0) newLoc.gabinete2 -= 1
          else if (newLoc.quirofano > 0) newLoc.quirofano -= 1
          else if (newLoc.almacenCentral > 0) newLoc.almacenCentral -= 1

          const updatedOnHand = Math.max(0, item.onHand - 1)
          showToast(`Consumo clínico registrado: -1 unidad de ${item.name} (Quedan: ${updatedOnHand})`)
          return {
            ...item,
            onHand: updatedOnHand,
            locations: newLoc,
          }
        }
        return item
      })
    )
  }

  const handleQuickRestock = (id: string, qty: number = 5) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedOnHand = item.onHand + qty
          const newLoc = { ...item.locations, almacenCentral: item.locations.almacenCentral + qty }
          showToast(`Reabastecido exitosamente: +${qty} unidades de ${item.name}`)
          return {
            ...item,
            onHand: updatedOnHand,
            locations: newLoc,
          }
        }
        return item
      })
    )
  }

  const handleSaveRestockModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestockItemId || restockQty <= 0) return

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedRestockItemId) {
          const newOnHand = item.onHand + restockQty
          const newLoc = {
            ...item.locations,
            [restockDestLocation]: (item.locations[restockDestLocation] || 0) + restockQty,
          }
          return {
            ...item,
            onHand: newOnHand,
            locations: newLoc,
          }
        }
        return item
      })
    )

    const targetItem = items.find((i) => i.id === selectedRestockItemId)
    showToast(`Entrada confirmada: +${restockQty} unidades de ${targetItem?.name || 'Insumo'} en ${locationLabels[restockDestLocation]}`)
    setIsEntryModalOpen(false)
  }

  const handleSaveNewSupply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSupplyName.trim() || !newSupplySku.trim()) {
      alert('Por favor ingrese al menos el nombre y código SKU del insumo.')
      return
    }

    const newItem: DentalStockItem = {
      id: `st-${Date.now()}`,
      name: newSupplyName.trim(),
      brand: newSupplyBrand.trim() || 'VitaDent General',
      sku: newSupplySku.trim().toUpperCase(),
      category: newSupplyCat,
      presentation: newSupplyPres.trim() || 'Unidad clínica',
      onHand: Number(newSupplyInitialQty) || 0,
      reorderAt: Number(newSupplyReorder) || 5,
      locations: {
        almacenCentral: newSupplyLoc === 'almacenCentral' ? Number(newSupplyInitialQty) : 0,
        gabinete1: newSupplyLoc === 'gabinete1' ? Number(newSupplyInitialQty) : 0,
        gabinete2: newSupplyLoc === 'gabinete2' ? Number(newSupplyInitialQty) : 0,
        quirofano: newSupplyLoc === 'quirofano' ? Number(newSupplyInitialQty) : 0,
      },
      unitCost: Number(newSupplyCost) || 0,
      onOrder: 0,
    }

    setItems((prev) => [newItem, ...prev])
    showToast(`Nuevo insumo "${newItem.name}" registrado en catálogo`)
    setIsEntryModalOpen(false)

    // Reset form
    setNewSupplyName('')
    setNewSupplyBrand('')
    setNewSupplySku('')
    setNewSupplyPres('')
    setNewSupplyInitialQty(10)
    setNewSupplyReorder(5)
  }

  const handleSaveReorderThreshold = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReorderItem) return

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === editingReorderItem.id) {
          return {
            ...item,
            reorderAt: Math.max(1, tempReorderVal),
          }
        }
        return item
      })
    )
    showToast(`Umbral de reorden para ${editingReorderItem.name} actualizado a ${tempReorderVal} unidades`)
    setEditingReorderItem(null)
  }

  const handleExportCSV = () => {
    const headers = [
      'SKU',
      'Insumo',
      'Marca',
      'Categoría Clínica',
      'Presentación',
      'Stock Actual',
      'Umbral Reorden',
      'Estado',
      'Almacén Central',
      'Gabinete 1',
      'Gabinete 2',
      'Quirófano',
      'Costo Unitario (COP)',
      'Valor Total (COP)',
      'En Pedido',
    ]

    const rows = items.map((item) => [
      item.sku,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.brand.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.presentation.replace(/"/g, '""')}"`,
      item.onHand,
      item.reorderAt,
      item.onHand <= item.reorderAt ? 'Crítico / Por Agotar' : item.onHand <= item.reorderAt * 1.5 ? 'Regular' : 'Óptimo',
      item.locations.almacenCentral,
      item.locations.gabinete1,
      item.locations.gabinete2,
      item.locations.quirofano,
      item.unitCost,
      item.onHand * item.unitCost,
      item.onOrder,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Inventario_VitaDent_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Planilla de inventario clínico exportada con éxito en CSV/Excel')
  }

  // Filtrado & Ordenamiento
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Filtro categoría
        if (categoryFilter !== 'Todas' && item.category !== categoryFilter) {
          return false
        }
        // Filtro ubicación
        if (locationFilter !== 'Todas') {
          const locKey = locationFilter as LocationKey
          if ((item.locations[locKey] || 0) <= 0) return false
        }
        // Solo críticos toggle
        if (onlyCritical && item.onHand > item.reorderAt) {
          return false
        }
        // Búsqueda
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const matchName = item.name.toLowerCase().includes(query)
          const matchBrand = item.brand.toLowerCase().includes(query)
          const matchSku = item.sku.toLowerCase().includes(query)
          const matchCat = item.category.toLowerCase().includes(query)
          if (!matchName && !matchBrand && !matchSku && !matchCat) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'criticalFirst') {
          const ratioA = a.onHand / Math.max(1, a.reorderAt)
          const ratioB = b.onHand / Math.max(1, b.reorderAt)
          return ratioA - ratioB
        }
        if (sortBy === 'nameAsc') {
          return a.name.localeCompare(b.name)
        }
        if (sortBy === 'valueDesc') {
          return b.onHand * b.unitCost - a.onHand * a.unitCost
        }
        if (sortBy === 'stockDesc') {
          return b.onHand - a.onHand
        }
        return 0
      })
  }, [items, categoryFilter, locationFilter, onlyCritical, searchQuery, sortBy])

  // Desglose de Valor por Categoría
  const categoryBreakdown = useMemo(() => {
    const cats: DentalCategory[] = [
      'Anestésicos & Farmacología',
      'Resinas & Biomateriales',
      'Ortodoncia',
      'Cirugía & Implantes',
      'Bioseguridad & Esterilización',
      'Endodoncia',
    ]

    return cats.map((cat) => {
      const catItems = items.filter((i) => i.category === cat)
      const val = catItems.reduce((acc, curr) => acc + curr.onHand * curr.unitCost, 0)
      const count = catItems.length
      const pct = totalStockValue > 0 ? Math.round((val / totalStockValue) * 100) : 0
      return {
        category: cat,
        value: val,
        count,
        pct,
        meta: categoryMeta[cat],
      }
    })
  }, [items, totalStockValue])

  const getCategoryIcon = (category: DentalCategory) => {
    switch (category) {
      case 'Anestésicos & Farmacología':
        return <Syringe size={15} style={{ color: '#0284c7' }} />
      case 'Resinas & Biomateriales':
        return <Sparkles size={15} style={{ color: '#8b5cf6' }} />
      case 'Ortodoncia':
        return <Smile size={15} style={{ color: '#0d9488' }} />
      case 'Cirugía & Implantes':
        return <Activity size={15} style={{ color: '#A94384' }} />
      case 'Bioseguridad & Esterilización':
        return <ShieldCheck size={15} style={{ color: '#059669' }} />
      case 'Endodoncia':
        return <Layers size={15} style={{ color: '#d97706' }} />
      default:
        return <Package size={15} />
    }
  }

  const getStockStatus = (onHand: number, reorderAt: number) => {
    if (onHand <= reorderAt) {
      return {
        level: 'critico' as const,
        label: 'Crítico / Por Agotar',
        color: '#dc2626',
        bg: '#fee2e2',
        border: '#fca5a5',
        isCritical: true,
      }
    }
    if (onHand <= reorderAt * 1.5) {
      return {
        level: 'regular' as const,
        label: 'Stock Regular',
        color: '#d97706',
        bg: '#fef3c7',
        border: '#fde68a',
        isCritical: false,
      }
    }
    return {
      level: 'optimo' as const,
      label: 'Stock Óptimo',
      color: '#16a34a',
      bg: '#dcfce7',
      border: '#86efac',
      isCritical: false,
    }
  }

  return (
    <div className="cadra-page-container">
      {/* Estilos locales refinados para interactividad odontológica */}
      <style>{`
        .vd-accent-btn {
          background: linear-gradient(135deg, #A94384 0%, #8E356E 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 3px 10px rgba(169, 67, 132, 0.28);
          border: none !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .vd-accent-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(169, 67, 132, 0.38);
        }
        .vd-critical-pulse {
          animation: vdPulse 1.8s infinite;
        }
        @keyframes vdPulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.45); }
          70% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .stock-3d-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 16px;
        }
        .stock-3d-card {
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          border: 1px solid #e2e8f0;
          border-bottom: 3px solid #cbd5e1;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .stock-3d-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -4px rgba(169, 67, 132, 0.12), 0 4px 8px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }
        .stock-3d-card.card-critical {
          border-top: 3px solid #ef4444;
          background: linear-gradient(180deg, #fffbfb 0%, #ffffff 100%);
        }
        .vd-pill-active-critical {
          background-color: #dc2626 !important;
          color: #ffffff !important;
          border-color: #dc2626 !important;
        }
        .vd-action-btn-mini {
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 11.5px;
          font-weight: 600;
          color: #374151;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .vd-action-btn-mini:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        .vd-action-btn-mini.btn-consume:hover {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fca5a5;
        }
        .vd-action-btn-mini.btn-restock:hover {
          background: #dcfce7;
          color: #15803d;
          border-color: #86efac;
        }
        .vd-toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #1e293b;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
          font-size: 13.5px;
          animation: slideInUp 0.25s ease-out;
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="vd-toast-banner">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMsg}</span>
          <button
            onClick={() => setToastMsg(null)}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 8 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Breadcrumbs Odontológicos */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Inventario & Farmacia</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Stock Clínico & Consumibles Odontológicos</span>
      </div>

      {/* Header Principal sin Submódulos Repetitivos */}
      <div className="cadra-page-header">
        <div className="page-header-left-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="cadra-page-title" style={{ margin: 0 }}>
              Inventario & Consumibles Dentales
            </h1>
            <span
              style={{
                backgroundColor: 'rgba(169, 67, 132, 0.1)',
                color: '#A94384',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: '1px solid rgba(169, 67, 132, 0.25)',
              }}
            >
              Control en Tiempo Real
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#8A8A8F' }}>
            Supervisión integral de materiales restauradores, farmacología, cirugía y suministros por gabinete y quirófano.
          </p>

          {/* Filtro Rápido de Ubicaciones Odontológicas */}
          <div className="cadra-sub-tabs" style={{ marginTop: 14 }}>
            {['Todas', 'Almacén Central', 'Gabinete 1', 'Gabinete 2', 'Quirófano'].map((locName) => {
              const active =
                locName === 'Todas'
                  ? locationFilter === 'Todas'
                  : locName === 'Almacén Central'
                  ? locationFilter === 'almacenCentral'
                  : locName === 'Gabinete 1'
                  ? locationFilter === 'gabinete1'
                  : locName === 'Gabinete 2'
                  ? locationFilter === 'gabinete2'
                  : locationFilter === 'quirofano'

              return (
                <button
                  key={locName}
                  className={`cadra-sub-tab ${active ? 'active' : ''}`}
                  onClick={() => {
                    if (locName === 'Todas') setLocationFilter('Todas')
                    else if (locName === 'Almacén Central') setLocationFilter('almacenCentral')
                    else if (locName === 'Gabinete 1') setLocationFilter('gabinete1')
                    else if (locName === 'Gabinete 2') setLocationFilter('gabinete2')
                    else if (locName === 'Quirófano') setLocationFilter('quirofano')
                  }}
                >
                  <Building2 size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {locName}
                </button>
              )
            })}
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill time="4:08 PM" onNavigate={onNavigate} />

          <div className="page-header-actions-row">
            <button className="cadra-btn-secondary" onClick={handleExportCSV} title="Descargar planilla CSV compatible con Excel">
              <Download size={14} />
              <span>Exportar Excel</span>
            </button>

            <button
              className="vd-accent-btn"
              onClick={() => {
                setEntryModalTab('restock')
                setIsEntryModalOpen(true)
              }}
            >
              <Plus size={16} />
              <span>Registrar Entrada / Compra</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas KPI Odontológicas */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Valor en Inventario */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <span className="kpi-icon-pill-circle" style={{ background: '#A94384', color: '#ffffff' }}>
              $
            </span>
            <span className="kpi-label">Valor Total en Insumos</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={`$${(totalStockValue / 1000000).toFixed(2)}M`} duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            <AnimatedCounter value={totalItemsCount} /> insumos registrados
          </span>
        </div>

        {/* Card 2: Unidades Disponibles */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top">
            <Boxes size={16} className="kpi-icon-blue" />
            <span className="kpi-label">Unidades en Clínica</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={totalUnitsOnHand.toLocaleString()} duration={750} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag tag-blue">4 áreas clínicas activas</span>
        </div>

        {/* Card 3: Stock Crítico / Por Reordenar */}
        <div className="cadra-kpi-card kpi-card-light" style={{ borderColor: criticalCount > 0 ? '#fca5a5' : undefined }}>
          <div className="kpi-card-top">
            <AlertTriangle size={16} style={{ color: criticalCount > 0 ? '#dc2626' : '#d97706' }} />
            <span className="kpi-label">Insumos en Nivel Crítico</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number" style={{ color: criticalCount > 0 ? '#dc2626' : undefined }}>
              <AnimatedCounter value={criticalCount} duration={600} delay={200} />
            </span>
            <span
              className={`cadra-tag-pill ${criticalCount > 0 ? 'tag-pink vd-critical-pulse' : 'tag-green'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setOnlyCritical(!onlyCritical)}
              title="Click para filtrar solo críticos"
            >
              {criticalCount > 0 ? '⚠️ Requiere reposición' : '✓ Stock balanceado'}
            </span>
          </div>
        </div>

        {/* Card 4: En Tránsito de Depósitos */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Truck size={16} className="kpi-icon-dim" />
            <span className="kpi-label">Unidades en Pedido</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value={totalUnitsOnOrder} duration={700} delay={250} />
            </span>
            <span className="cadra-tag-pill tag-neutral" onClick={() => onNavigate('/purchasing/orders')} style={{ cursor: 'pointer' }}>
              4 depósitos dentales
            </span>
          </div>
        </div>
      </div>

      {/* Fila Central: Distribución de Valor por Categoría Dental & Insumos Críticos */}
      <div className="dashboard-charts-grid mt-4">
        {/* Distribución por Categoría Dental */}
        <div className="cadra-card money-sits-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 18 }}>🦷</span>
              <h3>Distribución de Valor por Especialidad Odontológica</h3>
            </div>
            <span className="text-sm font-semibold" style={{ color: '#A94384' }}>
              ${totalStockValue.toLocaleString()} COP total
            </span>
          </div>

          {/* Barra Segmentada de Categorías Dentales */}
          <div className="segmented-cost-bar" style={{ height: 14, borderRadius: 7, overflow: 'hidden', display: 'flex' }}>
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.category}
                style={{
                  width: `${cat.pct}%`,
                  backgroundColor: cat.meta.color,
                  height: '100%',
                  transition: 'width 0.3s ease',
                }}
                title={`${cat.category}: ${cat.pct}% ($${cat.value.toLocaleString()})`}
              />
            ))}
          </div>

          {/* Leyenda de Categorías */}
          <div className="cost-breakdown-legend-grid" style={{ marginTop: 14 }}>
            <div className="cost-legend-col">
              {categoryBreakdown.slice(0, 3).map((cat) => (
                <div
                  key={cat.category}
                  className="cost-item-row"
                  style={{ cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => setCategoryFilter(categoryFilter === cat.category ? 'Todas' : cat.category)}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.meta.color }} />
                    <span style={{ fontSize: 12.5, fontWeight: categoryFilter === cat.category ? 700 : 500 }}>
                      {cat.category}
                    </span>
                  </span>
                  <span className="cost-val" style={{ fontSize: 12 }}>
                    ${(cat.value / 1000).toFixed(0)}k
                  </span>
                  <span className="cost-pct" style={{ fontWeight: 600 }}>
                    {cat.pct}%
                  </span>
                </div>
              ))}
            </div>

            <div className="cost-legend-col">
              {categoryBreakdown.slice(3, 6).map((cat) => (
                <div
                  key={cat.category}
                  className="cost-item-row"
                  style={{ cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => setCategoryFilter(categoryFilter === cat.category ? 'Todas' : cat.category)}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.meta.color }} />
                    <span style={{ fontSize: 12.5, fontWeight: categoryFilter === cat.category ? 700 : 500 }}>
                      {cat.category}
                    </span>
                  </span>
                  <span className="cost-val" style={{ fontSize: 12 }}>
                    ${(cat.value / 1000).toFixed(0)}k
                  </span>
                  <span className="cost-pct" style={{ fontWeight: 600 }}>
                    {cat.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insumos con Reorden Urgente */}
        <div className="cadra-card below-reorder-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning-red" />
              <h3>Insumos con Reorden Urgente</h3>
            </div>
            <span
              className="cadra-tag-pill tag-pink"
              style={{ cursor: 'pointer' }}
              onClick={() => setOnlyCritical(!onlyCritical)}
            >
              ● {criticalItems.length} insumos críticos
            </span>
          </div>

          <div className="below-reorder-list">
            {criticalItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: '#15803d', fontSize: 13 }}>
                <Check size={24} style={{ margin: '0 auto 6px' }} />
                Todos los insumos odontológicos se encuentran en niveles adecuados de stock.
              </div>
            ) : (
              criticalItems.slice(0, 5).map((item) => (
                <div key={item.id} className="below-reorder-row">
                  <span className="reorder-icon-box" style={{ background: '#fee2e2' }}>
                    {getCategoryIcon(item.category)}
                  </span>
                  <div className="reorder-info">
                    <span className="reorder-name">{item.name}</span>
                    <span className="reorder-sub text-danger" style={{ fontSize: 11.5 }}>
                      {item.onHand} dispon. · Umbral: {item.reorderAt} · Marca: {item.brand}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="vd-action-btn-mini btn-consume"
                      onClick={() => handleConsume(item.id)}
                      title="Registrar consumo clínico (-1)"
                    >
                      <Minus size={11} /> -1
                    </button>
                    <button
                      className="vd-action-btn-mini btn-restock"
                      onClick={() => handleQuickRestock(item.id, 5)}
                      title="Reabastecer +5 unidades inmediatamente"
                    >
                      <Plus size={11} /> +5
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Contenedor del Catálogo Principal de Insumos */}
      <div className="cadra-card cadra-table-card mt-4">
        {/* Barra de Herramientas & Búsqueda */}
        <div className="table-header-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="flex items-center gap-2">
            <Boxes size={18} style={{ color: '#A94384' }} />
            <h3 style={{ margin: 0 }}>Catálogo Clínico Odontológico</h3>
            <span style={{ fontSize: 12, color: '#8A8A8F', marginLeft: 6 }}>
              ({filteredItems.length} de {items.length} insumos)
            </span>
          </div>

          <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
            {/* Input de Búsqueda */}
            <div className="pos-search-input-box" style={{ minWidth: 260 }}>
              <Search size={14} className="text-secondary" />
              <input
                type="text"
                placeholder="Buscar por insumo, marca o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Toggle Rápido: Solo Críticos */}
            <button
              className={`cadra-btn-secondary small ${onlyCritical ? 'vd-pill-active-critical' : ''}`}
              onClick={() => setOnlyCritical(!onlyCritical)}
              title="Filtrar instantáneamente solo insumos que están por agotarse"
              style={{ fontWeight: 600 }}
            >
              <AlertTriangle size={13} style={{ color: onlyCritical ? '#ffffff' : '#dc2626' }} />
              <span>⚠️ Solo Stock Crítico ({criticalCount})</span>
            </button>

            {/* Selector de Orden */}
            <button
              className={`cadra-btn-secondary small ${sortBy === 'criticalFirst' ? 'active' : ''}`}
              onClick={() => {
                const nextSort =
                  sortBy === 'criticalFirst'
                    ? 'nameAsc'
                    : sortBy === 'nameAsc'
                    ? 'valueDesc'
                    : sortBy === 'valueDesc'
                    ? 'stockDesc'
                    : 'criticalFirst'
                setSortBy(nextSort)
              }}
              title="Cambiar orden de visualización"
            >
              <ArrowUpDown size={13} />
              <span>
                {sortBy === 'criticalFirst'
                  ? 'Críticos primero'
                  : sortBy === 'nameAsc'
                  ? 'Nombre A-Z'
                  : sortBy === 'valueDesc'
                  ? 'Mayor valor'
                  : 'Mayor stock'}
              </span>
            </button>

            {/* Alternador de Vista (Tabla vs 3D Grid) */}
            <div className="cadra-pill-group">
              <button
                className={`pill-switch-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Vista de Tabla detallada"
              >
                <TableIcon size={14} />
              </button>
              <button
                className={`pill-switch-btn ${viewMode === 'grid3d' ? 'active' : ''}`}
                onClick={() => setViewMode('grid3d')}
                title="Vista en Cuadrícula 3D de tarjetas"
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Filtros por Categoría Odontológica */}
        <div className="table-filter-pills-bar" style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <button
            className={`filter-pill-item ${categoryFilter === 'Todas' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('Todas')}
          >
            <span>Todas</span>
            <span className="filter-count-badge">{items.length}</span>
          </button>

          {(
            [
              'Anestésicos & Farmacología',
              'Resinas & Biomateriales',
              'Ortodoncia',
              'Cirugía & Implantes',
              'Bioseguridad & Esterilización',
              'Endodoncia',
            ] as DentalCategory[]
          ).map((cat) => {
            const count = items.filter((i) => i.category === cat).length
            const isSelected = categoryFilter === cat
            return (
              <button
                key={cat}
                className={`filter-pill-item ${isSelected ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  borderLeft: isSelected ? `3px solid ${categoryMeta[cat].color}` : undefined,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {getCategoryIcon(cat)}
                  {cat}
                </span>
                <span className="filter-count-badge">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Vista 1: Tabla Moderna Odontológica */}
        {viewMode === 'table' && (
          <div className="cadra-table-responsive">
            <table className="cadra-data-table">
              <thead>
                <tr>
                  <th style={{ width: '26%' }}>INSUMO ODONTOLÓGICO</th>
                  <th style={{ width: '13%' }}>CATEGORÍA</th>
                  <th style={{ width: '20%' }}>ESTADO & NIVEL DE STOCK</th>
                  <th style={{ width: '19%' }}>UBICACIÓN EN CLÍNICA</th>
                  <th style={{ width: '10%' }}>EN PEDIDO</th>
                  <th style={{ width: '12%' }}>ACCIONES RÁPIDAS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No se encontraron insumos con los filtros seleccionados.</p>
                      <button
                        className="cadra-btn-secondary small"
                        style={{ marginTop: 12 }}
                        onClick={() => {
                          setCategoryFilter('Todas')
                          setLocationFilter('Todas')
                          setOnlyCritical(false)
                          setSearchQuery('')
                        }}
                      >
                        Restablecer Filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const status = getStockStatus(item.onHand, item.reorderAt)
                    const fillPercent = Math.min(100, Math.round((item.onHand / (item.reorderAt * 2.5)) * 100))

                    return (
                      <tr key={item.id} className="table-row-hoverable">
                        {/* Insumo */}
                        <td>
                          <div className="order-cell-block">
                            <div
                              className="order-item-icon-circle"
                              style={{
                                backgroundColor: categoryMeta[item.category]?.bg || '#f1f5f9',
                                color: categoryMeta[item.category]?.color || '#334155',
                                border: `1px solid ${categoryMeta[item.category]?.border || '#e2e8f0'}`,
                              }}
                            >
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="order-item-details">
                              <span className="font-semibold text-main" style={{ fontSize: 13.5 }}>
                                {item.name}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#475569',
                                    background: '#f1f5f9',
                                    padding: '1px 5px',
                                    borderRadius: 4,
                                  }}
                                >
                                  {item.sku}
                                </span>
                                <span style={{ fontSize: 11.5, color: '#8A8A8F' }}>
                                  Marca: <strong style={{ color: '#334155' }}>{item.brand}</strong> · {item.presentation}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td>
                          <span
                            className="cadra-kind-pill"
                            style={{
                              backgroundColor: categoryMeta[item.category]?.bg,
                              color: categoryMeta[item.category]?.color,
                              border: `1px solid ${categoryMeta[item.category]?.border}`,
                              fontSize: 11.5,
                              fontWeight: 600,
                            }}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* Estado y Nivel con Barra y Pin */}
                        <td>
                          <div className="level-track-wrapper">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '2px 7px',
                                  borderRadius: 12,
                                  backgroundColor: status.bg,
                                  color: status.color,
                                  border: `1px solid ${status.border}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                                className={status.isCritical ? 'vd-critical-pulse' : ''}
                              >
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: status.color,
                                  }}
                                />
                                {status.label}
                              </span>
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: status.color }}>
                                {item.onHand} unidades
                              </span>
                            </div>

                            <div className="level-bar-bg" style={{ position: 'relative' }}>
                              <div
                                className="level-bar-fill"
                                style={{
                                  width: `${fillPercent}%`,
                                  backgroundColor: status.color,
                                }}
                              />
                              {/* Pin de Reorden Mínimo */}
                              <div
                                className="level-reorder-pin"
                                style={{ left: '40%' }}
                                title={`Umbral de reorden: ${item.reorderAt} unidades`}
                              />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                              <span style={{ fontSize: 11, color: '#8A8A8F' }}>
                                Mínimo reorden: <strong>{item.reorderAt}</strong>
                              </span>
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                ${(item.unitCost * item.onHand).toLocaleString()} COP
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Distribución por Ubicación Odontológica */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: item.locations.almacenCentral > 0 ? '#f1f5f9' : '#f8fafc',
                                  color: item.locations.almacenCentral > 0 ? '#1e293b' : '#94a3b8',
                                }}
                              >
                                Almacén: <strong>{item.locations.almacenCentral}</strong>
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: item.locations.gabinete1 > 0 ? '#e0f2fe' : '#f8fafc',
                                  color: item.locations.gabinete1 > 0 ? '#0369a1' : '#94a3b8',
                                }}
                              >
                                Gab 1: <strong>{item.locations.gabinete1}</strong>
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: item.locations.gabinete2 > 0 ? '#e0e7ff' : '#f8fafc',
                                  color: item.locations.gabinete2 > 0 ? '#4338ca' : '#94a3b8',
                                }}
                              >
                                Gab 2: <strong>{item.locations.gabinete2}</strong>
                              </span>
                              {item.locations.quirofano > 0 && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: '#fdf2f8',
                                    color: '#A94384',
                                    fontWeight: 700,
                                  }}
                                >
                                  Quirófano: {item.locations.quirofano}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* En Pedido */}
                        <td>
                          {item.onOrder > 0 ? (
                            <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 600 }}>
                              🚚 {item.onOrder} en camino
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
                          )}
                        </td>

                        {/* Acciones Rápidas */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <button
                              className="vd-action-btn-mini btn-consume"
                              onClick={() => handleConsume(item.id)}
                              title="Consumir 1 unidad en consulta odontológica"
                            >
                              <Minus size={11} /> -1
                            </button>
                            <button
                              className="vd-action-btn-mini btn-restock"
                              onClick={() => {
                                setSelectedRestockItemId(item.id)
                                setIsEntryModalOpen(true)
                              }}
                              title="Reabastecer unidades"
                            >
                              <Plus size={11} /> +
                            </button>
                            <button
                              className="vd-action-btn-mini"
                              onClick={() => {
                                setEditingReorderItem(item)
                                setTempReorderVal(item.reorderAt)
                              }}
                              title="Editar umbral de reorden mínimo"
                            >
                              <Edit3 size={11} />
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
        )}

        {/* Vista 2: Cuadrícula 3D de Tarjetas Táctiles */}
        {viewMode === 'grid3d' && (
          <div className="stock-3d-grid" style={{ padding: '16px 4px' }}>
            {filteredItems.map((item) => {
              const status = getStockStatus(item.onHand, item.reorderAt)
              const fillPercent = Math.min(100, Math.round((item.onHand / (item.reorderAt * 2.5)) * 100))

              return (
                <div
                  key={item.id}
                  className={`stock-3d-card ${status.isCritical ? 'card-critical' : ''}`}
                >
                  {/* Top Bar: Categoría & Estado */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: categoryMeta[item.category]?.color,
                      }}
                    >
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                        backgroundColor: status.bg,
                        color: status.color,
                        border: `1px solid ${status.border}`,
                      }}
                      className={status.isCritical ? 'vd-critical-pulse' : ''}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Nombre & Marca */}
                  <div style={{ marginBottom: 12 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: 14.5, fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                      {item.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                      <span style={{ fontWeight: 700, color: '#A94384' }}>{item.brand}</span>
                      <span>·</span>
                      <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace' }}>
                        {item.sku}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#8A8A8F' }}>{item.presentation}</p>
                  </div>

                  {/* Nivel de Stock con Indicador */}
                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Existencias en Clínica:</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: status.color }}>
                        {item.onHand} unidades
                      </span>
                    </div>

                    <div className="level-bar-bg" style={{ position: 'relative', height: 8 }}>
                      <div
                        className="level-bar-fill"
                        style={{
                          width: `${fillPercent}%`,
                          backgroundColor: status.color,
                          height: '100%',
                        }}
                      />
                      <div className="level-reorder-pin" style={{ left: '40%' }} title={`Reorden en ${item.reorderAt}`} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: '#8A8A8F' }}>
                      <span>Reordenar al llegar a: {item.reorderAt}</span>
                      <span>Valor: ${(item.unitCost * item.onHand).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Distribución por Ubicación */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, padding: '2px 6px', background: '#f1f5f9', borderRadius: 4, color: '#334155' }}>
                      Almacén: <strong>{item.locations.almacenCentral}</strong>
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 6px', background: '#e0f2fe', borderRadius: 4, color: '#0369a1' }}>
                      Gab 1: <strong>{item.locations.gabinete1}</strong>
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 6px', background: '#e0e7ff', borderRadius: 4, color: '#4338ca' }}>
                      Gab 2: <strong>{item.locations.gabinete2}</strong>
                    </span>
                    {item.locations.quirofano > 0 && (
                      <span style={{ fontSize: 11, padding: '2px 6px', background: '#fdf2f8', borderRadius: 4, color: '#A94384', fontWeight: 700 }}>
                        Quirófano: {item.locations.quirofano}
                      </span>
                    )}
                  </div>

                  {/* Botones de Acción Rápida en Tarjeta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 10,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="vd-action-btn-mini btn-consume"
                        onClick={() => handleConsume(item.id)}
                        title="Consumir 1 unidad"
                      >
                        <Minus size={12} /> Consumir (-1)
                      </button>
                      <button
                        className="vd-action-btn-mini btn-restock"
                        onClick={() => handleQuickRestock(item.id, 5)}
                        title="Sumar 5 unidades"
                      >
                        <Plus size={12} /> +5
                      </button>
                    </div>

                    <button
                      className="vd-action-btn-mini"
                      onClick={() => {
                        setEditingReorderItem(item)
                        setTempReorderVal(item.reorderAt)
                      }}
                      title="Modificar umbral de reorden"
                    >
                      <Edit3 size={12} /> Reorden
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Registrar Entrada / Compra */}
      {isEntryModalOpen && (
        <div className="cadra-modal-overlay">
          <div className="cadra-action-modal" style={{ maxWidth: 520 }}>
            <div className="action-modal-header">
              <div>
                <span className="cadra-eyebrow" style={{ color: '#A94384' }}>
                  GESTIÓN DE SUMINISTROS DENTALES
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: 18, color: '#1e293b' }}>
                  Registrar Entrada / Compra al Inventario
                </h3>
              </div>
              <button
                className="search-modal-esc"
                onClick={() => setIsEntryModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Pestañas de Modal: Reabastecer Existente vs Nuevo Insumo */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
              <button
                className={`cadra-sub-tab ${entryModalTab === 'restock' ? 'active' : ''}`}
                onClick={() => setEntryModalTab('restock')}
                style={{ padding: '6px 12px', fontSize: 13 }}
              >
                Ingreso a Insumo Existente
              </button>
              <button
                className={`cadra-sub-tab ${entryModalTab === 'new' ? 'active' : ''}`}
                onClick={() => setEntryModalTab('new')}
                style={{ padding: '6px 12px', fontSize: 13 }}
              >
                + Registrar Nuevo Insumo
              </button>
            </div>

            {/* Formulario 1: Reabastecer Existente */}
            {entryModalTab === 'restock' && (
              <form onSubmit={handleSaveRestockModal} className="action-modal-form">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    Seleccione Insumo a Ingresar
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                    }}
                    value={selectedRestockItemId}
                    onChange={(e) => setSelectedRestockItemId(e.target.value)}
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.brand} - {i.sku}) · Stock actual: {i.onHand}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Cantidad Recibida (Unidades)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={restockQty}
                      onChange={(e) => setRestockQty(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Ubicación de Destino
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={restockDestLocation}
                      onChange={(e) => setRestockDestLocation(e.target.value as LocationKey)}
                    >
                      <option value="almacenCentral">Almacén Central</option>
                      <option value="gabinete1">Gabinete 1</option>
                      <option value="gabinete2">Gabinete 2</option>
                      <option value="quirofano">Quirófano</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Depósito / Proveedor Dental
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={restockVendor}
                      onChange={(e) => setRestockVendor(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      N° Factura / Remisión
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={restockInvoice}
                      onChange={(e) => setRestockInvoice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="action-modal-footer" style={{ marginTop: 20 }}>
                  <button type="button" className="cadra-btn-secondary" onClick={() => setIsEntryModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="vd-accent-btn">
                    <Check size={16} />
                    Confirmar Entrada
                  </button>
                </div>
              </form>
            )}

            {/* Formulario 2: Nuevo Insumo Odontológico */}
            {entryModalTab === 'new' && (
              <form onSubmit={handleSaveNewSupply} className="action-modal-form">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                    Nombre Comercial del Insumo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cemento Ionómero de Vidrio Ketac Molar"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                    }}
                    value={newSupplyName}
                    onChange={(e) => setNewSupplyName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Marca Comercial
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 3M, Straumann, Septodont"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyBrand}
                      onChange={(e) => setNewSupplyBrand(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Código SKU Odontológico *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. BIO-ION-KET"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplySku}
                      onChange={(e) => setNewSupplySku(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Categoría Clínica *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyCat}
                      onChange={(e) => setNewSupplyCat(e.target.value as DentalCategory)}
                    >
                      <option value="Anestésicos & Farmacología">Anestésicos & Farmacología</option>
                      <option value="Resinas & Biomateriales">Resinas & Biomateriales</option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Cirugía & Implantes">Cirugía & Implantes</option>
                      <option value="Bioseguridad & Esterilización">Bioseguridad & Esterilización</option>
                      <option value="Endodoncia">Endodoncia</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Presentación
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Caja x50, Frasco 5ml"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyPres}
                      onChange={(e) => setNewSupplyPres(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Cantidad Inicial
                    </label>
                    <input
                      type="number"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyInitialQty}
                      onChange={(e) => setNewSupplyInitialQty(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Umbral Reorden
                    </label>
                    <input
                      type="number"
                      min="1"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyReorder}
                      onChange={(e) => setNewSupplyReorder(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      Costo Unitario ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 13,
                      }}
                      value={newSupplyCost}
                      onChange={(e) => setNewSupplyCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="action-modal-footer" style={{ marginTop: 20 }}>
                  <button type="button" className="cadra-btn-secondary" onClick={() => setIsEntryModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="vd-accent-btn">
                    <Plus size={16} />
                    Crear Insumo en Catálogo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Editar Umbral de Reorden */}
      {editingReorderItem && (
        <div className="cadra-modal-overlay">
          <div className="cadra-action-modal" style={{ maxWidth: 420 }}>
            <div className="action-modal-header">
              <div>
                <span className="cadra-eyebrow" style={{ color: '#A94384' }}>
                  CONFIGURACIÓN DE ALERTA DE STOCK
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: 17, color: '#1e293b' }}>
                  Umbral Mínimo de Reorden
                </h3>
              </div>
              <button
                className="search-modal-esc"
                onClick={() => setEditingReorderItem(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveReorderThreshold} className="action-modal-form">
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: 3 }}>
                  {editingReorderItem.name}
                </strong>
                <span style={{ color: '#64748b' }}>
                  SKU: {editingReorderItem.sku} · Stock actual: <strong>{editingReorderItem.onHand} unidades</strong>
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Nuevo Límite de Alerta de Reorden:
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                  value={tempReorderVal}
                  onChange={(e) => setTempReorderVal(Number(e.target.value))}
                />
                <span style={{ display: 'block', fontSize: 11.5, color: '#8A8A8F', marginTop: 6, lineHeight: 1.4 }}>
                  💡 Cuando las existencias alcancen o caigan por debajo de este valor, VitaDent activará la etiqueta roja de
                  <strong> Stock Crítico</strong> para generar pedido al depósito.
                </span>
              </div>

              <div className="action-modal-footer" style={{ marginTop: 18 }}>
                <button type="button" className="cadra-btn-secondary" onClick={() => setEditingReorderItem(null)}>
                  Cancelar
                </button>
                <button type="submit" className="vd-accent-btn">
                  <Check size={16} />
                  Guardar Umbral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

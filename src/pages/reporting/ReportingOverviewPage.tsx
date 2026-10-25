import React, { useState } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Printer,
  TrendingUp,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  DollarSign,
  Users,
  CreditCard,
  Building2,
  Stethoscope,
  Activity,
  ShieldCheck,
  Award,
  Sparkles,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react'

interface ReportingOverviewPageProps {
  onNavigate: (path: string) => void
}

type ReportType = 'pagos' | 'citas' | 'tratamientos' | 'especialistas'
type PeriodKey = 'este_mes' | 'mes_anterior' | 'q4' | 'ano'
type DoctorKey = 'todos' | 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'

export const DOCTORS_REPORT_CATALOG = [
  {
    id: 'doc-1' as const,
    name: 'Dra. Sofía Valenzuela',
    specialty: 'Odontología General',
    consultorio: 'Consultorio 1',
    color: '#A94384',
    bg: '#fdf2f8',
    borderColor: '#fbcfe8',
    iconEmoji: '🦷',
    totalNov: '$14.200.000 COP',
    totalQ4: '$41.800.000 COP',
    totalOct: '$13.100.000 COP',
    totalAno: '$152.000.000 COP',
    pending: '$1.250.000 COP',
    ticket: '$126.800 COP',
    citasCount: 112,
    citasDone: 108,
    satisfaccion: '98.4%',
    puntualidad: '93.0%',
    ocupacion: '92.0%',
    horas: '128.8 hrs / 140 hrs',
    tratamientosClave: 'Limpiezas ultrasónicas, resinas estéticas, blanqueamientos LED',
    subMeta: 'General · Meta: $15M (94.7%)',
    pendingSub: '4 tratamientos en curso / EPS Sura'
  },
  {
    id: 'doc-2' as const,
    name: 'Dr. Alejandro Soto',
    specialty: 'Ortodoncia 1',
    consultorio: 'Consultorio 2',
    color: '#0284c7',
    bg: '#eff6ff',
    borderColor: '#bfdbfe',
    iconEmoji: '🦷',
    totalNov: '$13.800.000 COP',
    totalQ4: '$40.500.000 COP',
    totalOct: '$12.600.000 COP',
    totalAno: '$148.500.000 COP',
    pending: '$1.420.000 COP',
    ticket: '$132.700 COP',
    citasCount: 104,
    citasDone: 98,
    satisfaccion: '97.8%',
    puntualidad: '91.2%',
    ocupacion: '88.0%',
    horas: '123.2 hrs / 140 hrs',
    tratamientosClave: 'Controles ortodoncia 1, arcos y brackets, 12 nuevos cementados',
    subMeta: 'Ortodoncia 1 · Meta: $14M (98.6%)',
    pendingSub: '5 controles activos con saldo'
  },
  {
    id: 'doc-3' as const,
    name: 'Dra. Claudia Rivas',
    specialty: 'Ortodoncia 2',
    consultorio: 'Consultorio 3',
    color: '#0d9488',
    bg: '#f0fdfa',
    borderColor: '#99f6e4',
    iconEmoji: '🦷',
    totalNov: '$9.100.000 COP',
    totalQ4: '$26.800.000 COP',
    totalOct: '$8.400.000 COP',
    totalAno: '$98.200.000 COP',
    pending: '$850.000 COP',
    ticket: '$197.800 COP',
    citasCount: 46,
    citasDone: 44,
    satisfaccion: '96.5%',
    puntualidad: '89.4%',
    ocupacion: '78.0%',
    horas: '109.2 hrs / 140 hrs',
    tratamientosClave: 'Controles ortodoncia 2, alineadores invisibles, ortopedia maxilar',
    subMeta: 'Ortodoncia 2 · Meta: $9.5M (95.8%)',
    pendingSub: '3 planes alineadores activos'
  },
  {
    id: 'doc-4' as const,
    name: 'Dr. Marcos Pineda',
    specialty: 'Diseño de Sonrisa',
    consultorio: 'Consultorio 4',
    color: '#c2410c',
    bg: '#fff7ed',
    borderColor: '#fed7aa',
    iconEmoji: '✨',
    totalNov: '$11.400.000 COP',
    totalQ4: '$33.700.000 COP',
    totalOct: '$10.100.000 COP',
    totalAno: '$125.600.000 COP',
    pending: '$1.300.000 COP',
    ticket: '$247.800 COP',
    citasCount: 46,
    citasDone: 45,
    satisfaccion: '99.1%',
    puntualidad: '92.1%',
    ocupacion: '85.0%',
    horas: '119.0 hrs / 140 hrs',
    tratamientosClave: 'Diseño de sonrisa digital, carillas cerámicas, implantes de titanio',
    subMeta: 'Diseño de Sonrisa · Meta: $12M (95.0%)',
    pendingSub: '2 planes carillas e implantes'
  }
]

export const ReportingOverviewPage: React.FC<ReportingOverviewPageProps> = ({ onNavigate }) => {
  const [activeReportType, setActiveReportType] = useState<ReportType>('pagos')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('este_mes')
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorKey>('todos')

  // Period label translator
  const getPeriodLabel = (p: PeriodKey) => {
    switch (p) {
      case 'este_mes':
        return 'Este Mes (Noviembre 2026)'
      case 'mes_anterior':
        return 'Mes Anterior (Octubre 2026)'
      case 'q4':
        return 'Trimestre Q4 2026'
      case 'ano':
        return 'Año Completo 2026'
    }
  }

  // Doctor label translator
  const getDoctorLabel = (d: DoctorKey) => {
    switch (d) {
      case 'todos':
        return 'Todos los Especialistas (Total Clínica)'
      case 'doc-1':
        return 'Dra. Sofía Valenzuela (Odontología General)'
      case 'doc-2':
        return 'Dr. Alejandro Soto (Ortodoncia 1)'
      case 'doc-3':
        return 'Dra. Claudia Rivas (Ortodoncia 2)'
      case 'doc-4':
        return 'Dr. Marcos Pineda (Diseño de Sonrisa)'
    }
  }

  // Dynamic KPI calculations based on selectedPeriod and selectedDoctor
  const getKPIs = () => {
    // If a specific doctor is selected, recalculate KPIs dynamically
    if (selectedDoctor !== 'todos') {
      const doc = DOCTORS_REPORT_CATALOG.find((d) => d.id === selectedDoctor)
      if (doc) {
        if (activeReportType === 'citas') {
          return {
            total: `${doc.citasCount} Citas`,
            totalLabel: `Citas Asignadas · ${doc.name}`,
            subLabel: `Ocupación: ${doc.ocupacion} en ${doc.consultorio}`,
            pending: `${doc.citasDone} Atendidas`,
            pendingLabel: 'Citas Realizadas',
            pendingSub: `${doc.citasCount - doc.citasDone} cancelaciones / reprogramadas`,
            ticket: doc.puntualidad,
            ticketLabel: `Puntualidad ${doc.consultorio}`,
            collectionRate: doc.satisfaccion,
            collectionSub: 'Índice de satisfacción paciente'
          }
        }

        if (activeReportType === 'tratamientos') {
          return {
            total: `${Math.round(doc.citasCount * 0.7)} Pacientes`,
            totalLabel: `Pacientes de ${doc.name.split(' ')[1]}`,
            subLabel: `${doc.specialty} · ${doc.consultorio}`,
            pending: `${doc.citasDone} Procedimientos`,
            pendingLabel: 'Tratamientos Ejecutados',
            pendingSub: doc.tratamientosClave,
            ticket: doc.ticket,
            ticketLabel: 'Ticket Promedio Paciente',
            collectionRate: doc.satisfaccion,
            collectionSub: 'Satisfacción en procedimientos'
          }
        }

        if (activeReportType === 'especialistas') {
          return {
            total: doc.totalNov,
            totalLabel: `Producción · ${doc.name}`,
            subLabel: `${doc.specialty} · ${doc.consultorio}`,
            pending: `${doc.citasCount} Atenciones`,
            pendingLabel: 'Citas Asistidas',
            pendingSub: doc.tratamientosClave,
            ticket: doc.satisfaccion,
            ticketLabel: 'Satisfacción Global',
            collectionRate: doc.puntualidad,
            collectionSub: 'Puntualidad en agenda'
          }
        }

        // default: 'pagos'
        const totalByPeriod =
          selectedPeriod === 'q4'
            ? doc.totalQ4
            : selectedPeriod === 'mes_anterior'
            ? doc.totalOct
            : selectedPeriod === 'ano'
            ? doc.totalAno
            : doc.totalNov

        return {
          total: totalByPeriod,
          totalLabel: `Recaudo · ${doc.name}`,
          subLabel: doc.subMeta,
          pending: doc.pending,
          pendingLabel: `Saldos Pendientes · ${doc.name.split(' ')[1]}`,
          pendingSub: doc.pendingSub,
          ticket: doc.ticket,
          ticketLabel: 'Ticket Promedio Paciente',
          collectionRate: doc.satisfaccion,
          collectionSub: `${doc.citasCount} citas atendidas · Satisfacción`
        }
      }
    }

    // Default: Total Clínica (Todos los 4 Doctores Consolidados)
    if (activeReportType === 'pagos') {
      if (selectedPeriod === 'q4') {
        return {
          total: '$142.800.000 COP',
          totalLabel: 'Recaudo Total Q4 (Clínica)',
          subLabel: 'Meta Trimestral: $150M (95.2%)',
          pending: '$12.400.000 COP',
          pendingLabel: 'Saldos Pendientes Totales',
          pendingSub: '24 planes de tratamiento',
          ticket: '$410.000 COP',
          ticketLabel: 'Ticket Promedio Paciente',
          collectionRate: '92.0%',
          collectionSub: '+3.1 pts vs Q3'
        }
      }
      if (selectedPeriod === 'mes_anterior') {
        return {
          total: '$44.200.000 COP',
          totalLabel: 'Recaudo Total Octubre (Clínica)',
          subLabel: 'Cierre Contable Certificado',
          pending: '$3.900.000 COP',
          pendingLabel: 'Saldos Pendientes Totales',
          pendingSub: '9 pacientes en cobro',
          ticket: '$370.000 COP',
          ticketLabel: 'Ticket Promedio Paciente',
          collectionRate: '89.5%',
          collectionSub: 'Alcanzado en 31 días'
        }
      }
      if (selectedPeriod === 'ano') {
        return {
          total: '$524.300.000 COP',
          totalLabel: 'Recaudo Acumulado Anual (Clínica)',
          subLabel: 'Mejor Mes: Jun ($54.2M)',
          pending: '$18.600.000 COP',
          pendingLabel: 'Cartera en Seguimiento',
          pendingSub: 'Convenios e Institucionales',
          ticket: '$395.000 COP',
          ticketLabel: 'Ticket Promedio Anual',
          collectionRate: '93.2%',
          collectionSub: '+4.5 pts vs 2025'
        }
      }
      // default: 'este_mes'
      return {
        total: '$48.500.000 COP',
        totalLabel: 'Recaudo Total Noviembre (Clínica)',
        subLabel: 'Hoy: $3.850.000 · Sem: $12.450.000',
        pending: '$4.820.000 COP',
        pendingLabel: 'Saldos Pendientes de Cobro',
        pendingSub: '12 pacientes con plan activo',
        ticket: '$385.000 COP',
        ticketLabel: 'Ticket Promedio Paciente',
        collectionRate: '91.0%',
        collectionSub: '+2.8 pts vs Octubre'
      }
    }

    if (activeReportType === 'citas') {
      return {
        total: '342 Citas',
        totalLabel: 'Citas Programadas (Clínica)',
        subLabel: '90.1% efectividad clínica',
        pending: '308 Atendidas',
        pendingLabel: 'Citas Realizadas',
        pendingSub: '34 cancelaciones / no-show',
        ticket: '91.4%',
        ticketLabel: 'Puntualidad en Consultorios',
        collectionRate: '85.8%',
        collectionSub: 'Ocupación media de 4 consultorios'
      }
    }

    if (activeReportType === 'tratamientos') {
      return {
        total: '214 Pacientes',
        totalLabel: 'Pacientes Únicos Atendidos',
        subLabel: '68 Nuevos · 146 Recurrentes',
        pending: '385 Procedimientos',
        pendingLabel: 'Tratamientos Ejecutados',
        pendingSub: 'Líder: Implantes & Carillas',
        ticket: '$2.500.000 COP',
        ticketLabel: 'Tratamiento de Mayor Valor',
        collectionRate: '18.9%',
        collectionSub: 'Ratio Insumos vs Facturación'
      }
    }

    // especialistas
    return {
      total: '$48.500.000 COP',
      totalLabel: 'Producción Total Especialistas',
      subLabel: '4 Doctores en Actividad Clínica',
      pending: '308 Atenciones',
      pendingLabel: 'Citas Asistidas por Doctores',
      pendingSub: '100% de cobertura de agenda',
      ticket: '98.2%',
      ticketLabel: 'Satisfacción Global',
      collectionRate: '94.5%',
      collectionSub: 'Adherencia a Planes Clínicos'
    }
  }

  const kpis = getKPIs()

  // Export to CSV Functionality
  const handleExportCSV = () => {
    let filename = `VitaDent_Informe_${activeReportType}_${selectedPeriod}.csv`
    let rows: (string | number)[][] = []

    if (activeReportType === 'pagos') {
      rows = [
        ['VitaDent Clínica Odontológica - Reporte Oficial de Facturación y Recaudos'],
        ['Periodo:', getPeriodLabel(selectedPeriod)],
        ['Especialista:', getDoctorLabel(selectedDoctor)],
        ['Fecha de Generación:', new Date().toLocaleString('es-CO')],
        [''],
        ['Canal de Pago / Concepto', 'Porcentaje', 'Monto Facturado (COP)', 'Transacciones', 'Estado'],
        ['Datáfono / Tarjetas Crédito & Débito', '48%', '$23.280.000 COP', 84, 'Conciliado Bancario'],
        ['Transferencia Nequi / Bancolombia', '32%', '$15.520.000 COP', 58, 'Acreditado Inmediato'],
        ['Efectivo en Caja Clínica', '20%', '$9.700.000 COP', 42, 'Arqueado en Caja'],
        ['TOTAL RECAUDADO', '100%', '$48.500.000 COP', 184, 'Auditoría OK'],
        [''],
        ['Convenios y Aseguradoras', 'Distribución', 'Monto Facturado (COP)', 'Pacientes Cubiertos', 'Estado Radicación'],
        ['Colsanitas Medicina Prepagada', '38%', '$18.200.000 COP', 42, 'Radicado y Aprobado'],
        ['EPS Sura Odontología', '30%', '$14.500.000 COP', 38, 'Radicación en Trámite'],
        ['Particulares (Pago Directo)', '32%', '$15.800.000 COP', 48, 'Cancelado en Consulta'],
        [''],
        ['Insumos Odontológicos Consumidos', 'Valor COP', 'Ratio s/ Facturación', 'Estado Control'],
        ['Costo Total de Insumos Clínicos', '$9.200.000 COP', '18.9%', 'Dentro de Margen Objetivo (< 22%)']
      ]
    } else if (activeReportType === 'citas') {
      rows = [
        ['VitaDent Clínica Odontológica - Reporte de Citas y Ocupación de Consultorios'],
        ['Periodo:', getPeriodLabel(selectedPeriod)],
        ['Fecha de Generación:', new Date().toLocaleString('es-CO')],
        [''],
        ['Consultorio', 'Especialista a Cargo', 'Ocupación (%)', 'Citas Atendidas', 'Horas Asignadas', 'Puntualidad'],
        ['Consultorio 1 (Odontología General)', 'Dra. Sofía Valenzuela', '92%', 112, '120 hrs', '93.0%'],
        ['Consultorio 2 (Ortodoncia 1)', 'Dr. Alejandro Soto', '88%', 104, '115 hrs', '91.2%'],
        ['Consultorio 3 (Ortodoncia 2)', 'Dra. Claudia Rivas', '78%', 46, '80 hrs', '89.4%'],
        ['Consultorio 4 (Diseño de Sonrisa)', 'Dr. Marcos Pineda', '85%', 46, '85 hrs', '92.1%'],
        [''],
        ['Métrica de Citas', 'Cantidad', 'Porcentaje'],
        ['Citas Programadas Totales', 342, '100%'],
        ['Citas Realizadas y Completadas', 308, '90.1%'],
        ['Cancelaciones con previo aviso', 18, '5.3%'],
        ['Inasistencias no avisadas (No-Show)', 16, '4.7%']
      ]
    } else if (activeReportType === 'tratamientos') {
      rows = [
        ['VitaDent Clínica Odontológica - Reporte de Tratamientos y Demanda de Pacientes'],
        ['Periodo:', getPeriodLabel(selectedPeriod)],
        ['Fecha de Generación:', new Date().toLocaleString('es-CO')],
        [''],
        ['Tratamiento', 'Categoría', 'Valor Unitario (COP)', 'Volumen Realizado', 'Total Facturado (COP)', 'Participación'],
        ['Implantes de Titanio + Corona', 'Implantología', '$2.500.000 COP', 9, '$22.500.000 COP', '46.4%'],
        ['Ortodoncia (Controles Mensuales)', 'Ortodoncia', '$100.000 COP', 114, '$11.400.000 COP', '23.5%'],
        ['Limpiezas Dentales Ultrasonido', 'Higiene & Prevención', '$90.000 COP', 62, '$5.580.000 COP', '11.5%'],
        ['Endodoncias Unirradicular/Multi', 'Endodoncia', '$350.000 COP', 14, '$4.900.000 COP', '10.1%'],
        ['Blanqueamiento Dental LED', 'Estética Dental', '$300.000 COP', 13, '$3.900.000 COP', '8.0%'],
        [''],
        ['Composición de Pacientes', 'Cantidad', 'Proporción'],
        ['Pacientes Nuevos (Primera Vez)', 68, '31.8%'],
        ['Pacientes Recurrentes (Seguimiento)', 146, '68.2%'],
        ['Total Pacientes Atendidos', 214, '100%']
      ]
    } else {
      // Especialistas
      rows = [
        ['VitaDent Clínica Odontológica - Reporte de Rendimiento por Especialista'],
        ['Periodo:', getPeriodLabel(selectedPeriod)],
        ['Fecha de Generación:', new Date().toLocaleString('es-CO')],
        [''],
        ['Doctor(a)', 'Especialidad', 'Consultorio', 'Citas Atendidas', 'Tratamientos Clave', 'Satisfacción', 'Facturación COP'],
        ['Dra. Sofía Valenzuela', 'Odontología General', 'Consultorio 1', 112, '86 profilaxis y resinas', '98.4%', '$14.200.000 COP'],
        ['Dr. Alejandro Soto', 'Ortodoncia 1', 'Consultorio 2', 104, '128 controles activos / arcos', '97.8%', '$13.800.000 COP'],
        ['Dra. Claudia Rivas', 'Ortodoncia 2', 'Consultorio 3', 46, 'Alineadores invisibles y placas', '96.5%', '$9.100.000 COP'],
        ['Dr. Marcos Pineda', 'Diseño de Sonrisa', 'Consultorio 4', 46, '11 implantes / carillas estéticas', '99.1%', '$11.400.000 COP'],
        ['TOTAL EQUIPO CLÍNICO', 'Odontología Integral', '4 Consultorios', 308, 'Tratamientos auditados', '98.2%', '$48.500.000 COP']
      ]
    }

    const csvContent =
      '\uFEFF' +
      rows
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell).replace(/"/g, '""')
              return `"${str}"`
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
  }

  // Export to Print/PDF Functionality
  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="cadra-page-container">
      {/* Official Clinical Print Header - Visible ONLY during PDF Print */}
      <div className="clinical-print-header">
        <div className="flex items-center gap-3">
          <img
            src="/Logo_Horizontal.png"
            alt="VitaDent Clínica Odontológica"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              // fallback if not found
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#A94384' }}>
              VitaDent Clínica Odontológica
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
              NIT 901.458.920-3 · Habilitación Secretaría de Salud Res. 2023-0491
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
          <div><strong>INFORME CLÍNICO OFICIAL DE RENDIMIENTO</strong></div>
          <div>Periodo: {getPeriodLabel(selectedPeriod)}</div>
          <div>Emisión: {new Date().toLocaleDateString('es-CO')} {new Date().toLocaleTimeString('es-CO')}</div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Informes</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Rendimiento Clínico</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Informes y Analítica Clínica</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/informes')}>
              Rendimiento Clínico
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/reporting/builder')}>
              Generador de Reportes
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            <button
              className="cadra-btn-secondary"
              onClick={handleExportCSV}
              title="Descargar informe actual en formato CSV para Microsoft Excel"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Exportar Excel / CSV</span>
            </button>

            <button
              className="cadra-btn-secondary"
              onClick={handlePrintPDF}
              title="Generar e imprimir informe clínico oficial en PDF"
            >
              <Printer size={15} style={{ color: '#A94384' }} />
              <span>Exportar PDF</span>
            </button>

            <button
              className="cadra-btn-primary"
              onClick={() => onNavigate('/reporting/builder')}
              title="Personalizar métricas y dimensiones clínicas"
            >
              <Layers size={15} />
              <span>Constructor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Report Selection & Filter Toolbar */}
      <div className="report-filters-bar no-print">
        <div className="report-type-pills">
          <button
            className={`report-type-btn ${activeReportType === 'pagos' ? 'active' : ''}`}
            onClick={() => setActiveReportType('pagos')}
          >
            <DollarSign size={15} />
            <span>Facturación & Pagos</span>
          </button>
          <button
            className={`report-type-btn ${activeReportType === 'citas' ? 'active' : ''}`}
            onClick={() => setActiveReportType('citas')}
          >
            <Calendar size={15} />
            <span>Citas & Consultorios</span>
          </button>
          <button
            className={`report-type-btn ${activeReportType === 'tratamientos' ? 'active' : ''}`}
            onClick={() => setActiveReportType('tratamientos')}
          >
            <Activity size={15} />
            <span>Tratamientos & Pacientes</span>
          </button>
          <button
            className={`report-type-btn ${activeReportType === 'especialistas' ? 'active' : ''}`}
            onClick={() => setActiveReportType('especialistas')}
          >
            <Stethoscope size={15} />
            <span>Rendimiento por Especialista</span>
          </button>
        </div>

        <div className="report-filter-controls">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted">Período:</label>
            <select
              className="report-filter-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as PeriodKey)}
            >
              <option value="este_mes">Este Mes (Noviembre 2026)</option>
              <option value="mes_anterior">Mes Anterior (Octubre 2026)</option>
              <option value="q4">Trimestre Q4 2026</option>
              <option value="ano">Año Completo 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted">Especialista:</label>
            <select
              className="report-filter-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value as DoctorKey)}
            >
              <option value="todos">Todos los Especialistas (Total Clínica)</option>
              <option value="doc-1">Dra. Sofía Valenzuela (Odontología General)</option>
              <option value="doc-2">Dr. Alejandro Soto (Ortodoncia 1)</option>
              <option value="doc-3">Dra. Claudia Rivas (Ortodoncia 2)</option>
              <option value="doc-4">Dr. Marcos Pineda (Diseño de Sonrisa)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BARRA DE ACCESO DIRECTO: FILTRAR POR DOCTOR O TOTALES CLÍNICA
          Permite conmutar con un solo clic los informes y métricas en tiempo real
          ========================================================================= */}
      <div
        style={{
          marginTop: '10px',
          marginBottom: '16px',
          padding: '12px 16px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>🎯</span>
            <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>
              Filtrar informe por:
            </strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {selectedDoctor === 'todos'
                ? 'Visualizando recaudos y citas globales consolidadas'
                : `Mostrando recaudos, citas y métricas exclusivas de ${getDoctorLabel(selectedDoctor)}`}
            </span>
          </div>
          {selectedDoctor !== 'todos' && (
            <button
              onClick={() => setSelectedDoctor('todos')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                color: '#A94384',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Ver Totales Consolidados de la Clínica
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedDoctor('todos')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedDoctor === 'todos' ? '2px solid #0f172a' : '1px solid #cbd5e1',
              backgroundColor: selectedDoctor === 'todos' ? '#0f172a' : '#ffffff',
              color: selectedDoctor === 'todos' ? '#ffffff' : '#334155',
              boxShadow: selectedDoctor === 'todos' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
            }}
          >
            <span>🏢</span>
            <span>Totales de Clínica (Consolidado)</span>
          </button>

          {DOCTORS_REPORT_CATALOG.map((doc) => {
            const isSel = selectedDoctor === doc.id
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSel ? `2px solid ${doc.color}` : '1px solid #cbd5e1',
                  backgroundColor: isSel ? doc.bg : '#ffffff',
                  color: isSel ? doc.color : '#334155',
                  boxShadow: isSel ? `0 2px 8px ${doc.color}25` : 'none'
                }}
              >
                <span>{doc.iconEmoji}</span>
                <span>{doc.name} · {doc.specialty}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4 Dynamic KPI Cards with VitaDent 3D Styling */}
      <div className="cadra-kpi-grid-4">
        {/* Card 1: Dark Card - Primary Metric */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top">
            <TrendingUp size={16} className="kpi-icon-dim" />
            <span className="kpi-label">{kpis.totalLabel}</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={kpis.total} duration={750} delay={100} />
          </div>
          <span className="kpi-sub-pill-tag">
            {kpis.subLabel}
          </span>
        </div>

        {/* Card 2: VitaDent Magenta Card */}
        <div className="cadra-kpi-card kpi-card-magenta">
          <div className="kpi-card-top">
            <DollarSign size={16} className="text-pink-100" />
            <span className="kpi-label text-pink-100">{kpis.pendingLabel}</span>
          </div>
          <div className="kpi-main-number text-white">
            <AnimatedCounter value={kpis.pending} duration={650} delay={150} />
          </div>
          <span className="kpi-sub-pill-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            {kpis.pendingSub}
          </span>
        </div>

        {/* Card 3: Light Card */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <Percent size={16} className="kpi-icon-dim" />
            <span className="kpi-label">{kpis.ticketLabel}</span>
          </div>
          <div className="kpi-main-number">
            <AnimatedCounter value={kpis.ticket} duration={700} delay={200} />
          </div>
          <span className="text-xs text-muted" style={{ marginTop: '4px' }}>
            Promedio auditado en clínica
          </span>
        </div>

        {/* Card 4: Light Card - Compliance / Efficiency */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top">
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span className="kpi-label">Efectividad Operativa</span>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">
              <AnimatedCounter value={kpis.collectionRate} duration={650} delay={250} />
            </span>
            <span className="cadra-tag-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
              {kpis.collectionSub}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: FACTURACIÓN & PAGOS CLÍNICOS
          ========================================================================= */}
      {activeReportType === 'pagos' && (
        <>
          <div className="reporting-split-layout mt-4">
            {/* Left: Revenue vs Clinic Consumables Curve */}
            <div className="cadra-card report-revenue-card">
              <div className="chart-card-header">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: '#A94384' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>Evolución de Recaudos Clínicos vs Costo de Insumos</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Ingresos brutos por tratamientos dentales frente a reposición de materiales biomédicos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className="legend-dot" style={{ backgroundColor: '#A94384' }} /> Recaudos COP
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className="legend-dot" style={{ backgroundColor: '#8A8A8F' }} /> Costo Insumos
                    </span>
                  </div>
                  <button
                    className="icon-btn-plain"
                    onClick={handleExportCSV}
                    title="Exportar datos del gráfico a CSV"
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>

              <div className="year-chart-wrapper">
                <div className="chart-y-axis">
                  <span>$60M COP</span>
                  <span>$40M COP</span>
                  <span>$20M COP</span>
                  <span>$0</span>
                </div>
                <div className="chart-plot-area">
                  <svg viewBox="0 0 600 135" preserveAspectRatio="none" className="smooth-curve-svg">
                    <defs>
                      <linearGradient id="revRepFillMagenta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A94384" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#A94384" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Subtle horizontal grid lines */}
                    <line x1="0" y1="10" x2="600" y2="10" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="600" y2="50" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    <line x1="0" y1="125" x2="600" y2="125" stroke="currentColor" strokeOpacity="0.08" />

                    {/* Recaudos curve (VitaDent Magenta) */}
                    <path
                      d="M 0 85 C 60 75, 120 70, 180 50 C 250 35, 320 22, 380 20 C 440 30, 520 24, 600 18"
                      fill="none"
                      stroke="#A94384"
                      strokeWidth="2.8"
                    />
                    <path
                      d="M 0 85 C 60 75, 120 70, 180 50 C 250 35, 320 22, 380 20 C 440 30, 520 24, 600 18 L 600 135 L 0 135 Z"
                      fill="url(#revRepFillMagenta)"
                    />

                    {/* Cost of consumables dashed curve (Metallic Slate) */}
                    <path
                      d="M 0 115 C 60 112, 120 110, 180 105 C 250 102, 320 98, 380 97 C 440 100, 520 98, 600 96"
                      fill="none"
                      stroke="#8A8A8F"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  <div className="chart-x-axis">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Ago</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov (Act)</span>
                  </div>
                </div>
              </div>

              {/* Insumos & Materiales Indicator */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: '#A94384' }} />
                  <span className="text-xs text-muted">
                    Insumos del periodo:{' '}
                    <strong style={{ color: 'var(--text-main)' }}>$9.200.000 COP</strong> (18.9% de facturación)
                  </span>
                </div>
                <span className="text-xs font-semibold" style={{ color: '#059669' }}>
                  Margen Bruto Clínico: 81.1% ($39.300.000 COP)
                </span>
              </div>
            </div>

            {/* Right: Payment Channels Breakdown */}
            <aside className="cadra-card speedometer-card">
              <div className="chart-card-header">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} style={{ color: '#A94384' }} />
                  <h3 style={{ margin: 0 }}>Canales de Recaudo</h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {/* Channel 1: Datáfono */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <CreditCard size={13} style={{ color: '#A94384' }} /> Datáfono / Tarjetas
                    </span>
                    <span className="font-mono font-bold">$23.280.000 (48%)</span>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '48%', backgroundColor: '#A94384' }} />
                  </div>
                  <span className="text-xs text-muted" style={{ fontSize: '11px' }}>
                    Crédito y Débito · Redeban / Credibanco
                  </span>
                </div>

                {/* Channel 2: Transferencia */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <DollarSign size={13} style={{ color: '#0284c7' }} /> Nequi / Bancolombia
                    </span>
                    <span className="font-mono font-bold">$15.520.000 (32%)</span>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '32%', backgroundColor: '#0284c7' }} />
                  </div>
                  <span className="text-xs text-muted" style={{ fontSize: '11px' }}>
                    Transferencias QR y Llave empresarial
                  </span>
                </div>

                {/* Channel 3: Efectivo */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Building2 size={13} style={{ color: '#8A8A8F' }} /> Efectivo en Caja
                    </span>
                    <span className="font-mono font-bold">$9.700.000 (20%)</span>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '20%', backgroundColor: '#8A8A8F' }} />
                  </div>
                  <span className="text-xs text-muted" style={{ fontSize: '11px' }}>
                    Caja principal de recepción
                  </span>
                </div>
              </div>

              <div className="speedo-footer-note" style={{ marginTop: '20px' }}>
                Total Auditado: <strong>$48.500.000 COP</strong>
              </div>
            </aside>
          </div>

          {/* Insurance / Convenios & Pending Balances Breakdown */}
          <div className="cadra-card mt-4 p-4">
            <div className="chart-card-header mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} style={{ color: '#A94384' }} />
                <h3>Convenios con Aseguradoras y Saldos Pendientes</h3>
              </div>
              <span className="text-xs text-muted">
                12 pacientes con saldos pendientes por cobrar ($4.820.000 COP)
              </span>
            </div>

            <div className="cadra-table-responsive">
              <table className="cadra-data-table">
                <thead>
                  <tr>
                    <th>CONVENIO / ENTIDAD</th>
                    <th>PARTICIPACIÓN</th>
                    <th>VALOR FACTURADO</th>
                    <th>PACIENTES</th>
                    <th>PLAZO MEDIO</th>
                    <th>ESTADO DE RADICACIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row-hoverable">
                    <td>
                      <strong>Colsanitas Medicina Prepagada</strong>
                      <div className="text-xs text-muted">Convenio integral odontológico preferente</div>
                    </td>
                    <td>
                      <span className="cadra-tag-pill" style={{ background: '#fdf2f8', color: '#A94384' }}>
                        38%
                      </span>
                    </td>
                    <td className="font-mono font-bold">$18.200.000 COP</td>
                    <td>42 pacientes</td>
                    <td>15 días hábiles</td>
                    <td>
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 size={13} /> Radicado y Aprobado
                      </span>
                    </td>
                  </tr>

                  <tr className="table-row-hoverable">
                    <td>
                      <strong>EPS Sura (Planes Complementarios)</strong>
                      <div className="text-xs text-muted">Atención de especialistas y endodoncia</div>
                    </td>
                    <td>
                      <span className="cadra-tag-pill" style={{ background: '#f0fdf4', color: '#166534' }}>
                        30%
                      </span>
                    </td>
                    <td className="font-mono font-bold">$14.500.000 COP</td>
                    <td>38 pacientes</td>
                    <td>20 días hábiles</td>
                    <td>
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 size={13} /> Radicado en Trámite
                      </span>
                    </td>
                  </tr>

                  <tr className="table-row-hoverable">
                    <td>
                      <strong>Particulares (Pago Directo)</strong>
                      <div className="text-xs text-muted">Implantes, estética dental y ortodoncia privada</div>
                    </td>
                    <td>
                      <span className="cadra-tag-pill" style={{ background: '#f1f5f9', color: '#475569' }}>
                        32%
                      </span>
                    </td>
                    <td className="font-mono font-bold">$15.800.000 COP</td>
                    <td>48 pacientes</td>
                    <td>Inmediato</td>
                    <td>
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 size={13} /> 100% Cobrado en Caja
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          SECTION 2: CITAS & OCUPACIÓN DE CONSULTORIOS
          ========================================================================= */}
      {activeReportType === 'citas' && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="reporting-split-layout">
            {/* Left: Consultorios Breakdown */}
            <div className="cadra-card p-4">
              <div className="chart-card-header mb-3">
                <div className="flex items-center gap-2">
                  <Building2 size={16} style={{ color: '#A94384' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>Ocupación de Consultorios Odontológicos</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Tasa de uso efectivo por consultorio sobre 140 horas clínicas disponibles en el mes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: '#A94384' }}>
                  Media Clínica: 85.8%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                {/* Consultorio 1 */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <strong style={{ fontSize: '13px' }}>Consultorio 1 · Odontología General</strong>
                      <div className="text-xs text-muted">Dra. Sofía Valenzuela · 112 citas atendidas</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm" style={{ color: '#A94384' }}>
                        92%
                      </span>
                      <div className="text-xs text-muted">128.8 hrs / 140 hrs</div>
                    </div>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '92%', backgroundColor: '#A94384' }} />
                  </div>
                </div>

                {/* Consultorio 2 */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <strong style={{ fontSize: '13px' }}>Consultorio 2 · Ortodoncia 1</strong>
                      <div className="text-xs text-muted">Dr. Alejandro Soto · 104 citas atendidas</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm" style={{ color: '#0284c7' }}>
                        88%
                      </span>
                      <div className="text-xs text-muted">123.2 hrs / 140 hrs</div>
                    </div>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '88%', backgroundColor: '#0284c7' }} />
                  </div>
                </div>

                {/* Consultorio 3 */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <strong style={{ fontSize: '13px' }}>Consultorio 3 · Ortodoncia 2</strong>
                      <div className="text-xs text-muted">Dra. Claudia Rivas · 46 citas atendidas</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm" style={{ color: '#0d9488' }}>
                        78%
                      </span>
                      <div className="text-xs text-muted">109.2 hrs / 140 hrs</div>
                    </div>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '78%', backgroundColor: '#0d9488' }} />
                  </div>
                </div>

                {/* Consultorio 4 */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <strong style={{ fontSize: '13px' }}>Consultorio 4 · Diseño de Sonrisa</strong>
                      <div className="text-xs text-muted">Dr. Marcos Pineda · 46 citas atendidas</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm" style={{ color: '#c2410c' }}>
                        85%
                      </span>
                      <div className="text-xs text-muted">119.0 hrs / 140 hrs</div>
                    </div>
                  </div>
                  <div className="relative-bar-track">
                    <div className="relative-bar-fill" style={{ width: '85%', backgroundColor: '#c2410c' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Puntualidad Speedometer & No-Show */}
            <aside className="cadra-card speedometer-card">
              <div className="chart-card-header">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                  <h3>Puntualidad en Citas</h3>
                </div>
              </div>

              <div className="speedometer-graphic-container">
                <svg viewBox="0 0 200 165" className="speedometer-svg">
                  {/* Subtle background track */}
                  <path
                    d="M 48 130 A 66 66 0 1 1 152 130"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  {/* Colored Arch Track in VitaDent Magenta */}
                  <path
                    d="M 48 130 A 66 66 0 1 1 152 130"
                    fill="none"
                    stroke="#A94384"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeDasharray="310"
                    strokeDashoffset="28"
                  />

                  {/* Radial Ticks */}
                  <line x1="55" y1="123" x2="62" y2="117" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="42" y1="84" x2="51" y2="84" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="62" y1="46" x2="68" y2="53" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="100" y1="28" x2="100" y2="38" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="138" y1="46" x2="132" y2="53" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="158" y1="84" x2="149" y2="84" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                  <line x1="145" y1="123" x2="138" y2="117" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

                  {/* Needle pointing to 91.4% */}
                  <line
                    x1="100"
                    y1="84"
                    x2="143"
                    y2="92"
                    stroke="#17181a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Center Pivot Pin */}
                  <circle cx="100" cy="84" r="6.5" fill="#17181a" />
                  <circle cx="100" cy="84" r="2.5" fill="#ffffff" />
                </svg>

                <div className="speedo-center-readout">
                  <span className="speedo-big-pct">
                    <AnimatedCounter value="91.4%" />
                  </span>
                  <span className="speedo-sub-label">Tiempo de espera &lt; 5 min</span>
                </div>
              </div>

              <div className="speedo-footer-note">
                Inasistencias (No-Show): <strong>4.7% (16 citas)</strong> · Canceladas: <strong>5.3%</strong>
              </div>
            </aside>
          </div>

          {/* Table of Appointments Status */}
          <div className="cadra-card p-4">
            <h3 className="mb-2">Resumen Operativo de la Agenda Clínica</h3>
            <div className="cadra-table-responsive">
              <table className="cadra-data-table">
                <thead>
                  <tr>
                    <th>ESTADO DE CITA</th>
                    <th>CANTIDAD</th>
                    <th>PROPORCIÓN</th>
                    <th>ACCIONES CLÍNICAS</th>
                    <th>IMPACTO ECONÓMICO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row-hoverable">
                    <td>
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <CheckCircle2 size={14} /> Atendidas y Finalizadas
                      </span>
                    </td>
                    <td className="font-mono font-bold">308 citas</td>
                    <td>90.1%</td>
                    <td>Historias clínicas diligenciadas con evolución firmada</td>
                    <td className="font-mono font-semibold">$48.500.000 COP</td>
                  </tr>
                  <tr className="table-row-hoverable">
                    <td>
                      <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                        <Calendar size={14} /> Canceladas con Anticipación
                      </span>
                    </td>
                    <td className="font-mono font-bold">18 citas</td>
                    <td>5.3%</td>
                    <td>Reasignadas en menos de 48 horas mediante lista de espera</td>
                    <td className="font-mono text-muted">Reagendadas</td>
                  </tr>
                  <tr className="table-row-hoverable">
                    <td>
                      <span className="flex items-center gap-1.5 font-semibold text-rose-600">
                        <AlertCircle size={14} /> Inasistencias (No-Show)
                      </span>
                    </td>
                    <td className="font-mono font-bold">16 citas</td>
                    <td>4.7%</td>
                    <td>Contacto telefónico de fidelización y confirmación automatizada</td>
                    <td className="font-mono text-rose-600">-$2.100.000 COP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: TRATAMIENTOS & PACIENTES MÁS DEMANDADOS
          ========================================================================= */}
      {activeReportType === 'tratamientos' && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="reporting-split-layout">
            {/* Left: Top 5 Treatments Table */}
            <div className="cadra-card p-4">
              <div className="chart-card-header mb-3">
                <div className="flex items-center gap-2">
                  <Award size={16} style={{ color: '#A94384' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>Top 5 Tratamientos por Volumen y Facturación</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Tratamientos odontológicos más solicitados clasificados por valor y frecuencia
                    </p>
                  </div>
                </div>
              </div>

              <div className="cadra-table-responsive">
                <table className="cadra-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}>TRATAMIENTO</th>
                      <th style={{ width: '20%' }}>PRECIO UNIT.</th>
                      <th style={{ width: '15%' }}>CANTIDAD</th>
                      <th style={{ width: '30%' }}>TOTAL RECAUDADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-row-hoverable">
                      <td>
                        <strong>1. Implantes de Titanio + Carillas Estéticas</strong>
                        <div className="text-xs text-muted">Dr. Marcos Pineda · Diseño de Sonrisa</div>
                      </td>
                      <td className="font-mono">$2.500.000 COP</td>
                      <td className="font-mono font-bold">9 casos</td>
                      <td>
                        <strong style={{ color: '#A94384' }} className="font-mono">
                          $22.500.000 COP
                        </strong>
                      </td>
                    </tr>

                    <tr className="table-row-hoverable">
                      <td>
                        <strong>2. Ortodoncia 1 (Mensualidades & Arcos)</strong>
                        <div className="text-xs text-muted">Dr. Alejandro Soto · Ortodoncia 1</div>
                      </td>
                      <td className="font-mono">$100.000 COP</td>
                      <td className="font-mono font-bold">114 controles</td>
                      <td>
                        <strong className="font-mono">$11.400.000 COP</strong>
                      </td>
                    </tr>

                    <tr className="table-row-hoverable">
                      <td>
                        <strong>3. Limpiezas Ultrasonido & Profilaxis</strong>
                        <div className="text-xs text-muted">Dra. Sofía Valenzuela · Odontología General</div>
                      </td>
                      <td className="font-mono">$90.000 COP</td>
                      <td className="font-mono font-bold">62 pacientes</td>
                      <td>
                        <strong className="font-mono">$5.580.000 COP</strong>
                      </td>
                    </tr>

                    <tr className="table-row-hoverable">
                      <td>
                        <strong>4. Ortodoncia 2 (Alineadores & Placas)</strong>
                        <div className="text-xs text-muted">Dra. Claudia Rivas · Ortodoncia 2</div>
                      </td>
                      <td className="font-mono">$350.000 COP</td>
                      <td className="font-mono font-bold">14 casos</td>
                      <td>
                        <strong className="font-mono">$4.900.000 COP</strong>
                      </td>
                    </tr>

                    <tr className="table-row-hoverable">
                      <td>
                        <strong>5. Blanqueamiento Dental LED</strong>
                        <div className="text-xs text-muted">Dra. Sofía Valenzuela · Odontología General & Estética</div>
                      </td>
                      <td className="font-mono">$300.000 COP</td>
                      <td className="font-mono font-bold">13 sesiones</td>
                      <td>
                        <strong className="font-mono">$3.900.000 COP</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: New vs Recurring Patients */}
            <aside className="cadra-card p-4">
              <div className="chart-card-header mb-2">
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: '#A94384' }} />
                  <h3 style={{ margin: 0 }}>Distribución de Pacientes</h3>
                </div>
              </div>

              <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div>
                    <span className="text-xs text-muted block">Pacientes Nuevos (1ª Vez)</span>
                    <strong style={{ fontSize: '20px', color: '#A94384' }}>68 Pacientes</strong>
                  </div>
                  <span className="cadra-tag-pill" style={{ background: '#fdf2f8', color: '#A94384' }}>
                    31.8%
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div>
                    <span className="text-xs text-muted block">Pacientes Recurrentes</span>
                    <strong style={{ fontSize: '20px', color: '#0284c7' }}>146 Pacientes</strong>
                  </div>
                  <span className="cadra-tag-pill" style={{ background: '#eff6ff', color: '#0284c7' }}>
                    68.2%
                  </span>
                </div>

                {/* Acquisition Channels */}
                <div style={{ marginTop: '6px' }}>
                  <span className="text-xs font-semibold text-muted block mb-2">
                    Canales de Adquisición de Pacientes:
                  </span>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Recomendación & Boca a boca</span>
                      <strong>42% (29 pacientes)</strong>
                    </div>
                    <div className="relative-bar-track">
                      <div className="relative-bar-fill" style={{ width: '42%', backgroundColor: '#A94384' }} />
                    </div>

                    <div className="flex justify-between mt-1">
                      <span>Convenios Sura & Colsanitas</span>
                      <strong>34% (23 pacientes)</strong>
                    </div>
                    <div className="relative-bar-track">
                      <div className="relative-bar-fill" style={{ width: '34%', backgroundColor: '#0284c7' }} />
                    </div>

                    <div className="flex justify-between mt-1">
                      <span>Redes Sociales & Web Clínica</span>
                      <strong>24% (16 pacientes)</strong>
                    </div>
                    <div className="relative-bar-track">
                      <div className="relative-bar-fill" style={{ width: '24%', backgroundColor: '#8A8A8F' }} />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: RENDIMIENTO POR ESPECIALISTA / DOCTOR
          ========================================================================= */}
      {activeReportType === 'especialistas' && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor 1: Dra. Sofía Valenzuela */}
            <div
              className="cadra-card p-4"
              style={{
                border: selectedDoctor === 'doc-1' ? '2.5px solid #A94384' : '1px solid var(--border-light)',
                boxShadow: selectedDoctor === 'doc-1' ? '0 6px 18px rgba(169, 67, 132, 0.2)' : 'none',
                backgroundColor: selectedDoctor === 'doc-1' ? '#fdf8fa' : undefined
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#fdf2f8',
                      color: '#A94384',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      border: '1.5px solid #A94384'
                    }}
                  >
                    SV
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Dra. Sofía Valenzuela</h3>
                    <span className="text-xs text-muted">Odontología General · Consultorio 1</span>
                  </div>
                </div>
                <span className="cadra-tag-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                  ⭐ 98.4% Satisfacción
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Citas Atendidas</span>
                  <strong className="text-base font-mono">112</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Tratamientos</span>
                  <strong className="text-base font-mono">86</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Recaudo</span>
                  <strong className="text-base font-mono" style={{ color: '#A94384' }}>
                    $14.2M
                  </strong>
                </div>
              </div>

              <div className="mt-3 text-xs text-secondary flex items-center justify-between">
                <span>Tratamientos clave: Limpiezas ultrasónicas, resinas estéticas, blanqueamientos LED</span>
                <span className="font-semibold text-emerald-600">Puntualidad: 93%</span>
              </div>
            </div>

            {/* Doctor 2: Dr. Alejandro Soto */}
            <div
              className="cadra-card p-4"
              style={{
                border: selectedDoctor === 'doc-2' ? '2.5px solid #0284c7' : '1px solid var(--border-light)',
                boxShadow: selectedDoctor === 'doc-2' ? '0 6px 18px rgba(2, 132, 199, 0.2)' : 'none',
                backgroundColor: selectedDoctor === 'doc-2' ? '#f0f9ff' : undefined
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      border: '1.5px solid #0284c7'
                    }}
                  >
                    AS
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Dr. Alejandro Soto</h3>
                    <span className="text-xs text-muted">Ortodoncia 1 · Consultorio 2</span>
                  </div>
                </div>
                <span className="cadra-tag-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                  ⭐ 97.8% Satisfacción
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Citas Atendidas</span>
                  <strong className="text-base font-mono">104</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Casos Activos</span>
                  <strong className="text-base font-mono">128</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Recaudo</span>
                  <strong className="text-base font-mono" style={{ color: '#0284c7' }}>
                    $13.8M
                  </strong>
                </div>
              </div>

              <div className="mt-3 text-xs text-secondary flex items-center justify-between">
                <span>Tratamientos clave: Controles mensuales de brackets, 12 nuevos cementados</span>
                <span className="font-semibold text-emerald-600">Puntualidad: 91%</span>
              </div>
            </div>

            {/* Doctor 3: Dra. Claudia Rivas */}
            <div
              className="cadra-card p-4"
              style={{
                border: selectedDoctor === 'doc-3' ? '2.5px solid #0d9488' : '1px solid var(--border-light)',
                boxShadow: selectedDoctor === 'doc-3' ? '0 6px 18px rgba(13, 148, 136, 0.2)' : 'none',
                backgroundColor: selectedDoctor === 'doc-3' ? '#f0fdfa' : undefined
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#f0fdfa',
                      color: '#0d9488',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      border: '1.5px solid #0d9488'
                    }}
                  >
                    CR
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Dra. Claudia Rivas</h3>
                    <span className="text-xs text-muted">Ortodoncia 2 · Consultorio 3</span>
                  </div>
                </div>
                <span className="cadra-tag-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                  ⭐ 96.5% Satisfacción
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Citas Atendidas</span>
                  <strong className="text-base font-mono">46</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Alineadores OK</span>
                  <strong className="text-base font-mono">26</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Recaudo</span>
                  <strong className="text-base font-mono" style={{ color: '#0d9488' }}>
                    $9.1M
                  </strong>
                </div>
              </div>

              <div className="mt-3 text-xs text-secondary flex items-center justify-between">
                <span>Tratamientos clave: Controles ortodoncia 2, alineadores invisibles, ortopedia maxilar</span>
                <span className="font-semibold text-emerald-600">Puntualidad: 89%</span>
              </div>
            </div>

            {/* Doctor 4: Dr. Marcos Pineda */}
            <div
              className="cadra-card p-4"
              style={{
                border: selectedDoctor === 'doc-4' ? '2.5px solid #c2410c' : '1px solid var(--border-light)',
                boxShadow: selectedDoctor === 'doc-4' ? '0 6px 18px rgba(194, 65, 12, 0.2)' : 'none',
                backgroundColor: selectedDoctor === 'doc-4' ? '#fff7ed' : undefined
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#fff7ed',
                      color: '#c2410c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      border: '1.5px solid #c2410c'
                    }}
                  >
                    MP
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Dr. Marcos Pineda</h3>
                    <span className="text-xs text-muted">Diseño de Sonrisa · Consultorio 4</span>
                  </div>
                </div>
                <span className="cadra-tag-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                  ⭐ 99.1% Satisfacción
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Citas Atendidas</span>
                  <strong className="text-base font-mono">46</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Carillas / Impl</span>
                  <strong className="text-base font-mono">29</strong>
                </div>
                <div className="p-2 rounded bg-card-subtle border border-light">
                  <span className="text-xs text-muted block">Recaudo</span>
                  <strong className="text-base font-mono" style={{ color: '#c2410c' }}>
                    $11.4M
                  </strong>
                </div>
              </div>

              <div className="mt-3 text-xs text-secondary flex items-center justify-between">
                <span>Tratamientos clave: Diseño de sonrisa digital, carillas cerámicas, implantes de titanio</span>
                <span className="font-semibold text-emerald-600">Puntualidad: 92%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Clinical Print Footer - Visible ONLY during PDF Print */}
      <div className="clinical-print-footer">
        <div>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
            VitaDent Clínica Odontológica · Carrera 15 # 85-30, Consultorio 402, Bogotá D.C.
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
            Tel: +57 311 405 2910 · administracion@vitadent.com.co
          </p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '220px' }}>
          <div style={{ borderBottom: '1px solid #000', marginBottom: '4px', width: '200px' }} />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Dra. Sofía Valenzuela</span>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Directora Médica VitaDent</div>
        </div>
      </div>
    </div>
  )
}

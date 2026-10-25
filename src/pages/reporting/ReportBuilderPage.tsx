import React, { useState } from 'react'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  Printer,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Calendar,
  Users,
  Activity,
  FileSpreadsheet
} from 'lucide-react'

interface ReportBuilderPageProps {
  onNavigate: (path: string) => void
}

type MetricId = 'facturacion' | 'citas' | 'pacientes' | 'ocupacion' | 'insumos'
type GroupByKey = 'mes' | 'especialidad' | 'tratamiento'

export const ReportBuilderPage: React.FC<ReportBuilderPageProps> = ({ onNavigate }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricId>('facturacion')
  const [groupBy, setGroupBy] = useState<GroupByKey>('mes')

  const metrics = [
    {
      id: 'facturacion' as const,
      title: 'Facturación & Recaudos',
      desc: 'Recaudos clínicos en COP por tratamientos y controles',
      icon: DollarSign,
      total: '$48.500.000 COP',
      highest: '$52.100.000 COP (Sep 2026)',
      lowest: '$38.400.000 COP (Ene 2026)',
    },
    {
      id: 'citas' as const,
      title: 'Citas Atendidas',
      desc: 'Citas presenciales y controles clínicos ejecutados',
      icon: Calendar,
      total: '308 citas',
      highest: '340 citas (Oct 2026)',
      lowest: '245 citas (Ene 2026)',
    },
    {
      id: 'pacientes' as const,
      title: 'Pacientes Únicos',
      desc: 'Pacientes nuevos y recurrentes en tratamiento',
      icon: Users,
      total: '214 pacientes',
      highest: '235 pac. (Oct 2026)',
      lowest: '180 pac. (Feb 2026)',
    },
    {
      id: 'ocupacion' as const,
      title: 'Puntualidad & Ocupación',
      desc: 'Cumplimiento de horario y ocupación de consultorios',
      icon: CheckCircle2,
      total: '91.4%',
      highest: '94.2% (May 2026)',
      lowest: '87.0% (Ago 2026)',
    },
    {
      id: 'insumos' as const,
      title: 'Costo de Insumos',
      desc: 'Materiales odontológicos, resinas, implantes y anestesia',
      icon: Activity,
      total: '$9.200.000 COP',
      highest: '$10.400.000 COP (Jul 2026)',
      lowest: '$7.100.000 COP (Ene 2026)',
    },
  ]

  const currentMetric = metrics.find((m) => m.id === selectedMetric) || metrics[0]

  // Data rows based on GroupBy and Metric
  const getDataRows = () => {
    if (groupBy === 'mes') {
      if (selectedMetric === 'facturacion') {
        return [
          { num: 1, name: 'Noviembre 2026 (En Curso)', val: '$48.500.000 COP', sub: '184 pagos', pct: 93 },
          { num: 2, name: 'Octubre 2026', val: '$50.200.000 COP', sub: '198 pagos', pct: 96 },
          { num: 3, name: 'Septiembre 2026 (Récord)', val: '$52.100.000 COP', sub: '210 pagos', pct: 100 },
          { num: 4, name: 'Agosto 2026', val: '$47.800.000 COP', sub: '176 pagos', pct: 91 },
          { num: 5, name: 'Julio 2026', val: '$46.300.000 COP', sub: '172 pagos', pct: 88 },
          { num: 6, name: 'Junio 2026', val: '$44.900.000 COP', sub: '165 pagos', pct: 86 },
        ]
      }
      if (selectedMetric === 'citas') {
        return [
          { num: 1, name: 'Octubre 2026 (Récord)', val: '340 citas', sub: '92% efectividad', pct: 100 },
          { num: 2, name: 'Noviembre 2026', val: '308 citas', sub: '90.1% efectividad', pct: 91 },
          { num: 3, name: 'Septiembre 2026', val: '325 citas', sub: '91% efectividad', pct: 95 },
          { num: 4, name: 'Agosto 2026', val: '298 citas', sub: '89% efectividad', pct: 87 },
          { num: 5, name: 'Julio 2026', val: '286 citas', sub: '88% efectividad', pct: 84 },
          { num: 6, name: 'Junio 2026', val: '275 citas', sub: '87% efectividad', pct: 81 },
        ]
      }
      if (selectedMetric === 'pacientes') {
        return [
          { num: 1, name: 'Octubre 2026', val: '235 pacientes', sub: '74 nuevos', pct: 100 },
          { num: 2, name: 'Septiembre 2026', val: '228 pacientes', sub: '70 nuevos', pct: 97 },
          { num: 3, name: 'Noviembre 2026', val: '214 pacientes', sub: '68 nuevos', pct: 91 },
          { num: 4, name: 'Agosto 2026', val: '205 pacientes', sub: '62 nuevos', pct: 87 },
          { num: 5, name: 'Julio 2026', val: '198 pacientes', sub: '58 nuevos', pct: 84 },
          { num: 6, name: 'Junio 2026', val: '190 pacientes', sub: '55 nuevos', pct: 80 },
        ]
      }
      if (selectedMetric === 'ocupacion') {
        return [
          { num: 1, name: 'Mayo 2026', val: '94.2%', sub: 'Puntualidad alta', pct: 100 },
          { num: 2, name: 'Noviembre 2026', val: '91.4%', sub: 'Espera media 4.2 min', pct: 97 },
          { num: 3, name: 'Octubre 2026', val: '90.8%', sub: 'Espera media 4.8 min', pct: 96 },
          { num: 4, name: 'Septiembre 2026', val: '89.5%', sub: 'Espera media 5.1 min', pct: 95 },
          { num: 5, name: 'Julio 2026', val: '88.3%', sub: 'Espera media 5.5 min', pct: 93 },
          { num: 6, name: 'Agosto 2026', val: '87.0%', sub: 'Espera media 6.0 min', pct: 92 },
        ]
      }
      // insumos
      return [
        { num: 1, name: 'Julio 2026', val: '$10.400.000 COP', sub: 'Adquisición implantes', pct: 100 },
        { num: 2, name: 'Septiembre 2026', val: '$9.800.000 COP', sub: 'Reposición brackets', pct: 94 },
        { num: 3, name: 'Octubre 2026', val: '$9.500.000 COP', sub: 'Composite y resinas', pct: 91 },
        { num: 4, name: 'Noviembre 2026', val: '$9.200.000 COP', sub: 'Consumo óptimo (18.9%)', pct: 88 },
        { num: 5, name: 'Agosto 2026', val: '$8.600.000 COP', sub: 'Material descartable', pct: 82 },
        { num: 6, name: 'Junio 2026', val: '$8.100.000 COP', sub: 'Anestesia e insumos', pct: 77 },
      ]
    }

    if (groupBy === 'especialidad') {
      if (selectedMetric === 'facturacion') {
        return [
          { num: 1, name: 'Odontología General & Estética (Dra. Valenzuela)', val: '$14.200.000 COP', sub: '112 citas · Consultorio 1', pct: 100 },
          { num: 2, name: 'Ortodoncia & Ortopedia (Dr. Soto)', val: '$13.800.000 COP', sub: '104 citas · Consultorio 2', pct: 97 },
          { num: 3, name: 'Cirugía Oral & Implantes (Dr. Pineda)', val: '$11.400.000 COP', sub: '46 citas · Consultorio 4', pct: 80 },
          { num: 4, name: 'Endodoncia Microscópica (Dra. Rivas)', val: '$9.100.000 COP', sub: '46 citas · Consultorio 3', pct: 64 },
        ]
      }
      if (selectedMetric === 'citas') {
        return [
          { num: 1, name: 'Odontología General & Estética (Dra. Valenzuela)', val: '112 citas', sub: '92% ocupación', pct: 100 },
          { num: 2, name: 'Ortodoncia & Ortopedia (Dr. Soto)', val: '104 citas', sub: '88% ocupación', pct: 93 },
          { num: 3, name: 'Endodoncia Microscópica (Dra. Rivas)', val: '46 citas', sub: '78% ocupación', pct: 41 },
          { num: 4, name: 'Cirugía Oral & Implantes (Dr. Pineda)', val: '46 citas', sub: '85% ocupación', pct: 41 },
        ]
      }
      if (selectedMetric === 'pacientes') {
        return [
          { num: 1, name: 'Odontología General & Estética', val: '88 pacientes', sub: '42 nuevos · 46 recurrentes', pct: 100 },
          { num: 2, name: 'Ortodoncia & Ortopedia', val: '72 pacientes', sub: '14 nuevos · 58 recurrentes', pct: 82 },
          { num: 3, name: 'Endodoncia Microscópica', val: '28 pacientes', sub: '8 nuevos · 20 recurrentes', pct: 32 },
          { num: 4, name: 'Cirugía Oral & Implantes', val: '26 pacientes', sub: '4 nuevos · 22 recurrentes', pct: 30 },
        ]
      }
      if (selectedMetric === 'ocupacion') {
        return [
          { num: 1, name: 'Consultorio 1 (Odontología General)', val: '92.0%', sub: '128.8 hrs efectivas', pct: 100 },
          { num: 2, name: 'Consultorio 2 (Ortodoncia)', val: '88.0%', sub: '123.2 hrs efectivas', pct: 95 },
          { num: 3, name: 'Consultorio 4 (Cirugía & Quirófano)', val: '85.0%', sub: '119.0 hrs efectivas', pct: 92 },
          { num: 4, name: 'Consultorio 3 (Endodoncia)', val: '78.0%', sub: '109.2 hrs efectivas', pct: 84 },
        ]
      }
      // insumos
      return [
        { num: 1, name: 'Cirugía Oral & Implantes', val: '$4.200.000 COP', sub: 'Cajas de implantes y fresas', pct: 100 },
        { num: 2, name: 'Odontología General & Estética', val: '$2.350.000 COP', sub: 'Resinas estéticas y lámparas', pct: 56 },
        { num: 3, name: 'Ortodoncia & Ortopedia', val: '$1.450.000 COP', sub: 'Brackets cerámicos y arcos', pct: 34 },
        { num: 4, name: 'Endodoncia Microscópica', val: '$1.200.000 COP', sub: 'Limas rotatorias y selladores', pct: 28 },
      ]
    }

    // tratamiento
    if (selectedMetric === 'facturacion') {
      return [
        { num: 1, name: 'Implante de Titanio + Corona', val: '$22.500.000 COP', sub: '9 implantes colocados', pct: 100 },
        { num: 2, name: 'Ortodoncia (Mensualidades & Control)', val: '$11.400.000 COP', sub: '114 controles ejecutados', pct: 50 },
        { num: 3, name: 'Limpieza Dental Ultrasonido & Profilaxis', val: '$5.580.000 COP', sub: '62 sesiones de higiene', pct: 25 },
        { num: 4, name: 'Endodoncia Unirradicular/Multirradicular', val: '$4.900.000 COP', sub: '14 tratamientos completados', pct: 22 },
        { num: 5, name: 'Blanqueamiento Dental LED', val: '$3.900.000 COP', sub: '13 blanqueamientos realizados', pct: 17 },
        { num: 6, name: 'Extracción Quirúrgica (Cordales)', val: '$2.250.000 COP', sub: '9 cordales complejas', pct: 10 },
      ]
    }
    if (selectedMetric === 'citas') {
      return [
        { num: 1, name: 'Ortodoncia (Mensualidades & Control)', val: '114 citas', sub: 'Dr. Alejandro Soto', pct: 100 },
        { num: 2, name: 'Limpieza Dental Ultrasonido & Profilaxis', val: '62 citas', sub: 'Dra. Sofía Valenzuela', pct: 54 },
        { num: 3, name: 'Obturación / Empaste en Composite', val: '38 citas', sub: 'Dra. Sofía Valenzuela', pct: 33 },
        { num: 4, name: 'Endodoncia Unirradicular/Multirradicular', val: '26 citas', sub: 'Dra. Claudia Rivas', pct: 23 },
        { num: 5, name: 'Extracción Quirúrgica (Cordales)', val: '18 citas', sub: 'Dr. Marcos Pineda', pct: 16 },
        { num: 6, name: 'Implante de Titanio + Corona', val: '11 citas', sub: 'Dr. Marcos Pineda', pct: 10 },
      ]
    }
    if (selectedMetric === 'pacientes') {
      return [
        { num: 1, name: 'Ortodoncia (Mensualidades & Control)', val: '114 pacientes', sub: 'Seguimiento mensual activo', pct: 100 },
        { num: 2, name: 'Limpieza Dental Ultrasonido & Profilaxis', val: '62 pacientes', sub: 'Mantenimiento preventivo', pct: 54 },
        { num: 3, name: 'Obturación / Empaste en Composite', val: '28 pacientes', sub: 'Tratamientos restauradores', pct: 24 },
        { num: 4, name: 'Endodoncia Unirradicular/Multirradicular', val: '14 pacientes', sub: 'Eliminación del dolor agudo', pct: 12 },
        { num: 5, name: 'Blanqueamiento Dental LED', val: '13 pacientes', sub: 'Estética de alta sonrisa', pct: 11 },
        { num: 6, name: 'Implante de Titanio + Corona', val: '9 pacientes', sub: 'Rehabilitación definitiva', pct: 8 },
      ]
    }
    // Default for treatment
    return [
      { num: 1, name: 'Implante de Titanio + Corona', val: '$2.500.000 COP', sub: 'Implantología oral mayor', pct: 100 },
      { num: 2, name: 'Endodoncia Multirradicular', val: '$450.000 COP', sub: 'Molares y premolares', pct: 18 },
      { num: 3, name: 'Endodoncia Unirradicular', val: '$350.000 COP', sub: 'Dientes anteriores', pct: 14 },
      { num: 4, name: 'Blanqueamiento Dental LED', val: '$300.000 COP', sub: 'Sesión clínica completa', pct: 12 },
      { num: 5, name: 'Extracción Quirúrgica (Cordal)', val: '$250.000 COP', sub: 'Cirugía menor ambulatoria', pct: 10 },
      { num: 6, name: 'Limpieza Dental Ultrasonido', val: '$90.000 COP', sub: 'Profilaxis ultrasónica', pct: 4 },
    ]
  }

  const rows = getDataRows()

  // Export built report to CSV
  const handleExportBuilderCSV = () => {
    const filename = `VitaDent_Constructor_${selectedMetric}_por_${groupBy}.csv`
    const csvRows = [
      ['VitaDent Clínica Odontológica - Constructor de Reportes Personalizado'],
      ['Métrica Analizada:', currentMetric.title],
      ['Agrupación:', `Por ${groupBy.toUpperCase()}`],
      ['Total Global:', currentMetric.total],
      ['Fecha de Generación:', new Date().toLocaleString('es-CO')],
      [''],
      ['Ranking', 'Categoría / Concepto', 'Valor', 'Detalle Clínico', 'Participación Relativa'],
      ...rows.map((r) => [r.num, r.name, r.val, r.sub, `${r.pct}%`]),
    ]

    const csvContent =
      '\uFEFF' +
      csvRows
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

  return (
    <div className="cadra-page-container">
      {/* Official Clinical Print Header */}
      <div className="clinical-print-header">
        <div className="flex items-center gap-3">
          <img
            src="/Logo_Horizontal.png"
            alt="VitaDent Clínica Odontológica"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#A94384' }}>
              VitaDent Clínica Odontológica
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
              Constructor Analítico · {currentMetric.title} agrupado por {groupBy.toUpperCase()}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
          <div><strong>REPORTE ANALÍTICO PERSONALIZADO</strong></div>
          <div>Emisión: {new Date().toLocaleDateString('es-CO')}</div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Informes</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Generador de Reportes</span>
      </div>

      {/* Header with two-tier right cluster */}
      <div className="cadra-page-header">
        <div className="page-header-left">
          <h1 className="cadra-page-title">Generador de Reportes</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab" onClick={() => onNavigate('/informes')}>
              Rendimiento Clínico
            </button>
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/reporting/builder')}>
              Generador de Reportes
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill onNavigate={onNavigate} />
          <div className="cadra-header-actions">
            <button
              className="cadra-btn-secondary"
              onClick={handleExportBuilderCSV}
              title="Descargar datos en formato CSV para Microsoft Excel"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button
              className="cadra-btn-secondary"
              onClick={() => window.print()}
              title="Imprimir reporte oficial en PDF"
            >
              <Printer size={15} style={{ color: '#A94384' }} />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Layout: Builder sidebar (Left) vs Report output (Right) */}
      <div className="builder-split-layout mt-4">
        {/* Left: Build a report controls */}
        <aside className="cadra-card builder-sidebar-card no-print">
          <div className="side-card-title-row mb-3">
            <div className="flex items-center gap-2">
              <Layers size={16} style={{ color: '#A94384' }} />
              <h3 style={{ margin: 0 }}>Métrica Clínica</h3>
            </div>
          </div>

          <div className="builder-section-label">SELECCIONE MÉTRICA A MEDIR</div>

          <div className="builder-metrics-stack">
            {metrics.map((m) => {
              const Icon = m.icon
              const isSelected = selectedMetric === m.id
              return (
                <div
                  key={m.id}
                  className={`metric-choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMetric(m.id)}
                >
                  <div className="metric-choice-icon">
                    <Icon size={16} />
                  </div>
                  <div className="metric-choice-texts">
                    <strong>{m.title}</strong>
                    <p>{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="builder-section-label mt-4">AGRUPAR DIMENSIÓN POR</div>

          <div className="cadra-pill-group w-full justify-between">
            <button
              className={`pill-switch-btn flex-1 ${groupBy === 'mes' ? 'active' : ''}`}
              onClick={() => setGroupBy('mes')}
            >
              Mes
            </button>
            <button
              className={`pill-switch-btn flex-1 ${groupBy === 'especialidad' ? 'active' : ''}`}
              onClick={() => setGroupBy('especialidad')}
            >
              Especialidad
            </button>
            <button
              className={`pill-switch-btn flex-1 ${groupBy === 'tratamiento' ? 'active' : ''}`}
              onClick={() => setGroupBy('tratamiento')}
            >
              Tratamiento
            </button>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              fontSize: '11.5px',
              color: 'var(--text-secondary)'
            }}
          >
            <strong className="block mb-1" style={{ color: 'var(--text-main)' }}>
              💡 Auditoría Odontológica
            </strong>
            Los reportes generados aplican automáticamente a la contabilidad de VitaDent (COP) y al sistema de historias clínicas.
          </div>
        </aside>

        {/* Right: Interactive Report Display */}
        <div className="cadra-card builder-output-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span style={{ color: '#A94384' }}>📊</span>
              <div>
                <h3 style={{ margin: 0 }}>
                  {currentMetric.title} por{' '}
                  {groupBy === 'mes' ? 'Mes' : groupBy === 'especialidad' ? 'Especialidad Odontológica' : 'Tratamiento'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Visualización consolidada según los parámetros clínicos activos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted no-print">
              <span>Auditoría Jun 2026 – Nov 2026</span>
              <button className="icon-btn-plain" onClick={handleExportBuilderCSV} title="Exportar CSV">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Top 3 Metric Summary Boxes */}
          <div className="builder-stats-trio">
            <div className="stat-trio-box">
              <span className="stat-trio-label">Total Auditado</span>
              <span className="stat-trio-val">{currentMetric.total}</span>
            </div>
            <div className="stat-trio-box">
              <span className="stat-trio-label">Pico Más Alto</span>
              <span className="stat-trio-val" style={{ color: '#A94384' }}>
                {currentMetric.highest}
              </span>
            </div>
            <div className="stat-trio-box">
              <span className="stat-trio-label">Valor Mínimo</span>
              <span className="stat-trio-val text-muted">{currentMetric.lowest}</span>
            </div>
          </div>

          {/* Smooth Chart Area with VitaDent Colors */}
          <div className="year-chart-wrapper mt-3">
            <div className="chart-y-axis">
              <span>{selectedMetric === 'ocupacion' ? '100%' : '$55M'}</span>
              <span>{selectedMetric === 'ocupacion' ? '50%' : '$27M'}</span>
              <span>0</span>
            </div>
            <div className="chart-plot-area">
              <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="smooth-curve-svg">
                <defs>
                  <linearGradient id="builderCurveFillMagenta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A94384" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#A94384" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 115 C 60 120, 120 100, 180 80 C 250 45, 320 20, 380 25 C 440 35, 520 50, 600 85"
                  fill="none"
                  stroke="#A94384"
                  strokeWidth="2.8"
                />
                <path
                  d="M 0 115 C 60 120, 120 100, 180 80 C 250 45, 320 20, 380 25 C 440 35, 520 50, 600 85 L 600 160 L 0 160 Z"
                  fill="url(#builderCurveFillMagenta)"
                />
              </svg>
              <div className="chart-x-axis">
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="cadra-table-responsive mt-4">
            <table className="cadra-data-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>#</th>
                  <th style={{ width: '42%' }}>
                    {groupBy === 'mes' ? 'MES' : groupBy === 'especialidad' ? 'ESPECIALIDAD' : 'TRATAMIENTO'}
                  </th>
                  <th style={{ width: '25%' }}>VALOR AUDITADO</th>
                  <th style={{ width: '25%' }}>PROPORCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.num} className="table-row-hoverable">
                    <td className="font-mono text-muted">{r.num}</td>
                    <td>
                      <strong>{r.name}</strong>
                      <div className="text-xs text-muted">{r.sub}</div>
                    </td>
                    <td className="font-mono font-bold" style={{ color: 'var(--text-main)' }}>
                      {r.val}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="relative-bar-track flex-1">
                          <div className="relative-bar-fill" style={{ width: `${r.pct}%`, backgroundColor: '#A94384' }} />
                        </div>
                        <span className="font-mono text-xs text-muted" style={{ minWidth: '32px', textAlign: 'right' }}>
                          {r.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

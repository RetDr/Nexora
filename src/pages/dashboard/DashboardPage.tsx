import React from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { useAuth } from '../../context/AuthContext'
import {
  Calendar,
  Clock,
  Users,
  Plus,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Building2,
  Package,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  Crown
} from 'lucide-react'

interface DashboardPageProps {
  onNavigate: (path: string) => void
}

interface AppointmentItem {
  id: string
  time: string
  period: string
  patient: string
  treatment: string
  doctor: string
  consultorio: string
  status: 'En atención' | 'Confirmada' | 'Pendiente'
  statusColor: 'green' | 'blue' | 'amber'
}

interface CriticalStockItem {
  id: string
  name: string
  detail: string
  stock: string
  percentage: number
  level: 'critical' | 'warning' | 'normal'
  badgeText: string
}

interface RecentPayment {
  id: string
  patient: string
  treatment: string
  amount: string
  method: string
  time: string
}

interface SpecialistDuty {
  id: string
  name: string
  specialty: string
  consultorio: string
  consultorioNum: number
  initials: string
  color: string
  citasCount: number
  status: string
  statusType: 'available' | 'busy' | 'prep'
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth()
  
  // Saludo dinámico según usuario logueado
  const userGreetingName = user?.name ? (user.name.includes('Dr') ? user.name : user.name.split(' ')[0]) : 'Nathalia'

  // Próximas Citas de Hoy
  const upcomingAppointments: AppointmentItem[] = [
    {
      id: 'apt-1',
      time: '10:00',
      period: 'AM',
      patient: 'Carlos García Mendoza',
      treatment: 'Implante Titanio + Corona',
      doctor: 'Dr. Marcos Pineda',
      consultorio: 'Consultorio 4',
      status: 'En atención',
      statusColor: 'green'
    },
    {
      id: 'apt-2',
      time: '11:30',
      period: 'AM',
      patient: 'Laura Gómez Restrepo',
      treatment: 'Control Brackets Ortodoncia',
      doctor: 'Dr. Alejandro Soto',
      consultorio: 'Consultorio 2',
      status: 'Confirmada',
      statusColor: 'blue'
    },
    {
      id: 'apt-3',
      time: '02:00',
      period: 'PM',
      patient: 'Andrés Felipe Mendoza',
      treatment: 'Endodoncia Pieza 26',
      doctor: 'Dra. Claudia Rivas',
      consultorio: 'Consultorio 3',
      status: 'Confirmada',
      statusColor: 'blue'
    },
    {
      id: 'apt-4',
      time: '03:30',
      period: 'PM',
      patient: 'Valentina Ríos Castro',
      treatment: 'Limpieza Ultrasonido',
      doctor: 'Dra. Sofía Valenzuela',
      consultorio: 'Consultorio 1',
      status: 'Confirmada',
      statusColor: 'blue'
    },
    {
      id: 'apt-5',
      time: '04:30',
      period: 'PM',
      patient: 'Mariana Torres Peña',
      treatment: 'Estratificación Carillas',
      doctor: 'Dra. Sofía Valenzuela',
      consultorio: 'Consultorio 1',
      status: 'Pendiente',
      statusColor: 'amber'
    }
  ]

  // Insumos Odontológicos Críticos
  const criticalStockItems: CriticalStockItem[] = [
    {
      id: 'stock-1',
      name: 'Anestesia Scandonest 2%',
      detail: 'Con vasoconstrictor (Mepivacaína)',
      stock: '12 carpules restantes',
      percentage: 20,
      level: 'critical',
      badgeText: '⚠️ Reorden urgente'
    },
    {
      id: 'stock-2',
      name: 'Composite Filtek Z350 XT A2',
      detail: 'Jeringa de resina universal 4g 3M',
      stock: '8 unidades restantes',
      percentage: 38,
      level: 'warning',
      badgeText: 'Stock bajo'
    },
    {
      id: 'stock-3',
      name: 'Guantes de Nitrilo Talla M',
      detail: 'Caja x 100 unidades color azul',
      stock: '45 cajas',
      percentage: 82,
      level: 'normal',
      badgeText: 'Stock óptimo'
    },
    {
      id: 'stock-4',
      name: 'Implantes Straumann BLX',
      detail: 'Ø 3.75mm Roxolid SLActive',
      stock: '10 unidades',
      percentage: 60,
      level: 'normal',
      badgeText: 'Stock regular'
    }
  ]

  // Cobros Recientes en Caja
  const recentPayments: RecentPayment[] = [
    {
      id: 'pay-1',
      patient: 'Carlos García Mendoza',
      treatment: 'Abono Implante Titanio (Fase 1)',
      amount: '$1.800.000 COP',
      method: 'Nequi / Transferencia',
      time: '10:45 AM'
    },
    {
      id: 'pay-2',
      patient: 'Laura Gómez Restrepo',
      treatment: 'Control Mensual Ortodoncia',
      amount: '$180.000 COP',
      method: 'Tarjeta Débito',
      time: '09:50 AM'
    },
    {
      id: 'pay-3',
      patient: 'Valentina Ríos Castro',
      treatment: 'Profilaxis & Limpieza Ultrasonido',
      amount: '$150.000 COP',
      method: 'Tarjeta Crédito',
      time: '09:15 AM'
    },
    {
      id: 'pay-4',
      patient: 'Andrés Felipe Mendoza',
      treatment: 'Abono Endodoncia Multirradicular',
      amount: '$420.000 COP',
      method: 'Efectivo',
      time: '08:40 AM'
    }
  ]

  // Especialistas en Turno
  const specialists: SpecialistDuty[] = [
    {
      id: 'doc-1',
      name: 'Dra. Sofía Valenzuela',
      specialty: 'Odontología General & Estética',
      consultorio: 'Consultorio 1',
      consultorioNum: 1,
      initials: 'SV',
      color: '#A94384', // VitaDent Magenta
      citasCount: 3,
      status: 'Disponible',
      statusType: 'available'
    },
    {
      id: 'doc-2',
      name: 'Dr. Alejandro Soto',
      specialty: 'Ortodoncia Avanzada & Brackets',
      consultorio: 'Consultorio 2',
      consultorioNum: 2,
      initials: 'AS',
      color: '#0284c7', // Sky blue
      citasCount: 2,
      status: 'En atención',
      statusType: 'busy'
    },
    {
      id: 'doc-3',
      name: 'Dra. Claudia Rivas',
      specialty: 'Endodoncia & Cirugía Apical',
      consultorio: 'Consultorio 3',
      consultorioNum: 3,
      initials: 'CR',
      color: '#7c3aed', // Purple
      citasCount: 2,
      status: 'En preparación',
      statusType: 'prep'
    },
    {
      id: 'doc-4',
      name: 'Dr. Marcos Pineda',
      specialty: 'Implantología & Periodoncia',
      consultorio: 'Consultorio 4',
      consultorioNum: 4,
      initials: 'MP',
      color: '#059669', // Emerald
      citasCount: 1,
      status: 'En procedimiento',
      statusType: 'busy'
    }
  ]

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Panel Principal</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="cadra-page-title mb-0">Inicio</h1>
        <span className="text-xs text-secondary font-medium hidden sm:inline-flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-light">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistema Clínico Activo · Sede Principal
        </span>
      </div>

      {/* 1. Hero Welcome Card (Tarjeta Principal) */}
      <div className="dashboard-hero-card-full">
        {/* Fecha en español */}
        <div className="welcome-date-header flex items-center gap-2">
          <Calendar size={13} className="text-[#A94384]" />
          <span>MIÉRCOLES, 11 DE NOVIEMBRE DE 2026</span>
        </div>

        {/* Saludo dinámico al usuario o especialista */}
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="welcome-greeting-title">Buenos días, {userGreetingName}.</h2>
          {user?.role === 'doctor' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${user.avatarColor}18`,
                color: user.avatarColor,
                border: `1px solid ${user.avatarColor}35`,
              }}
            >
              <Stethoscope size={13} />
              <span>{user.specialty} · {user.consultorio}</span>
            </span>
          )}
          {user?.role === 'admin' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#A94384]/10 text-[#A94384] border border-[#A94384]/20"
            >
              <Crown size={13} />
              <span>Dirección Médica & Administrativa</span>
            </span>
          )}
        </div>

        {/* Resumen claro del día */}
        <p className="welcome-summary-text">
          <strong>
            <AnimatedCounter value={8} /> citas programadas hoy
          </strong>{' '}
          (4 atendidas, 4 pendientes),{' '}
          <strong>
            <AnimatedCounter value="$4.250.000" /> COP
          </strong>{' '}
          en cobros proyectados, y{' '}
          <span
            className="text-red-600 font-semibold cursor-pointer underline decoration-red-300 hover:text-red-700 transition-colors inline-flex items-center gap-1"
            onClick={() => onNavigate('/stock')}
            title="Ver insumo en Stock"
          >
            <AlertTriangle size={14} className="inline text-red-500" />
            1 insumo crítico bajo stock (Anestesia Scandonest)
          </span>
          .
        </p>

        {/* Botones de acción directa */}
        <div className="welcome-action-buttons">
          <button
            className="cadra-btn-primary"
            onClick={() => onNavigate('/agenda')}
            title="Crear nueva cita en la agenda"
          >
            <Plus size={15} />
            <span>+ Nueva Cita</span>
          </button>

          <button
            className="cadra-btn-secondary"
            onClick={() => onNavigate('/agenda')}
            title="Abrir la agenda completa"
          >
            <Calendar size={15} />
            <span>🗓️ Ver Agenda de Citas</span>
          </button>

          <button
            className="cadra-btn-secondary"
            onClick={() => onNavigate('/pagos')}
            title="Registrar nuevo cobro o factura"
          >
            <CreditCard size={15} />
            <span>💳 Registrar Cobro</span>
          </button>

          <button
            className="cadra-btn-secondary"
            onClick={() => onNavigate('/pacientes')}
            title="Buscar o gestionar pacientes"
          >
            <Users size={15} />
            <span>👤 Pacientes</span>
          </button>
        </div>

        {/* 3 Métricas Rápidas en el pie de la tarjeta */}
        <div className="dashboard-quick-metrics-bar">
          <div className="dashboard-quick-metric-item">
            <div className="quick-metric-icon-wrap metric-emerald">
              <CheckCircle2 size={20} />
            </div>
            <div className="quick-metric-info">
              <span className="quick-metric-label">Puntualidad en citas</span>
              <span className="quick-metric-val">
                <AnimatedCounter value="98%" />
              </span>
            </div>
          </div>

          <div className="dashboard-quick-metric-item">
            <div className="quick-metric-icon-wrap metric-magenta">
              <Building2 size={20} />
            </div>
            <div className="quick-metric-info">
              <span className="quick-metric-label">Consultorios disponibles</span>
              <span className="quick-metric-val">4 de 4</span>
            </div>
          </div>

          <div className="dashboard-quick-metric-item">
            <div className="quick-metric-icon-wrap metric-blue">
              <Clock size={20} />
            </div>
            <div className="quick-metric-info">
              <span className="quick-metric-label">Tiempo promedio por cita</span>
              <span className="quick-metric-val">45 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 Tarjetas KPI Clínicas */}
      <div className="cadra-kpi-grid-4 mt-4">
        {/* Card 1: Citas de Hoy */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#A94384]">
                <Calendar size={15} />
              </div>
              <span className="kpi-label">Citas de Hoy</span>
            </div>
            <span className="cadra-tag-pill tag-green text-[10.5px]">Hoy</span>
          </div>
          <div className="kpi-main-number mt-2">
            <AnimatedCounter value={8} duration={650} delay={100} />{' '}
            <span className="text-sm font-semibold text-secondary">citas</span>
          </div>
          <div className="kpi-sub-spark-row mt-2">
            <span className="kpi-subtext text-xs text-secondary">
              <strong className="text-emerald-600">4</strong> realizadas ·{' '}
              <strong className="text-blue-600">2</strong> en atención ·{' '}
              <strong className="text-amber-600">2</strong> pendientes
            </span>
          </div>
        </div>

        {/* Card 2: Pacientes Activos del Mes */}
        <div className="cadra-kpi-card kpi-card-blue">
          <div className="kpi-card-top flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#A94384] bg-opacity-15 flex items-center justify-center text-[#A94384]">
                <Users size={15} />
              </div>
              <span className="kpi-label">Pacientes Activos del Mes</span>
            </div>
            <span className="cadra-tag-pill tag-blue text-[10.5px]">Nov 2026</span>
          </div>
          <div className="kpi-main-number mt-2">
            <AnimatedCounter value="142" duration={700} delay={150} />{' '}
            <span className="text-sm font-semibold text-secondary">pacientes</span>
          </div>
          <div className="kpi-sub-spark-row mt-2">
            <span className="kpi-subtext text-emerald-700 text-xs flex items-center gap-1 font-semibold">
              <TrendingUp size={13} />
              +14% vs mes anterior
            </span>
          </div>
        </div>

        {/* Card 3: Facturación del Mes */}
        <div className="cadra-kpi-card kpi-card-dark">
          <div className="kpi-card-top flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 bg-opacity-20 flex items-center justify-center text-emerald-400">
                <DollarSign size={15} />
              </div>
              <span className="kpi-label text-gray-300">Facturación del Mes</span>
            </div>
            <span className="cadra-tag-pill tag-green text-[10.5px]">COP</span>
          </div>
          <div className="kpi-main-number mt-2 text-white">
            <AnimatedCounter value="$48.500.000" duration={800} delay={200} />
            <span className="text-xs font-normal text-gray-300 ml-1">COP</span>
          </div>
          <div className="kpi-sub-spark-row mt-2">
            <span className="kpi-subtext text-gray-300 text-xs">
              <TrendingUp size={13} className="inline mr-1 text-emerald-400" />
              Ritmo de facturación constante
            </span>
          </div>
        </div>

        {/* Card 4: Tasa de Aceptación de Tratamientos */}
        <div className="cadra-kpi-card kpi-card-light">
          <div className="kpi-card-top flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={15} />
              </div>
              <span className="kpi-label">Aceptación de Tratamientos</span>
            </div>
            <span className="cadra-tag-pill tag-green text-[10.5px]">88%</span>
          </div>
          <div className="kpi-main-number mt-2">
            <AnimatedCounter value="88%" duration={650} delay={250} />
          </div>
          <div className="kpi-sub-spark-row mt-2">
            <span className="kpi-subtext text-emerald-700 text-xs font-semibold">
              28 de 32 presupuestos aceptados
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sección Principal en 2 Columnas */}
      <div className="dashboard-clinical-split-grid">
        {/* Columna Izquierda: Próximas Citas de Hoy */}
        <div className="cadra-card">
          <div className="chart-card-header mb-3">
            <div className="chart-title-group">
              <Calendar size={18} className="text-[#A94384]" />
              <h3 className="text-base font-bold text-main">Próximas Citas de Hoy</h3>
              <span className="cadra-tag-pill tag-neutral text-[11px] ml-1">
                5 citas programadas
              </span>
            </div>
            <button
              className="cadra-link-btn"
              onClick={() => onNavigate('/agenda')}
              title="Abrir la agenda clínica"
            >
              <span>Ver Agenda Completa</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <p className="text-xs text-secondary mb-3">
            Pacientes asignados a los consultorios para el transcurso de hoy. Haz clic en "Ver Cita" para acceder a la ficha y detalles clínicos.
          </p>

          <div className="flex flex-col">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="dental-appointment-row">
                {/* Horario */}
                <div className="dental-time-badge">
                  <span className="text-sm font-extrabold text-main">{apt.time}</span>
                  <span className="text-[10px] text-muted font-bold">{apt.period}</span>
                </div>

                {/* Detalle Paciente y Tratamiento */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-bold text-sm text-main truncate hover:text-[#A94384] transition-colors cursor-pointer"
                      onClick={() => onNavigate('/agenda')}
                    >
                      {apt.patient}
                    </span>
                    <span className="text-xs text-[#8A8A8F] hidden sm:inline">·</span>
                    <span className="text-xs font-semibold text-[#A94384] bg-pink-50 dark:bg-pink-950 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-900">
                      {apt.treatment}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                    <span className="font-medium text-main">{apt.doctor}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                      <Building2 size={11} className="text-[#8A8A8F]" />
                      {apt.consultorio}
                    </span>
                  </div>
                </div>

                {/* Estado y Acción */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {apt.status === 'En atención' && (
                    <span className="cadra-tag-pill tag-green flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      En atención
                    </span>
                  )}
                  {apt.status === 'Confirmada' && (
                    <span className="cadra-tag-pill tag-blue">
                      Confirmada
                    </span>
                  )}
                  {apt.status === 'Pendiente' && (
                    <span className="cadra-tag-pill tag-neutral text-amber-700 bg-amber-50 border border-amber-200">
                      Pendiente
                    </span>
                  )}

                  <button
                    className="cadra-btn-secondary small"
                    onClick={() => onNavigate('/agenda')}
                    title={`Ver detalles de la cita de ${apt.patient}`}
                  >
                    <span>Ver Cita</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link button to agenda */}
          <div className="pt-2 text-right">
            <button
              className="cadra-btn-secondary small w-full justify-center"
              onClick={() => onNavigate('/agenda')}
            >
              <Calendar size={13} />
              <span>Gestionar todas las citas en Agenda</span>
            </button>
          </div>
        </div>

        {/* Columna Derecha: Insumos Críticos + Cobros Recientes */}
        <div className="dental-side-panel-stack">
          {/* Tarjeta: Insumos Odontológicos Críticos */}
          <div className="cadra-card">
            <div className="chart-card-header mb-2">
              <div className="chart-title-group">
                <AlertTriangle size={17} className="text-amber-500" />
                <h3 className="text-base font-bold text-main">Insumos Odontológicos Críticos</h3>
              </div>
              <button
                className="cadra-btn-secondary small"
                onClick={() => onNavigate('/stock')}
                title="Ir al módulo de stock"
              >
                <Package size={13} />
                <span>Ir a Stock</span>
              </button>
            </div>

            <p className="text-xs text-secondary mb-3">
              Monitoreo de insumos de consultorio con nivel de stock bajo o reorden recomendado.
            </p>

            <div className="flex flex-col">
              {criticalStockItems.map((item) => (
                <div key={item.id} className="dental-stock-item-row">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-main truncate pr-2">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.level === 'critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300'
                            : item.level === 'warning'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {item.badgeText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-secondary mb-1.5">
                      <span className="truncate text-muted">{item.detail}</span>
                      <strong className={`font-bold ml-1 ${item.level === 'critical' ? 'text-red-600' : 'text-main'}`}>
                        {item.stock}
                      </strong>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-container rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.level === 'critical'
                            ? 'bg-red-500'
                            : item.level === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="cadra-btn-secondary small w-full justify-center mt-1"
              onClick={() => onNavigate('/stock')}
            >
              <span>Ir a Inventario de Stock</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          {/* Tarjeta: Cobros Recientes en Caja */}
          <div className="cadra-card">
            <div className="chart-card-header mb-2">
              <div className="chart-title-group">
                <CreditCard size={17} className="text-[#A94384]" />
                <h3 className="text-base font-bold text-main">Cobros Recientes en Caja</h3>
              </div>
              <button
                className="cadra-link-btn"
                onClick={() => onNavigate('/pagos')}
                title="Ver lista de cobros y facturas"
              >
                <span>Ir a Pagos</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <p className="text-xs text-secondary mb-3">
              Ingresos registrados hoy por atención en caja y recepción.
            </p>

            <div className="flex flex-col">
              {recentPayments.map((pay) => (
                <div key={pay.id} className="dental-payment-row">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold text-main truncate hover:text-[#A94384] transition-colors cursor-pointer"
                        onClick={() => onNavigate('/pagos')}
                      >
                        {pay.patient}
                      </span>
                      <span className="text-xs font-extrabold text-[#A94384]">
                        {pay.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-secondary mt-0.5">
                      <span className="text-muted truncate">{pay.treatment}</span>
                      <span className="bg-container px-2 py-0.5 rounded text-[10px] font-semibold text-secondary ml-1 flex-shrink-0">
                        {pay.method}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-light flex items-center justify-between text-xs">
              <span className="text-secondary font-medium">Recaudado hoy en caja:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                $2.550.000 COP
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Especialistas en Turno */}
      <div className="cadra-card mt-4">
        <div className="chart-card-header mb-1">
          <div className="chart-title-group">
            <Stethoscope size={18} className="text-[#A94384]" />
            <h3 className="text-base font-bold text-main">Especialistas en Turno Hoy</h3>
            <span className="cadra-tag-pill tag-green text-[11px] ml-1">
              4 Consultorios en Servicio
            </span>
          </div>
          <button
            className="cadra-link-btn"
            onClick={() => onNavigate('/agenda')}
            title="Ver agenda de los consultorios"
          >
            <span>Ver Agenda de Consultorios</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <p className="text-xs text-secondary mb-3">
          Odontólogos titulares activos en la jornada con consultorio asignado y carga de citas programadas.
        </p>

        <div className="specialists-roster-grid">
          {specialists.map((doc) => (
            <div key={doc.id} className="specialist-card-item">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm flex-shrink-0"
                  style={{ backgroundColor: doc.color }}
                >
                  {doc.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-main truncate">{doc.name}</h4>
                  <p className="text-[11.5px] text-muted truncate">{doc.specialty}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-light text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-[#A94384] bg-pink-50 dark:bg-pink-950 px-2 py-0.5 rounded-md border border-pink-100 dark:border-pink-900">
                  <Building2 size={12} />
                  {doc.consultorio}
                </span>

                <span className="text-secondary font-medium">
                  <strong>{doc.citasCount}</strong> {doc.citasCount === 1 ? 'cita' : 'citas'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted">Estado actual:</span>
                {doc.statusType === 'available' && (
                  <span className="cadra-tag-pill tag-green text-[10.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {doc.status}
                  </span>
                )}
                {doc.statusType === 'busy' && (
                  <span className="cadra-tag-pill tag-blue text-[10.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {doc.status}
                  </span>
                )}
                {doc.statusType === 'prep' && (
                  <span className="cadra-tag-pill tag-neutral text-[10.5px] text-purple-700 bg-purple-50 border border-purple-200">
                    {doc.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

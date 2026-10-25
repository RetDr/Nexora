// src/config/clinic.config.ts
// Configuración centralizada de VitaDent Clínica Odontológica

export interface ClinicDoctor {
  id: string
  name: string
  specialty: string
  commissionPct: number
  color: string
}

export interface ClinicTreatment {
  code: string
  name: string
  category: 'Diagnóstico' | 'Higiene' | 'Conservadora' | 'Endodoncia' | 'Implantología' | 'Ortodoncia' | 'Estética' | 'Cirugía'
  durationMin: number
  priceCop: number
}

export interface ClinicConfig {
  name: string
  subtitle: string
  taxId: string // RUT
  currency: {
    code: string
    symbol: string
    locale: string
  }
  taxRate: number
  schedule: {
    weekday: string
    saturday: string
    intervalMinutes: number
  }
  branding: {
    primaryColor: string     // Magenta/Púrpura del logo (#A94384)
    primaryHover: string     // (#8E356E)
    secondaryColor: string   // Gris metálico del logo (#8A8A8F / #98989A)
    bgLight: string          // Blanco clínico (#f8fafc)
    bgDark: string           // (#121214)
    logoPath: string
    symbolPath: string
  }
  navigation: Array<{
    key: string
    label: string
    path: string
    badge?: number
  }>
  doctors: ClinicDoctor[]
  treatments: ClinicTreatment[]
  criticalStock: string[]
  paymentMethods: string[]
  insurances: string[]
}

export const vitadentConfig: ClinicConfig = {
  name: 'VitaDent',
  subtitle: 'clínica odontológica',
  taxId: 'RUT',
  currency: {
    code: 'COP',
    symbol: '$',
    locale: 'es-CO',
  },
  taxRate: 0.0, // Exento por salud
  schedule: {
    weekday: '8:00 AM – 7:00 PM',
    saturday: '8:00 AM – 2:00 PM',
    intervalMinutes: 30,
  },
  branding: {
    primaryColor: '#A94384',
    primaryHover: '#8E356E',
    secondaryColor: '#8A8A8F',
    bgLight: '#f8fafc',
    bgDark: '#121214',
    logoPath: '/logo_vitadent.png',
    symbolPath: '/vitadent_symbol.png',
    logoHorizontalPath: '/Logo_Horizontal.png',
  },
  admin: {
    name: 'Nathalia Leon',
    role: 'Administradora General',
    initials: 'NL',
    email: 'administracion@vitadent.com.co',
    phone: '+57 311 405 2910',
  },
  navigation: [
    { key: 'inicio', label: 'Inicio', path: '/inicio' },
    { key: 'agenda', label: 'Agenda', path: '/agenda', badge: 4 },
    { key: 'pacientes', label: 'Pacientes', path: '/pacientes' },
    { key: 'pagos', label: 'Pagos', path: '/pagos', badge: 2 },
    { key: 'presupuestos', label: 'Presupuestos', path: '/presupuestos', badge: 5 },
    { key: 'stock', label: 'Stock', path: '/stock', badge: 1 },
    { key: 'precios', label: 'Precios', path: '/precios' },
    { key: 'informes', label: 'Informes', path: '/informes' },
  ],
  doctors: [
    { id: 'doc-1', name: 'Dra. Sofía Valenzuela', specialty: 'Odontología General', commissionPct: 35, color: '#A94384' },
    { id: 'doc-2', name: 'Dr. Alejandro Soto', specialty: 'Ortodoncia', commissionPct: 40, color: '#0284c7' },
    { id: 'doc-3', name: 'Dra. Claudia Rivas', specialty: 'Endodoncia', commissionPct: 40, color: '#0d9488' },
    { id: 'doc-4', name: 'Dr. Marcos Pineda', specialty: 'Cirugía e Implantes', commissionPct: 40, color: '#c2410c' },
  ],
  treatments: [
    { code: 'T-01', name: 'Primera consulta + Diagnóstico', category: 'Diagnóstico', durationMin: 30, priceCop: 50000 },
    { code: 'T-02', name: 'Limpieza dental ultrasonido', category: 'Higiene', durationMin: 45, priceCop: 90000 },
    { code: 'T-03', name: 'Empaste / Obturación composite', category: 'Conservadora', durationMin: 45, priceCop: 120000 },
    { code: 'T-04', name: 'Endodoncia unirradicular', category: 'Endodoncia', durationMin: 60, priceCop: 350000 },
    { code: 'T-05', name: 'Implante de titanio + corona', category: 'Implantología', durationMin: 90, priceCop: 2500000 },
    { code: 'T-06', name: 'Ortodoncia (mensualidad)', category: 'Ortodoncia', durationMin: 30, priceCop: 100000 },
    { code: 'T-07', name: 'Blanqueamiento dental LED', category: 'Estética', durationMin: 60, priceCop: 300000 },
    { code: 'T-08', name: 'Extracción quirúrgica (cordal)', category: 'Cirugía', durationMin: 45, priceCop: 250000 },
  ],
  criticalStock: [
    'Anestesia con vasoconstrictor',
    'Composite estético',
    'Guantes de nitrilo y mascarillas quirúrgicas',
    'Cajas de implantes y aditamentos protésicos',
    'Brackets y arcos de ortodoncia',
  ],
  paymentMethods: [
    'Efectivo',
    'Tarjeta de Crédito / Débito',
    'Transferencia bancaria (Nequi / Bancolombia)',
  ],
  insurances: [
    'Particulares',
    'Sura',
    'Colsanitas',
  ],
}


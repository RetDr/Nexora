import React, { useState, useMemo } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  Clock,
  Sparkles,
  X,
  Phone,
  Mail,
  FileText,
  User,
  CheckCircle2,
  Trash2,
  Edit3,
  CalendarClock,
  Filter,
  Check,
  AlertCircle,
  Stethoscope,
  RefreshCw,
  Search
} from 'lucide-react'

export interface ClinicalAppointment {
  id: string
  patientName: string
  patientId: string // CC
  patientPhone: string
  patientEmail: string
  doctorName: string
  doctorSpecialty: string
  doctorColor: string
  doctorId: string
  doctorInitials: string
  treatment: string
  category: 'General' | 'Ortodoncia' | 'Endodoncia' | 'Cirugía' | 'Higiene'
  categoryLabel: string
  categoryColor: string
  dayIndex: number // 0 = LUN, 1 = MAR, 2 = MIÉ, 3 = JUE, 4 = VIE, 5 = SÁB, 6 = DOM
  dateStr: string
  dayNum: number
  startHour: number // e.g. 8.5 for 8:30 AM
  durationHours: number // e.g. 1.5
  timeFormatted: string
  box: string // "Sillón 1", "Sillón 2", etc.
  status: 'Confirmada' | 'En atención' | 'Realizada' | 'Pendiente' | 'Cancelada'
  notes?: string
}

interface SchedulingPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

// Initial clinical appointments for VitaDent
const INITIAL_APPOINTMENTS: ClinicalAppointment[] = [
  // LUNES 9
  {
    id: 'apt-1',
    patientName: 'Carlos García Restrepo',
    patientId: 'CC 1.028.455.912',
    patientPhone: '+57 312 450 8921',
    patientEmail: 'carlos.garcia@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Limpieza Ultrasonido y Profilaxis Fluorada',
    category: 'Higiene',
    categoryLabel: 'Higiene & Prevención',
    categoryColor: '#10b981',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 8.0,
    durationHours: 1.5,
    timeFormatted: '8:00 AM – 9:30 AM',
    box: 'Sillón 1',
    status: 'Realizada',
    notes: 'Sensibilidad dental leve en cuello de molares inferiores. Se aplicó barniz de flúor Duraphat 5%.'
  },
  {
    id: 'apt-2',
    patientName: 'Laura Gómez Cárdenas',
    patientId: 'CC 1.032.889.102',
    patientPhone: '+57 315 220 1144',
    patientEmail: 'laura.gomez@hotmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Cambio de Arcos NiTi 0.016 y Ligaduras',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 10.0,
    durationHours: 1.5,
    timeFormatted: '10:00 AM – 11:30 AM',
    box: 'Sillón 2',
    status: 'Realizada',
    notes: 'Excelente higiene. Próximo control en 4 semanas para avance a arco de acero rectangular.'
  },
  {
    id: 'apt-3',
    patientName: 'Mateo Fernández Quintero',
    patientId: 'CC 1.019.340.551',
    patientPhone: '+57 318 901 2345',
    patientEmail: 'mateo.fernandez@yahoo.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Cirugía & Implantes',
    doctorColor: '#ea580c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Colocación Implante Straumann BLX 4.0mm',
    category: 'Cirugía',
    categoryLabel: 'Cirugía & Implantes',
    categoryColor: '#ea580c',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 14.0,
    durationHours: 2.0,
    timeFormatted: '2:00 PM – 4:00 PM',
    box: 'Sillón 4',
    status: 'Realizada',
    notes: 'Torque de inserción primario óptimo (35 Ncm). Se prescribió amoxicilina 875mg y ketoprofeno.'
  },
  {
    id: 'apt-4',
    patientName: 'María Paula Duque',
    patientId: 'CC 1.020.771.839',
    patientPhone: '+57 310 882 9901',
    patientEmail: 'mpauladuque@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Restauración Estética Resina Filtek 3M',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Sillón 1',
    status: 'Realizada',
    notes: 'Reconstrucción de cúspide distovestibular pieza 16. Oclusión y puntos de contacto anatómicos verificados.'
  },

  // MARTES 10
  {
    id: 'apt-5',
    patientName: 'Andrés Mendoza Londoño',
    patientId: 'CC 1.017.654.321',
    patientPhone: '+57 314 555 7820',
    patientEmail: 'andres.mendoza@outlook.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Endodoncia',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Conductometría y Limas Rotatorias Mtwo',
    category: 'Endodoncia',
    categoryLabel: 'Endodoncia',
    categoryColor: '#0d9488',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 9.0,
    durationHours: 1.5,
    timeFormatted: '9:00 AM – 10:30 AM',
    box: 'Sillón 3',
    status: 'Realizada',
    notes: 'Pieza 24 conducto permeable. Longitud de trabajo 21mm. Medicación intraconducto hidróxido de calcio.'
  },
  {
    id: 'apt-6',
    patientName: 'Felipe Castro Morales',
    patientId: 'CC 1.030.912.448',
    patientPhone: '+57 320 441 5590',
    patientEmail: 'felipe.castro@empresa.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Cementado Brackets MBT 0.022 Superior',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 11.0,
    durationHours: 1.5,
    timeFormatted: '11:00 AM – 12:30 PM',
    box: 'Sillón 2',
    status: 'Realizada',
    notes: 'Grabado y adhesión con Transbond XT. Instrucciones detalladas de cepillado interproximal.'
  },
  {
    id: 'apt-7',
    patientName: 'Camilo Rincón Prieto',
    patientId: 'CC 1.022.667.112',
    patientPhone: '+57 316 778 3344',
    patientEmail: 'camilo.rincon@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Cirugía & Implantes',
    doctorColor: '#ea580c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Control Postquirúrgico y Retiro Sutura',
    category: 'Cirugía',
    categoryLabel: 'Cirugía & Implantes',
    categoryColor: '#ea580c',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 15.0,
    durationHours: 1.0,
    timeFormatted: '3:00 PM – 4:00 PM',
    box: 'Sillón 4',
    status: 'Realizada',
    notes: 'Cicatrización gingival de primera intención. Sin signos de inflamación ni edema.'
  },
  {
    id: 'apt-8',
    patientName: 'Diana Marcela Gómez',
    patientId: 'CC 1.015.443.990',
    patientPhone: '+57 311 234 5678',
    patientEmail: 'diana.gomez@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Carillas Cerámicas Disilicato Prueba Bisel',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Sillón 1',
    status: 'Realizada',
    notes: 'Ajuste marginal de carillas 11, 12, 21 y 22. Color BL2 aprobado con satisfacción por la paciente.'
  },

  // MIÉRCOLES 11 (HOY)
  {
    id: 'apt-9',
    patientName: 'Juliana Pardo Ramos',
    patientId: 'CC 1.026.883.210',
    patientPhone: '+57 300 456 7890',
    patientEmail: 'juliana.pardo@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Cirugía & Implantes',
    doctorColor: '#ea580c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Extracción Quirúrgica Cordales 38 y 48',
    category: 'Cirugía',
    categoryLabel: 'Cirugía & Implantes',
    categoryColor: '#ea580c',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Sillón 4',
    status: 'Realizada',
    notes: 'Odontosección limpia cordal 48 retenida. Sutura seda 3-0. Hemostasia y recuperación inmediata.'
  },
  {
    id: 'apt-10',
    patientName: 'Mariana Torres Valencia',
    patientId: 'CC 1.033.441.229',
    patientPhone: '+57 317 654 9911',
    patientEmail: 'mariana.torres@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Estratificación 4 Carillas Estéticas',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Sillón 1',
    status: 'En atención',
    notes: 'Estratificación de esmalte y dentina opalescente. Paciente en sillón con aislamiento absoluto dique de goma.'
  },
  {
    id: 'apt-11',
    patientName: 'Santiago Beltrán Castro',
    patientId: 'CC 1.018.776.324',
    patientPhone: '+57 313 890 1234',
    patientEmail: 'santiago.beltran@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Higiene Profunda y Curetaje Subgingival',
    category: 'Higiene',
    categoryLabel: 'Higiene & Prevención',
    categoryColor: '#10b981',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 13.0,
    durationHours: 1.0,
    timeFormatted: '1:00 PM – 2:00 PM',
    box: 'Sillón 1',
    status: 'Confirmada',
    notes: 'Sondeo periodontal con bolsas de 4mm en sextante 5. Requiere profilaxis de mantenimiento con ultrasonido.'
  },
  {
    id: 'apt-12',
    patientName: 'Valentina Ríos Botero',
    patientId: 'CC 1.029.112.873',
    patientPhone: '+57 319 012 3456',
    patientEmail: 'valentina.rios@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Blanqueamiento Dental LED Sesión 2',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 14.5,
    durationHours: 1.5,
    timeFormatted: '2:30 PM – 4:00 PM',
    box: 'Sillón 1',
    status: 'Confirmada',
    notes: 'Peróxido de hidrógeno al 35%. Aplicación de barrera gingival fotopolimerizable OpalDam.'
  },
  {
    id: 'apt-13',
    patientName: 'Samuel Ortiz Ospina',
    patientId: 'CC 1.031.556.789',
    patientPhone: '+57 301 234 5678',
    patientEmail: 'samuel.ortiz@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Ajuste y Control Ortodoncia Invisible',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Sillón 2',
    status: 'Confirmada',
    notes: 'Entrega alineadores serie #12 al #16. Stripping interproximal en 32 y 42 según planificación digital.'
  },

  // JUEVES 12
  {
    id: 'apt-14',
    patientName: 'Patricia Henao Zuluaga',
    patientId: 'CC 1.014.332.901',
    patientPhone: '+57 316 123 4567',
    patientEmail: 'patricia.henao@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Endodoncia',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Obturación Gutapercha Caliente System B',
    category: 'Endodoncia',
    categoryLabel: 'Endodoncia',
    categoryColor: '#0d9488',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Sillón 3',
    status: 'Confirmada',
    notes: 'Sellado tridimensional conducto distal molar 46 con cemento biocerámico AH Plus.'
  },
  {
    id: 'apt-15',
    patientName: 'Daniela Roldán Vélez',
    patientId: 'CC 1.025.774.119',
    patientPhone: '+57 312 998 8776',
    patientEmail: 'daniela.roldan@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Toma de Registros Escáner Intraoral 3D',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Sillón 2',
    status: 'Confirmada',
    notes: 'Escaneo de arcadas completas para diseño de ortodoncia lingual y set-up virtual 3D.'
  },
  {
    id: 'apt-16',
    patientName: 'Nicolás Vega Salazar',
    patientId: 'CC 1.019.223.445',
    patientPhone: '+57 314 887 6655',
    patientEmail: 'nicolas.vega@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Reconstrucción de Muñón Pre-Corona',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 14.0,
    durationHours: 1.5,
    timeFormatted: '2:00 PM – 3:30 PM',
    box: 'Sillón 1',
    status: 'Confirmada',
    notes: 'Poste de fibra de vidrio cementado en conducto palatino. Reconstrucción con resina Core.'
  },
  {
    id: 'apt-17',
    patientName: 'Esteban Cárdenas Gil',
    patientId: 'CC 1.028.990.334',
    patientPhone: '+57 318 443 2211',
    patientEmail: 'esteban.cardenas@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Cirugía & Implantes',
    doctorColor: '#ea580c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Cirugía Guiada Implante Primer Molar',
    category: 'Cirugía',
    categoryLabel: 'Cirugía & Implantes',
    categoryColor: '#ea580c',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 16.0,
    durationHours: 1.5,
    timeFormatted: '4:00 PM – 5:30 PM',
    box: 'Sillón 4',
    status: 'Pendiente',
    notes: 'Férula quirúrgica esterilizada lista. Kit quirúrgico guiado Straumann BLX preparado.'
  },

  // VIERNES 13
  {
    id: 'apt-18',
    patientName: 'Claudia Restrepo Villegas',
    patientId: 'CC 1.016.554.887',
    patientPhone: '+57 315 667 8899',
    patientEmail: 'claudia.restrepo@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Destartraje Supragingival y Flúor',
    category: 'Higiene',
    categoryLabel: 'Higiene & Prevención',
    categoryColor: '#10b981',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 9.0,
    durationHours: 1.5,
    timeFormatted: '9:00 AM – 10:30 AM',
    box: 'Sillón 1',
    status: 'Confirmada',
    notes: 'Mantenimiento semestral programado. Refuerzo de técnica de cepillado Bass modificada.'
  },
  {
    id: 'apt-19',
    patientName: 'Roberto Mejía Correa',
    patientId: 'CC 1.023.445.667',
    patientPhone: '+57 320 112 3344',
    patientEmail: 'roberto.mejia@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Endodoncia',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Retratamiento Conducto Molar Superior',
    category: 'Endodoncia',
    categoryLabel: 'Endodoncia',
    categoryColor: '#0d9488',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 11.0,
    durationHours: 1.5,
    timeFormatted: '11:00 AM – 12:30 PM',
    box: 'Sillón 3',
    status: 'Pendiente',
    notes: 'Desobturación con solvente de gutapercha y magnificación microscópica.'
  },
  {
    id: 'apt-20',
    patientName: 'Lucía Ospina Marín',
    patientId: 'CC 1.034.221.998',
    patientPhone: '+57 311 998 7766',
    patientEmail: 'lucia.ospina@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Instalación Arco Transpalatino de Anclaje',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 14.5,
    durationHours: 1.5,
    timeFormatted: '2:30 PM – 4:00 PM',
    box: 'Sillón 2',
    status: 'Confirmada',
    notes: 'Adaptación bandas molares 16 y 26 cementadas con ionómero de vidrio GC Fuji I.'
  },
  {
    id: 'apt-21',
    patientName: 'Gonzalo Morales Tamayo',
    patientId: 'CC 1.012.334.556',
    patientPhone: '+57 317 334 5566',
    patientEmail: 'gonzalo.morales@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Cirugía & Implantes',
    doctorColor: '#ea580c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Elevación de Seno Maxilar con Injerto Óseo',
    category: 'Cirugía',
    categoryLabel: 'Cirugía & Implantes',
    categoryColor: '#ea580c',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Sillón 4',
    status: 'Pendiente',
    notes: 'Bio-Oss 0.5g y membrana de colágeno Bio-Gide preparados en quirófano ambulatorio.'
  },

  // SÁBADO 14
  {
    id: 'apt-22',
    patientName: 'Tatiana Salgado Ruiz',
    patientId: 'CC 1.027.665.443',
    patientPhone: '+57 310 554 3322',
    patientEmail: 'tatiana.salgado@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Diseño de Sonrisa Consulta Diagnóstica',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Sillón 1',
    status: 'Confirmada',
    notes: 'Fotografía clínica digital intra y extraoral, encerado digital y mock-up.'
  },
  {
    id: 'apt-23',
    patientName: 'David Quintero Barrientos',
    patientId: 'CC 1.018.990.223',
    patientPhone: '+57 313 445 6677',
    patientEmail: 'david.quintero@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Colocación Microtornillos Ortodónticos',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia',
    categoryColor: '#0284c7',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Sillón 2',
    status: 'Confirmada',
    notes: 'Anclaje esquelético interradicular entre 15 y 16 para intrusión de molar superior.'
  },
  {
    id: 'apt-24',
    patientName: 'Natalia Arango Echeverri',
    patientId: 'CC 1.029.443.112',
    patientPhone: '+57 316 778 9900',
    patientEmail: 'natalia.arango@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General & Estética',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Control y Pulido de Carillas Composite',
    category: 'General',
    categoryLabel: 'Odontología General & Estética',
    categoryColor: '#A94384',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 12.5,
    durationHours: 1.0,
    timeFormatted: '12:30 PM – 1:30 PM',
    box: 'Sillón 1',
    status: 'Pendiente',
    notes: 'Discos Sof-Lex abrasivos y pasta diamantada de alto brillo Prisma Gloss.'
  },

  // DOMINGO 15
  {
    id: 'apt-25',
    patientName: 'Valeria Monsalve Jaramillo',
    patientId: 'CC 1.035.882.119',
    patientPhone: '+57 314 667 2288',
    patientEmail: 'valeria.monsalve@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Endodoncia',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Urgencia Dolor Agudo Pulpar y Apertura',
    category: 'Endodoncia',
    categoryLabel: 'Endodoncia',
    categoryColor: '#0d9488',
    dayIndex: 6,
    dateStr: 'Dom 15 Nov',
    dayNum: 15,
    startHour: 10.0,
    durationHours: 1.5,
    timeFormatted: '10:00 AM – 11:30 AM',
    box: 'Sillón 3',
    status: 'Realizada',
    notes: 'Guardia dominical de urgencias odontológicas. Biopulpectomía de emergencia pieza 36.'
  }
]

// Specialty Color Guide definition as requested
const SPECIALTY_GUIDE = [
  {
    id: 'General',
    name: 'Odontología General & Estética',
    color: '#A94384',
    count: 6,
  },
  {
    id: 'Ortodoncia',
    name: 'Ortodoncia',
    color: '#0284c7',
    count: 5,
  },
  {
    id: 'Endodoncia',
    name: 'Endodoncia',
    color: '#0d9488',
    count: 4,
  },
  {
    id: 'Cirugía',
    name: 'Cirugía & Implantes',
    color: '#ea580c',
    count: 5,
  },
  {
    id: 'Higiene',
    name: 'Higiene & Prevención',
    color: '#10b981',
    count: 5,
  },
]

// Clinical Doctors List
const CLINIC_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dra. Sofía Valenzuela',
    specialty: 'Odontología General & Estética',
    initials: 'SV',
    color: '#A94384',
    activeCount: 11
  },
  {
    id: 'doc-2',
    name: 'Dr. Alejandro Soto',
    specialty: 'Ortodoncia',
    initials: 'AS',
    color: '#0284c7',
    activeCount: 5
  },
  {
    id: 'doc-3',
    name: 'Dra. Claudia Rivas',
    specialty: 'Endodoncia',
    initials: 'CR',
    color: '#0d9488',
    activeCount: 4
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcos Pineda',
    specialty: 'Cirugía & Implantes',
    initials: 'MP',
    color: '#ea580c',
    activeCount: 5
  }
]

const DAYS_HEADER = [
  { label: 'LUN', num: 9, isWeekend: false },
  { label: 'MAR', num: 10, isWeekend: false },
  { label: 'MIÉ', num: 11, isToday: true, isWeekend: false },
  { label: 'JUE', num: 12, isWeekend: false },
  { label: 'VIE', num: 13, isWeekend: false },
  { label: 'SÁB', num: 14, isWeekend: true },
  { label: 'DOM', num: 15, isWeekend: true },
]

const HOURS_AXIS = [
  { hour: 8, label: '8:00 AM' },
  { hour: 9, label: '9:00 AM' },
  { hour: 10, label: '10:00 AM' },
  { hour: 11, label: '11:00 AM' },
  { hour: 12, label: '12:00 PM' },
  { hour: 13, label: '1:00 PM' },
  { hour: 14, label: '2:00 PM' },
  { hour: 15, label: '3:00 PM' },
  { hour: 16, label: '4:00 PM' },
  { hour: 17, label: '5:00 PM' },
  { hour: 18, label: '6:00 PM' },
  { hour: 19, label: '7:00 PM' },
]

export const SchedulingPage: React.FC<SchedulingPageProps> = ({ onNavigate, onOpenCreate }) => {
  // Navigation & View Mode State
  const [rangeMode, setRangeMode] = useState<'Week' | 'Month' | 'Quarter'>('Week')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all')
  const [appointments, setAppointments] = useState<ClinicalAppointment[]>(INITIAL_APPOINTMENTS)
  
  // Drawer & Modal States
  const [selectedAppointment, setSelectedAppointment] = useState<ClinicalAppointment | null>(null)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  const [reassignTargetApt, setReassignTargetApt] = useState<ClinicalAppointment | null>(null)
  const [reassignBox, setReassignBox] = useState('Sillón 1')
  const [reassignDoctor, setReassignDoctor] = useState('doc-1')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 3200)
  }

  // Filter appointments according to selected doctor and category
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (selectedDoctorId !== 'all' && apt.doctorId !== selectedDoctorId) return false
      if (selectedCategory !== 'all' && apt.category !== selectedCategory) return false
      return true
    })
  }, [appointments, selectedDoctorId, selectedCategory])

  // Open drawer for appointment
  const handleOpenAppointment = (apt: ClinicalAppointment) => {
    setSelectedAppointment(apt)
    setTempNotes(apt.notes || '')
    setIsEditingNotes(false)
  }

  // Close drawer
  const handleCloseDrawer = () => {
    setSelectedAppointment(null)
    setIsEditingNotes(false)
  }

  // Update status directly from drawer
  const handleUpdateStatus = (newStatus: ClinicalAppointment['status']) => {
    if (!selectedAppointment) return
    const updated = { ...selectedAppointment, status: newStatus }
    setSelectedAppointment(updated)
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    showNotification(`Estado de la cita actualizado a: ${newStatus}`)
  }

  // Mark appointment as Completed
  const handleCompleteAppointment = () => {
    handleUpdateStatus('Realizada')
  }

  // Save notes
  const handleSaveNotes = () => {
    if (!selectedAppointment) return
    const updated = { ...selectedAppointment, notes: tempNotes }
    setSelectedAppointment(updated)
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setIsEditingNotes(false)
    showNotification('Notas clínicas guardadas con éxito')
  }

  // Cancel / Delete appointment
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return
    const confirmCancel = window.confirm(`¿Deseas cancelar la cita de ${selectedAppointment.patientName}?`)
    if (confirmCancel) {
      const updated = { ...selectedAppointment, status: 'Cancelada' as const }
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      setSelectedAppointment(null)
      showNotification(`Cita de ${updated.patientName} cancelada`)
    }
  }

  // Re-schedule appointment
  const handleReschedule = () => {
    if (!selectedAppointment) return
    setReassignTargetApt(selectedAppointment)
    setReassignBox(selectedAppointment.box)
    setReassignDoctor(selectedAppointment.doctorId)
    setIsReassignModalOpen(true)
  }

  // Execute Reassign
  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reassignTargetApt) return
    const doctorObj = CLINIC_DOCTORS.find((d) => d.id === reassignDoctor)
    const updated: ClinicalAppointment = {
      ...reassignTargetApt,
      box: reassignBox,
      doctorId: reassignDoctor,
      doctorName: doctorObj ? doctorObj.name : reassignTargetApt.doctorName,
      doctorSpecialty: doctorObj ? doctorObj.specialty : reassignTargetApt.doctorSpecialty,
      doctorColor: doctorObj ? doctorObj.color : reassignTargetApt.doctorColor,
      doctorInitials: doctorObj ? doctorObj.initials : reassignTargetApt.doctorInitials,
    }

    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    if (selectedAppointment && selectedAppointment.id === updated.id) {
      setSelectedAppointment(updated)
    }
    setIsReassignModalOpen(false)
    setReassignTargetApt(null)
    showNotification(`Turno reasignado con éxito a ${reassignBox} con ${updated.doctorName}`)
  }

  // Render Status Badge
  const renderStatusBadge = (status: ClinicalAppointment['status']) => {
    switch (status) {
      case 'En atención':
        return (
          <span className="apt-status-chip status-chip-en-atencion">
            <span className="live-pulse-dot" />
            <span>En atención</span>
          </span>
        )
      case 'Realizada':
        return (
          <span className="apt-status-chip status-chip-realizada">
            <Check size={10} />
            <span>Realizada</span>
          </span>
        )
      case 'Confirmada':
        return (
          <span className="apt-status-chip status-chip-confirmada">
            <CheckCircle2 size={10} />
            <span>Confirmada</span>
          </span>
        )
      case 'Pendiente':
      default:
        return (
          <span className="apt-status-chip status-chip-pendiente">
            <Clock size={10} />
            <span>Pendiente</span>
          </span>
        )
    }
  }

  // Get date range title based on view
  const getDateRangeLabel = () => {
    if (rangeMode === 'Week') return '9 Nov – 15 Nov, 2026'
    if (rangeMode === 'Month') return 'Noviembre 2026'
    return '4° Trimestre 2026 (Oct – Dic)'
  }

  return (
    <div className="cadra-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 999,
            backgroundColor: '#141517',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={16} color="#A94384" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs — Exactly as requested: VitaDent > Agenda > Citas Odontológicas */}
      <div className="cadra-breadcrumbs">
        <span>VitaDent</span>
        <span className="crumb-sep">&gt;</span>
        <span>Agenda</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Citas Odontológicas</span>
      </div>

      {/* Page Title & Top Actions */}
      <div className="cadra-page-header">
        <div className="page-header-left-col">
          <h1 className="cadra-page-title">Agenda Clínica</h1>
          <div className="cadra-sub-tabs">
            <button className="cadra-sub-tab active" onClick={() => onNavigate('/agenda')}>
              Citas Odontológicas
            </button>
            <button className="cadra-sub-tab" onClick={() => onNavigate('/manufacturing/orders')}>
              Procedimientos & Sillones
            </button>
          </div>
        </div>

        <div className="page-header-right-cluster">
          <LiveFloorPill time="12:02 PM" onNavigate={onNavigate} />

          <div className="page-header-actions-row">
            <button
              className="cadra-btn-secondary"
              onClick={() => showNotification('Descargando agenda clínica en formato PDF y Excel...')}
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>

            <button className="cadra-btn-primary" onClick={onOpenCreate}>
              <Plus size={15} />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Bar & Segmented Toggles */}
      <div className="cadra-control-bar">
        {/* Left: Date controls */}
        <div className="control-date-cluster">
          <button className="circle-arrow-btn" aria-label="Semana anterior">
            <ChevronLeft size={16} />
          </button>
          <span className="current-date-text">{getDateRangeLabel()}</span>
          <button className="circle-arrow-btn" aria-label="Semana siguiente">
            <ChevronRight size={16} />
          </button>
          <button className="today-badge-btn" onClick={() => setRangeMode('Week')}>
            <Calendar size={14} />
            <span>Hoy</span>
          </button>
        </div>

        {/* Right: Segmented switches */}
        <div className="control-switches-cluster">
          {/* Real Week, Month, Quarter functionality */}
          <div className="cadra-pill-group">
            <button
              className={`pill-switch-btn ${rangeMode === 'Week' ? 'active' : ''}`}
              onClick={() => setRangeMode('Week')}
            >
              Semana
            </button>
            <button
              className={`pill-switch-btn ${rangeMode === 'Month' ? 'active' : ''}`}
              onClick={() => setRangeMode('Month')}
            >
              Mes
            </button>
            <button
              className={`pill-switch-btn ${rangeMode === 'Quarter' ? 'active' : ''}`}
              onClick={() => setRangeMode('Quarter')}
            >
              Trimestre
            </button>
          </div>

          {/* Quick Doctor / Specialty Reset button */}
          {(selectedDoctorId !== 'all' || selectedCategory !== 'all') && (
            <button
              className="cadra-btn-secondary"
              style={{ height: '32px', padding: '0 10px', fontSize: '11px', gap: '5px' }}
              onClick={() => {
                setSelectedDoctorId('all')
                setSelectedCategory('all')
                showNotification('Filtros restablecidos')
              }}
            >
              <X size={12} />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Clinical Operations Alert Banner */}
      <div className="cadra-alert-banner">
        <span className="green-live-dot" />
        <p className="alert-banner-text">
          <strong><AnimatedCounter value={5} /> citas activas hoy</strong> en 4 sillones clínicos ·{' '}
          <strong><AnimatedCounter value={filteredAppointments.length} /> citas registradas</strong> en la agenda ·{' '}
          En atención actual: <span style={{ color: '#A94384', fontWeight: 700 }}>Mariana Torres (Sillón 1 - Carillas)</span>
        </p>
      </div>

      {/* Main Split Layout: Calendar on Left, Colors & Tools on Right */}
      <div className="clinical-calendar-container">
        {/* =========================================================================
            LEFT COLUMN: CALENDAR (WEEK, MONTH, OR QUARTER)
            ========================================================================= */}
        <div className="clinical-calendar-card">
          {/* ==================== VISTA SEMANA ==================== */}
          {rangeMode === 'Week' && (
            <div>
              {/* Week Days Header Row */}
              <div className="calendar-week-header">
                <div className="calendar-time-col-header">
                  <Clock size={13} style={{ marginRight: '4px' }} />
                  <span>HORA</span>
                </div>

                {DAYS_HEADER.map((day, idx) => (
                  <div
                    key={idx}
                    className={`calendar-day-header-cell ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''}`}
                  >
                    <span className="day-label-tag">{day.label}</span>
                    <span className="day-label-num">{day.num}</span>
                    {day.isToday && <span className="today-pulse-pill">HOY</span>}
                  </div>
                ))}
              </div>

              {/* Daily Capacity Row */}
              <div className="calendar-capacity-row">
                <div className="capacity-corner-label">CUPO</div>
                {['4/8', '4/8', '5/8', '4/8', '4/8', '3/8', '1/8'].map((cap, idx) => {
                  const isFull = cap === '5/8'
                  return (
                    <div key={idx} className="capacity-day-cell">
                      <span className={`capacity-pill-bar ${isFull ? 'is-full' : ''}`} />
                      <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{cap}</span>
                    </div>
                  )
                })}
              </div>

              {/* Calendar Week Body (Hourly Grid) */}
              <div className="calendar-week-body">
                {/* Time Indicator Line for Wednesday (dayIndex = 2) at 12:02 PM */}
                {/* 12:02 PM is 4 hours after 8:00 AM => 4.033 * 68px = 274px */}
                <div
                  className="calendar-now-line"
                  style={{
                    top: '274px',
                    left: 'calc(74px + (100% - 74px) * (2 / 7))',
                    width: 'calc((100% - 74px) / 7)',
                  }}
                >
                  <span className="calendar-now-pill">12:02 PM · EN VIVO</span>
                </div>

                {/* Left Hours Axis (8:00 AM to 7:00 PM) */}
                <div className="calendar-time-axis-col">
                  {HOURS_AXIS.map((h) => (
                    <div key={h.hour} className="calendar-hour-label">
                      {h.label}
                    </div>
                  ))}
                </div>

                {/* 7 Days Columns */}
                {DAYS_HEADER.map((day, dayIndex) => {
                  const dayAppointments = filteredAppointments.filter((a) => a.dayIndex === dayIndex)

                  return (
                    <div
                      key={dayIndex}
                      className={`calendar-day-column ${day.isToday ? 'is-today-col' : ''} ${day.isWeekend ? 'is-weekend-col' : ''}`}
                    >
                      {/* Hour slot background divider lines */}
                      {HOURS_AXIS.map((h) => (
                        <div key={h.hour} className="day-grid-hour-slot" />
                      ))}

                      {/* Positioned Appointments for this day */}
                      {dayAppointments.map((apt) => {
                        const topPosition = (apt.startHour - 8) * 68
                        const cardHeight = apt.durationHours * 68 - 6

                        return (
                          <div
                            key={apt.id}
                            className="clinical-appointment-card"
                            style={{
                              top: `${topPosition}px`,
                              height: `${cardHeight}px`,
                              borderLeftColor: apt.categoryColor,
                            }}
                            onClick={() => handleOpenAppointment(apt)}
                          >
                            <div className="apt-card-top">
                              <span className="apt-patient-name" title={apt.patientName}>
                                {apt.patientName}
                              </span>
                              <span
                                className="apt-doctor-badge"
                                style={{ backgroundColor: apt.doctorColor }}
                                title={`${apt.doctorName} (${apt.doctorSpecialty})`}
                              >
                                {apt.doctorInitials}
                              </span>
                            </div>

                            <div className="apt-treatment-row">
                              <span className="apt-treatment-text" title={apt.treatment}>
                                {apt.treatment}
                              </span>
                            </div>

                            <div className="apt-card-bottom">
                              <div className="apt-meta-info">
                                <span>{apt.timeFormatted.split('–')[0]}</span>
                                <span>·</span>
                                <span style={{ fontWeight: 700 }}>{apt.box}</span>
                              </div>
                              {renderStatusBadge(apt.status)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ==================== VISTA MES ==================== */}
          {rangeMode === 'Month' && (
            <div className="calendar-month-container">
              {/* Month Header */}
              <div className="month-days-header-row">
                {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'].map((d, i) => (
                  <div key={i} className="month-day-head-title">
                    {d}
                  </div>
                ))}
              </div>

              {/* Month Grid (35 cells covering Nov 2026) */}
              <div className="month-grid-cells">
                {Array.from({ length: 35 }).map((_, idx) => {
                  // Oct 26 to Nov 29 representation
                  const dayNum = idx < 6 ? 26 + idx : idx <= 35 ? idx - 5 : idx - 35
                  const isCurrentMonth = idx >= 6 && idx <= 35
                  const isToday = isCurrentMonth && dayNum === 11
                  const dayIdxOfWeek = idx % 7

                  // Map appointments to days in current week (9 to 15)
                  const dayApts = isCurrentMonth
                    ? filteredAppointments.filter((a) => a.dayNum === dayNum)
                    : []

                  return (
                    <div
                      key={idx}
                      className={`month-grid-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'is-today-cell' : ''}`}
                    >
                      <div className="month-cell-header">
                        <span className="month-cell-num">{dayNum}</span>
                        {isToday && <span className="month-today-badge">HOY</span>}
                      </div>

                      <div className="month-cell-apts">
                        {dayApts.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className="month-apt-pill"
                            style={{ borderLeftColor: apt.categoryColor }}
                            onClick={() => handleOpenAppointment(apt)}
                            title={`${apt.patientName} - ${apt.treatment} (${apt.timeFormatted})`}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: apt.categoryColor,
                                flexShrink: 0,
                              }}
                            />
                            <span className="month-apt-patient">{apt.patientName}</span>
                          </div>
                        ))}

                        {dayApts.length > 3 && (
                          <span
                            className="month-more-apts-btn"
                            onClick={() => setRangeMode('Week')}
                          >
                            +{dayApts.length - 3} citas más
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ==================== VISTA TRIMESTRE ==================== */}
          {rangeMode === 'Quarter' && (
            <div className="calendar-quarter-view">
              {/* 4 KPI Summary Cards */}
              <div className="quarter-kpis-row">
                <div className="quarter-kpi-card">
                  <span className="quarter-kpi-label">Citas Totales Programadas</span>
                  <span className="quarter-kpi-val"><AnimatedCounter value={428} /></span>
                  <span className="quarter-kpi-trend">
                    <Sparkles size={13} /> +14.2% vs Q3 anterior
                  </span>
                </div>

                <div className="quarter-kpi-card">
                  <span className="quarter-kpi-label">Tasa de Ocupación Sillones</span>
                  <span className="quarter-kpi-val">84.6%</span>
                  <span className="quarter-kpi-trend">
                    <CheckCircle2 size={13} /> Óptima capacidad clínica
                  </span>
                </div>

                <div className="quarter-kpi-card">
                  <span className="quarter-kpi-label">Horas Clínicas Atendidas</span>
                  <span className="quarter-kpi-val"><AnimatedCounter value={612} /> hrs</span>
                  <span className="quarter-kpi-trend">
                    <Clock size={13} /> 98.4% puntualidad
                  </span>
                </div>

                <div className="quarter-kpi-card">
                  <span className="quarter-kpi-label">Pacientes Únicos Atendidos</span>
                  <span className="quarter-kpi-val"><AnimatedCounter value={315} /></span>
                  <span className="quarter-kpi-trend">
                    <User size={13} /> 94% satisfacción NPS
                  </span>
                </div>
              </div>

              {/* 3 Months Distribution Breakdown */}
              <div className="quarter-months-grid">
                {[
                  { month: 'Octubre 2026', total: 142, ocupacion: '82.4%', estado: 'Completado' },
                  { month: 'Noviembre 2026', total: 156, ocupacion: '88.1%', estado: 'En curso (Mes activo)' },
                  { month: 'Diciembre 2026', total: 130, ocupacion: '83.3%', estado: 'Programado' },
                ].map((m, idx) => (
                  <div key={idx} className="quarter-month-card">
                    <div className="quarter-month-card-head">
                      <span className="quarter-month-name">{m.month}</span>
                      <span className="quarter-month-badge">{m.estado}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Ocupación de turnos</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{m.ocupacion}</span>
                    </div>

                    <div className="quarter-prog-bar-container">
                      <div className="quarter-prog-bar-fill" style={{ width: m.ocupacion }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>Total de Citas Clínicas</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.total} turnos</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specialty Volume Breakdown */}
              <div className="quarter-specs-breakdown">
                <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Distribución Trimestral por Especialidad Odontológica
                </h3>

                {[
                  { name: 'Odontología General & Estética', pct: 38, color: '#A94384' },
                  { name: 'Ortodoncia', pct: 24, color: '#0284c7' },
                  { name: 'Cirugía & Implantes', pct: 16, color: '#ea580c' },
                  { name: 'Endodoncia', pct: 14, color: '#0d9488' },
                  { name: 'Higiene & Prevención', pct: 8, color: '#10b981' },
                ].map((spec, i) => (
                  <div key={i} className="quarter-spec-bar-row">
                    <span className="quarter-spec-bar-label">{spec.name}</span>
                    <div className="quarter-spec-track">
                      <div
                        className="quarter-spec-fill"
                        style={{ width: `${spec.pct}%`, backgroundColor: spec.color }}
                      />
                    </div>
                    <span className="quarter-spec-pct">{spec.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: COLOR GUIDE & QUICK TOOLS SIDEBAR PANEL
            ========================================================================= */}
        <div className="clinical-sidebar-panel">
          {/* Section 1: Guía / Instructivo de Colores (Exactly as requested) */}
          <div className="clinical-side-card">
            <div className="side-card-title">
              <h3>
                <Sparkles size={15} color="#A94384" />
                <span>Guía de Especialidades</span>
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {filteredAppointments.length} citas
              </span>
            </div>

            <div className="color-legend-list">
              {SPECIALTY_GUIDE.map((item) => {
                const isSelected = selectedCategory === item.id
                return (
                  <div
                    key={item.id}
                    className={`color-legend-item ${isSelected ? 'active-filter' : ''}`}
                    style={{ '--item-color': item.color } as React.CSSProperties}
                    onClick={() => {
                      setSelectedCategory((cur) => (cur === item.id ? 'all' : item.id))
                      showNotification(
                        isSelected
                          ? 'Mostrando todas las especialidades'
                          : `Filtrando por: ${item.name}`
                      )
                    }}
                    title={`Click para filtrar citas de ${item.name}`}
                  >
                    <div className="legend-swatch-cluster">
                      <span
                        className="legend-color-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="legend-specialty-name">{item.name}</span>
                    </div>
                    <span className="legend-count-pill">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 2: Caja de Herramientas Rápidas */}
          <div className="clinical-side-card">
            <div className="side-card-title">
              <h3>
                <Stethoscope size={15} color="var(--text-secondary)" />
                <span>Herramientas Rápidas</span>
              </h3>
            </div>

            <div className="quick-tools-grid">
              <button
                className="quick-tool-btn btn-primary-tool"
                onClick={onOpenCreate}
              >
                <div className="tool-left-cluster">
                  <Plus size={16} />
                  <span>Nueva Cita</span>
                </div>
                <span style={{ fontSize: '10px', opacity: 0.85, fontWeight: 700 }}>+ Turno</span>
              </button>

              <button
                className="quick-tool-btn"
                onClick={() => {
                  setReassignTargetApt(appointments[0])
                  setReassignBox(appointments[0].box)
                  setReassignDoctor(appointments[0].doctorId)
                  setIsReassignModalOpen(true)
                }}
              >
                <div className="tool-left-cluster">
                  <RefreshCw size={15} color="#0284c7" />
                  <span>Reasignar Turnos</span>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" />
              </button>

              <button
                className="quick-tool-btn"
                onClick={() => {
                  setSelectedDoctorId('all')
                  setSelectedCategory((cur) => (cur === 'all' ? 'Ortodoncia' : 'all'))
                  showNotification('Alternando filtro de especialidad')
                }}
              >
                <div className="tool-left-cluster">
                  <Filter size={15} color="#10b981" />
                  <span>Filtrar por Especialista</span>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" />
              </button>
            </div>
          </div>

          {/* Section 3: Filtro Rápido de Doctores */}
          <div className="clinical-side-card">
            <div className="side-card-title">
              <h3>
                <User size={15} color="var(--text-secondary)" />
                <span>Doctores Clínicos</span>
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {CLINIC_DOCTORS.length} especialistas
              </span>
            </div>

            <div className="doctor-filter-list">
              {/* All Doctors option */}
              <div
                className={`doctor-filter-item ${selectedDoctorId === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDoctorId('all')
                  showNotification('Mostrando agenda de todos los doctores')
                }}
              >
                <div className="doc-info-cluster">
                  <span
                    className="doc-avatar-pill"
                    style={{ backgroundColor: '#141517' }}
                  >
                    ALL
                  </span>
                  <div className="doc-texts">
                    <span className="doc-name">Todos los Doctores</span>
                    <span className="doc-spec">Vista consolidada de sillones</span>
                  </div>
                </div>
                <span className="doc-count-badge">{appointments.length}</span>
              </div>

              {/* Individual Doctors */}
              {CLINIC_DOCTORS.map((doc) => {
                const isSelected = selectedDoctorId === doc.id
                return (
                  <div
                    key={doc.id}
                    className={`doctor-filter-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDoctorId((cur) => (cur === doc.id ? 'all' : doc.id))
                      showNotification(
                        isSelected
                          ? 'Mostrando todos los doctores'
                          : `Filtrando citas de ${doc.name}`
                      )
                    }}
                  >
                    <div className="doc-info-cluster">
                      <span
                        className="doc-avatar-pill"
                        style={{ backgroundColor: doc.color }}
                      >
                        {doc.initials}
                      </span>
                      <div className="doc-texts">
                        <span className="doc-name">{doc.name}</span>
                        <span className="doc-spec">{doc.specialty}</span>
                      </div>
                    </div>
                    <span className="doc-count-badge">{doc.activeCount}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL / DRAWER LATERAL DE DETALLES DE CITA
          ========================================================================= */}
      {selectedAppointment && (
        <div className="appointment-drawer-overlay" onClick={handleCloseDrawer}>
          <div
            className="appointment-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Banner */}
            <div className="drawer-top-banner">
              <button
                className="drawer-close-btn-top"
                onClick={handleCloseDrawer}
                aria-label="Cerrar detalles"
              >
                <X size={16} />
              </button>

              <div className="drawer-patient-header">
                <div
                  className="drawer-patient-avatar"
                  style={{ backgroundColor: selectedAppointment.categoryColor }}
                >
                  {selectedAppointment.patientName.charAt(0)}
                </div>

                <div className="drawer-patient-title-group">
                  <span className="drawer-patient-name">
                    {selectedAppointment.patientName}
                  </span>
                  <span className="drawer-patient-id">
                    {selectedAppointment.patientId} · {selectedAppointment.dateStr}
                  </span>
                  <div style={{ marginTop: '4px' }}>
                    {renderStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Body Sections */}
            <div className="drawer-body-sections">
              {/* Patient Contact Info */}
              <div className="drawer-info-grid">
                <div className="drawer-field-block">
                  <span className="drawer-field-label-sm">Teléfono / WhatsApp</span>
                  <a
                    href={`tel:${selectedAppointment.patientPhone}`}
                    className="drawer-field-val-sm"
                    style={{ color: '#0284c7', textDecoration: 'none' }}
                  >
                    <Phone size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {selectedAppointment.patientPhone}
                  </a>
                </div>

                <div className="drawer-field-block">
                  <span className="drawer-field-label-sm">Correo Electrónico</span>
                  <span className="drawer-field-val-sm" title={selectedAppointment.patientEmail}>
                    <Mail size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {selectedAppointment.patientEmail}
                  </span>
                </div>
              </div>

              {/* Doctor & Chair Info */}
              <div className="drawer-section-card">
                <div className="drawer-section-card-title">
                  <Stethoscope size={13} color="#A94384" />
                  <span>Especialista & Sillón Asignado</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: selectedAppointment.doctorColor,
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedAppointment.doctorInitials}
                    </span>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {selectedAppointment.doctorName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {selectedAppointment.doctorSpecialty}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-main)',
                    }}
                  >
                    {selectedAppointment.box}
                  </span>
                </div>
              </div>

              {/* Treatment & Time */}
              <div className="drawer-section-card">
                <div className="drawer-section-card-title">
                  <FileText size={13} color="#0284c7" />
                  <span>Procedimiento Odontológico</span>
                </div>

                <span className="drawer-treatment-title">
                  {selectedAppointment.treatment}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: selectedAppointment.categoryColor,
                      color: '#ffffff',
                    }}
                  >
                    {selectedAppointment.categoryLabel}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={12} />
                    {selectedAppointment.durationHours * 60} min ({selectedAppointment.timeFormatted})
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="drawer-section-card">
                <div className="drawer-section-card-title">
                  <Sparkles size={13} color="#10b981" />
                  <span>Cambiar Estado de la Cita</span>
                </div>

                <div className="drawer-status-selector">
                  {(['Confirmada', 'En atención', 'Realizada', 'Pendiente'] as const).map((st) => (
                    <button
                      key={st}
                      className={`status-select-btn ${selectedAppointment.status === st ? 'active-status' : ''}`}
                      onClick={() => handleUpdateStatus(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="drawer-section-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="drawer-section-card-title">
                    <Edit3 size={13} color="var(--text-muted)" />
                    <span>Notas Clínicas & Observaciones</span>
                  </div>

                  {!isEditingNotes ? (
                    <button
                      style={{ fontSize: '11px', fontWeight: 700, color: '#A94384', cursor: 'pointer' }}
                      onClick={() => setIsEditingNotes(true)}
                    >
                      Editar nota
                    </button>
                  ) : (
                    <button
                      style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', cursor: 'pointer' }}
                      onClick={handleSaveNotes}
                    >
                      Guardar
                    </button>
                  )}
                </div>

                {!isEditingNotes ? (
                  <p className="drawer-notes-box">
                    {selectedAppointment.notes || 'Sin observaciones adicionales registradas.'}
                  </p>
                ) : (
                  <textarea
                    rows={3}
                    className="cadra-input"
                    style={{ width: '100%', resize: 'vertical', fontSize: '12.5px', marginTop: '6px' }}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Drawer Footer Actions (Exact buttons requested) */}
            <div className="drawer-footer-cluster">
              <div className="drawer-btn-grid">
                <button
                  className="drawer-action-btn-primary"
                  onClick={handleCompleteAppointment}
                >
                  <CheckCircle2 size={16} />
                  <span>Completar Cita</span>
                </button>

                <button
                  className="drawer-action-btn-secondary"
                  onClick={handleReschedule}
                >
                  <CalendarClock size={16} />
                  <span>Reagendar / Mover</span>
                </button>
              </div>

              <div className="drawer-btn-grid">
                <button
                  className="drawer-action-btn-secondary"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Edit3 size={15} />
                  <span>Editar Cita</span>
                </button>

                <button
                  className="drawer-action-btn-danger"
                  onClick={handleCancelAppointment}
                >
                  <Trash2 size={15} />
                  <span>Cancelar / Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE REASIGNACIÓN DE TURNOS / SILLONES
          ========================================================================= */}
      {isReassignModalOpen && reassignTargetApt && (
        <div className="cadra-modal-overlay" onClick={() => setIsReassignModalOpen(false)}>
          <div className="cadra-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div>
                <span className="cadra-eyebrow">AGENDA CLÍNICA</span>
                <h2>Reasignar Turno Odontológico</h2>
              </div>
              <button
                className="icon-close-btn"
                onClick={() => setIsReassignModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmReassign} className="action-modal-form">
              <div className="form-group">
                <label>Paciente</label>
                <input
                  type="text"
                  disabled
                  value={`${reassignTargetApt.patientName} (${reassignTargetApt.patientId})`}
                  style={{ opacity: 0.8, backgroundColor: 'var(--bg-container)' }}
                />
              </div>

              <div className="form-group">
                <label>Tratamiento Actual</label>
                <input
                  type="text"
                  disabled
                  value={reassignTargetApt.treatment}
                  style={{ opacity: 0.8, backgroundColor: 'var(--bg-container)' }}
                />
              </div>

              <div className="form-group">
                <label>Nuevo Sillón Odontológico *</label>
                <select
                  value={reassignBox}
                  onChange={(e) => setReassignBox(e.target.value)}
                  required
                >
                  <option value="Sillón 1">Sillón 1 — Odontología General & Estética</option>
                  <option value="Sillón 2">Sillón 2 — Ortodoncia & Escáner 3D</option>
                  <option value="Sillón 3">Sillón 3 — Endodoncia & Microscopía</option>
                  <option value="Sillón 4">Sillón 4 — Cirugía & Quirófano Implantes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Doctor Especialista Asignado *</label>
                <select
                  value={reassignDoctor}
                  onChange={(e) => setReassignDoctor(e.target.value)}
                  required
                >
                  {CLINIC_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="action-modal-footer">
                <button
                  type="button"
                  className="cadra-btn-secondary"
                  onClick={() => setIsReassignModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="cadra-btn-primary">
                  <Check size={16} />
                  <span>Confirmar Reasignación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

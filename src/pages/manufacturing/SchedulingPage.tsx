import React, { useState, useMemo, useEffect } from 'react'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { LiveFloorPill } from '../../components/ui/LiveFloorPill'
import { useWorkspace, DOCTORS_WORKSPACES } from '../../context/WorkspaceContext'
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
  box: string // "Consultorio 1", "Consultorio 2", etc.
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
    patientName: 'Valentina Ríos Castro',
    patientId: 'TI 1.098.234.190',
    patientPhone: '+57 320 192 8472',
    patientEmail: 'valentina.rios@yahoo.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Limpieza Ultrasonido y Profilaxis Fluorada',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 8.0,
    durationHours: 1.5,
    timeFormatted: '8:00 AM – 9:30 AM',
    box: 'Consultorio 1',
    status: 'Realizada',
    notes: 'Sensibilidad dental leve en cuello de molares inferiores. Se aplicó barniz de flúor Duraphat 5%.'
  },
  {
    id: 'apt-2',
    patientName: 'Laura Gómez Restrepo',
    patientId: 'CC 1.032.481.923',
    patientPhone: '+57 312 904 1120',
    patientEmail: 'laura.gomez@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Cambio de Arcos NiTi 0.016 y Ligaduras',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 10.0,
    durationHours: 1.5,
    timeFormatted: '10:00 AM – 11:30 AM',
    box: 'Consultorio 2',
    status: 'Realizada',
    notes: 'Excelente higiene. Próximo control en 4 semanas para avance a arco de acero rectangular.'
  },
  {
    id: 'apt-3',
    patientName: 'Carlos García Mendoza',
    patientId: 'CC 1.020.485.912',
    patientPhone: '+57 310 482 9182',
    patientEmail: 'carlos.garcia@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Diseño de Sonrisa & Carillas de Porcelana (Fase 1)',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 14.0,
    durationHours: 2.0,
    timeFormatted: '2:00 PM – 4:00 PM',
    box: 'Consultorio 4',
    status: 'Realizada',
    notes: 'Escaneo intraoral 3D y diseño digital smile design. Muestras de color BL1 aprobadas.'
  },
  {
    id: 'apt-4',
    patientName: 'Andrés Felipe Mendoza',
    patientId: 'CC 1.014.892.301',
    patientPhone: '+57 318 459 2018',
    patientEmail: 'andres.mendoza@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Restauración Resina Filtek 3M (Calzas)',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 0,
    dateStr: 'Lun 9 Nov',
    dayNum: 9,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Consultorio 1',
    status: 'Realizada',
    notes: 'Reconstrucción de cúspide distovestibular pieza 16. Oclusión y puntos de contacto anatómicos verificados.'
  },

  // MARTES 10
  {
    id: 'apt-5',
    patientName: 'Mariana Torres Peña',
    patientId: 'CC 1.022.391.823',
    patientPhone: '+57 311 839 2011',
    patientEmail: 'mariana.tp@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Alineadores Invisibles · Set-up y Planificación',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 9.0,
    durationHours: 1.5,
    timeFormatted: '9:00 AM – 10:30 AM',
    box: 'Consultorio 3',
    status: 'Realizada',
    notes: 'Planificación de 18 alineadores superiores e inferiores. Entrega de primeros 2 juegos de placas.'
  },
  {
    id: 'apt-6',
    patientName: 'Camilo Echeverri',
    patientId: 'CC 1.017.392.810',
    patientPhone: '+57 316 772 3419',
    patientEmail: 'camilo.echeverri@hotmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Cementado Brackets MBT 0.022 y Arcos NiTi',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 11.0,
    durationHours: 1.5,
    timeFormatted: '11:00 AM – 12:30 PM',
    box: 'Consultorio 2',
    status: 'Realizada',
    notes: 'Grabado y adhesión con Transbond XT. Instrucciones detalladas de cepillado interproximal.'
  },
  {
    id: 'apt-7',
    patientName: 'Valeria Ospina',
    patientId: 'CC 1.033.928.172',
    patientPhone: '+57 314 550 8912',
    patientEmail: 'valeria.ospina@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Mockup Digital y Prueba de Sonrisa Estética',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 15.0,
    durationHours: 1.0,
    timeFormatted: '3:00 PM – 4:00 PM',
    box: 'Consultorio 4',
    status: 'Realizada',
    notes: 'Prueba de mockup en bisacrilato con alta satisfacción. Se envía orden para carillas cerámicas disilicato.'
  },
  {
    id: 'apt-8',
    patientName: 'Mateo Salazar',
    patientId: 'CC 1.028.391.740',
    patientPhone: '+57 318 640 1928',
    patientEmail: 'mateo.salazar@outlook.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Estudio Cefalométrico y Análisis Steiner',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 1,
    dateStr: 'Mar 10 Nov',
    dayNum: 10,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Consultorio 3',
    status: 'Realizada',
    notes: 'Trazado cefalométrico computarizado completado. Clase II esquelética confirmada.'
  },

  // MIÉRCOLES 11 (HOY)
  {
    id: 'apt-9',
    patientName: 'Carlos García Mendoza',
    patientId: 'CC 1.020.485.912',
    patientPhone: '+57 310 482 9182',
    patientEmail: 'carlos.garcia@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Cementación Adhesiva 6 Carillas Porcelana',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Consultorio 4',
    status: 'Realizada',
    notes: 'Aislamiento absoluto con OptraDam. Cemento resinoso Variolink Esthetic Light.'
  },
  {
    id: 'apt-10',
    patientName: 'Valentina Ríos Castro',
    patientId: 'TI 1.098.234.190',
    patientPhone: '+57 320 192 8472',
    patientEmail: 'valentina.rios@yahoo.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Control Semestral y Pulido Dental Profiláctico',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Consultorio 1',
    status: 'En atención',
    notes: 'Pasta profiláctica Nupro y pulido interproximal con tiras de acabado.'
  },
  {
    id: 'apt-11',
    patientName: 'Laura Gómez Restrepo',
    patientId: 'CC 1.032.481.923',
    patientPhone: '+57 312 904 1120',
    patientEmail: 'laura.gomez@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Control Mensual Brackets Zafiro',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 13.0,
    durationHours: 1.0,
    timeFormatted: '1:00 PM – 2:00 PM',
    box: 'Consultorio 2',
    status: 'Confirmada',
    notes: 'Ajuste de torque anterior y cambio de ligaduras elastoméricas transparentes.'
  },
  {
    id: 'apt-12',
    patientName: 'Andrés Felipe Mendoza',
    patientId: 'CC 1.014.892.301',
    patientPhone: '+57 318 459 2018',
    patientEmail: 'andres.mendoza@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Blanqueamiento Dental LED Clínica',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 14.5,
    durationHours: 1.5,
    timeFormatted: '2:30 PM – 4:00 PM',
    box: 'Consultorio 1',
    status: 'Confirmada',
    notes: 'Peróxido de hidrógeno al 35%. Aplicación de barrera gingival fotopolimerizable.'
  },
  {
    id: 'apt-13',
    patientName: 'Mariana Torres Peña',
    patientId: 'CC 1.022.391.823',
    patientPhone: '+57 311 839 2011',
    patientEmail: 'mariana.tp@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Control Alineador #8 y Revisión de Aditamentos',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 2,
    dateStr: 'Mié 11 Nov',
    dayNum: 11,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Consultorio 3',
    status: 'Confirmada',
    notes: 'Encaje perfecto de alineadores. Se entregan placas 9, 10 y 11 para las próximas 6 semanas.'
  },

  // JUEVES 12
  {
    id: 'apt-14',
    patientName: 'Valeria Ospina',
    patientId: 'CC 1.033.928.172',
    patientPhone: '+57 314 550 8912',
    patientEmail: 'valeria.ospina@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Micropreparación Estética y Toma de Impresiones Silicona',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Consultorio 4',
    status: 'Confirmada',
    notes: 'Preparación mínimamente invasiva carillas 13 al 23. Silicona por adición Express 3M.'
  },
  {
    id: 'apt-15',
    patientName: 'Camilo Echeverri',
    patientId: 'CC 1.017.392.810',
    patientPhone: '+57 316 772 3419',
    patientEmail: 'camilo.echeverri@hotmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Instalación Arco NiTi Rectangular 0.016x0.022',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Consultorio 2',
    status: 'Confirmada',
    notes: 'Avance en secuencia de arcos. Ligaduras metálicas en caninos para control de rotación.'
  },
  {
    id: 'apt-16',
    patientName: 'Mateo Salazar',
    patientId: 'CC 1.028.391.740',
    patientPhone: '+57 318 640 1928',
    patientEmail: 'mateo.salazar@outlook.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Entrega de Placas Alineadoras e Instrucciones',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 14.0,
    durationHours: 1.5,
    timeFormatted: '2:00 PM – 3:30 PM',
    box: 'Consultorio 3',
    status: 'Confirmada',
    notes: 'Colocación de attachments vestibulares en resina compuesta fotocurable.'
  },
  {
    id: 'apt-17',
    patientName: 'Mateo Fernández Silva',
    patientId: 'CC 1.018.239.014',
    patientPhone: '+57 315 782 3910',
    patientEmail: 'mateo.f@outlook.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Operatoria Dental y Restauración Estética',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 3,
    dateStr: 'Jue 12 Nov',
    dayNum: 12,
    startHour: 16.0,
    durationHours: 1.5,
    timeFormatted: '4:00 PM – 5:30 PM',
    box: 'Consultorio 1',
    status: 'Pendiente',
    notes: 'Cambio de amalgama defectuosa por composite estético nanorrelleno pieza 46.'
  },

  // VIERNES 13
  {
    id: 'apt-18',
    patientName: 'Valentina Ríos Castro',
    patientId: 'TI 1.098.234.190',
    patientPhone: '+57 320 192 8472',
    patientEmail: 'valentina.rios@yahoo.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Aplicación Sellantes de Fosas y Fisuras',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 9.0,
    durationHours: 1.5,
    timeFormatted: '9:00 AM – 10:30 AM',
    box: 'Consultorio 1',
    status: 'Confirmada',
    notes: 'Prevención en molares permanentes con sellante resinoso Clinpro 3M.'
  },
  {
    id: 'apt-19',
    patientName: 'Mariana Torres Peña',
    patientId: 'CC 1.022.391.823',
    patientPhone: '+57 311 839 2011',
    patientEmail: 'mariana.tp@gmail.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Stripping Interproximal Calibrado',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 11.0,
    durationHours: 1.5,
    timeFormatted: '11:00 AM – 12:30 PM',
    box: 'Consultorio 3',
    status: 'Pendiente',
    notes: 'Desgaste interproximal de 0.2mm en sector anteroinferior para resolver apiñamiento.'
  },
  {
    id: 'apt-20',
    patientName: 'Laura Gómez Restrepo',
    patientId: 'CC 1.032.481.923',
    patientPhone: '+57 312 904 1120',
    patientEmail: 'laura.gomez@gmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Colocación Elásticos Intermaxilares Clase II',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 14.5,
    durationHours: 1.5,
    timeFormatted: '2:30 PM – 4:00 PM',
    box: 'Consultorio 2',
    status: 'Confirmada',
    notes: 'Elásticos 3/16 4.5oz. Paciente capacitada para recambio diario.'
  },
  {
    id: 'apt-21',
    patientName: 'Carlos García Mendoza',
    patientId: 'CC 1.020.485.912',
    patientPhone: '+57 310 482 9182',
    patientEmail: 'carlos.garcia@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Control y Pulido Final de Carillas de Porcelana',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 4,
    dateStr: 'Vie 13 Nov',
    dayNum: 13,
    startHour: 16.5,
    durationHours: 1.5,
    timeFormatted: '4:30 PM – 6:00 PM',
    box: 'Consultorio 4',
    status: 'Pendiente',
    notes: 'Revisión oclusal en lateralidades y protrusiva. Brillo de cerámica con pasta diamantada.'
  },

  // SÁBADO 14
  {
    id: 'apt-22',
    patientName: 'Andrés Felipe Mendoza',
    patientId: 'CC 1.014.892.301',
    patientPhone: '+57 318 459 2018',
    patientEmail: 'andres.mendoza@gmail.com',
    doctorName: 'Dra. Sofía Valenzuela',
    doctorSpecialty: 'Odontología General',
    doctorColor: '#A94384',
    doctorId: 'doc-1',
    doctorInitials: 'SV',
    treatment: 'Revisión Post-Tratamiento y Guarda Oclusal',
    category: 'General',
    categoryLabel: 'Odontología General',
    categoryColor: '#A94384',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 8.5,
    durationHours: 1.5,
    timeFormatted: '8:30 AM – 10:00 AM',
    box: 'Consultorio 1',
    status: 'Confirmada',
    notes: 'Toma de impresión para placa miorrelajante nocturna tipo Michigan.'
  },
  {
    id: 'apt-23',
    patientName: 'Camilo Echeverri',
    patientId: 'CC 1.017.392.810',
    patientPhone: '+57 316 772 3419',
    patientEmail: 'camilo.echeverri@hotmail.com',
    doctorName: 'Dr. Alejandro Soto',
    doctorSpecialty: 'Ortodoncia 1',
    doctorColor: '#0284c7',
    doctorId: 'doc-2',
    doctorInitials: 'AS',
    treatment: 'Urgencia Alambre Molesto y Recorte de Arco',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 1',
    categoryColor: '#0284c7',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 10.5,
    durationHours: 1.5,
    timeFormatted: '10:30 AM – 12:00 PM',
    box: 'Consultorio 2',
    status: 'Confirmada',
    notes: 'Corte distal de arco con fresa y alivio con cera ortodóntica.'
  },
  {
    id: 'apt-24',
    patientName: 'Valeria Ospina',
    patientId: 'CC 1.033.928.172',
    patientPhone: '+57 314 550 8912',
    patientEmail: 'valeria.ospina@gmail.com',
    doctorName: 'Dr. Marcos Pineda',
    doctorSpecialty: 'Diseño de Sonrisa',
    doctorColor: '#c2410c',
    doctorId: 'doc-4',
    doctorInitials: 'MP',
    treatment: 'Sesión Fotográfica Clínica Final de Sonrisa',
    category: 'Cirugía',
    categoryLabel: 'Diseño de Sonrisa',
    categoryColor: '#c2410c',
    dayIndex: 5,
    dateStr: 'Sáb 14 Nov',
    dayNum: 14,
    startHour: 12.5,
    durationHours: 1.0,
    timeFormatted: '12:30 PM – 1:30 PM',
    box: 'Consultorio 4',
    status: 'Pendiente',
    notes: 'Fotografía con flash anular y contrastadores negros para book clínico.'
  },

  // DOMINGO 15
  {
    id: 'apt-25',
    patientName: 'Mateo Salazar',
    patientId: 'CC 1.028.391.740',
    patientPhone: '+57 318 640 1928',
    patientEmail: 'mateo.salazar@outlook.com',
    doctorName: 'Dra. Claudia Rivas',
    doctorSpecialty: 'Ortodoncia 2',
    doctorColor: '#0d9488',
    doctorId: 'doc-3',
    doctorInitials: 'CR',
    treatment: 'Ajuste de Botón de Anclaje de Urgencia',
    category: 'Ortodoncia',
    categoryLabel: 'Ortodoncia 2',
    categoryColor: '#0d9488',
    dayIndex: 6,
    dateStr: 'Dom 15 Nov',
    dayNum: 15,
    startHour: 10.0,
    durationHours: 1.5,
    timeFormatted: '10:00 AM – 11:30 AM',
    box: 'Consultorio 3',
    status: 'Realizada',
    notes: 'Recementado de aditamento desprendido en pieza 15 con resina fluida.'
  }
]

// Specialty Color Guide definition adaptada a VitaDent
const SPECIALTY_GUIDE = [
  {
    id: 'General',
    name: 'Odontología General (Consultorio 1)',
    color: '#A94384',
    count: 7,
  },
  {
    id: 'Ortodoncia 1',
    name: 'Ortodoncia 1 · Dr. Soto (Consultorio 2)',
    color: '#0284c7',
    count: 6,
  },
  {
    id: 'Ortodoncia 2',
    name: 'Ortodoncia 2 · Dra. Rivas (Consultorio 3)',
    color: '#0d9488',
    count: 6,
  },
  {
    id: 'Diseño Sonrisa',
    name: 'Diseño de Sonrisa · Dr. Pineda (Consultorio 4)',
    color: '#c2410c',
    count: 6,
  },
]

// Clinical Doctors List con Consultorios Oficiales de VitaDent
export const CLINIC_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dra. Sofía Valenzuela',
    specialty: 'Odontología General',
    consultorio: 'Consultorio 1',
    initials: 'SV',
    color: '#A94384',
    activeCount: 7
  },
  {
    id: 'doc-2',
    name: 'Dr. Alejandro Soto',
    specialty: 'Ortodoncia 1',
    consultorio: 'Consultorio 2',
    initials: 'AS',
    color: '#0284c7',
    activeCount: 6
  },
  {
    id: 'doc-3',
    name: 'Dra. Claudia Rivas',
    specialty: 'Ortodoncia 2',
    consultorio: 'Consultorio 3',
    initials: 'CR',
    color: '#0d9488',
    activeCount: 6
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcos Pineda',
    specialty: 'Diseño de Sonrisa',
    consultorio: 'Consultorio 4',
    initials: 'MP',
    color: '#c2410c',
    activeCount: 6
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
  const { currentWorkspace, setWorkspace, activeWorkspaceInfo } = useWorkspace()

  // Navigation & View Mode State
  const [rangeMode, setRangeMode] = useState<'Week' | 'Month' | 'Quarter'>('Week')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all')
  
  // Cargar y persistir citas clínicas
  const [appointments, setAppointments] = useState<ClinicalAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('vitadent_clinical_appointments')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length >= INITIAL_APPOINTMENTS.length) return parsed
      }
    } catch {}
    return INITIAL_APPOINTMENTS
  })

  useEffect(() => {
    try {
      localStorage.setItem('vitadent_clinical_appointments', JSON.stringify(appointments))
    } catch {}
  }, [appointments])

  // Sincronizar el doctor del workspace con el filtro de agenda
  useEffect(() => {
    if (currentWorkspace !== 'all') {
      setSelectedDoctorId(currentWorkspace)
    } else {
      setSelectedDoctorId('all')
    }
  }, [currentWorkspace])

  // Doctor activo a filtrar: si el workspace está activo, manda el workspace
  const effectiveDoctorId = currentWorkspace !== 'all' ? currentWorkspace : selectedDoctorId
  
  // Drawer & Modal States
  const [selectedAppointment, setSelectedAppointment] = useState<ClinicalAppointment | null>(null)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')

  // Modal de Reasignar / Mover Turnos entre Consultorios
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  const [reassignTargetApt, setReassignTargetApt] = useState<ClinicalAppointment | null>(null)
  const [reassignBox, setReassignBox] = useState('Consultorio 1')
  const [reassignDoctor, setReassignDoctor] = useState('doc-1')
  const [reassignDayIndex, setReassignDayIndex] = useState(2)
  const [reassignStartHour, setReassignStartHour] = useState(10.0)

  // Modal de Agendar Nueva Cita (Herramienta Asistente Nathalia Leon)
  const [isNewAptModalOpen, setIsNewAptModalOpen] = useState(false)
  const [newAptPatientName, setNewAptPatientName] = useState('')
  const [newAptPatientPhone, setNewAptPatientPhone] = useState('+57 310 ')
  const [newAptPatientId, setNewAptPatientId] = useState('')
  const [newAptDoctorId, setNewAptDoctorId] = useState<string>(() => {
    return currentWorkspace !== 'all' ? currentWorkspace : 'doc-1'
  })
  const [newAptTreatment, setNewAptTreatment] = useState('Primera consulta + Diagnóstico')
  const [newAptDayIndex, setNewAptDayIndex] = useState(2) // Miércoles por defecto
  const [newAptStartHour, setNewAptStartHour] = useState(10.0) // 10:00 AM
  const [newAptDuration, setNewAptDuration] = useState(1.5) // 1.5 horas
  const [newAptNotes, setNewAptNotes] = useState('')

  useEffect(() => {
    if (currentWorkspace !== 'all') {
      setNewAptDoctorId(currentWorkspace)
    }
  }, [currentWorkspace])

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
      if (effectiveDoctorId !== 'all' && apt.doctorId !== effectiveDoctorId) return false
      if (selectedCategory !== 'all') {
        const catNorm = apt.category.toLowerCase()
        const selNorm = selectedCategory.toLowerCase()
        if (!catNorm.includes(selNorm) && !selNorm.includes(catNorm)) return false
      }
      return true
    })
  }, [appointments, effectiveDoctorId, selectedCategory])

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
    setReassignDayIndex(selectedAppointment.dayIndex)
    setReassignStartHour(selectedAppointment.startHour)
    setIsReassignModalOpen(true)
  }

  // Execute Reassign / Move
  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reassignTargetApt) return
    const doctorObj = CLINIC_DOCTORS.find((d) => d.id === reassignDoctor) || CLINIC_DOCTORS[0]
    const dayHeader = DAYS_HEADER[reassignDayIndex] || DAYS_HEADER[reassignTargetApt.dayIndex]

    const startH = Math.floor(reassignStartHour)
    const startM = (reassignStartHour % 1) * 60
    const endHourDec = reassignStartHour + reassignTargetApt.durationHours
    const endH = Math.floor(endHourDec)
    const endM = (endHourDec % 1) * 60
    const fmt = (h: number, m: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      const mStr = m === 0 ? '00' : `${Math.round(m)}`
      return `${h12}:${mStr} ${ampm}`
    }
    const timeFormatted = `${fmt(startH, startM)} – ${fmt(endH, endM)}`

    const updated: ClinicalAppointment = {
      ...reassignTargetApt,
      box: reassignBox,
      doctorId: reassignDoctor,
      doctorName: doctorObj.name,
      doctorSpecialty: doctorObj.specialty,
      doctorColor: doctorObj.color,
      doctorInitials: doctorObj.initials,
      dayIndex: reassignDayIndex,
      dateStr: `${dayHeader.label} ${dayHeader.num} Nov`,
      dayNum: dayHeader.num,
      startHour: reassignStartHour,
      timeFormatted,
    }

    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    if (selectedAppointment && selectedAppointment.id === updated.id) {
      setSelectedAppointment(updated)
    }
    setIsReassignModalOpen(false)
    setReassignTargetApt(null)
    showNotification(`Turno reasignado con éxito a ${reassignBox} con ${updated.doctorName} (${updated.timeFormatted})`)
  }

  // Crear Nueva Cita Odontológica (Asistente Nathalia Leon)
  const handleCreateNewAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAptPatientName.trim()) return

    const doctorObj = CLINIC_DOCTORS.find((d) => d.id === newAptDoctorId) || CLINIC_DOCTORS[0]
    const dayHeader = DAYS_HEADER[newAptDayIndex] || DAYS_HEADER[2]

    const startH = Math.floor(newAptStartHour)
    const startM = (newAptStartHour % 1) * 60
    const endHourDec = newAptStartHour + newAptDuration
    const endH = Math.floor(endHourDec)
    const endM = (endHourDec % 1) * 60
    const fmt = (h: number, m: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      const mStr = m === 0 ? '00' : `${Math.round(m)}`
      return `${h12}:${mStr} ${ampm}`
    }
    const timeFormatted = `${fmt(startH, startM)} – ${fmt(endH, endM)}`

    const newApt: ClinicalAppointment = {
      id: `apt-${Date.now()}`,
      patientName: newAptPatientName.trim(),
      patientId: newAptPatientId.trim() || `CC 1.0${Math.floor(10000000 + Math.random() * 90000000)}`,
      patientPhone: newAptPatientPhone.trim() || '+57 310 000 0000',
      patientEmail: `${newAptPatientName.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      doctorName: doctorObj.name,
      doctorSpecialty: doctorObj.specialty,
      doctorColor: doctorObj.color,
      doctorId: doctorObj.id,
      doctorInitials: doctorObj.initials,
      treatment: newAptTreatment,
      category: doctorObj.id === 'doc-2' || doctorObj.id === 'doc-3' ? 'Ortodoncia' : doctorObj.id === 'doc-4' ? 'Cirugía' : 'General',
      categoryLabel: doctorObj.specialty,
      categoryColor: doctorObj.color,
      dayIndex: newAptDayIndex,
      dateStr: `${dayHeader.label} ${dayHeader.num} Nov`,
      dayNum: dayHeader.num,
      startHour: newAptStartHour,
      durationHours: newAptDuration,
      timeFormatted,
      box: doctorObj.consultorio,
      status: 'Confirmada',
      notes: newAptNotes.trim() || `Cita colocada en agenda por la Asistente Nathalia Leon para ${doctorObj.name} en ${doctorObj.consultorio}.`
    }

    setAppointments((prev) => [newApt, ...prev])
    showNotification(`¡Cita agendada para ${newApt.patientName} con ${doctorObj.name} en ${doctorObj.consultorio}!`)
    setIsNewAptModalOpen(false)

    // Reset
    setNewAptPatientName('')
    setNewAptPatientPhone('+57 310 ')
    setNewAptPatientId('')
    setNewAptNotes('')
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
              Procedimientos & Citas
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

            <button className="cadra-btn-primary" onClick={() => setIsNewAptModalOpen(true)}>
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
                setWorkspace('all')
                showNotification('Filtros y espacio restablecidos a Toda la Clínica')
              }}
            >
              <X size={12} />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace & Assistant Coordination Context Banner */}
      <div
        className="scheduling-workspace-banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          borderRadius: '12px',
          background: currentWorkspace === 'all'
            ? 'linear-gradient(135deg, rgba(169, 67, 132, 0.08) 0%, rgba(248, 248, 250, 0.95) 100%)'
            : `linear-gradient(135deg, ${activeWorkspaceInfo.color}15 0%, rgba(255, 255, 255, 0.95) 100%)`,
          border: `1.5px solid ${currentWorkspace === 'all' ? 'rgba(169, 67, 132, 0.28)' : `${activeWorkspaceInfo.color}45`}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: currentWorkspace === 'all' ? '#A94384' : activeWorkspaceInfo.color,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: `0 2px 6px ${currentWorkspace === 'all' ? '#A94384' : activeWorkspaceInfo.color}45`
            }}
          >
            {currentWorkspace === 'all' ? '👑' : activeWorkspaceInfo.iconEmoji || '🦷'}
          </span>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
              {currentWorkspace === 'all' ? (
                <>
                  Vista Global de Agendas Clínicas · <span style={{ color: '#A94384' }}>Asistente de Dirección (Nathalia Leon)</span>
                </>
              ) : (
                <>
                  Agenda Clínica:{' '}
                  <span style={{ color: activeWorkspaceInfo.color }}>
                    {activeWorkspaceInfo.name} ({activeWorkspaceInfo.consultorio})
                  </span>
                </>
              )}
              {' '}
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                ({filteredAppointments.length} {filteredAppointments.length === 1 ? 'cita visible' : 'citas visibles'})
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
              {currentWorkspace === 'all'
                ? 'Coordinación centralizada de los 4 consultorios odontológicos. Utiliza las herramientas ágiles para agendar o reasignar.'
                : `Mostrando y resaltando exclusivamente la agenda de ${activeWorkspaceInfo.specialty} en ${activeWorkspaceInfo.consultorio}.`}
            </div>
          </div>
        </div>

        {/* Herramientas Ágiles de la Asistente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${currentWorkspace === 'all' ? 'bg-[#A94384] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => {
                setWorkspace('all')
                showNotification('Mostrando agenda global de todos los consultorios')
              }}
              title="Vista global de todos los consultorios"
            >
              Todos
            </button>
            {CLINIC_DOCTORS.map((doc) => {
              const isActive = currentWorkspace === doc.id
              return (
                <button
                  key={doc.id}
                  type="button"
                  className={`px-2 py-1 text-xs rounded font-bold transition-all ${isActive ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  style={isActive ? { backgroundColor: doc.color } : {}}
                  onClick={() => {
                    setWorkspace(doc.id as any)
                    showNotification(`Filtrando y resaltando agenda de ${doc.name} (${doc.consultorio})`)
                  }}
                  title={`Filtrar agenda de ${doc.name} (${doc.consultorio})`}
                >
                  {doc.initials} ({doc.consultorio.replace('Consultorio ', 'C')})
                </button>
              )
            })}
          </div>

          <button
            className="btn-3d-magenta"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setIsNewAptModalOpen(true)}
          >
            <Plus size={14} />
            <span>+ Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Clinical Operations Alert Banner */}
      <div className="cadra-alert-banner">
        <span className="green-live-dot" />
        <p className="alert-banner-text">
          <strong><AnimatedCounter value={5} /> citas activas hoy</strong> en 4 consultorios clínicos ·{' '}
          <strong><AnimatedCounter value={filteredAppointments.length} /> citas filtradas</strong> en la agenda ·{' '}
          En atención actual: <span style={{ color: '#A94384', fontWeight: 700 }}>Valentina Ríos (Consultorio 1 - Profilaxis)</span>
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

                        const isDoctorHighlighted = currentWorkspace !== 'all' && apt.doctorId === currentWorkspace

                        return (
                          <div
                            key={apt.id}
                            className={`clinical-appointment-card ${isDoctorHighlighted ? 'is-active-doctor-highlight' : ''}`}
                            style={{
                              top: `${topPosition}px`,
                              height: `${cardHeight}px`,
                              borderLeftColor: apt.categoryColor,
                              ...(isDoctorHighlighted
                                ? {
                                    boxShadow: `0 4px 14px ${apt.doctorColor}35`,
                                    borderWidth: '2px',
                                    borderColor: `${apt.doctorColor}60`,
                                    backgroundColor: 'var(--bg-card, #ffffff)',
                                  }
                                : {}),
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
                  <span className="quarter-kpi-label">Disponibilidad de Citas</span>
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
                  setWorkspace('all')
                  showNotification('Mostrando agenda global de toda la clínica')
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
                    <span className="doc-spec">Vista consolidada de consultorios</span>
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
                      const nextId = selectedDoctorId === doc.id ? 'all' : doc.id
                      setSelectedDoctorId(nextId)
                      setWorkspace(nextId as any)
                      showNotification(
                        nextId === 'all'
                          ? 'Mostrando todos los doctores (Toda la Clínica)'
                          : `Espacio y agenda cambiados a: ${doc.name} (${doc.consultorio})`
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
                  <span>Especialista & Consultorio Asignado</span>
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
          MODAL DE REASIGNACIÓN DE TURNOS / CONSULTORIOS
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
                <label>Doctor Especialista Asignado *</label>
                <select
                  value={reassignDoctor}
                  onChange={(e) => {
                    const docId = e.target.value
                    setReassignDoctor(docId)
                    const docObj = CLINIC_DOCTORS.find((d) => d.id === docId)
                    if (docObj) {
                      setReassignBox(docObj.consultorio)
                    }
                  }}
                  required
                >
                  {CLINIC_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.consultorio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Consultorio Clínico Asignado *</label>
                <select
                  value={reassignBox}
                  onChange={(e) => setReassignBox(e.target.value)}
                  required
                >
                  <option value="Consultorio 1">Consultorio 1 — Dra. Sofía Valenzuela (General)</option>
                  <option value="Consultorio 2">Consultorio 2 — Dr. Alejandro Soto (Ortodoncia 1)</option>
                  <option value="Consultorio 3">Consultorio 3 — Dra. Claudia Rivas (Ortodoncia 2)</option>
                  <option value="Consultorio 4">Consultorio 4 — Dr. Marcos Pineda (Diseño de Sonrisa)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Día de la Cita *</label>
                  <select
                    value={reassignDayIndex}
                    onChange={(e) => setReassignDayIndex(Number(e.target.value))}
                    required
                  >
                    {DAYS_HEADER.map((d, idx) => (
                      <option key={idx} value={idx}>
                        {d.label} {d.num} Nov {d.isToday ? '(Hoy)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Hora de Inicio *</label>
                  <select
                    value={reassignStartHour}
                    onChange={(e) => setReassignStartHour(Number(e.target.value))}
                    required
                  >
                    <option value={8.0}>8:00 AM</option>
                    <option value={8.5}>8:30 AM</option>
                    <option value={9.0}>9:00 AM</option>
                    <option value={9.5}>9:30 AM</option>
                    <option value={10.0}>10:00 AM</option>
                    <option value={10.5}>10:30 AM</option>
                    <option value={11.0}>11:00 AM</option>
                    <option value={11.5}>11:30 AM</option>
                    <option value={14.0}>2:00 PM</option>
                    <option value={14.5}>2:30 PM</option>
                    <option value={15.0}>3:00 PM</option>
                    <option value={15.5}>3:30 PM</option>
                    <option value={16.0}>4:00 PM</option>
                    <option value={16.5}>4:30 PM</option>
                    <option value={17.0}>5:00 PM</option>
                  </select>
                </div>
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

      {/* =========================================================================
          MODAL DE AGENDAR NUEVA CITA (HERRAMIENTA ASISTENTE NATHALIA LEON)
          ========================================================================= */}
      {isNewAptModalOpen && (
        <div className="cadra-modal-overlay" onClick={() => setIsNewAptModalOpen(false)}>
          <div
            className="cadra-action-modal"
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-modal-header">
              <div>
                <span className="cadra-eyebrow" style={{ color: '#A94384' }}>
                  ASISTENTE DE DIRECCIÓN · NATHALIA LEON
                </span>
                <h2>Agendar Nueva Cita Odontológica</h2>
              </div>
              <button
                className="icon-close-btn"
                onClick={() => setIsNewAptModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewAppointment} className="action-modal-form">
              <div className="form-group">
                <label>Nombre Completo del Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Andrés Felipe Gómez..."
                  value={newAptPatientName}
                  onChange={(e) => setNewAptPatientName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Documento de Identidad (CC)</label>
                  <input
                    type="text"
                    placeholder="CC 1.020.394.819"
                    value={newAptPatientId}
                    onChange={(e) => setNewAptPatientId(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 310 ..."
                    value={newAptPatientPhone}
                    onChange={(e) => setNewAptPatientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Doctor Clínico & Consultorio *</label>
                <select
                  value={newAptDoctorId}
                  onChange={(e) => setNewAptDoctorId(e.target.value)}
                  required
                >
                  {CLINIC_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.consultorio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tratamiento / Procedimiento *</label>
                <select
                  value={newAptTreatment}
                  onChange={(e) => setNewAptTreatment(e.target.value)}
                  required
                >
                  <option value="Primera consulta + Diagnóstico integral">Primera consulta + Diagnóstico integral</option>
                  <option value="Control Ortodoncia (Ajuste de Arcos & Brackets)">Control Ortodoncia (Ajuste de Arcos & Brackets)</option>
                  <option value="Alineadores Invisibles · Set-up y Planificación">Alineadores Invisibles · Set-up y Planificación</option>
                  <option value="Diseño de Sonrisa · Preparación Carillas Cerámicas">Diseño de Sonrisa · Preparación Carillas Cerámicas</option>
                  <option value="Mockup Digital y Prueba de Sonrisa Estética">Mockup Digital y Prueba de Sonrisa Estética</option>
                  <option value="Profilaxis Profunda Ultrasonido y Aeropulidor">Profilaxis Profunda Ultrasonido y Aeropulidor</option>
                  <option value="Restauración Resina Filtek 3M (Calzas)">Restauración Resina Filtek 3M (Calzas)</option>
                  <option value="Blanqueamiento Dental LED Philips Zoom">Blanqueamiento Dental LED Philips Zoom</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Día *</label>
                  <select
                    value={newAptDayIndex}
                    onChange={(e) => setNewAptDayIndex(Number(e.target.value))}
                    required
                  >
                    {DAYS_HEADER.map((d, idx) => (
                      <option key={idx} value={idx}>
                        {d.label} {d.num} Nov {d.isToday ? '(Hoy)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Hora Inicio *</label>
                  <select
                    value={newAptStartHour}
                    onChange={(e) => setNewAptStartHour(Number(e.target.value))}
                    required
                  >
                    <option value={8.0}>8:00 AM</option>
                    <option value={8.5}>8:30 AM</option>
                    <option value={9.0}>9:00 AM</option>
                    <option value={9.5}>9:30 AM</option>
                    <option value={10.0}>10:00 AM</option>
                    <option value={10.5}>10:30 AM</option>
                    <option value={11.0}>11:00 AM</option>
                    <option value={11.5}>11:30 AM</option>
                    <option value={14.0}>2:00 PM</option>
                    <option value={14.5}>2:30 PM</option>
                    <option value={15.0}>3:00 PM</option>
                    <option value={15.5}>3:30 PM</option>
                    <option value={16.0}>4:00 PM</option>
                    <option value={16.5}>4:30 PM</option>
                    <option value={17.0}>5:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duración *</label>
                  <select
                    value={newAptDuration}
                    onChange={(e) => setNewAptDuration(Number(e.target.value))}
                    required
                  >
                    <option value={0.5}>30 min</option>
                    <option value={1.0}>1 hora</option>
                    <option value={1.5}>1.5 horas</option>
                    <option value={2.0}>2 horas</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notas Clínicas / Indicaciones Asistente</label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de ingreso, alergias o preparación previa..."
                  value={newAptNotes}
                  onChange={(e) => setNewAptNotes(e.target.value)}
                />
              </div>

              <div className="action-modal-footer">
                <button
                  type="button"
                  className="cadra-btn-secondary"
                  onClick={() => setIsNewAptModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-3d-magenta"
                  style={{
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Agendar Cita en Consultorio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

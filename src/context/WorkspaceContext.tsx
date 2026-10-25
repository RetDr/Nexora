import React, { createContext, useContext, useState, useEffect } from 'react'
import { vitadentConfig, ClinicDoctor } from '../config/clinic.config'

export type WorkspaceId = 'all' | 'doc-1' | 'doc-2' | 'doc-3' | 'doc-4'

export interface DoctorWorkspace {
  id: WorkspaceId
  name: string
  specialty: string
  shortTitle: string
  color: string
  initials: string
  consultorio: string
  permitsAllPatients: boolean
  iconEmoji: string
  description: string
}

export const DOCTORS_WORKSPACES: DoctorWorkspace[] = [
  {
    id: 'doc-1',
    name: 'Dra. Sofía Valenzuela',
    specialty: 'Odontología General',
    shortTitle: 'Dra. Sofía Valenzuela · General',
    color: '#A94384',
    initials: 'SV',
    consultorio: 'Consultorio 1',
    permitsAllPatients: true,
    iconEmoji: '🦷',
    description: 'Acceso global (todos los pacientes)',
  },
  {
    id: 'doc-2',
    name: 'Dr. Alejandro Soto',
    specialty: 'Ortodoncia 1',
    shortTitle: 'Dr. Alejandro Soto · Ortodoncia 1',
    color: '#0284c7',
    initials: 'AS',
    consultorio: 'Consultorio 2',
    permitsAllPatients: false,
    iconEmoji: '🦷',
    description: 'Pacientes únicos de Ortodoncia 1',
  },
  {
    id: 'doc-3',
    name: 'Dra. Claudia Rivas',
    specialty: 'Ortodoncia 2',
    shortTitle: 'Dra. Claudia Rivas · Ortodoncia 2',
    color: '#0d9488',
    initials: 'CR',
    consultorio: 'Consultorio 3',
    permitsAllPatients: false,
    iconEmoji: '🦷',
    description: 'Pacientes únicos de Ortodoncia 2',
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcos Pineda',
    specialty: 'Diseño de Sonrisa',
    shortTitle: 'Dr. Marcos Pineda · Diseño de Sonrisa',
    color: '#c2410c',
    initials: 'MP',
    consultorio: 'Consultorio 4',
    permitsAllPatients: false,
    iconEmoji: '✨',
    description: 'Pacientes únicos de Diseño de Sonrisa',
  },
]

export const ALL_WORKSPACE: DoctorWorkspace = {
  id: 'all',
  name: 'Toda la Clínica',
  specialty: 'Vista Asistente de Dirección',
  shortTitle: 'Toda la Clínica',
  color: '#A94384',
  initials: 'TC',
  consultorio: 'Todos los consultorios (1, 2, 3, 4)',
  permitsAllPatients: true,
  iconEmoji: '🏢',
  description: 'Vista Asistente - Todos los consultorios',
}

export interface WorkspaceContextType {
  currentWorkspace: WorkspaceId
  setWorkspace: (id: WorkspaceId) => void
  getActiveDoctor: () => ClinicDoctor | null
  canViewPatient: (patientDoctorId?: string | null) => boolean
  activeWorkspaceInfo: DoctorWorkspace
  workspaces: DoctorWorkspace[]
  allWorkspaces: DoctorWorkspace[]
}

const STORAGE_KEY = 'vitadent_active_workspace'

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspaceState] = useState<WorkspaceId>(() => {
    if (typeof window === 'undefined') return 'all'
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as WorkspaceId
      if (stored && ['all', 'doc-1', 'doc-2', 'doc-3', 'doc-4'].includes(stored)) {
        return stored
      }
    } catch {
      // Fallback
    }
    return 'all'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, currentWorkspace)
      } catch {
        // Ignored in restricted environments
      }
    }
  }, [currentWorkspace])

  const setWorkspace = (id: WorkspaceId) => {
    setCurrentWorkspaceState(id)
  }

  const getActiveDoctor = (): ClinicDoctor | null => {
    if (currentWorkspace === 'all') return null
    const found = vitadentConfig.doctors.find((d) => d.id === currentWorkspace)
    return found || null
  }

  const canViewPatient = (patientDoctorId?: string | null): boolean => {
    // Si no tiene doctor asignado o no se especifica, se puede ver
    if (!patientDoctorId) return true

    // 1. Vista Asistente / Toda la clínica: acceso completo
    if (currentWorkspace === 'all') return true

    // 2. Dra. Sofía Valenzuela (Odontología General): permiso para TODOS los pacientes
    if (currentWorkspace === 'doc-1') return true

    // 3. Doctores especialistas con pacientes únicos (doc-2, doc-3, doc-4)
    if (patientDoctorId === currentWorkspace) return true

    // Validación por coincidencia de nombre o clave
    const activeDoctor = DOCTORS_WORKSPACES.find((d) => d.id === currentWorkspace)
    if (activeDoctor) {
      const normalizedTarget = patientDoctorId.trim().toLowerCase()
      if (normalizedTarget === activeDoctor.id.toLowerCase()) return true
      if (normalizedTarget === activeDoctor.name.toLowerCase()) return true
      if (normalizedTarget.includes(activeDoctor.name.toLowerCase()) || activeDoctor.name.toLowerCase().includes(normalizedTarget)) {
        return true
      }
    }

    return false
  }

  const activeWorkspaceInfo: DoctorWorkspace =
    currentWorkspace === 'all'
      ? ALL_WORKSPACE
      : DOCTORS_WORKSPACES.find((w) => w.id === currentWorkspace) || ALL_WORKSPACE

  const value: WorkspaceContextType = {
    currentWorkspace,
    setWorkspace,
    getActiveDoctor,
    canViewPatient,
    activeWorkspaceInfo,
    workspaces: DOCTORS_WORKSPACES,
    allWorkspaces: [ALL_WORKSPACE, ...DOCTORS_WORKSPACES],
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace debe ser utilizado dentro de un WorkspaceProvider')
  }
  return context
}

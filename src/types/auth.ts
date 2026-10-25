export type UserRole = 'admin' | 'doctor'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  email: string
  initials: string
  title: string
  avatarColor: string
  specialty?: string
  consultorio?: string
  badgeEmoji?: string
  phone?: string
  bio?: string
}

/**
 * Catálogo de usuarios autorizados de VitaDent Clínica Odontológica.
 * Roles exclusivos: Administrador y Doctores/Especialistas.
 */
export const VITA_USERS: AuthUser[] = [
  {
    id: 'admin-1',
    name: 'Nathalia Leon',
    role: 'admin',
    email: 'administracion@vitadent.com.co',
    initials: 'NL',
    title: 'Administradora General',
    avatarColor: '#A94384',
    badgeEmoji: '👑',
    phone: '+57 312 456 7890',
    bio: 'Dirección médica, gestión operativa integral, finanzas y control de agenda clínica.'
  },
  {
    id: 'doc-1',
    name: 'Dra. Sofía Valenzuela',
    role: 'doctor',
    email: 'sofia.valenzuela@vitadent.com.co',
    specialty: 'Odontología General & Estética',
    consultorio: 'Consultorio 1',
    initials: 'SV',
    title: 'Odontóloga Especialista',
    avatarColor: '#A94384',
    badgeEmoji: '🦷',
    phone: '+57 301 234 5678',
    bio: 'Especialista en rehabilitación oral, estética dental y prevención clínica.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Alejandro Soto',
    role: 'doctor',
    email: 'alejandro.soto@vitadent.com.co',
    specialty: 'Ortodoncia',
    consultorio: 'Consultorio 2',
    initials: 'AS',
    title: 'Especialista en Ortodoncia',
    avatarColor: '#0284c7',
    badgeEmoji: '🦷',
    phone: '+57 310 987 6543',
    bio: 'Ortodoncia convencional, autoligado y alineadores invisibles de última generación.'
  },
  {
    id: 'doc-3',
    name: 'Dra. Claudia Rivas',
    role: 'doctor',
    email: 'claudia.rivas@vitadent.com.co',
    specialty: 'Endodoncia',
    consultorio: 'Consultorio 3',
    initials: 'CR',
    title: 'Especialista en Endodoncia',
    avatarColor: '#0d9488',
    badgeEmoji: '🦷',
    phone: '+57 315 444 8899',
    bio: 'Tratamientos de conductos avanzados con magnificación microscópica y cirugía apical.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcos Pineda',
    role: 'doctor',
    email: 'marcos.pineda@vitadent.com.co',
    specialty: 'Cirugía & Implantes',
    consultorio: 'Consultorio 4',
    initials: 'MP',
    title: 'Cirujano Maxilofacial & Implantólogo',
    avatarColor: '#ea580c',
    badgeEmoji: '🦷',
    phone: '+57 320 777 1122',
    bio: 'Implantología guiada, regeneración ósea y cirugía maxilofacial compleja.'
  }
]

export const findUserByEmail = (email: string): AuthUser | undefined => {
  const normalized = email.trim().toLowerCase()
  return VITA_USERS.find(u => u.email.toLowerCase() === normalized)
}

export const findUserById = (id: string): AuthUser | undefined => {
  return VITA_USERS.find(u => u.id === id)
}

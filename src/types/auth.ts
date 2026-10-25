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
 * Perfil único de inicio de sesión institucional:
 * Nathalia Leon (Asistente de Dirección y Coordinadora de Agendas Clínicas).
 */
export const VITA_USERS: AuthUser[] = [
  {
    id: 'admin-1',
    name: 'Nathalia Leon',
    role: 'admin',
    email: 'administracion@vitadent.com.co',
    initials: 'NL',
    title: 'Asistente de Dirección y Coordinadora de Agendas Clínicas',
    avatarColor: '#A94384',
    badgeEmoji: '👑',
    phone: '+57 311 405 2910',
    bio: 'Asistente de Dirección y Coordinadora de Agendas Clínicas. Supervisión centralizada de agendas, consultorios y pacientes de VitaDent.'
  }
]

export const findUserByEmail = (email: string): AuthUser | undefined => {
  const normalized = email.trim().toLowerCase()
  return VITA_USERS.find(u => u.email.toLowerCase() === normalized)
}

export const findUserById = (id: string): AuthUser | undefined => {
  return VITA_USERS.find(u => u.id === id)
}

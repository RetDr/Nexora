import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthUser, VITA_USERS, findUserByEmail, findUserById } from '../types/auth'

const STORAGE_KEY = 'vitadent_auth_user'

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginAs: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return VITA_USERS[0]
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Si el usuario cerró sesión explícitamente, no hay sesión activa
      if (stored === 'logged_out') {
        return null
      }
      // Si hay un usuario guardado
      if (stored) {
        const parsed = JSON.parse(stored)
        const match = findUserById(parsed?.id) || findUserByEmail(parsed?.email || '')
        if (match) return match
      }
      // Por defecto inicializa con Nathalia Leon (Administradora General)
      return VITA_USERS[0]
    } catch {
      return VITA_USERS[0]
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  // Sincronizar persistencia en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  }, [user])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    // Simular latencia de verificación segura SSL/TLS
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setIsLoading(false)
      return { success: false, error: 'Por favor ingresa tu correo institucional de VitaDent.' }
    }

    if (!password.trim()) {
      setIsLoading(false)
      return { success: false, error: 'Por favor ingresa tu contraseña de acceso clínico.' }
    }

    const matchedUser = findUserByEmail(cleanEmail)
    if (!matchedUser) {
      setIsLoading(false)
      return {
        success: false,
        error: 'Correo no registrado en el directorio clínico. Verifica tu dirección o usa el selector rápido de roles.',
      }
    }

    // Validación de contraseña flexible para demo clínica
    // Se acepta cualquier contraseña de al menos 4 caracteres o la oficial "vitadent2026"
    if (password.length < 4) {
      setIsLoading(false)
      return {
        success: false,
        error: 'La contraseña debe contener al menos 4 caracteres por seguridad clínica.',
      }
    }

    setUser(matchedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser))
    setIsLoading(false)
    return { success: true }
  }

  const loginAs = (userId: string) => {
    const matchedUser = findUserById(userId)
    if (matchedUser) {
      setUser(matchedUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.setItem(STORAGE_KEY, 'logged_out')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    loginAs,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}

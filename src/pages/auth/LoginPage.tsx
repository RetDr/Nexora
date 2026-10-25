import React, { useState } from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Crown,
  Key
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { VITA_USERS, AuthUser } from '../../types/auth'

interface LoginPageProps {
  onLoginSuccess?: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, loginAs, isLoading } = useAuth()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successRoleFlash, setSuccessRoleFlash] = useState<string | null>(null)

  const nathalia = VITA_USERS[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const res = await login(email, password)
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess()
    } else {
      setErrorMessage(res.error || 'Credenciales inválidas.')
    }
  }

  const handleQuickLogin = (u: AuthUser) => {
    setSuccessRoleFlash(u.id)
    setEmail(u.email)
    setPassword('vitadent2026')
    setTimeout(() => {
      loginAs(u.id)
      if (onLoginSuccess) onLoginSuccess()
    }, 280)
  }

  return (
    <div className="vita-auth-container">
      {/* Halo de luz decorativo de fondo */}
      <div className="vita-auth-glow-top" />
      <div className="vita-auth-glow-bottom" />

      {/* Tarjeta de Login Principal con estética 3D táctil */}
      <div className="vita-auth-card">
        {/* Cabecera con Logo Oficial y Certificado de Seguridad */}
        <div className="vita-auth-header">
          <div className="vita-auth-logo-wrapper">
            <img
              src="/Logo_Horizontal.png"
              alt="VitaDent Clínica Odontológica"
              className="vita-auth-logo"
            />
          </div>

          <div className="vita-auth-badge-security">
            <ShieldCheck size={14} className="text-[#A94384]" />
            <span>Acceso Seguro Institucional · Conexión Cifrada SSL/TLS 256-bit</span>
          </div>

          <h1 className="vita-auth-title">Portal de Coordinación & Dirección Clínica</h1>
          <p className="vita-auth-subtitle">
            Acceso administrativo para la Asistente de Dirección y Coordinadora de Agendas Clínicas (<strong>Nathalia Leon</strong>). Clave predeterminada: <code>vitadent2026</code>.
          </p>
        </div>

        {/* Mensaje de error si falla la validación */}
        {errorMessage && (
          <div className="vita-auth-alert-error" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario tradicional */}
        <form onSubmit={handleSubmit} className="vita-auth-form">
          {/* Campo de Correo */}
          <div className="vita-form-group">
            <label htmlFor="vita-email" className="vita-form-label">
              Correo Institucional
            </label>
            <div className="vita-input-box">
              <span className="vita-input-icon">
                <Mail size={16} />
              </span>
              <input
                id="vita-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="administracion@vitadent.com.co"
                className="vita-input-field"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Campo de Contraseña con toggle de visibilidad */}
          <div className="vita-form-group">
            <div className="vita-label-row">
              <label htmlFor="vita-password" className="vita-form-label">
                Contraseña de Acceso Clínico
              </label>
              <button
                type="button"
                className="vita-link-btn"
                onClick={() =>
                  alert(
                    'La contraseña predeterminada para el acceso administrativo es: vitadent2026. También puedes hacer clic en el botón de "Acceso Rápido en 1 Clic".'
                  )
                }
              >
                ¿Ayuda con tu contraseña?
              </button>
            </div>
            <div className="vita-input-box">
              <span className="vita-input-icon">
                <Lock size={16} />
              </span>
              <input
                id="vita-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="vitadent2026"
                className="vita-input-field"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="vita-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                aria-label="Alternar visibilidad de contraseña"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Fila Recordar Sesión */}
          <div className="vita-remember-row">
            <label className="vita-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="vita-checkbox"
              />
              <span>Mantener sesión activa en esta estación clínica</span>
            </label>
          </div>

          {/* Botón Principal 3D Magenta */}
          <button
            type="submit"
            className="vita-btn-primary-3d"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="vita-btn-loading">
                <span className="vita-spinner" />
                <span>Verificando credenciales oficiales...</span>
              </span>
            ) : (
              <>
                <span>Iniciar Sesión en VitaDent</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Separador con etiqueta */}
        <div className="vita-auth-divider">
          <span className="vita-divider-line" />
          <span className="vita-divider-text">
            O ACCESO DIRECTO EN 1 CLIC
          </span>
          <span className="vita-divider-line" />
        </div>

        {/* Botón Directo de Acceso Rápido para Nathalia Leon */}
        <div className="vita-quick-roles-section">
          <p className="vita-quick-roles-tip">
            <Sparkles size={13} className="text-[#A94384]" />
            <span>Haz clic para ingresar inmediatamente como Asistente de Dirección:</span>
          </p>

          <div className="vita-roles-grid">
            {nathalia && (
              <button
                key={nathalia.id}
                type="button"
                className={`vita-role-card vita-role-card-admin ${
                  successRoleFlash === nathalia.id ? 'selected' : ''
                }`}
                onClick={() => handleQuickLogin(nathalia)}
                title={`Entrar de inmediato como ${nathalia.name}`}
              >
                <div className="vita-role-card-left">
                  <div
                    className="vita-role-avatar"
                    style={{
                      backgroundColor: nathalia.avatarColor,
                      boxShadow: `0 3px 10px ${nathalia.avatarColor}40`,
                    }}
                  >
                    <span>{nathalia.initials}</span>
                    <span className="vita-role-avatar-badge">
                      <Crown size={10} />
                    </span>
                  </div>

                  <div className="vita-role-info">
                    <div className="vita-role-name-row">
                      <span className="vita-role-name">{nathalia.name}</span>
                      <span className="vita-role-tag admin">Coordinación Clínica</span>
                    </div>
                    <span className="vita-role-specialty">
                      {nathalia.title}
                    </span>
                  </div>
                </div>

                <div className="vita-role-card-right flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A8A8F]">
                    <Key size={11} className="text-[#A94384]" />
                    <code>vitadent2026</code>
                  </span>
                  <span className="vita-role-enter-pill">
                    {successRoleFlash === nathalia.id ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : (
                      <span>Entrar en 1 Clic</span>
                    )}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Pie de la tarjeta de login */}
        <div className="vita-auth-card-footer">
          <div className="vita-auth-footer-note">
            <Building2 size={13} className="text-[#8A8A8F]" />
            <span>VitaDent Clínica Odontológica S.A.S. · Sede Principal</span>
          </div>
          <div className="vita-auth-footer-help">
            <HelpCircle size={13} className="text-[#8A8A8F]" />
            <span>Soporte TI: sistemas@vitadent.com.co</span>
          </div>
        </div>
      </div>

      {/* Sello inferior de Atenea Studio */}
      <footer className="vita-auth-page-footer">
        <div className="atenea-studio-badge">
          <span className="atenea-sparkle">✦</span>
          <span>Diseño, Seguridad & Arquitectura por</span>
          <strong className="atenea-brand-name">Atenea Studio</strong>
        </div>
        <span className="footer-sep">•</span>
        <span>VitaDent Suite v2.6.4</span>
      </footer>
    </div>
  )
}

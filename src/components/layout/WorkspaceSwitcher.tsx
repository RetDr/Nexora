import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  Check,
  Layers,
  Info,
  ShieldCheck,
  Sparkles,
  Lock
} from 'lucide-react'
import { useWorkspace, WorkspaceId, DoctorWorkspace } from '../../context/WorkspaceContext'

export const WorkspaceSwitcher: React.FC = () => {
  const { currentWorkspace, setWorkspace, activeWorkspaceInfo, allWorkspaces } = useWorkspace()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (id: WorkspaceId) => {
    setWorkspace(id)
    setIsOpen(false)
  }

  const isAll = currentWorkspace === 'all'

  return (
    <div className="vita-ws-wrapper" ref={menuRef}>
      {/* Botón Trigger Estilizado en 3D Táctil */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="vita-ws-trigger-btn"
        title="Cambiar espacio de trabajo clínico"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Indicador de Estado / Icono */}
        <div
          className="vita-ws-icon-box"
          style={{
            backgroundColor: isAll ? '#A94384' : activeWorkspaceInfo.color,
          }}
        >
          {isAll ? '🏢' : activeWorkspaceInfo.iconEmoji}
        </div>

        {/* Textos del Espacio Activo */}
        <div className="vita-ws-text-col">
          <div className="vita-ws-sub-row">
            <span className="vita-ws-sub-label">Espacio</span>
            <span
              className="vita-ws-badge-pill"
              style={{
                backgroundColor: isAll || activeWorkspaceInfo.permitsAllPatients ? '#A94384' : activeWorkspaceInfo.color,
              }}
            >
              {isAll ? 'Global' : activeWorkspaceInfo.consultorio.replace('Consultorio ', 'Box ')}
            </span>
          </div>

          <div className="vita-ws-main-title">
            {isAll ? '🏢 Toda la Clínica' : `${activeWorkspaceInfo.name}`}
          </div>
        </div>

        {/* Chevron Animado */}
        <ChevronDown
          size={14}
          className="vita-ws-chevron"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {/* Menú Desplegable Premium Táctil */}
      {isOpen && (
        <div className="vita-ws-dropdown">
          {/* Header del Desplegable */}
          <div className="vita-ws-dropdown-header">
            <div className="vita-ws-dropdown-header-title">
              <Layers size={13} />
              <span>Espacios de Trabajo VitaDent</span>
            </div>
            <p className="vita-ws-dropdown-header-desc">
              Supervisa la clínica completa o filtra pacientes y agendas por especialista:
            </p>
          </div>

          {/* Lista de Opciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '340px', overflowY: 'auto' }}>
            {allWorkspaces.map((ws: DoctorWorkspace) => {
              const isSelected = currentWorkspace === ws.id
              const isWsAll = ws.id === 'all'

              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => handleSelect(ws.id)}
                  className={`vita-ws-item-btn ${isSelected ? 'active' : ''}`}
                >
                  <div className="vita-ws-item-left">
                    {/* Icono / Emoji con badge de color */}
                    <div
                      className="vita-ws-item-icon"
                      style={{
                        backgroundColor: ws.id === 'all' ? '#141517' : ws.color,
                      }}
                    >
                      {ws.iconEmoji}
                    </div>

                    {/* Detalles */}
                    <div className="vita-ws-item-info">
                      <div className="vita-ws-item-name">
                        {ws.name}
                      </div>

                      <div className="vita-ws-item-spec">
                        {ws.id === 'all' ? 'Coordinación Asistente' : ws.specialty} · {ws.permitsAllPatients ? 'Acceso a Todos' : ws.consultorio}
                      </div>

                      <div style={{ fontSize: '9.5px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {isWsAll ? (
                          <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldCheck size={10} />
                            Todos los consultorios
                          </span>
                        ) : ws.permitsAllPatients ? (
                          <span style={{ color: '#A94384', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Sparkles size={10} />
                            Acceso global a pacientes
                          </span>
                        ) : (
                          <span style={{ color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Lock size={9} />
                            Pacientes únicos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Indicador de Selección */}
                  <div style={{ paddingLeft: '8px' }}>
                    {isSelected ? (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#A94384',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: '1.5px solid var(--border-light, #e2e8f0)'
                        }}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer Informativo */}
          <div style={{
            padding: '8px 10px',
            backgroundColor: 'var(--bg-card-subtle, #f8fafc)',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
            borderRadius: '0 0 12px 12px',
            fontSize: '10.5px',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <Info size={12} style={{ color: '#A94384', flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Dra. Sofía Valenzuela</strong> tiene permiso para ver todos los pacientes. Los demás especialistas acceden a sus pacientes únicos.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

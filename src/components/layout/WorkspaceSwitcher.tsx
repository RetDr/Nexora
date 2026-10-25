import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  Lock,
  Layers,
  Info
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
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Botón Trigger Estilizado en 3D Táctil */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="vita-ws-trigger-btn flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 select-none group"
        style={{
          background: isAll
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 248, 250, 0.9) 100%)'
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, ${activeWorkspaceInfo.color}08 100%)`,
          border: `1.5px solid ${isAll ? 'rgba(169, 67, 132, 0.28)' : `${activeWorkspaceInfo.color}55`}`,
          boxShadow: isOpen
            ? `0 6px 18px ${activeWorkspaceInfo.color}25, 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
            : '0 2px 6px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
        title="Cambiar espacio de trabajo clínico"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Indicador de Estado / Icono */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: isAll ? '#A94384' : activeWorkspaceInfo.color,
            color: '#ffffff',
            boxShadow: `0 2px 6px ${isAll ? '#A94384' : activeWorkspaceInfo.color}40`,
          }}
        >
          {isAll ? '🏢' : activeWorkspaceInfo.iconEmoji}
        </div>

        {/* Textos del Espacio Activo */}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8F]">
              Espacio Activo
            </span>
            {isAll ? (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#A94384] text-white">
                Global
              </span>
            ) : activeWorkspaceInfo.permitsAllPatients ? (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#A94384] text-white">
                Acceso Total
              </span>
            ) : (
              <span
                className="text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white"
                style={{ backgroundColor: activeWorkspaceInfo.color }}
              >
                {activeWorkspaceInfo.consultorio.replace('Consultorio ', 'Box ')}
              </span>
            )}
          </div>

          <div className="text-[12.5px] font-bold text-main mt-0.5 max-w-[190px] truncate">
            {isAll ? '🏢 Toda la Clínica' : `${activeWorkspaceInfo.iconEmoji} ${activeWorkspaceInfo.shortTitle}`}
          </div>
        </div>

        {/* Chevron Animado */}
        <ChevronDown
          size={14}
          className={`text-[#8A8A8F] transition-transform duration-200 ml-1 group-hover:text-main ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menú Desplegable Premium Táctil */}
      {isOpen && (
        <div
          className="vita-ws-dropdown absolute left-0 mt-2 w-[340px] rounded-2xl bg-white dark:bg-[#1a1b1e] border border-border-light shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{
            boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(169, 67, 132, 0.08)',
          }}
        >
          {/* Header del Desplegable */}
          <div className="p-3.5 bg-gradient-to-r from-slate-50 to-pink-50/40 dark:from-neutral-900 dark:to-pink-950/20 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-main font-bold text-xs uppercase tracking-wider">
                <Layers size={13} className="text-[#A94384]" />
                <span>Espacios de Trabajo VitaDent</span>
              </div>
              <span className="text-[10px] font-semibold text-muted bg-white/80 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-border-light">
                5 Vistas
              </span>
            </div>
            <p className="text-[11px] text-muted mt-1 leading-snug">
              Supervisa la clínica completa o filtra pacientes y agendas por especialista:
            </p>
          </div>

          {/* Lista de Opciones */}
          <div className="p-2 space-y-1.5 max-h-[380px] overflow-y-auto">
            {allWorkspaces.map((ws: DoctorWorkspace) => {
              const isSelected = currentWorkspace === ws.id
              const isWsAll = ws.id === 'all'

              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => handleSelect(ws.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group/item relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-50/80 to-purple-50/50 dark:from-pink-950/30 dark:to-purple-950/20 border border-[#A94384]/40 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-neutral-800/60 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icono / Emoji con badge de color */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 shadow-sm transition-transform group-hover/item:scale-105"
                      style={{
                        backgroundColor: ws.color,
                        color: '#ffffff',
                        boxShadow: `0 2px 8px ${ws.color}35`,
                      }}
                    >
                      {ws.iconEmoji}
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[13px] font-bold ${
                            isSelected ? 'text-[#A94384]' : 'text-main'
                          }`}
                        >
                          {ws.id === 'all' ? ws.name : ws.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-secondary font-medium">
                          {ws.id === 'all' ? 'Vista Asistente' : ws.specialty}
                        </span>
                        <span className="text-[10px] text-muted">•</span>
                        <span className="text-[10px] font-semibold text-muted">
                          {ws.consultorio}
                        </span>
                      </div>

                      {/* Nota de Permisos de Pacientes */}
                      <span className="text-[10px] mt-0.5 font-medium flex items-center gap-1">
                        {isWsAll ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck size={11} />
                            Todos los consultorios
                          </span>
                        ) : ws.permitsAllPatients ? (
                          <span className="text-[#A94384] font-semibold flex items-center gap-0.5">
                            <Sparkles size={11} />
                            Acceso global (todos los pacientes)
                          </span>
                        ) : (
                          <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                            <Lock size={10} />
                            Pacientes únicos
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Indicador de Selección */}
                  <div className="flex items-center pl-2">
                    {isSelected ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: '#A94384' }}
                      >
                        <Check size={13} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-neutral-700 group-hover/item:border-[#A94384]/50" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer Informativo */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-neutral-900 border-t border-border-light text-[11px] text-muted flex items-start gap-1.5">
            <Info size={12} className="text-[#A94384] flex-shrink-0 mt-0.5" />
            <span>
              <strong>Dra. Sofía Valenzuela</strong> tiene permiso para ver todos los pacientes. Los demás especialistas acceden a sus pacientes únicos.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

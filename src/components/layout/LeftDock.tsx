import React from 'react'
import { Search, Plus, Moon, Sun, Target, Settings } from 'lucide-react'

interface LeftDockProps {
  currentPath: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenSearch: () => void
  onOpenCreate: () => void
  onNavigate: (path: string) => void
}

export const LeftDock: React.FC<LeftDockProps> = ({
  currentPath,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenCreate,
  onNavigate,
}) => {
  const isSettings = currentPath === '/settings'

  return (
    <aside className="cadra-floating-dock" aria-label="Quick actions dock">
      <button
        className="dock-item"
        onClick={onOpenSearch}
        title="Quick search (Cmd+K)"
        aria-label="Search"
      >
        <Search size={17} strokeWidth={2.2} />
      </button>

      <button
        className="dock-item"
        onClick={onOpenCreate}
        title="Create new record"
        aria-label="Create new"
      >
        <Plus size={19} strokeWidth={2.4} />
      </button>

      <button
        className="dock-item"
        onClick={onToggleDarkMode}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Theme toggle"
      >
        {darkMode ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
      </button>

      <button
        className="dock-item"
        onClick={() => onNavigate('/inicio')}
        title="Inicio / Resumen General"
        aria-label="Dashboard"
      >
        <Target size={17} strokeWidth={2.2} />
      </button>

      <button
        className={`dock-item ${isSettings ? 'active' : ''}`}
        onClick={() => onNavigate('/settings')}
        title="Settings & Workspace"
        aria-label="Settings"
      >
        <Settings size={17} strokeWidth={2.2} />
        {isSettings && <span className="dock-active-dot" />}
      </button>
    </aside>
  )
}


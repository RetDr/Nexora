import React, { useState, useEffect } from 'react'
import { Search, X, ArrowRight, Factory, ShoppingCart, Boxes, Wallet, Users, FileText } from 'lucide-react'

interface QuickSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const items = [
    { title: 'Carlos García: Implante Titanio + Corona (Box 1)', path: '/agenda', cat: 'Agenda', icon: Factory },
    { title: 'Laura Gómez: Control Brackets Ortodoncia (Box 2)', path: '/agenda', cat: 'Agenda', icon: Factory },
    { title: 'Presupuesto PRE-1021: Ortodoncia Integral ($3.200.000)', path: '/presupuestos', cat: 'Presupuestos', icon: ShoppingCart },
    { title: 'Caja & Tarifas de Tratamientos (Cobro Recepción)', path: '/precios', cat: 'Precios', icon: ShoppingCart },
    { title: 'Directorio de Pacientes y Convenios EPS', path: '/pacientes', cat: 'Pacientes', icon: Users },
    { title: 'Stock Crítico: Anestesia Scandonest 2% (Reordenar)', path: '/stock', cat: 'Stock', icon: Boxes },
    { title: 'Pedidos a Depósito: Dentales Antioquia', path: '/stock', cat: 'Stock', icon: Boxes },
    { title: 'Laboratorio Dental: Corona Zirconio LAB-401', path: '/stock', cat: 'Laboratorio', icon: Boxes },
    { title: 'Liquidación Honorarios Médicos (Dra. Valenzuela)', path: '/pagos', cat: 'Pagos', icon: Wallet },
    { title: 'Factura FAC-4101 (Carlos García $2.500.000)', path: '/pagos', cat: 'Pagos', icon: FileText },
    { title: 'Configuración de la Clínica & Licencia RUT', path: '/settings', cat: 'Configuración', icon: FileText },
  ]

  const filtered = query
    ? items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.cat.toLowerCase().includes(query.toLowerCase()))
    : items

  const handleSelect = (path: string) => {
    onNavigate(path)
    onClose()
    setQuery('')
  }

  return (
    <div className="cadra-modal-overlay" onClick={onClose}>
      <div className="cadra-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={18} className="search-modal-icon" />
          <input
            autoFocus
            type="text"
            placeholder="Search orders, products, invoices, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-modal-input"
          />
          <kbd className="search-modal-esc" onClick={onClose}>ESC</kbd>
        </div>

        <div className="search-modal-results">
          {filtered.length === 0 ? (
            <div className="search-modal-empty">No results found for "{query}"</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleSelect(item.path)}
                >
                  <div className="search-result-left">
                    <Icon size={15} className="result-cat-icon" />
                    <span className="result-title">{item.title}</span>
                  </div>
                  <div className="search-result-right">
                    <span className="result-cat-badge">{item.cat}</span>
                    <ArrowRight size={13} className="result-arrow" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}


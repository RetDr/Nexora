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
    { title: 'WO-2047: Ridgeline frameset ×15', path: '/manufacturing/scheduling', cat: 'Manufacturing', icon: Factory },
    { title: 'WO-2041: Ridgeline Gravel ×12', path: '/manufacturing/orders', cat: 'Manufacturing', icon: Factory },
    { title: 'SO-5321: Rosewood Bikes ($10,829)', path: '/sales/pipeline', cat: 'Sales', icon: ShoppingCart },
    { title: 'Point of Sale (Division St showroom)', path: '/pos', cat: 'Sales', icon: ShoppingCart },
    { title: 'Contacts & Address Book', path: '/contacts', cat: 'Sales', icon: Users },
    { title: 'Ridgeline Gravel (16 on hand)', path: '/inventory/stock', cat: 'Stock', icon: Boxes },
    { title: 'PO-3313: Northgate Saddles', path: '/purchasing/orders', cat: 'Purchasing', icon: Boxes },
    { title: 'SHP-7711: Exception at Blaine, WA', path: '/logistics/shipments', cat: 'Logistics', icon: Boxes },
    { title: 'General ledger journal entries', path: '/accounting/ledger', cat: 'Accounting', icon: Wallet },
    { title: 'Invoice INV-24184 (Harbor & Hill)', path: '/accounting/invoices', cat: 'Accounting', icon: FileText },
    { title: 'Company Settings & Tax ID', path: '/settings', cat: 'Settings', icon: FileText },
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


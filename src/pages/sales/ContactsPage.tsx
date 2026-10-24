import React, { useState } from 'react'
import {
  Search,
  Plus,
  Star,
  Mail,
  Phone,
  MapPin,
  List,
  LayoutGrid,
  ShoppingBag,
  Users,
  PieChart
} from 'lucide-react'
import { contactsData } from '../../data/cadraData'
import { ContactItem } from '../../types'

interface ContactsPageProps {
  onNavigate: (path: string) => void
  onOpenCreate: () => void
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onNavigate, onOpenCreate }) => {
  const [contacts, setContacts] = useState<ContactItem[]>(contactsData)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Customers' | 'Vendors' | 'Partners'>('All')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const toggleStar = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const filtered = contacts.filter((c) => {
    const matchesQuery =
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.rep.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())

    const matchesType =
      typeFilter === 'All'
        ? true
        : typeFilter === 'Customers'
        ? c.type === 'Customer'
        : typeFilter === 'Vendors'
        ? c.type === 'Vendor'
        : c.type === 'Partner'

    const matchesLetter = activeLetter ? c.company.toUpperCase().startsWith(activeLetter) : true

    return matchesQuery && matchesType && matchesLetter
  })

  // Group by first letter
  const grouped: Record<string, ContactItem[]> = {}
  filtered.forEach((c) => {
    const letter = c.company[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(c)
  })

  const sortedLetters = Object.keys(grouped).sort()
  const starredContacts = contacts.filter((c) => c.starred)

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Contacts</span>
      </div>

      {/* Header with Submodule Pills */}
      <div className="cadra-page-header">
        <div className="title-with-submodules">
          <h1 className="cadra-page-title">Contacts</h1>
          <div className="cadra-submodule-pills">
            <button className="submodule-pill" onClick={() => onNavigate('/sales/pipeline')}>
              <span>Sales</span>
              <span className="cadra-badge badge-orange">4</span>
            </button>
            <button className="submodule-pill" onClick={() => onNavigate('/pos')}>
              <ShoppingBag size={13} />
              <span>POS</span>
            </button>
            <button className="submodule-pill active" onClick={() => onNavigate('/contacts')}>
              <Users size={13} />
              <span>Contacts</span>
            </button>
          </div>
        </div>

        <div className="cadra-header-actions">
          <button className="cadra-btn-primary" onClick={onOpenCreate}>
            <Plus size={15} />
            <span>New contact</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search + Type Filter + View Mode */}
      <div className="contacts-control-bar">
        <div className="contacts-search-box">
          <Search size={15} className="text-secondary" />
          <input
            type="text"
            placeholder="Search name, person, city or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="cadra-pill-group">
          {(['All', 'Customers', 'Vendors', 'Partners'] as const).map((t) => (
            <button
              key={t}
              className={`pill-switch-btn ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="view-toggle-buttons">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Split: Address Book (left) vs Starred & Stats (right) */}
      <div className="contacts-split-layout">
        {/* Left: Address book card */}
        <div className="cadra-card address-book-card">
          <div className="address-book-head">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-secondary" />
              <h3>Address book</h3>
            </div>
            <span className="total-companies-badge">{contacts.length} companies</span>
          </div>

          {/* Alphabet Scrubber */}
          <div className="alphabet-scrubber">
            <button
              className={`alpha-char-btn ${activeLetter === null ? 'active' : ''}`}
              onClick={() => setActiveLetter(null)}
            >
              All
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                className={`alpha-char-btn ${activeLetter === char ? 'active' : ''}`}
                onClick={() => setActiveLetter(activeLetter === char ? null : char)}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Contact Groups */}
          <div className="contacts-groups-list">
            {sortedLetters.length === 0 ? (
              <div className="empty-contacts-state">No contacts match your filters.</div>
            ) : (
              sortedLetters.map((letter) => (
                <div key={letter} className="contact-letter-section">
                  <div className="letter-header">
                    <span className="letter-char">{letter}</span>
                    <span className="letter-count">{grouped[letter].length}</span>
                  </div>

                  <div className="letter-contacts-list">
                    {grouped[letter].map((c) => (
                      <div key={c.id} className="contact-row-item">
                        <button
                          className={`star-toggle-btn ${c.starred ? 'starred' : ''}`}
                          onClick={() => toggleStar(c.id)}
                          title="Star contact"
                        >
                          <Star size={15} fill={c.starred ? '#f59e0b' : 'none'} stroke={c.starred ? '#f59e0b' : '#9ca3af'} />
                        </button>

                        <div className="contact-avatar-circle">{c.initials}</div>

                        <div className="contact-main-info">
                          <span className="contact-company-name">{c.company}</span>
                          <span className="contact-rep-title">{c.rep}</span>
                        </div>

                        <span
                          className={`contact-type-tag ${
                            c.type === 'Vendor' ? 'tag-vendor' : c.type === 'Customer' ? 'tag-customer' : 'tag-partner'
                          }`}
                        >
                          ● {c.type}
                        </span>

                        <div className="contact-location-info">
                          <MapPin size={13} className="text-secondary" />
                          <span>
                            {c.city}
                            {c.state ? `, ${c.state}` : ''}
                          </span>
                        </div>

                        <span className="contact-category-info">{c.category}</span>

                        <div className="contact-action-buttons">
                          <a href={`mailto:${c.email}`} className="contact-action-btn" title={c.email}>
                            <Mail size={14} />
                          </a>
                          <a href={`tel:${c.phone}`} className="contact-action-btn" title={c.phone}>
                            <Phone size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar: Starred + Who's in the book */}
        <aside className="contacts-sidebar-panel">
          {/* Starred */}
          <div className="cadra-card contacts-side-card">
            <div className="side-card-title-row">
              <Star size={16} className="text-amber-500" />
              <h3>Starred</h3>
            </div>

            {starredContacts.length === 0 ? (
              <div className="starred-empty-box">
                <Star size={20} className="text-secondary mb-1" />
                <strong>Nothing starred yet</strong>
                <p>Star the people you call every week and they stay right here.</p>
              </div>
            ) : (
              <div className="starred-contacts-list">
                {starredContacts.map((sc) => (
                  <div key={sc.id} className="starred-mini-item">
                    <span className="contact-avatar-circle small">{sc.initials}</span>
                    <div className="starred-mini-texts">
                      <span className="starred-mini-company">{sc.company}</span>
                      <span className="starred-mini-rep">{sc.rep}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Who's in the book Donut Chart */}
          <div className="cadra-card contacts-side-card mt-4">
            <div className="side-card-title-row">
              <PieChart size={16} className="text-secondary" />
              <h3>Who’s in the book</h3>
            </div>

            <div className="donut-chart-container">
              <div className="donut-graphic-wrapper">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  {/* Outer segments */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  {/* Customers: 10 / 22 = 45% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="12"
                    strokeDasharray="108 238"
                    strokeDashoffset="0"
                  />
                  {/* Vendors: 9 / 22 = 41% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="12"
                    strokeDasharray="98 238"
                    strokeDashoffset="-108"
                  />
                  {/* Partners: 3 / 22 = 14% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="33 238"
                    strokeDashoffset="-206"
                  />
                </svg>
                <div className="donut-center-label">
                  <span className="donut-big-num">{contacts.length}</span>
                  <span className="donut-sub">companies</span>
                </div>
              </div>

              <div className="donut-legend-stack">
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot dot-blue" />
                    <span>Customers</span>
                  </span>
                  <strong>10</strong>
                </div>
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot dot-terracotta" />
                    <span>Vendors</span>
                  </span>
                  <strong>9</strong>
                </div>
                <div className="legend-row">
                  <span className="flex items-center gap-2">
                    <i className="legend-dot dot-green" />
                    <span>Partners</span>
                  </span>
                  <strong>3</strong>
                </div>
              </div>
            </div>

            <div className="book-geo-footer">
              <span>🌐 19 cities · 5 outside the US</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


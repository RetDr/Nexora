import React, { useState } from 'react'
import {
  Building2,
  Users,
  Bell,
  Sun,
  Layers,
  Database,
  Lock,
  Bike,
  CheckCircle2
} from 'lucide-react'

interface SettingsPageProps {
  onToast: (msg: string) => void
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onToast }) => {
  const [activeTab, setActiveTab] = useState('company')
  const [tradingName, setTradingName] = useState('Larkspur Cycle Works')
  const [legalEntity, setLegalEntity] = useState('Larkspur Cycle Works LLC')
  const [address, setAddress] = useState('2210 SE Division St, Portland, OR 97202')
  const [taxId, setTaxId] = useState('93-4418207')
  const [billingEmail, setBillingEmail] = useState('hello@larkspurcycles.com')
  const [phone, setPhone] = useState('(503) 555-0100')
  const [currency, setCurrency] = useState('USD')

  const navItems = [
    { id: 'company', label: 'Company', sub: 'Name, address, tax ID', icon: Building2 },
    { id: 'users', label: 'Users & roles', sub: 'Who can see and change what', icon: Users },
    { id: 'notifications', label: 'Notifications', sub: 'What reaches your bell', icon: Bell },
    { id: 'appearance', label: 'Appearance', sub: 'Theme, accent, density', icon: Sun },
    { id: 'integrations', label: 'Integrations', sub: 'Bank, carriers, terminals', icon: Layers },
    { id: 'data', label: 'Data', sub: 'Export or start over', icon: Database },
  ]

  const handleSave = () => {
    onToast('Company profile settings saved to browser storage.')
  }

  return (
    <div className="cadra-page-container">
      {/* Breadcrumbs */}
      <div className="cadra-breadcrumbs">
        <span>Larkspur</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">Settings</span>
      </div>

      <h1 className="cadra-page-title mb-4">Settings</h1>

      <div className="settings-split-3-col">
        {/* Col 1: Settings Navigation */}
        <aside className="settings-nav-sidebar">
          <div className="settings-nav-cards-stack">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <div
                  key={item.id}
                  className={`settings-nav-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="settings-nav-icon">
                    <Icon size={16} />
                  </div>
                  <div className="settings-nav-texts">
                    <strong>{item.label}</strong>
                    <p>{item.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="settings-save-local-note">
            <Lock size={13} className="text-secondary" />
            <span>Changes save to this browser.</span>
          </div>
        </aside>

        {/* Col 2: Settings Content Form */}
        <div className="cadra-card settings-form-card">
          <div className="settings-head-row">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-secondary" />
              <h3>Company profile</h3>
            </div>
          </div>
          <p className="text-xs text-muted mb-4">
            Heads every invoice, purchase order and packing slip.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
            className="settings-inputs-form"
          >
            <div className="form-group">
              <label>Trading name</label>
              <input
                type="text"
                value={tradingName}
                onChange={(e) => setTradingName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Legal entity</label>
              <input
                type="text"
                value={legalEntity}
                onChange={(e) => setLegalEntity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Registered address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>EIN / tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Billing email</label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Fiscal year starts</label>
                <input type="text" defaultValue="January" readOnly />
              </div>

              <div className="form-group">
                <label>Time zone</label>
                <input type="text" defaultValue="America/Los_Angeles (PT)" readOnly />
              </div>
            </div>

            <button type="submit" className="cadra-btn-primary mt-2">
              <span>Save profile</span>
            </button>
          </form>
        </div>

        {/* Col 3: Live Document Preview Card */}
        <aside className="cadra-card live-doc-preview-card">
          <div className="chart-card-header">
            <div className="flex items-center gap-2">
              <span className="text-secondary">📄</span>
              <h3>On your documents</h3>
            </div>
            <span className="cadra-tag-pill tag-blue">Live preview</span>
          </div>

          <div className="document-sheet-mockup">
            <div className="doc-sheet-head">
              <div className="doc-brand">
                <div className="cadra-brand-icon small">
                  <Bike size={14} />
                </div>
                <div>
                  <strong className="text-sm">{tradingName}</strong>
                  <div className="text-xs text-muted">{legalEntity}</div>
                </div>
              </div>
              <div className="doc-invoice-number">
                <span className="text-xs text-muted">INVOICE</span>
                <strong>INV-24184</strong>
              </div>
            </div>

            <div className="doc-metadata-grid">
              <div className="doc-meta-col">
                <span className="doc-meta-label">FROM</span>
                <p className="doc-meta-val">{address}</p>
              </div>

              <div className="doc-meta-col">
                <span className="doc-meta-label">TAX ID</span>
                <p className="doc-meta-val">{taxId}</p>
              </div>
            </div>

            <div className="doc-metadata-grid mt-2">
              <div className="doc-meta-col">
                <span className="doc-meta-label">CONTACT</span>
                <p className="doc-meta-val">{billingEmail}</p>
                <p className="doc-meta-val">{phone}</p>
              </div>

              <div className="doc-meta-col">
                <span className="doc-meta-label">AMOUNTS IN</span>
                <p className="doc-meta-val font-bold">{currency}</p>
              </div>
            </div>

            {/* Skeleton document lines */}
            <div className="doc-skeleton-lines mt-4">
              <div className="skeleton-line full" />
              <div className="skeleton-line full" />
              <div className="skeleton-line half" />
            </div>

            <div className="doc-footer-timezone">
              Fiscal year from January · times in America/Los_Angeles (PT)
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


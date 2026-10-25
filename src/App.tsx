import React, { useState, useEffect } from 'react'
import { Header } from './components/layout/Header'
import { LeftDock } from './components/layout/LeftDock'
import { QuickSearchModal } from './components/layout/QuickSearchModal'
import { QuickCreateModal } from './components/layout/QuickCreateModal'
import { Toast } from './components/ui/Toast'

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { SchedulingPage } from './pages/manufacturing/SchedulingPage'
import { WorkOrdersPage } from './pages/manufacturing/WorkOrdersPage'
import { PipelinePage } from './pages/sales/PipelinePage'
import { ContactsPage } from './pages/sales/ContactsPage'
import { POSPage } from './pages/sales/POSPage'
import { StockPage } from './pages/stock/StockPage'
import { PurchaseOrdersPage } from './pages/stock/PurchaseOrdersPage'
import { ShipmentsPage } from './pages/stock/ShipmentsPage'
import { GeneralLedgerPage } from './pages/accounting/GeneralLedgerPage'
import { InvoicesPage } from './pages/accounting/InvoicesPage'
import { PaymentsPage } from './pages/accounting/PaymentsPage'
import { ReportingOverviewPage } from './pages/reporting/ReportingOverviewPage'
import { ReportBuilderPage } from './pages/reporting/ReportBuilderPage'
import { DirectoryProfileDrawer } from './pages/hr/DirectoryProfileDrawer'
import { SettingsPage } from './pages/settings/SettingsPage'

export function App() {
  const getPathFromHash = () => {
    const raw = window.location.hash.replace(/^#/, '')
    return raw || '/agenda' // Por defecto abre la Agenda de Sillones de VitaDent
  }

  const [currentPath, setCurrentPath] = useState<string>(getPathFromHash)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    if (params.get('theme') === 'dark') return true
    return localStorage.getItem('cadra-theme') === 'dark'
  })
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('cadra-theme', next ? 'dark' : 'light')
      }
      return next
    })
  }

  useEffect(() => {
    const handleHashChange = () => {
      const p = getPathFromHash()
      setCurrentPath(p)
      if (p.includes('/hr/directory/s-noor')) {
        setIsProfileOpen(true)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path: string) => {
    window.location.hash = path
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 3500)
  }

  // Render current view
  const renderView = () => {
    // VitaDent routes + legacy alias routes
    if (currentPath === '/agenda' || currentPath === '/manufacturing/scheduling') {
      return <SchedulingPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/pacientes' || currentPath === '/contacts') {
      return <ContactsPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/pagos' || currentPath === '/accounting/payments') {
      return <PaymentsPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} onToast={showToast} />
    }
    if (currentPath === '/inicio' || currentPath === '/dashboard' || currentPath === '/' || currentPath === '') {
      return <DashboardPage onNavigate={navigate} />
    }
    if (currentPath === '/presupuestos' || currentPath === '/sales/pipeline' || currentPath.startsWith('/sales')) {
      return <PipelinePage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/stock' || currentPath === '/inventory/stock') {
      return <StockPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/precios' || currentPath === '/pos') {
      return <POSPage onNavigate={navigate} onToast={showToast} />
    }
    if (currentPath === '/informes' || currentPath === '/reporting/overview' || currentPath === '/reporting') {
      return <ReportingOverviewPage onNavigate={navigate} />
    }
    if (currentPath === '/reporting/builder') {
      return <ReportBuilderPage onNavigate={navigate} />
    }
    if (currentPath === '/manufacturing/orders') {
      return <WorkOrdersPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/purchasing/orders') {
      return <PurchaseOrdersPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/logistics/shipments') {
      return <ShipmentsPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/accounting/ledger') {
      return <GeneralLedgerPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath === '/accounting/invoices') {
      return <InvoicesPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
    }
    if (currentPath.startsWith('/hr') || currentPath === '/equipo') {
      return (
        <DirectoryProfileDrawer
          onNavigate={navigate}
          showDrawer={isProfileOpen}
          onCloseDrawer={() => setIsProfileOpen(false)}
          onToast={showToast}
        />
      )
    }
    if (currentPath === '/settings') {
      return <SettingsPage onToast={showToast} />
    }

    // Default fallback: Agenda de sillones
    return <SchedulingPage onNavigate={navigate} onOpenCreate={() => setIsCreateOpen(true)} />
  }

  return (
    <div className={`cadra-app-root ${darkMode ? 'cadra-dark' : ''}`}>
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="cadra-shell-body">
        {/* Left Floating Dock */}
        <LeftDock
          currentPath={currentPath}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreate={() => setIsCreateOpen(true)}
          onNavigate={navigate}
        />

        {/* Main Content Area */}
        <main className="cadra-main-viewport">
          <div key={currentPath} className="cadra-route-container">
            {renderView()}
          </div>

          {/* Persistent Cadra Profile Drawer if open on other pages */}
          {isProfileOpen && !currentPath.startsWith('/hr') && (
            <DirectoryProfileDrawer
              onNavigate={navigate}
              showDrawer={isProfileOpen}
              onCloseDrawer={() => setIsProfileOpen(false)}
              onToast={showToast}
            />
          )}

          {/* Quick Search Modal */}
          <QuickSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={navigate}
          />

          {/* Quick Create Modal */}
          <QuickCreateModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={showToast}
          />

          {/* Global Toast */}
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </main>
      </div>

      {/* VitaDent Footer */}
      <footer className="cadra-app-footer">
        <div className="footer-left">
          <span>VitaDent — Gestión Odontológica Integral</span>
          <span className="footer-sep">•</span>
          <span>Clínica Odontológica Principal</span>
        </div>
        <div className="footer-right">
          <span className="green-live-dot" />
          <span>Boxes y agenda en línea · Sincronizado</span>
        </div>
      </footer>
    </div>
  )
}

export default App

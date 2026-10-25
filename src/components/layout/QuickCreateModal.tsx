import React, { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'

interface QuickCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [recordType, setRecordType] = useState('work_order')
  const [title, setTitle] = useState('')
  const [customer, setCustomer] = useState('')
  const [qty, setQty] = useState('10')
  const [priority, setPriority] = useState('Normal')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSuccess(`New record "${title}" created successfully!`)
    setTitle('')
    setCustomer('')
    onClose()
  }

  return (
    <div className="cadra-modal-overlay" onClick={onClose}>
      <div className="cadra-action-modal" onClick={(e) => e.stopPropagation()}>
        <div className="action-modal-header">
          <div>
            <span className="cadra-eyebrow">NUEVO REGISTRO CLÍNICO</span>
            <h2>Crear {recordType === 'work_order' ? 'Cita' : recordType === 'sales_quote' ? 'Presupuesto' : recordType === 'contact' ? 'Paciente' : 'Pedido de Insumos'}</h2>
          </div>
          <button className="icon-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="action-modal-form">
          <div className="form-group">
            <label>Tipo de Registro</label>
            <select value={recordType} onChange={(e) => setRecordType(e.target.value)}>
              <option value="work_order">Cita en Sillón / Turno</option>
              <option value="sales_quote">Presupuesto / Tratamiento</option>
              <option value="purchase_order">Pedido a Depósito Dental</option>
              <option value="contact">Paciente / Convenio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción / Tratamiento *</label>
            <input
              autoFocus
              type="text"
              required
              placeholder="Ej. Limpieza con ultrasonido o Implante Straumann"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Paciente o Proveedor</label>
              <input
                type="text"
                placeholder="Ej. Carlos García o Dentales Antioquia"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quantity / Units</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="segmented-priority">
              {['Low', 'Normal', 'Rush'].map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`priority-chip ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="action-modal-footer">
            <button type="button" className="cadra-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cadra-btn-primary">
              <Plus size={15} />
              <span>Create record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


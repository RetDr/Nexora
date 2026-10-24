import React from 'react'
import { Check, X } from 'lucide-react'

interface ToastProps {
  message: string | null
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="cadra-toast">
      <div className="toast-left">
        <span className="toast-check-icon">
          <Check size={14} strokeWidth={2.5} />
        </span>
        <span className="toast-text">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={13} />
      </button>
    </div>
  )
}


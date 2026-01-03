import React from 'react'
import './dialog.css'

export interface DialogProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Reusable dialog/modal component with header, body, and optional footer.
 */
export const Dialog: React.FC<DialogProps> = ({
  title,
  children,
  footer,
  className = '',
}) => {
  return (
    <div className={`dialog ${className}`}>
      <div className="dialog__header">
        <h2 className="dialog__title">{title}</h2>
      </div>
      <div className="dialog__body">{children}</div>
      {footer && <div className="dialog__footer">{footer}</div>}
    </div>
  )
}

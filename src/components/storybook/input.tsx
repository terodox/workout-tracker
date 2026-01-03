import React from 'react'
import './input.css'

export interface InputProps {
  label: string
  id: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

/**
 * Reusable text input component with label.
 */
export const Input: React.FC<InputProps> = ({
  label,
  id,
  value = '',
  onChange,
  placeholder,
  required = false,
  className = '',
}) => {
  return (
    <div className={`input ${className}`}>
      <label htmlFor={id} className="input__label">
        {label}
        {required && <span className="input__required">*</span>}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input__field"
      />
    </div>
  )
}

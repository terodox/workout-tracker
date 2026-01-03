import React from 'react'
import './radio-group.css'

export interface RadioOption {
  value: string
  label: string
}

export interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

/**
 * Reusable radio button group component.
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`radio-group ${className}`}>
      <label className="radio-group__label">{label}</label>
      <div className="radio-group__options">
        {options.map((option) => (
          <label key={option.value} className="radio-group__option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="radio-group__input"
            />
            <span className="radio-group__text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

import React from 'react'
import './slider.css'

export interface SliderProps {
  label: string
  id: string
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  className?: string
}

/**
 * Reusable range slider component with label and value display.
 */
export const Slider: React.FC<SliderProps> = ({
  label,
  id,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  className = '',
}) => {
  return (
    <div className={`slider ${className}`}>
      <div className="slider__header">
        <label htmlFor={id} className="slider__label">
          {label}
        </label>
        {showValue && <span className="slider__value">{value}</span>}
      </div>
      <input
        type="range"
        id={id}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="slider__input"
      />
      <div className="slider__range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

import React, { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  delay?: number
  className?: string
}

/**
 * AnimatedCounter:
 * Anima visiblemente los números desde 0 hasta su valor objetivo al aparecer la pestaña o componente.
 * Velocidad equilibrada (850ms): perceptible, fluida y con formato íntegro ($, %, +, -, comas y decimales).
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 850,
  delay = 0,
  className = '',
}) => {
  const strVal = String(value)
  const isPercent = strVal.includes('%')
  const hasPlus = strVal.startsWith('+')
  const hasMinus = strVal.startsWith('-') || strVal.includes('(')
  const hasDollar = strVal.includes('$')
  const hasK = strVal.toLowerCase().includes('k')
  const hasM = strVal.toLowerCase().includes('m')

  // Extraer número limpio
  const numericString = strVal.replace(/[^0-9.-]/g, '')
  const targetNum = parseFloat(numericString) || 0
  const isDecimal = numericString.includes('.')
  const decimalPlaces = isDecimal ? numericString.split('.')[1].length : 0

  // Iniciar siempre en 0 para que la animación sea visible al entrar a la vista
  const [displayValue, setDisplayValue] = useState<number>(0)
  const frameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const startVal = 0
    const change = targetNum - startVal
    const startTime = performance.now()

    // Curva cuadrática suave de desaceleración (natural y balanceada para conteo humano)
    const easeOutQuad = (t: number): number => {
      return 1 - (1 - t) * (1 - t)
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = startVal + change * easeOutQuad(progress)

      setDisplayValue(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetNum)
      }
    }

    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        frameRef.current = requestAnimationFrame(animate)
      }, delay)
    } else {
      frameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [targetNum, duration, delay])

  // Formato final conservando símbolos y separadores de miles
  const formatValue = (num: number) => {
    const abs = Math.abs(num)
    let formatted: string
    if (isDecimal) {
      formatted = abs.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    } else {
      formatted = Math.round(abs).toLocaleString('en-US')
    }

    let result = ''
    if (hasPlus && num > 0) result += '+'
    if (num < 0 || (hasMinus && num < 0)) result += '-'
    if (hasDollar) result += '$'
    result += formatted
    if (hasK) result += 'k'
    if (hasM) result += 'M'
    if (isPercent) result += '%'

    return result
  }

  return (
    <span className={`cadra-animated-counter ${className}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatValue(displayValue)}
    </span>
  )
}
